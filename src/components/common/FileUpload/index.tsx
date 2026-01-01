import React, { useRef, useState } from "react";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
  existingFiles?: string[];
  onRemoveFile?: (index: number) => void;
}

export default function FileUpload({
  onFileSelect,
  accept = "*",
  multiple = false,
  maxFiles = 1,
  maxSizeMB = 10,
  error = "",
  disabled = false,
  existingFiles = [],
  onRemoveFile,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    validateAndProcessFiles(files);
  };

  const validateAndProcessFiles = (files: File[]) => {
    setLocalError("");

    // Check number of files
    if (files.length + existingFiles.length > maxFiles) {
      setLocalError(`Maximum ${maxFiles} file(s) allowed`);
      return;
    }

    // Check file sizes
    const oversizedFiles = files.filter(
      (file) => file.size > maxSizeMB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      setLocalError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    onFileSelect(files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    validateAndProcessFiles(files);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="file-upload-wrapper">
      <div
        className={`file-upload-area-base ${dragActive ? "file-upload-area-drag-active" : ""} ${
          disabled ? "file-upload-area-disabled cursor-not-allowed" : "cursor-pointer"
        } ${error || localError ? "file-upload-area-error" : "file-upload-area-default"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden-input"
          disabled={disabled}
        />

        <div className="file-upload-content">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 26.6667V13.3334M20 13.3334L13.3333 20M20 13.3334L26.6667 20"
              stroke="#D74315"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M33.3333 26.6667V30C33.3333 31.8409 31.8409 33.3333 30 33.3333H10C8.15905 33.3333 6.66667 31.8409 6.66667 30V26.6667"
              stroke="#D74315"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <span className="file-upload-text-primary">Click to upload</span>
            <span className="file-upload-text-secondary"> or drag and drop</span>
          </div>
          <p className="file-upload-text-hint">
            {accept === "image/*"
              ? "PNG, JPG, JPEG (max. 10MB)"
              : `Max ${maxSizeMB}MB per file`}
          </p>
        </div>
      </div>

      {(error || localError) && (
        <p className="text-primary form-text mt-2 small">
          {error || localError}
        </p>
      )}

      {existingFiles.length > 0 && (
        <div className="mt-3">
          {existingFiles.map((file, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between p-2 mb-2 border br10"
            >
              <span className="file-list-item-text">
                {typeof file === "string" ? file : (file as File).name}
              </span>
              {onRemoveFile && (
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="btn-unstyled file-list-item-remove"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
