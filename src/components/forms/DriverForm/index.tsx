"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import Button from "@common/Button";
import DocumentUploadModal from "@common/DocumentUploadModal";
import Input from "@common/Input";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import {
  driverFormSchema,
  type DriverFormData,
} from "@/lib/schemas/driver.schema";
import { useCreateDriverMutation } from "@/queries/driver";
import type { Driver } from "@/types/driver.types";

// Document types for compliance
const DOCUMENT_TYPES = [
  { id: "driverLicense", label: "Driver License" },
  { id: "whiteCard", label: "White Card" },
  { id: "voc", label: "VOC (Verification of Competency)" },
  { id: "highRiskWorkLicense", label: "High Risk Work License" },
] as const;

type DocumentType = (typeof DOCUMENT_TYPES)[number]["id"];

interface DocumentState {
  [key: string]: {
    file: File | null;
    uploaded: boolean;
  };
}

interface DriverFormProps {
  driver?: Driver | null;
  mode?: "add" | "edit";
}

export default function DriverForm({ driver, mode = "add" }: DriverFormProps) {
  const { closeOffcanvas, openOffcanvasId } = useOffcanvasStore();

  // Determine if we're in edit mode (moved up for use in useMemo)
  const isEditMode = mode === "edit" && driver;
  const offcanvasId = isEditMode ? "offcanvasEditDriver" : "offcanvasAddDriver";

  // Document upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeDocumentType, setActiveDocumentType] =
    useState<DocumentType | null>(null);
  const [documentChanges, setDocumentChanges] = useState<DocumentState>({});
  const prevDriverIdRef = useRef<string | null>(null);

  // Reset document changes when driver changes
  const currentDriverId = driver?.id ?? null;
  if (prevDriverIdRef.current !== currentDriverId) {
    prevDriverIdRef.current = currentDriverId;
    if (Object.keys(documentChanges).length > 0) {
      setDocumentChanges({});
    }
  }

  // Derive initial documents from driver prop
  const initialDocuments = useMemo((): DocumentState => {
    const state: DocumentState = {};
    DOCUMENT_TYPES.forEach((doc) => {
      state[doc.id] = { file: null, uploaded: false };
    });

    if (isEditMode && driver?.driver_documents) {
      driver.driver_documents.forEach((d) => {
        if (d?.driver_license) {
          state["driverLicense"] = { file: null, uploaded: true };
        }
        if (d?.white_card) {
          state["whiteCard"] = { file: null, uploaded: true };
        }
        if (d?.voc) {
          state["voc"] = { file: null, uploaded: true };
        }
        if (d?.high_risk_work_license) {
          state["highRiskWorkLicense"] = { file: null, uploaded: true };
        }
      });
    }
    return state;
  }, [isEditMode, driver]);

  // Merge initial documents with user changes
  const documents = useMemo(
    () => ({ ...initialDocuments, ...documentChanges }),
    [initialDocuments, documentChanges]
  );

  const mutation = useCreateDriverMutation();

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    setValue,
    clearErrors,
    control,
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "+61",
      password: "",
    },
  });

  const mobileNumber = useWatch({
    control,
    name: "mobileNumber",
    defaultValue: "+61",
  });

  // Memoize offcanvas state
  const isOffcanvasOpen = useMemo(
    () => openOffcanvasId === offcanvasId,
    [openOffcanvasId, offcanvasId]
  );

  // Populate form when in edit mode
  useEffect(() => {
    if (isEditMode && driver && isOffcanvasOpen) {
      reset({
        fullName: driver.name || "",
        email: driver.email || "",
        mobileNumber: driver.mobile_number || "+61",
        password: "", // Don't populate password for security
      });
    }
  }, [isEditMode, driver, isOffcanvasOpen, reset]);

  // Handle offcanvas animation
  useEffect(() => {
    if (!isOffcanvasOpen) return;

    const element = document.getElementById(offcanvasId);
    if (!element) return;

    requestAnimationFrame(() => {
      element.classList.add("show");
      document.body.style.overflow = "hidden";
    });

    return () => {
      element.classList.remove("show");
      if (!openOffcanvasId) {
        document.body.style.overflow = "";
      }
    };
  }, [isOffcanvasOpen, openOffcanvasId, offcanvasId]);

  // Handle mobile number input to maintain +61 prefix
  const handleMobileNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Always ensure the value starts with +61
      if (!value.startsWith("+61")) {
        value = "+61";
      }

      // Only allow numbers after +61
      const numbers = value.slice(3).replace(/\D/g, "");
      const newValue = `+61${numbers}`;

      setValue("mobileNumber", newValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  // Handle mobile number key down to prevent deleting the prefix
  const handleMobileNumberKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const cursorPosition = input.selectionStart || 0;

      // Prevent deletion of +61 prefix
      if (
        (e.key === "Backspace" || e.key === "Delete") &&
        cursorPosition <= 3
      ) {
        e.preventDefault();
      }
    },
    []
  );

  // Handle mobile number focus to position cursor after +61
  const handleMobileNumberFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const cursorPosition = input.selectionStart || 0;

      // If cursor is before or at position 3, move it after +61
      if (cursorPosition < 3) {
        setTimeout(() => {
          input.setSelectionRange(3, 3);
        }, 0);
      }
    },
    []
  );

  // Memoized password generator function
  const generateSecurePassword = useCallback((): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "@$!%*?&#";
    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = password.length; i < 16; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }, []);

  // Handle cancel action
  const handleCancel = useCallback(() => {
    closeOffcanvas();
    setTimeout(() => {
      reset({
        fullName: "",
        email: "",
        mobileNumber: "+61",
        password: "",
      });
      setDocumentChanges({});
    }, 300);
  }, [closeOffcanvas, reset]);

  // Handle document type button click
  const handleDocumentClick = useCallback((documentType: DocumentType) => {
    setActiveDocumentType(documentType);
    setIsUploadModalOpen(true);
  }, []);

  // Handle document upload
  const handleDocumentUpload = useCallback(
    (file: File) => {
      if (activeDocumentType) {
        setDocumentChanges((prev) => ({
          ...prev,
          [activeDocumentType]: { file, uploaded: true },
        }));
      }
      setIsUploadModalOpen(false);
      setActiveDocumentType(null);
    },
    [activeDocumentType]
  );

  // Handle upload modal close
  const handleUploadModalClose = useCallback(() => {
    setIsUploadModalOpen(false);
    setActiveDocumentType(null);
  }, []);

  // Handle document removal
  const handleRemoveDocument = useCallback(
    (e: React.MouseEvent, documentType: DocumentType) => {
      e.stopPropagation();
      setDocumentChanges((prev) => ({
        ...prev,
        [documentType]: { file: null, uploaded: false },
      }));
    },
    []
  );

  // Handle auto-generate password
  const handleAutoGenerate = useCallback(() => {
    const newPassword = generateSecurePassword();
    setValue("password", newPassword, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    clearErrors("password");
  }, [generateSecurePassword, setValue, clearErrors]);

  // Handle form submission
  const onSubmit = useCallback(
    async (data: DriverFormData) => {
      try {
        const formData = new FormData();

        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("mobileNumber", data.mobileNumber);

        // Only append password if it's provided (for add mode or password change)
        if (data.password) {
          formData.append("password", data.password);
        }

        // Add driver ID if in edit mode
        if (isEditMode && driver?.id) {
          formData.append("id", driver.id.toString());
        }

        // Append document files only if they exist
        if (documents.driverLicense?.file) {
          formData.append("driverLicense", documents.driverLicense.file);
        }
        if (documents.whiteCard?.file) {
          formData.append("whiteCard", documents.whiteCard.file);
        }
        if (documents.voc?.file) {
          formData.append("voc", documents.voc.file);
        }
        if (documents.highRiskWorkLicense?.file) {
          formData.append(
            "highRiskWorkLicense",
            documents.highRiskWorkLicense.file
          );
        }

        if (isEditMode) {
          for (const [key, value] of formData.entries()) {
            console.log(key, value);
          }


        } else {
          await mutation.mutateAsync(formData);
        }

        handleCancel();
      } catch (error) {
        console.error(
          isEditMode ? "Error updating driver:" : "Error adding driver:",
          error
        );
      }
    },
    [documents, mutation, handleCancel, isEditMode, driver]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCancel();
      }
    },
    [handleCancel]
  );

  // Memoize submit button disabled state
  const isSubmitDisabled = useMemo(
    () => isSubmitting || (!isDirty && !isValid),
    [isSubmitting, isDirty, isValid]
  );

  return (
    <>
      {isOffcanvasOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleBackdropClick}
        />
      )}

      <div
        className="offcanvas offcanvas-end offcanvas-cm"
        tabIndex={-1}
        id={offcanvasId}
        aria-labelledby={`${offcanvasId}Label`}
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id={`${offcanvasId}Label`}>
              {isEditMode ? "Edit Driver" : "Add Driver"}
            </div>
            <p className="offcanvas-tl-p">
              {isEditMode
                ? "Update driver information and compliance documents."
                : "Add a new driver to your team for job assignments."}
            </p>
          </div>
        </div>
        <form
          className="offcanvas-form"
          onSubmit={handleFormSubmit(onSubmit)}
          noValidate
        >
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Enter driver's full name"
                  {...register("fullName")}
                  inputClass={`form-control border ${errors.fullName ? "border-danger" : ""
                    }`}
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby={
                    errors.fullName ? "fullName-error" : undefined
                  }
                />
                {errors.fullName && (
                  <p
                    id="fullName-error"
                    className="text-primary form-text mt-2 small"
                    role="alert"
                  >
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="driver@example.com"
                  {...register("email")}
                  inputClass={`form-control border ${errors.email ? "border-danger" : ""
                    }`}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-primary form-text mt-2 small"
                    role="alert"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label className="form-label">
                  Mobile Number <span className="text-danger">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="+61412345678"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  onKeyDown={handleMobileNumberKeyDown}
                  onFocus={handleMobileNumberFocus}
                  inputClass={`form-control border ${errors.mobileNumber ? "border-danger" : ""
                    }`}
                  aria-invalid={errors.mobileNumber ? "true" : "false"}
                  aria-describedby={
                    errors.mobileNumber ? "mobileNumber-error" : undefined
                  }
                />
                {errors.mobileNumber && (
                  <p
                    id="mobileNumber-error"
                    className="text-primary form-text mt-2 small"
                    role="alert"
                  >
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">
                  {isEditMode
                    ? "Change Password (Optional)"
                    : "Generate Password"}{" "}
                  {!isEditMode && <span className="text-danger">*</span>}
                </label>
                <div className="position-relative">
                  <Input
                    type="text"
                    placeholder={
                      isEditMode
                        ? "Leave blank to keep current"
                        : "Enter Password"
                    }
                    {...register("password")}
                    inputClass={`form-control border ${errors.password ? "border-danger" : ""
                      }`}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAutoGenerate}
                    className="position-absolute auto-generate-btn bg-white"
                    aria-label="Auto-generate secure password"
                  >
                    Auto-Generated
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-primary form-text mt-2 small"
                    role="alert"
                  >
                    {errors.password.message}
                  </p>
                )}
                {!isEditMode && (
                  <p className="form-text mt-2 small text-primary fst-italic fw-bold">
                    Note: A temporary password will be sent by email. The driver
                    can reset it on first login.
                  </p>
                )}
              </div>

              {/* Driver Compliance Documents */}
              <div className="form-group">
                <label className="form-label fw-bold driver-form-label">
                  Driver Compliance Documents
                </label>
                <p className="cgray mb-3 driver-form-description">
                  Upload the driver&apos;s required licences and certifications
                  to confirm they are qualified and legally permitted to operate
                  on-site. Make sure all documents are current and valid.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  {DOCUMENT_TYPES.map((doc) => {
                    const isUploaded = documents[doc.id]?.uploaded;
                    const buttonClass = isUploaded
                      ? "doc-upload-btn doc-upload-btn-uploaded"
                      : "doc-upload-btn doc-upload-btn-default";

                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleDocumentClick(doc.id)}
                        className={buttonClass}
                      >
                        {isUploaded ? (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.3334 4L6.00008 11.3333L2.66675 8"
                              stroke="#2e7d32"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 10.6667V5.33333M8 5.33333L5.33333 8M8 5.33333L10.6667 8"
                              stroke="#797979"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M13.3333 10.6667V12C13.3333 12.7364 12.7364 13.3333 12 13.3333H4C3.26362 13.3333 2.66667 12.7364 2.66667 12V10.6667"
                              stroke="#797979"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        {doc.label}
                        {isUploaded && (
                          <span
                            onClick={(e) => handleRemoveDocument(e, doc.id)}
                            className="doc-remove-icon"
                            title="Remove document"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                                stroke="#2e7d32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="offcanvas-op-btn">
            <div className="offcanvas-btn-wrap">
              <Button
                type="button"
                variant="outline"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="filled"
                disabled={isSubmitDisabled}
                aria-busy={isSubmitting}
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "Update Driver"
                    : "Add Driver"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleUploadModalClose}
        onUpload={handleDocumentUpload}
        title="Upload Document"
        description="Choose the document you want to upload from your device. Ensure the file is clear, valid, and up to date so we can verify compliance smoothly."
      />
    </>
  );
}
