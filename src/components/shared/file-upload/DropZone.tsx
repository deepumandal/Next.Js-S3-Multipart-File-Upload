"use client";

import { Upload, File } from "lucide-react";
import { ChangeEvent, DragEvent, useCallback, useState } from "react";
import { cn } from "@Utils/ClassName";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  currentFileCount?: number;
}

export const DropZone = ({
  onFilesAdded,
  disabled = false,
  maxFiles = 10,
  currentFileCount = 0,
}: DropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      const remainingSlots = maxFiles - currentFileCount;
      const filesToAdd = files.slice(0, remainingSlots);

      if (filesToAdd.length > 0) {
        onFilesAdded(filesToAdd);
      }
    },
    [disabled, onFilesAdded, maxFiles, currentFileCount],
  );

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const remainingSlots = maxFiles - currentFileCount;
      const filesToAdd = files.slice(0, remainingSlots);

      if (filesToAdd.length > 0) {
        onFilesAdded(filesToAdd);
      }

      // Reset input
      e.target.value = "";
    },
    [onFilesAdded, maxFiles, currentFileCount],
  );

  const canAddFiles = currentFileCount < maxFiles;

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
        "hover:border-primary/50 hover:bg-primary/5",
        isDragOver && !disabled
          ? "border-primary bg-primary/10 scale-102"
          : "border-muted-foreground/25",
        disabled && "opacity-50 cursor-not-allowed",
        !canAddFiles && "opacity-50 cursor-not-allowed",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <div
          className={cn(
            "p-4 rounded-full transition-all duration-300",
            isDragOver ? "bg-primary/20" : "bg-muted",
          )}
        >
          <Upload
            className={cn(
              "w-8 h-8 transition-colors duration-300",
              isDragOver ? "text-primary" : "text-muted-foreground",
            )}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {isDragOver ? "Drop your files here" : "Upload your files"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {canAddFiles
              ? `Drag and drop or click to select files (${currentFileCount}/${maxFiles})`
              : "Maximum file limit reached"}
          </p>
        </div>

        {canAddFiles && (
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              disabled={disabled}
            />
            <span className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <File className="w-4 h-4 mr-2" />
              Browse Files
            </span>
          </label>
        )}
      </div>
    </div>
  );
};
