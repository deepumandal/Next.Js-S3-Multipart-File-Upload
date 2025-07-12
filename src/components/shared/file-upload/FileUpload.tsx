"use client";

import { Upload, Trash2, Play, Pause } from "lucide-react";
import { FileUploadConfig, FileUploadItem } from "@AppTypes/upload";
import useUpload from "@Hooks/useUpload";
import { Badge } from "@UI/Badge";
import { Button } from "@UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@UI/Card";
import { Separator } from "@UI/Separator";
import { cn } from "@Utils/ClassName";
import { formatFileSize } from "@Utils/upload-utils";
import { DropZone } from "./DropZone";
import { FilePreview } from "./FilePreview";

interface FileUploadProps {
  config?: Partial<FileUploadConfig>;
  onUploadComplete?: (files: FileUploadItem[]) => void;
  className?: string;
}

const defaultConfig: FileUploadConfig = {
  maxSize: 1000 * 1024 * 1024, // 10MB
  maxFiles: 10,
  allowedTypes: ["image/", "video/", "audio/", ".pdf", ".doc", ".docx", ".txt"],
  showPreview: true,
};

export const FileUpload = ({ config = {}, className }: FileUploadProps) => {
  const {
    files,
    isUploading,
    uploadsPaused,
    addFiles,
    removeFile,
    clearAllFiles,
    retryFile,
    startUploads,
    pauseUploads,
    resumeUploads,
    stats,
    hasFiles,
    canUpload,
    finalConfig,
  } = useUpload({ ...defaultConfig, ...config });
  console.log("FileUpload config:", stats, isUploading);
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
            Max {formatFileSize(finalConfig.maxSize ?? 0)} per file
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
