"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DocumentUploadInputProps = {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
  onUpload?: (url: string, fileName: string) => void;
  onRemove?: () => void;
  value?: string;
  fileName?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  required?: boolean;
};

export function DocumentUploadInput({
  label,
  description,
  error,
  containerClassName,
  onUpload,
  onRemove,
  value,
  fileName,
  maxSizeMB = 10,
  acceptedFormats = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ],
  required,
}: DocumentUploadInputProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = React.useState<{ url: string; name: string } | null>(
    value && fileName ? { url: value, name: fileName } : null,
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (value && fileName) {
      setUploadedFile({ url: value, name: fileName });
    } else if (!value) {
      setUploadedFile(null);
    }
  }, [value, fileName]);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Accepted formats: PDF, DOC, DOCX, JPG, PNG`;
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
      formData.append("type", "document");

      const response = await apiClient.upload<{ url: string }>("/api/upload/document", formData);
      const fileData = { url: response.url, name: file.name };
      setUploadedFile(fileData);
      onUpload?.(response.url, file.name);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload document. Please try again.");
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
    setUploadedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFileExtension = (name: string) => {
    return name.split(".").pop()?.toUpperCase() || "";
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {uploadedFile ? (
        <div className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-300 bg-gray-50">
          <div className="flex-shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
              <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {getFileExtension(uploadedFile.name)} • Uploaded
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="flex-shrink-0"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
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
              <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "size-10 rounded-lg flex items-center justify-center",
                  error || uploadError ? "bg-red-100" : "bg-primary/10",
                )}
              >
                {error || uploadError ? (
                  <X className="size-5 text-red-600" />
                ) : (
                  <Upload className="size-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {error || uploadError ? "Upload failed" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, JPG, PNG (max {maxSizeMB}MB)
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

