"use client";

import { useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import Button from "@common/Button";
import Input from "@common/Input";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import {
  teamMemberCreateSchema,
  teamMemberEditSchema,
  type TeamMemberCreateData,
  type TeamMemberEditData,
} from "@/lib/schemas/team-member.schema";
import {
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
} from "@/queries/team-member";
import type { TeamMember } from "@/types/team-member.types";

interface TeamMemberFormProps {
  teamMember?: TeamMember | null;
  mode?: "add" | "edit";
}

export default function TeamMemberForm({
  teamMember,
  mode = "add",
}: TeamMemberFormProps) {
  const { closeOffcanvas, openOffcanvasId } = useOffcanvasStore();

  // Determine if we're in edit mode
  const isEditMode = mode === "edit" && teamMember;
  const offcanvasId = isEditMode
    ? "offcanvasEditTeamMember"
    : "offcanvasAddTeamMember";

  const createMutation = useCreateTeamMemberMutation();
  const updateMutation = useUpdateTeamMemberMutation();

  // Use appropriate schema based on mode
  const schema = isEditMode ? teamMemberEditSchema : teamMemberCreateSchema;

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    setValue,
    clearErrors,
    control,
  } = useForm<TeamMemberCreateData | TeamMemberEditData>({
    resolver: zodResolver(schema),
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
    if (isEditMode && teamMember && isOffcanvasOpen) {
      reset({
        fullName: teamMember.name || teamMember.fullName || "",
        email: teamMember.email || "",
        mobileNumber: teamMember.mobile_number || "+61",
        password: "", // Don't populate password for security
      });
    }
  }, [isEditMode, teamMember, isOffcanvasOpen, reset]);

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
    }, 300);
  }, [closeOffcanvas, reset]);

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
    async (data: TeamMemberCreateData | TeamMemberEditData) => {
      try {
        const formData = new FormData();

        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("mobileNumber", data.mobileNumber);

        // Only append password if it's provided
        if (data.password) {
          formData.append("password", data.password);
        }

        if (isEditMode && teamMember?.id) {
          await updateMutation.mutateAsync({
            id: teamMember.id,
            data: formData,
          });
        } else {
          await createMutation.mutateAsync(formData);
        }

        handleCancel();
      } catch (error) {
        console.error(
          isEditMode
            ? "Error updating team member:"
            : "Error adding team member:",
          error
        );
      }
    },
    [createMutation, updateMutation, handleCancel, isEditMode, teamMember]
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
              {isEditMode ? "Edit Team Member" : "Add a Team Member"}
            </div>
            <p className="offcanvas-tl-p">
              {isEditMode
                ? "Update team member information."
                : "Invite an admin team member to help manage jobs, drivers, or fleet operations. They'll receive login details by email."}
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
                  placeholder="Enter team member's full name"
                  {...register("fullName")}
                  inputClass={`form-control border ${
                    errors.fullName ? "border-danger" : ""
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
                  placeholder="team.member@example.com"
                  {...register("email")}
                  inputClass={`form-control border ${
                    errors.email ? "border-danger" : ""
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
                  inputClass={`form-control border ${
                    errors.mobileNumber ? "border-danger" : ""
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

              <hr />

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
                    inputClass={`form-control border ${
                      errors.password ? "border-danger" : ""
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
                    Note: A temporary password will be sent by email. The team
                    member can reset it on first login.
                  </p>
                )}
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
                    : "Inviting..."
                  : isEditMode
                  ? "Update Team Member"
                  : "Invite Team Member"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
