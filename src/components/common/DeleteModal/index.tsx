"use client";

import { useCallback, useRef, useState } from "react";

import Button from "@common/Button";

import "./DeleteModal.css";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onConfirm: () => void;
}

export default function DeleteModal({
  isOpen,
  onClose,
  title = "Delete",
  description = "Are you sure you want to delete this driver?",
  onConfirm,
}: DeleteModalProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

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
      <div
        className="modal fade show d-block document-upload-modal"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white br20 document-upload-modal-content">
            <div className="modal-header border-0 p-4">
              <div>
                <h5 className="modal-title fw-bold document-upload-modal-title">
                  {title}
                </h5>
                <p className="mb-0 mt-3 document-upload-modal-description">
                  {description}
                </p>
              </div>
            </div>
            <div className="modal-body p-4 pt-0"></div>
            <div className="d-flex justify-content-between align-items-center border-0 p-4 pt-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="me-2 bck-btn bg-white text-black border-dark"
              >
                Cancel
              </Button>
              <Button type="button" variant="filled" onClick={onConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
