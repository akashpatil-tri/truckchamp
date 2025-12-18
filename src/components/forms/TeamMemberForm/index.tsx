"use client";

import { useEffect, useState } from "react";

import Button from "@common/Button";
import Input from "@common/Input";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import "./TeamMemberForm.css";

export default function TeamMemberForm() {
  const { openOffcanvas, closeOffcanvas, openOffcanvasId } =
    useOffcanvasStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  // Add show class to active offcanvas for smooth transitions
  useEffect(() => {
    if (openOffcanvasId !== "offcanvasAddTeamMember") return;

    const element = document.getElementById("offcanvasAddTeamMember");
    if (!element) return;

    // Add show class with a small delay for transition
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
  }, [openOffcanvasId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Implement API call to add team member
      console.log("Adding team member:", formData);

      // Close offcanvas and reset form
      handleCancel();
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  const handleCancel = () => {
    closeOffcanvas();
    // Reset form after animation
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        password: "",
      });
      setErrors({
        fullName: "",
        email: "",
        mobileNumber: "",
        password: "",
      });
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleAutoGenerate = () => {
    // Generate a random password
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password }));
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  return (
    <>
      {/* Backdrop */}
      {openOffcanvasId === "offcanvasAddTeamMember" && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleBackdropClick}
        />
      )}

      {/* Add Team Member Offcanvas */}
      <div
        className="offcanvas offcanvas-end offcanvas-cm"
        tabIndex={-1}
        id="offcanvasAddTeamMember"
        aria-labelledby="offcanvasAddTeamMemberLabel"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasAddTeamMemberLabel">
              Add a Team Member
            </div>
            <p className="offcanvas-tl-p">
              Invite a admin team member to help manage jobs, drivers, or fleet
              operations. They'll receive login details by email.
            </p>
          </div>
        </div>
        <form className="offcanvas-form">
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Alex Johnson"
                  value={formData.fullName}
                  onChange={handleChange}
                  inputClass={`form-control border ${
                    errors.fullName ? "border-danger" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="alex.johnson@truckmatch.com"
                  value={formData.email}
                  onChange={handleChange}
                  inputClass={`form-control border ${
                    errors.email ? "border-danger" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <Input
                  type="tel"
                  name="mobileNumber"
                  placeholder="+61"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  inputClass={`form-control border ${
                    errors.mobileNumber ? "border-danger" : ""
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              <hr />

              {/* Generate Password */}
              <div className="form-group">
                <label className="form-label">Generate Password</label>
                <div className="position-relative">
                  <Input
                    type="text"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    inputClass={`form-control border ${
                      errors.password ? "border-danger" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAutoGenerate}
                    className="btn-unstyled position-absolute auto-generate-btn"
                  >
                    Auto-Generated
                  </button>
                </div>
                {errors.password && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.password}
                  </p>
                )}
                <p className="form-text mt-2 small text-primary fst-italic fw-bold">
                  Note: A temporary password will be sent by email. The team
                  member can reset it on first login.
                </p>
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
              >
                Cancel
              </Button>
              <Button type="button" variant="filled" onClick={handleSubmit}>
                Invite Team Member
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
