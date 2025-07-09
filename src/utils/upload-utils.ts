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

export const simulateUpload = (
  file: FileUploadItem,
  onProgress: (id: string, progress: number) => void,
  onComplete: (id: string, status: "success" | "error") => void
): void => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      // Simulate random success/error for demo
      const success = Math.random() > 0.2; // 80% success rate
      onComplete(file.id, success ? "success" : "error");
    }
    onProgress(file.id, progress);
  }, 200);
};
