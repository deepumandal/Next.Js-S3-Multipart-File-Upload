import { FileUploadConfig, FileUploadItem } from "@AppTypes/upload";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (type: string): string => {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "file-text";
  if (type.includes("word") || type.includes("document")) return "file-text";
  if (type.includes("excel") || type.includes("spreadsheet"))
    return "file-spreadsheet";
  if (type.includes("zip") || type.includes("rar")) return "file-archive";
  return "file";
};

export const validateFile = (
  file: File,
  config: FileUploadConfig
): string | null => {
  if (file.size > config.maxSize) {
    return `File size exceeds ${formatFileSize(config.maxSize)}`;
  }

  if (config.allowedTypes.length > 0) {
    const isAllowed = config.allowedTypes.some(
      (type) =>
        file.type.includes(type) || file.name.toLowerCase().endsWith(type)
    );
    if (!isAllowed) {
      return `File type not allowed. Allowed types: ${config.allowedTypes.join(", ")}`;
    }
  }

  return null;
};

export const createFilePreview = (file: File): Promise<string> =>
  new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      resolve("");
    }
  });

// ✅ Custom concurrency limiter (like p-limit)
export function limitConcurrency<T>(
  maxConcurrency: number,
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    let index = 0;
    let active = 0;

    const runNext = () => {
      if (index === tasks.length && active === 0) {
        return resolve(results);
      }

      while (active < maxConcurrency && index < tasks.length) {
        const currentIndex = index++;
        const task = tasks[currentIndex];

        active++;
        task()
          .then((result) => {
            results[currentIndex] = result;
            active--;
            runNext();
          })
          .catch(reject);
      }
    };

    runNext();
  });
}

// Helper function to detect optimal upload settings based on file size and network
const getOptimalUploadSettings = (fileSize: number) => {
  // File size thresholds
  const SMALL_FILE_THRESHOLD = 25 * 1024 * 1024; // 25MB
  const MEDIUM_FILE_THRESHOLD = 100 * 1024 * 1024; // 100MB
  const LARGE_FILE_THRESHOLD = 500 * 1024 * 1024; // 500MB

  // Chunk sizes (minimum 25MB as requested)
  const MIN_CHUNK_SIZE = 25 * 1024 * 1024; // 25MB minimum
  const MEDIUM_CHUNK_SIZE = 50 * 1024 * 1024; // 50MB
  const LARGE_CHUNK_SIZE = 100 * 1024 * 1024; // 100MB

  // Concurrency limits
  const SINGLE_CONCURRENT = 1;
  const LOW_CONCURRENT = 2;

  let chunkSize: number;
  let maxConcurrency: number;

  if (fileSize < SMALL_FILE_THRESHOLD) {
    // Files < 25MB: Single upload, no chunking needed
    chunkSize = fileSize;
    maxConcurrency = SINGLE_CONCURRENT;
  } else if (fileSize < MEDIUM_FILE_THRESHOLD) {
    // Files 25-100MB: use 25MB chunks, 2 concurrent
    chunkSize = MIN_CHUNK_SIZE;
    maxConcurrency = LOW_CONCURRENT;
  } else if (fileSize < LARGE_FILE_THRESHOLD) {
    // Files 100-500MB: use 50MB chunks, 2 concurrent
    chunkSize = MEDIUM_CHUNK_SIZE;
    maxConcurrency = LOW_CONCURRENT;
  } else {
    // Large files: use 100MB chunks, 2 concurrent max
    chunkSize = LARGE_CHUNK_SIZE;
    maxConcurrency = LOW_CONCURRENT;
  }

  return { chunkSize, maxConcurrency };
};

export const createFileUploadStream = async (
  fileItem: FileUploadItem,
  onProgress: (id: string, progress: number) => void,
  onComplete: (
    id: string,
    status: "success" | "error",
    errorMessage?: string
  ) => void
): Promise<void> => {
  try {
    const { file, id } = fileItem;

    // Optimize chunk size based on file size for better performance
    const { chunkSize, maxConcurrency } = getOptimalUploadSettings(file.size);

    const totalParts = Math.ceil(file.size / chunkSize);
    const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1);

    console.log(
      `📊 File: ${file.name}, Size: ${formatFileSize(file.size)}, Parts: ${totalParts}, Chunk: ${formatFileSize(chunkSize)}, Concurrency: ${maxConcurrency}`
    );

    // Step 1: Initiate multipart upload
    const initRes = await fetch("/api/create-multipart-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!initRes.ok) throw new Error("Failed to initiate multipart upload");
    const { uploadId, key } = await initRes.json();

    const etags: { PartNumber: number; ETag: string }[] = [];
    let completed = 0;
    let uploadedBytes = 0;

    // Step 2: Upload chunks with just-in-time URL fetching and timeout
    const uploadChunk = async (partNumber: number): Promise<void> => {
      const MAX_RETRIES = 3;
      const TIMEOUT_MS = 120000; // 2 minutes timeout per chunk

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(
            `🔄 Getting presigned URL for part ${partNumber} (attempt ${attempt})...`
          );

          // Get presigned URL just when needed (not all at once)
          const urlRes = await fetch("/api/get-presign-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uploadId, key, parts: [partNumber] }),
          });

          if (!urlRes.ok) {
            throw new Error(
              `Failed to get presigned URL for part ${partNumber}`
            );
          }

          const { urls } = await urlRes.json();
          const presignedUrl = urls[0].signedUrl;

          const start = (partNumber - 1) * chunkSize;
          const end = Math.min(file.size, start + chunkSize);
          const blob = file.slice(start, end);

          console.log(
            `🚀 Uploading part ${partNumber}/${totalParts} (${formatFileSize(
              blob.size
            )}) - Attempt ${attempt}`
          );

          const uploadStartTime = Date.now();

          // Create AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            console.log(
              `⏰ Part ${partNumber} timed out after ${TIMEOUT_MS / 1000}s`
            );
          }, TIMEOUT_MS);

          const res = await fetch(presignedUrl, {
            method: "PUT",
            body: blob,
            headers: {
              "Content-Type": "application/octet-stream",
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          const uploadTime = Date.now() - uploadStartTime;

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }

          const etag = res.headers.get("ETag");
          if (!etag) {
            throw new Error(`Missing ETag for part ${partNumber}`);
          }

          console.log(
            `✅ Part ${partNumber} uploaded successfully in ${(
              uploadTime / 1000
            ).toFixed(1)}s`
          );

          etags.push({
            PartNumber: partNumber,
            ETag: etag.replace(/"/g, ""),
          });

          completed++;
          uploadedBytes += blob.size;

          // Calculate progress based on uploaded bytes
          const progress = Math.round((uploadedBytes / file.size) * 100);
          onProgress(id, Math.min(progress, 99)); // Cap at 99% until complete

          console.log(
            `📊 Progress: ${progress}% (${completed}/${totalParts} parts)`
          );

          return; // Success, exit retry loop
        } catch (error: unknown) {
          const err = error as Error;
          const isTimeout = err.name === "AbortError";

          console.warn(
            `⚠️ Part ${partNumber} attempt ${attempt} failed: ${
              isTimeout ? "Timeout" : err.message
            }`
          );

          if (attempt === MAX_RETRIES) {
            throw new Error(
              `Failed to upload part ${partNumber} after ${MAX_RETRIES} attempts: ${err.message}`
            );
          }

          // Wait before retry with exponential backoff
          const waitTime = Math.min(2000 * Math.pow(2, attempt - 1), 10000);
          console.log(
            `⏳ Retrying part ${partNumber} in ${waitTime / 1000}s...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    };

    // Step 3: Upload parts with configurable concurrency
    console.log("🚀 Starting upload with optimized processing...");

    // Use the optimal concurrency from settings
    const concurrency =
      totalParts === 1 ? 1 : Math.min(maxConcurrency, totalParts);
    console.log(`🔧 Using concurrency: ${concurrency}`);

    await limitConcurrency(
      concurrency,
      partNumbers.map((n) => () => uploadChunk(n))
    );

    // Step 4: Sort etags by PartNumber before completing
    const sortedEtags = etags.sort((a, b) => a.PartNumber - b.PartNumber);

    console.log("🏁 Completing multipart upload...");
    const completeRes = await fetch("/api/complete-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, key, parts: sortedEtags }),
    });

    if (!completeRes.ok) {
      const error = await completeRes.json();
      throw new Error(error.message || "Failed to complete upload");
    }

    console.log("🎉 Upload completed successfully!");
    onProgress(id, 100); // Show 100% when fully complete
    onComplete(id, "success");
  } catch (err: unknown) {
    const error = err as Error;
    console.error("❌ Upload error:", error);
    onComplete(fileItem.id, "error", error.message || "Unexpected error");
  }
};
