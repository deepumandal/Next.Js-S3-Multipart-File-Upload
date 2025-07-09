"use client";

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@UI/Progress";
import { cn } from "@Utils/ClassName";

interface UploadProgressProps {
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  className?: string;
}

export const UploadProgress = ({
  progress,
  status,
  className,
}: UploadProgressProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      case "uploading":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "uploading":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {status === "success"
            ? "Complete"
            : status === "error"
              ? "Failed"
              : status === "uploading"
                ? "Uploading..."
                : "Pending"}
        </span>
        <div className={cn("flex items-center space-x-1", getStatusColor())}>
          {getStatusIcon()}
          <span className="text-sm">{Math.round(progress)}%</span>
        </div>
      </div>
      <Progress
        value={progress}
        className={cn(
          "h-2 transition-all duration-300",
          status === "success" && "bg-green-100",
          status === "error" && "bg-red-100",
        )}
      />
    </div>
  );
};
