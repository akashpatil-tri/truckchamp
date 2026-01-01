"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@common/Button";
import InputField from "@common/Input";
import Spinner from "@common/Spinner";

import { useProfileQuery, useUpdateProfileMutation } from "@/queries/profile";
import {
  editProfileSchema,
  type EditProfileFormData,
} from "@/lib/schemas/profile.schema";

import defaultLogo from "@assets/svg/d-mem-icon.svg";

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (profile) {
      reset({
        abnNumber: profile.abnNumber || "",
        primaryContactName: profile.primaryContactName || "",
        primaryContactEmail: profile.primaryContactEmail || "",
        mobileNumber: profile.mobileNumber || "",
      });
      if (profile.companyLogo) {
        setLogoPreview(profile.companyLogo);
      }
    }
  }, [profile, reset]);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EditProfileFormData) => {
    if (!profile) return;

    const formData = new FormData();
    formData.append("abnNumber", data.abnNumber);
    formData.append("primaryContactName", data.primaryContactName);
    formData.append("primaryContactEmail", data.primaryContactEmail);
    formData.append("mobileNumber", data.mobileNumber);

    if (selectedLogo) {
      formData.append("companyLogo", selectedLogo);
    }

    try {
      await updateMutation.mutateAsync({ id: profile.id, data: formData });
      setIsEditing(false);
      setSelectedLogo(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedLogo(null);
    if (profile) {
      reset({
        abnNumber: profile.abnNumber || "",
        primaryContactName: profile.primaryContactName || "",
        primaryContactEmail: profile.primaryContactEmail || "",
        mobileNumber: profile.mobileNumber || "",
      });
      setLogoPreview(profile.companyLogo || null);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <p>Loading...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div>
        <div className="profile-content-header">
          <h3 className="profile-content-title">Edit Profile</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="edit-profile-form">
          <div className="logo-upload-section mb-4">
            <Image
              src={logoPreview || defaultLogo}
              alt="Company Logo"
              width={70}
              height={70}
              className="logo-preview"
            />
            <div
              className="logo-upload-btn"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleLogoClick()}
            >
              Replace Logo
              <span>eg .jpg, .jpeg, and .png files</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleLogoChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <InputField
                  type="text"
                  placeholder={profile?.companyName || "Company Name"}
                  value={profile?.companyName || ""}
                  isDisabled
                  inputClass="form-control border"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Company Type</label>
                <InputField
                  type="text"
                  placeholder={profile?.companyType || "Company Type"}
                  value={profile?.companyType || ""}
                  isDisabled
                  inputClass="form-control border"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">
                  ABN / Business Registration Number
                </label>
                <InputField
                  type="text"
                  placeholder="Enter Business Registration Number"
                  {...register("abnNumber")}
                  inputClass={`form-control border ${
                    errors.abnNumber ? "border-danger" : ""
                  }`}
                />
                {errors.abnNumber && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.abnNumber.message}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Primary Contact Name</label>
                <InputField
                  type="text"
                  placeholder="Enter Primary Contact Name"
                  {...register("primaryContactName")}
                  inputClass={`form-control border ${
                    errors.primaryContactName ? "border-danger" : ""
                  }`}
                />
                {errors.primaryContactName && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.primaryContactName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Primary Contact Email</label>
                <InputField
                  type="email"
                  placeholder="Enter email address"
                  {...register("primaryContactEmail")}
                  inputClass={`form-control border ${
                    errors.primaryContactEmail ? "border-danger" : ""
                  }`}
                />
                {errors.primaryContactEmail && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.primaryContactEmail.message}
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <InputField
                  type="text"
                  placeholder="+61"
                  {...register("mobileNumber")}
                  inputClass={`form-control border ${
                    errors.mobileNumber ? "border-danger" : ""
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="btn-outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="filled"
              isLoading={updateMutation.isPending}
            >
              Update Profile
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="profile-content-header">
        <h3 className="profile-content-title">My Profile</h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="btn-outline"
        >
          Edit Profile
        </Button>
      </div>

      <div className="profile-card">
        <div className="profile-company-info">
          <Image
            src={profile?.companyLogo || defaultLogo}
            alt="Company Logo"
            width={70}
            height={70}
            className="profile-company-logo"
          />
          <div className="profile-company-details">
            <h4>{profile?.companyName || "Company Name"}</h4>
            <p>{profile?.companyType || "Company Type"}</p>
          </div>
        </div>
      </div>

      <div className="contact-details-section">
        <h5>Contact Details</h5>
        <div className="contact-details-grid">
          <div className="contact-detail-item">
            <div className="contact-detail-label">Primary Contact Name</div>
            <div className="contact-detail-value">
              {profile?.primaryContactName || "-"}
            </div>
          </div>
          <div className="contact-detail-item">
            <div className="contact-detail-label">Primary Contact Email</div>
            <div className="contact-detail-value">
              {profile?.primaryContactEmail || "-"}
            </div>
          </div>
          <div className="contact-detail-item">
            <div className="contact-detail-label">Mobile Number</div>
            <div className="contact-detail-value">
              {profile?.mobileNumber || "-"}
            </div>
          </div>
          <div className="contact-detail-item">
            <div className="contact-detail-label">
              ABN / Business Registration Number
            </div>
            <div className="contact-detail-value">
              {profile?.abnNumber || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
