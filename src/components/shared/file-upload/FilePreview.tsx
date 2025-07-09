"use client";

import { X, Eye, AlertCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";
import { AnyType } from "@AppTypes/AnyType";
import { FileUploadItem } from "@AppTypes/upload";
import { Badge } from "@UI/Badge";
import { Button } from "@UI/Button";
import { Card } from "@UI/Card";
import { cn } from "@Utils/ClassName";
import { formatFileSize, getFileIcon } from "@Utils/upload-utils";
import { UploadProgress } from "./UploadProgress";

interface FilePreviewProps {
  file: FileUploadItem;
  onRemove: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}

export const FilePreview = ({
  file,
  onRemove,
  onRetry,
  className,
}: FilePreviewProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const iconName = getFileIcon(file.file.type);
  const IconComponent = Icons[iconName as keyof typeof Icons] as AnyType;

  const getStatusBadge = () => {
    switch (file.status) {
      case "success":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Complete
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "uploading":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Uploading
          </Badge>
        );
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-md max-w-full truncate",
        className
      )}
    >
      <div className="flex items-start space-x-3">
        {/* File Icon or Preview */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <div className="relative">
              <img
                src={file.preview}
                alt={file.file.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background/80 hover:bg-background"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              {IconComponent && (
                <IconComponent className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium truncate pr-2">
              {file.file.name}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => onRemove(file.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-muted-foreground">
              {formatFileSize(file.file.size)}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {file.file.type || "Unknown type"}
            </span>
            {getStatusBadge()}
          </div>

          {/* Progress */}
          <UploadProgress
            progress={file.progress}
            status={file.status}
            className="mb-2"
          />

          {/* Error Message */}
          {file.error && (
            <div className="flex items-center space-x-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{file.error}</span>
              {onRetry && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => onRetry(file.id)}
                >
                  Retry
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && file.preview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
        >
          <div className="max-w-3xl max-h-[80vh] p-4">
            <img
              src={file.preview}
              alt={file.file.name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </Card>
  );
};
