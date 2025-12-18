import React, { useState } from "react";

import Button from "@common/Button";
import Input from "@common/Input";

import "./AttachmentModal.css";

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, price: number) => void;
}

export default function AttachmentModal({
  isOpen,
  onClose,
  onSave,
}: AttachmentModalProps) {
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentPrice, setAttachmentPrice] = useState("");
  const [errors, setErrors] = useState({ name: "", price: "" });

  const handleSave = () => {
    const newErrors = { name: "", price: "" };
    let isValid = true;

    if (!attachmentName.trim()) {
      newErrors.name = "Attachment name is required";
      isValid = false;
    }

    if (!attachmentPrice.trim()) {
      newErrors.price = "Price is required";
      isValid = false;
    } else if (isNaN(Number(attachmentPrice)) || Number(attachmentPrice) <= 0) {
      newErrors.price = "Please enter a valid price";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      onSave(attachmentName, Number(attachmentPrice));
      setAttachmentName("");
      setAttachmentPrice("");
      setErrors({ name: "", price: "" });
    }
  };

  const handleClose = () => {
    setAttachmentName("");
    setAttachmentPrice("");
    setErrors({ name: "", price: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show attachment-modal-backdrop"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block attachment-modal"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white br20 attachment-modal-content">
            <div className="modal-header border-0 p-4">
              <div>
                <h5 className="modal-title fw-bold attachment-modal-title">
                  Add New Attachment
                </h5>
                <p className="mb-0 mt-1 attachment-modal-description">
                  Add the name and price of the attachment you want to include
                  with this truck.
                </p>
              </div>
            </div>
            <div className="modal-body p-4 pt-0">
              <div className="form-group">
                <label className="form-label">Attachment Name</label>
                <Input
                  type="text"
                  placeholder="Select attachment"
                  value={attachmentName}
                  onChange={(e) => {
                    setAttachmentName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  inputClass={`form-control border ${
                    errors.name ? "border-danger" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Attachment Price</label>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={attachmentPrice}
                  onChange={(e) => {
                    setAttachmentPrice(e.target.value);
                    if (errors.price) setErrors({ ...errors, price: "" });
                  }}
                  inputClass={`form-control border ${
                    errors.price ? "border-danger" : ""
                  }`}
                />
                {errors.price && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.price}
                  </p>
                )}
              </div>
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
              <Button type="button" variant="filled" onClick={handleSave}>
                Save Attachment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
