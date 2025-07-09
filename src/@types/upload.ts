export interface FileUploadItem {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export interface FileUploadConfig {
  maxSize: number; // in bytes
  maxFiles: number;
  allowedTypes: string[];
  showPreview: boolean;
}
