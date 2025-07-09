"use client";

import { Upload, Trash2, Play, Pause } from "lucide-react";
import { useState, useCallback } from "react";
import { FileUploadConfig, FileUploadItem } from "@AppTypes/upload";
import { Badge } from "@UI/Badge";
import { Button } from "@UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@UI/Card";
import { Separator } from "@UI/Separator";
import { cn } from "@Utils/ClassName";
import {
  createFilePreview,
  formatFileSize,
  simulateUpload,
  validateFile,
} from "@Utils/upload-utils";
import { DropZone } from "./DropZone";
import { FilePreview } from "./FilePreview";

interface FileUploadProps {
  config?: Partial<FileUploadConfig>;
  onUploadComplete?: (files: FileUploadItem[]) => void;
  className?: string;
}

const defaultConfig: FileUploadConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 10,
  allowedTypes: ["image/", "video/", "audio/", ".pdf", ".doc", ".docx", ".txt"],
  showPreview: true,
};

export const FileUpload = ({ config = {}, className }: FileUploadProps) => {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadsPaused, setUploadsPaused] = useState(false);

  const finalConfig = { ...defaultConfig, ...config };

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      const fileItems: FileUploadItem[] = [];

      for (const file of newFiles) {
        const error = validateFile(file, finalConfig);
        const preview = finalConfig.showPreview
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
    [finalConfig]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const updateFileProgress = useCallback((id: string, progress: number) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)));
  }, []);

  const updateFileStatus = useCallback(
    (id: string, status: "success" | "error") => {
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

      simulateUpload(file, updateFileProgress, updateFileStatus);
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
      simulateUpload(file, updateFileProgress, updateFileStatus);
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

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>File Upload</span>
          </CardTitle>

          {hasFiles && (
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {stats.total} files • {formatFileSize(stats.totalSize)}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                disabled={isUploading}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {hasFiles && (
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.failed}
              </div>
              <div className="text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.uploading}
              </div>
              <div className="text-muted-foreground">Uploading</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Configuration Info */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">Max {finalConfig.maxFiles} files</Badge>
          <Badge variant="outline">
            Max {formatFileSize(finalConfig.maxSize)} per file
          </Badge>
          <Badge variant="outline">
            Types: {finalConfig.allowedTypes.join(", ")}
          </Badge>
        </div>

        {/* Drop Zone */}
        <DropZone
          onFilesAdded={addFiles}
          disabled={isUploading}
          maxFiles={finalConfig.maxFiles}
          currentFileCount={files.length}
        />

        {/* Upload Controls */}
        {hasFiles && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {canUpload && (
                <Button onClick={startUploads} disabled={isUploading}>
                  <Play className="w-4 h-4 mr-1" />
                  Start Upload
                </Button>
              )}

              {isUploading && (
                <Button
                  variant="outline"
                  onClick={uploadsPaused ? resumeUploads : pauseUploads}
                >
                  {uploadsPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              {isUploading
                ? "Uploading files..."
                : `${files.length} file(s) ready`}
            </div>
          </div>
        )}

        {/* Files List */}
        {hasFiles && (
          <div className="space-y-3">
            <Separator />
            <div className="grid gap-3">
              {files.map((file) => (
                <FilePreview
                  key={file.id}
                  file={file}
                  onRemove={removeFile}
                  onRetry={retryFile}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
