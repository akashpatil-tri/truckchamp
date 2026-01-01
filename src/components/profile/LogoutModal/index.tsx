"use client";

import { useState } from "react";

import Button from "@common/Button";

import { useAuth } from "@/providers/AuthProvider";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show document-upload-modal-backdrop"
        onClick={handleBackdropClick}
      />
      <div
        className="modal fade show d-block document-upload-modal"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white br20 document-upload-modal-content">
            <div className="modal-header border-0 p-4">
              <div>
                <h5 className="modal-title fw-bold document-upload-modal-title">
                  Ready to Sign Out?
                </h5>
                <p className="mb-0 mt-3 document-upload-modal-description">
                  Logging out will end your session. You can sign back in
                  anytime to access your account.
                </p>
              </div>
            </div>
            <div className="modal-body p-4 pt-0"></div>
            <div className="d-flex justify-content-between align-items-center border-0 p-4 pt-0">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="me-2 bck-btn bg-white text-black border-dark"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="filled"
                onClick={handleLogout}
                isLoading={isLoggingOut}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
