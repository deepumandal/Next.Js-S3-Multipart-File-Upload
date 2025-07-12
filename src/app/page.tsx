"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileUploadItem } from "@AppTypes/upload";
import { FileUpload } from "@Shared/file-upload/FileUpload";
import { Toaster } from "@UI/Toaster";

const Home = () => {
  const [uploadResults, setUploadResults] = useState<FileUploadItem[]>([]);

  const handleUploadComplete = (files: FileUploadItem[]) => {
    alert("handle Upload Complete!");
    setUploadResults(files);
    const successCount = files.filter((f) => f.status === "success").length;
    const failCount = files.filter((f) => f.status === "error").length;

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)!`);
    }
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} file(s)`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced File Upload
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, feature-rich file upload component with drag & drop,
            progress tracking, file validation, and beautiful UI
          </p>
        </div>

        {/* File Upload Component */}
        <FileUpload
          config={{
            maxSize: 100 * 1024 * 1024, // 1gb
            maxFiles: 20,
            allowedTypes: [
              "image/",
              "video/",
              "audio/",
              ".pdf",
              ".doc",
              ".docx",
              ".txt",
              ".zip",
              ".rar",
            ],
            showPreview: true,
          }}
          onUploadComplete={handleUploadComplete}
        />

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Drag & Drop</h3>
            <p className="text-muted-foreground">
              Intuitive drag and drop interface with visual feedback and smooth
              animations
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">File Validation</h3>
            <p className="text-muted-foreground">
              Comprehensive file validation with size limits, type checking, and
              error handling
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Progress Tracking</h3>
            <p className="text-muted-foreground">
              Real-time progress indicators with status updates and retry
              functionality
            </p>
          </div>
        </div>

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Upload Results</h3>
            <div className="space-y-2">
              {uploadResults.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{file.file.name}</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      file.status === "success"
                        ? "bg-green-100 text-green-800"
                        : file.status === "error"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {file.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
};

export default Home;
