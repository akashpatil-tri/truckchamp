import React, { useState, useEffect } from "react";

import Button from "@common/Button";
import FileUpload from "@common/FileUpload";

import "./UploadModal.css";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void | Promise<void>;
  title?: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  documentType?: string;
}

export default function UploadModal({
  isOpen,
  onClose,
  onUpload,
  title = "Upload Document",
  description = "Choose the document you want to upload from your device. Ensure the file is clear, valid, and up to date so we can verify compliance smoothly.",
  accept = "image/jpeg,image/jpg,image/png,application/pdf",
  maxSizeMB = 10,
  documentType,
}: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setIsUploading(false);
      setError("");
    }
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isUploading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, isUploading, onClose]);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = accept.split(",").map((type) => type.trim());
    const fileType = file.type;
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

    const isValidType = allowedTypes.some(
      (type) =>
        type === fileType ||
        type === fileExtension ||
        (type.endsWith("/*") && fileType.startsWith(type.replace("/*", "")))
    );

    if (!isValidType) {
      return "Invalid file type. Please upload a JPG, PNG, or PDF file.";
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB. Please upload a smaller file.`;
    }

    return null;
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
    } else {
      setError("");
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      await onUpload(selectedFile);
      // Success - modal will be closed by parent component
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Please try again later."
      );
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (!isUploading) {
      onClose();
    }
  };

  const handleBackdropClick = () => {
    if (!isUploading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show upload-modal-backdrop"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="modal fade show d-block upload-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="upload-modal-title"
        aria-describedby="upload-modal-description"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white br20 upload-modal-content">
            <div className="modal-header border-0 p-4">
              <div>
                <h5
                  id="upload-modal-title"
                  className="modal-title fw-bold upload-modal-title"
                >
                  {title}
                </h5>
                <p
                  id="upload-modal-description"
                  className="mb-0 mt-1 upload-modal-description"
                >
                  {description}
                </p>
              </div>
            </div>
            <div className="modal-body p-4 pt-0">
              <FileUpload
                onFileSelect={handleFileSelect}
                accept={accept}
                multiple={false}
                maxFiles={1}
                maxSizeMB={maxSizeMB}
                disabled={isUploading}
                error={error}
              />

              {selectedFile && !error && (
                <div className="mt-3 p-3 border br10 bg-light">
                  <div className="d-flex align-items-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="me-2"
                    >
                      <path
                        d="M6 10L9 13L14 7"
                        stroke="#2e7d32"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="upload-modal-file-name">
                      {selectedFile.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="me-2"
                isDisabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="filled"
                onClick={handleUpload}
                isDisabled={!selectedFile || isUploading}
                isLoading={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
