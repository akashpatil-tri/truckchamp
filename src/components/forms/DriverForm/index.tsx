"use client";

import { useEffect, useState } from "react";

import Button from "@common/Button";
import Input from "@common/Input";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

export default function DriverForm() {
  const { closeOffcanvas, openOffcanvasId } = useOffcanvasStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    licenseNumber: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    licenseNumber: "",
  });

  useEffect(() => {
    if (openOffcanvasId !== "offcanvasAddDriver") return;

    const element = document.getElementById("offcanvasAddDriver");
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
  }, [openOffcanvasId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      mobileNumber: "",
      licenseNumber: "",
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

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
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
      console.log("Adding driver:", formData);
      handleCancel();
    } catch (error) {
      console.error("Error adding driver:", error);
    }
  };

  const handleCancel = () => {
    closeOffcanvas();
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        mobileNumber: "",
        licenseNumber: "",
      });
      setErrors({
        fullName: "",
        email: "",
        mobileNumber: "",
        licenseNumber: "",
      });
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <>
      {openOffcanvasId === "offcanvasAddDriver" && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleBackdropClick}
        />
      )}

      <div
        className="offcanvas offcanvas-end offcanvas-cm"
        tabIndex={-1}
        id="offcanvasAddDriver"
        aria-labelledby="offcanvasAddDriverLabel"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasAddDriverLabel">
              Add Driver
            </div>
            <p className="offcanvas-tl-p">
              Add a new driver to your team for job assignments.
            </p>
          </div>
        </div>
        <form className="offcanvas-form">
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Enter driver's full name"
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

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="driver@example.com"
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

              <div className="form-group">
                <label className="form-label">License Number</label>
                <Input
                  type="text"
                  name="licenseNumber"
                  placeholder="Enter license number"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  inputClass={`form-control border ${
                    errors.licenseNumber ? "border-danger" : ""
                  }`}
                />
                {errors.licenseNumber && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.licenseNumber}
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
              >
                Cancel
              </Button>
              <Button type="button" variant="filled" onClick={handleSubmit}>
                Add Driver
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
