"use client";

import { useCallback, useRef, useState } from "react";

import Button from "@common/Button";

import "./DocumentUploadModal.css";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  title?: string;
  description?: string;
  acceptedFormats?: string;
  maxSizeMB?: number;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  onUpload,
  title = "Upload Document",
  description = "Choose the document you want to upload from your device. Ensure the file is clear, valid, and up to date so we can verify compliance smoothly.",
  acceptedFormats = ".jpg,.jpeg,.pdf",
  maxSizeMB = 10,
}: DocumentUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setSelectedFile(null);
    setIsDragActive(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Validate file
  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file format
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const acceptedList = acceptedFormats.split(",").map((f) => f.trim().toLowerCase());
      
      if (!acceptedList.includes(fileExtension)) {
        setError("Only jpg, jpeg, and pdf files are supported");
        return false;
      }

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return false;
      }

      return true;
    },
    [acceptedFormats, maxSizeMB]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (file: File) => {
      setError(null);
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    },
    [validateFile]
  );

  // Handle file input change
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  // Handle click to browse
  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle upload
  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
      handleClose();
    }
  }, [selectedFile, onUpload, handleClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show document-upload-modal-backdrop"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="modal fade show d-block document-upload-modal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white br20 document-upload-modal-content">
            <div className="modal-header border-0 p-4">
              <div>
                <h5 className="modal-title fw-bold document-upload-modal-title">
                  {title}
                </h5>
                <p className="mb-0 mt-1 document-upload-modal-description">
                  {description}
                </p>
              </div>
            </div>
            <div className="modal-body p-4 pt-0">
              {/* Upload Area */}
              <div
                className={`document-upload-area ${isDragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedFormats}
                  onChange={handleFileChange}
                  className="hidden-input"
                />

                <div className="document-upload-content">
                  {/* Upload Icon */}
                  <div className="document-upload-icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24 32V16M24 16L18 22M24 16L30 22"
                        stroke="#D74315"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M40 32V36C40 38.2091 38.2091 40 36 40H12C9.79086 40 8 38.2091 8 36V32"
                        stroke="#D74315"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {selectedFile ? (
                    <div className="document-upload-selected">
                      <p className="document-upload-filename">{selectedFile.name}</p>
                      <p className="document-upload-filesize">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="document-upload-text">
                        Upload your Document here
                      </p>
                      <p className="document-upload-formats">
                        Only support .jpg, .jpeg, .pdf format.
                      </p>
                      <p className="document-upload-link">
                        Drag & Drop file or <span>Browse Files</span>
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-primary form-text mt-2 small">{error}</p>
              )}
            </div>
            <div className="modal-footer border-0 p-4 pt-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="filled"
                onClick={handleUpload}
                disabled={!selectedFile}
              >
                Upload File
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
