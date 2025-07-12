import { useCallback, useLayoutEffect, useState } from "react";
import { FileUploadConfig, FileUploadItem } from "@AppTypes/upload";
import {
  createFilePreview,
  createFileUploadStream,
  validateFile,
} from "@Utils/upload-utils";

const useUpload = (config: FileUploadConfig) => {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadsPaused, setUploadsPaused] = useState(false);
  console.log("files", files);
  const addFiles = useCallback(
    async (newFiles: File[]) => {
      const fileItems: FileUploadItem[] = [];

      for (const file of newFiles) {
        const error = validateFile(file, config);
        const preview = config.showPreview
          ? await createFilePreview(file)
          : undefined;

        const fileItem: FileUploadItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
          progress: 0,
          status: error ? "error" : "pending",
          error: error ?? undefined,
        };

        fileItems.push(fileItem);
      }

      setFiles((prev) => [...prev, ...fileItems]);
    },
    [config]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const updateFileProgress = useCallback((id: string, progress: number) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, progress } : file))
    );
  }, []);

  const updateFileStatus = useCallback(
    (id: string, status: "success" | "error") => {
      console.log("Updating file status:", id, status, files);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status,
                progress: status === "success" ? 100 : f.progress,
                error: status === "error" ? "Upload failed" : undefined,
              }
            : f
        )
      );
    },
    []
  );

  const retryFile = useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id);
      if (!file) return;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                status: "uploading" as const,
                progress: 0,
                error: undefined,
              }
            : f
        )
      );

      createFileUploadStream(file, updateFileProgress, updateFileStatus);
    },
    [files, updateFileProgress, updateFileStatus]
  );

  const startUploads = useCallback(() => {
    setIsUploading(true);
    setUploadsPaused(false);

    const pendingFiles = files.filter((f) => f.status === "pending");

    setFiles((prev) =>
      prev.map((f) =>
        f.status === "pending" ? { ...f, status: "uploading" as const } : f
      )
    );

    pendingFiles.forEach((file) => {
      createFileUploadStream(file, updateFileProgress, updateFileStatus);
    });
  }, [files, updateFileProgress, updateFileStatus]);

  const pauseUploads = useCallback(() => {
    setUploadsPaused(true);
  }, []);

  const resumeUploads = useCallback(() => {
    setUploadsPaused(false);
  }, []);

  const getStats = () => {
    const total = files.length;
    const completed = files.filter((f) => f.status === "success").length;
    const failed = files.filter((f) => f.status === "error").length;
    const uploading = files.filter((f) => f.status === "uploading").length;
    const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

    return { total, completed, failed, uploading, totalSize };
  };

  const stats = getStats();
  const hasFiles = files.length > 0;
  const canUpload = files.some((f) => f.status === "pending") && !isUploading;

  useLayoutEffect(() => {
    const foundUploadedFiles = files.filter((file) => {
      if (file.status === "success" && file.progress === 100) {
        return true;
      }
    });
    if (foundUploadedFiles.length) {
      setIsUploading(false);
    }
  }, [files]);

  return {
    files,
    isUploading,
    uploadsPaused,
    addFiles,
    removeFile,
    clearAllFiles,
    updateFileProgress,
    updateFileStatus,
    retryFile,
    startUploads,
    pauseUploads,
    resumeUploads,
    getStats,
    stats,
    hasFiles,
    canUpload,
    finalConfig: config,
  };
};

export default useUpload;
