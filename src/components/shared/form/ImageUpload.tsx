"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageUploadProps = {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  onUpload?: (url: string) => void;
  onRemove?: () => void;
  value?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  required?: boolean;
};

export function ImageUpload({
  label,
  description,
  error,
  containerClassName,
  onUpload,
  onRemove,
  value,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  required,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(value || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted formats: ${acceptedFormats.join(", ")}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const response = await apiClient.upload<{ url: string }>("/api/upload/image", formData);
      setPreview(response.url);
      onUpload?.(response.url);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {preview ? (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : error || uploadError
                ? "border-red-400 bg-red-50/50"
                : "border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(",")}
            onChange={handleFileSelect}
            className="hidden"
            required={required}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "size-12 rounded-full flex items-center justify-center",
                  error || uploadError ? "bg-red-100" : "bg-primary/10",
                )}
              >
                {error || uploadError ? (
                  <X className="size-6 text-red-600" />
                ) : (
                  <Upload className="size-6 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {error || uploadError ? "Upload failed" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {acceptedFormats.map((f) => f.split("/")[1]).join(", ").toUpperCase()} (max{" "}
                  {maxSizeMB}MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error || uploadError ? (
        <p className="text-sm text-red-600" role="alert">
          {error || uploadError}
        </p>
      ) : description ? (
        <p className="text-sm text-gray-500">{description}</p>
      ) : null}
    </div>
  );
}

