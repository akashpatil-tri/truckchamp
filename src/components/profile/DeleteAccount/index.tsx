"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@common/Button";
import InputField from "@common/Input";
import Dropdown from "@common/Dropdown";

import { useProfileQuery, useDeleteAccountMutation } from "@/queries/profile";
import {
  deleteAccountSchema,
  type DeleteAccountFormData,
} from "@/lib/schemas/profile.schema";

const deleteReasonOptions = [
  { value: "costly", label: "Costly" },
  { value: "other", label: "Other" },
];

export default function DeleteAccount() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<DeleteAccountFormData | null>(null);

  const { data: profile } = useProfileQuery();
  const deleteMutation = useDeleteAccountMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: DeleteAccountFormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!profile || !formData) return;

    try {
      await deleteMutation.mutateAsync({
        id: profile.id,
        data: formData,
      });
      setShowConfirmModal(false);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setFormData(null);
  };

  return (
    <div>
      <div className="profile-content-header">
        <h3 className="profile-content-title">Delete Account</h3>
      </div>

      <h4 className="fs-16 fw-bold mb-2">Permanently delete your account</h4>
      <p className="delete-account-warning">
        Deleting your account is permanent and will remove all your data. This
        action cannot be undone. Are you sure you want to continue?
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <InputField
                type="email"
                placeholder="Enter Email Address"
                {...register("email")}
                inputClass={`form-control border ${errors.email ? "border-danger" : ""}`}
              />
              {errors.email && (
                <p className="text-primary form-text mt-2 small">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-icon">
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("password")}
                  inputClass={`form-control border ${errors.password ? "border-danger" : ""}`}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {showPassword ? (
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                        fill="#797979"
                      />
                    ) : (
                      <path
                        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                        fill="#797979"
                      />
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="text-primary form-text mt-2 small">{errors.password.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Select Reason</label>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={deleteReasonOptions}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                placeholder="Choose Reason"
                error={errors.reason?.message}
              />
            )}
          />
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Button
            type="submit"
            variant="filled"
            isLoading={deleteMutation.isPending}
          >
            Confirm Deletion
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <>
          <div
            className="modal-backdrop fade show document-upload-modal-backdrop"
            onClick={handleCloseModal}
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
                      Delete Account
                    </h5>
                    <p className="mb-0 mt-3 document-upload-modal-description">
                      Are you sure you want to permanently delete your account?
                      This action cannot be undone and all your data will be
                      lost.
                    </p>
                  </div>
                </div>
                <div className="modal-body p-4 pt-0"></div>
                <div className="d-flex justify-content-between align-items-center border-0 p-4 pt-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="me-2 bck-btn bg-white text-black border-dark"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="filled"
                    onClick={handleConfirmDelete}
                    isLoading={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
