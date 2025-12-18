"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

import Button from "@common/Button";
import Dropdown from "@common/Dropdown";
import Input from "@common/Input";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import {
  addFleet,
  loadTruckTypes,
  type Attachment,
} from "@/lib/api/fleet/fleet.api";
import {
  fleetFormSchema,
  type FleetFormData,
} from "@/lib/schemas/fleet.schema";

import AttachmentModal from "./AttachmentModal";

import "./FleetForm.css";

export default function FleetForm() {
  const { closeOffcanvas, openOffcanvasId } = useOffcanvasStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FleetFormData>({
    resolver: zodResolver(fleetFormSchema),
    mode: "onBlur",
    defaultValues: {
      truckType: "",
      truckNumber: "",
      hourlyRate: "",
      travelCharge: "",
      minimumHire: "",
      attachments: [],
      fleetImages: [],
      vehicleRegistrationCertificate: null,
      publicLiabilityInsurance: null,
      maintenanceRecords: null,
      truckInsurance: null,
      motorVehicleRegistrationCertificate: null,
      vehicleInsuranceDocument: null,
      swmsDocument: null,
    },
  });

  // Watch form values for dynamic updates
  const attachments = watch("attachments");
  const fleetImages = watch("fleetImages");
  const vehicleRegistrationCertificate = watch(
    "vehicleRegistrationCertificate"
  );
  const publicLiabilityInsurance = watch("publicLiabilityInsurance");
  const maintenanceRecords = watch("maintenanceRecords");
  const truckInsurance = watch("truckInsurance");
  const motorVehicleRegistrationCertificate = watch(
    "motorVehicleRegistrationCertificate"
  );
  const vehicleInsuranceDocument = watch("vehicleInsuranceDocument");
  const swmsDocument = watch("swmsDocument");

  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);

  useEffect(() => {
    if (openOffcanvasId !== "offcanvasAddFleet") return;

    const element = document.getElementById("offcanvasAddFleet");
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

  const handleDropdownChange = (name: string, value: string) => {
    setValue(name as keyof FleetFormData, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleAddAttachment = (name: string, price: number) => {
    const newAttachment: Attachment = {
      id: Date.now().toString(),
      name,
      price,
    };
    setValue("attachments", [...attachments, newAttachment], {
      shouldValidate: true,
    });
    setIsAttachmentModalOpen(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setValue(
      "attachments",
      attachments.filter((att) => att.id !== id),
      { shouldValidate: true }
    );
  };

  const handleFleetImagesSelect = (files: File[]) => {
    const newImages = [...fleetImages, ...files].slice(0, 3);
    setValue("fleetImages", newImages, { shouldValidate: true });
  };

  const handleRemoveFleetImage = (index: number) => {
    setValue(
      "fleetImages",
      fleetImages.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const handleDocumentUpload = (
    fieldName: keyof FleetFormData,
    files: File[]
  ) => {
    if (files.length > 0) {
      setValue(fieldName, files[0], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FleetFormData) => {
    try {
      await addFleet({
        truckType: data.truckType,
        truckNumber: data.truckNumber,
        hourlyRate: data.hourlyRate,
        travelCharge: data.travelCharge,
        minimumHire: data.minimumHire,
        attachments: data.attachments,
        fleetImages: data.fleetImages,
        vehicleRegistrationCertificate: data.vehicleRegistrationCertificate,
        publicLiabilityInsurance: data.publicLiabilityInsurance,
        maintenanceRecords: data.maintenanceRecords,
        truckInsurance: data.truckInsurance,
        motorVehicleRegistrationCertificate:
          data.motorVehicleRegistrationCertificate,
        vehicleInsuranceDocument: data.vehicleInsuranceDocument,
        swmsDocument: data.swmsDocument,
      });

      console.log("Fleet added successfully!");
      handleCancel();
    } catch (error) {
      console.error("Error adding fleet:", error);
    }
  };

  const handleCancel = () => {
    closeOffcanvas();
    setTimeout(() => {
      reset();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <>
      {openOffcanvasId === "offcanvasAddFleet" && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleBackdropClick}
        />
      )}

      <div
        className="offcanvas offcanvas-end offcanvas-cm offcanvas-med"
        tabIndex={-1}
        id="offcanvasAddFleet"
        aria-labelledby="offcanvasAddFleetLabel"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasAddFleetLabel">
              Add New Fleet
            </div>
            <p className="offcanvas-tl-p">
              Provide your truck details and upload the required compliance
              documents to keep your fleet verified and up to date.
            </p>
          </div>
        </div>
        <form className="offcanvas-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              {/* Truck Type */}
              <div className="form-group">
                <label className="form-label">Truck Type</label>
                <Dropdown
                  placeholder="Select Truck Type"
                  value={watch("truckType")}
                  onChange={(value) =>
                    handleDropdownChange("truckType", value as string)
                  }
                  loadOptions={(page, searchTerm) =>
                    loadTruckTypes(page, searchTerm)
                  }
                  queryKey="truck-types"
                  isSearchable={true}
                  error={errors.truckType?.message}
                />
              </div>

              {/* Attachments */}
              <div className="form-group">
                <label className="form-label">Attachments</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="d-inline-flex align-items-center gap-2 px-3 py-2 bg-red2 br30 fs-14"
                    >
                      <span className="text-primary">
                        {attachment.name} - ${attachment.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="text-primary border-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setIsAttachmentModalOpen(true)}
                  className="btn-unstyled text-primary border-0 text-sm fw-medium"
                >
                  + Add Attachment
                </button>
              </div>

              {/* Fleet Images */}
              <div className="form-group">
                <label className="form-label">Fleet Images</label>
                <p className="mb-2 fs-12 cgray">
                  Only support jpg, jpeg, and png files
                </p>
                <div className="row gx-2">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="col-4 mb-2">
                      {fleetImages[index] ? (
                        <div className="position-relative">
                          <Image
                            src={URL.createObjectURL(fleetImages[index])}
                            alt={`Fleet ${index + 1}`}
                            className="w-100 br10 fleet-image-thumbnail"
                            width={20}
                            height={20}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFleetImage(index)}
                            className="btn-unstyled position-absolute fleet-image-remove-btn"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center border2-gray br10 fleet-image-slot"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/jpeg,image/jpg,image/png";
                            input.onchange = (e) => {
                              const files = Array.from(
                                (e.target as HTMLInputElement).files || []
                              );
                              handleFleetImagesSelect(files);
                            };
                            input.click();
                          }}
                        >
                          <span className="fleet-upload-icon">+</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {errors.fleetImages && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.fleetImages.message}
                  </p>
                )}
              </div>

              {/* Truck Number & Hourly Rate */}
              <div className="row gx-2">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Truck Number</label>
                    <Input
                      type="text"
                      placeholder="Enter Truck Number"
                      {...register("truckNumber")}
                      inputClass={`form-control border ${
                        errors.truckNumber ? "border-danger" : ""
                      }`}
                    />
                    {errors.truckNumber && (
                      <p className="text-primary form-text mt-2 small">
                        {errors.truckNumber.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Hourly Rate</label>
                    <Input
                      type="number"
                      placeholder="Enter Hourly Rate"
                      {...register("hourlyRate")}
                      inputClass={`form-control border ${
                        errors.hourlyRate ? "border-danger" : ""
                      }`}
                    />
                    {errors.hourlyRate && (
                      <p className="text-primary form-text mt-2 small">
                        {errors.hourlyRate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Travel Charge & Minimum Hire */}
              <div className="row gx-2">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Travel Charge</label>
                    <Input
                      type="number"
                      placeholder="Enter Travel Charge"
                      {...register("travelCharge")}
                      inputClass={`form-control border ${
                        errors.travelCharge ? "border-danger" : ""
                      }`}
                    />
                    {errors.travelCharge && (
                      <p className="text-primary form-text mt-2 small">
                        {errors.travelCharge.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Minimum Hire</label>
                    <Input
                      type="text"
                      placeholder="Minimum 6 hrs or 4 Hours"
                      {...register("minimumHire")}
                      inputClass={`form-control border ${
                        errors.minimumHire ? "border-danger" : ""
                      }`}
                    />
                    {errors.minimumHire && (
                      <p className="text-primary form-text mt-2 small">
                        {errors.minimumHire.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Required Documents */}
              <div className="form-group">
                <h6 className="fw-bold mb-2">Upload Required Documents</h6>

                {/* Common Document */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Common Document
                  </label>
                  <p className="mb-2 fs-12 cgray">
                    Please provide the essential documents that confirm your
                    truck&apos;s registration, insurance, and maintenance
                    status.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      {
                        key: "vehicleRegistrationCertificate" as const,
                        label: "Vehicle/Fleet Registration Certificate",
                        value: vehicleRegistrationCertificate,
                      },
                      {
                        key: "publicLiabilityInsurance" as const,
                        label: "Public Liability Insurance",
                        value: publicLiabilityInsurance,
                      },
                      {
                        key: "maintenanceRecords" as const,
                        label: "Maintenance & Service Records",
                        value: maintenanceRecords,
                      },
                      {
                        key: "truckInsurance" as const,
                        label: "Truck/Equipment Insurance",
                        value: truckInsurance,
                      },
                    ].map((doc) => (
                      <div
                        key={doc.key}
                        className={`px-3 py-2 br30 d-inline-flex align-items-center gap-2 doc-upload-btn ${
                          doc.value ? "bg-green3" : "border2-gray"
                        }`}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".pdf,.doc,.docx";
                          input.onchange = (e) => {
                            const files = Array.from(
                              (e.target as HTMLInputElement).files || []
                            );
                            handleDocumentUpload(doc.key, files);
                          };
                          input.click();
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M8 10V4M8 4L5.5 6.5M8 4L10.5 6.5"
                            stroke={doc.value ? "#2E7D32" : "#797979"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 10V11C3 11.5523 3.44772 12 4 12H12C12.5523 12 13 11.5523 13 11V10"
                            stroke={doc.value ? "#2E7D32" : "#797979"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          className={
                            doc.value
                              ? "doc-upload-btn--uploaded-green"
                              : "doc-upload-btn--default"
                          }
                        >
                          {doc.label}
                        </span>
                        {doc.value && (
                          <span className="doc-checkmark-green">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Motor Vehicle Certification */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Motor vehicle certification
                  </label>
                  <p className="mb-2 fs-12 cgray">
                    Attach your current vehicle certification showing this truck
                    has passed all required inspections for safe use.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      {
                        key: "motorVehicleRegistrationCertificate" as const,
                        label: "Vehicle Registration Certificate",
                        value: motorVehicleRegistrationCertificate,
                      },
                      {
                        key: "vehicleInsuranceDocument" as const,
                        label: "Vehicle Insurance Document",
                        value: vehicleInsuranceDocument,
                      },
                      {
                        key: "swmsDocument" as const,
                        label: "SWMS Document",
                        value: swmsDocument,
                      },
                    ].map((doc) => (
                      <div
                        key={doc.key}
                        className={`px-3 py-2 br30 d-inline-flex align-items-center gap-2 doc-upload-btn ${
                          doc.value ? "bg-orange3" : "border2-gray"
                        }`}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".pdf,.doc,.docx";
                          input.onchange = (e) => {
                            const files = Array.from(
                              (e.target as HTMLInputElement).files || []
                            );
                            handleDocumentUpload(doc.key, files);
                          };
                          input.click();
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M8 10V4M8 4L5.5 6.5M8 4L10.5 6.5"
                            stroke={doc.value ? "#FFA500" : "#797979"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3 10V11C3 11.5523 3.44772 12 4 12H12C12.5523 12 13 11.5523 13 11V10"
                            stroke={doc.value ? "#FFA500" : "#797979"}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          className={
                            doc.value
                              ? "doc-upload-btn--uploaded-orange"
                              : "doc-upload-btn--default"
                          }
                        >
                          {doc.label}
                        </span>
                        {doc.value && (
                          <span className="doc-checkmark-orange">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="filled"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                {isSubmitting ? "Adding Fleet..." : "Add New Fleet"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Attachment Modal */}
      <AttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        onSave={handleAddAttachment}
      />
    </>
  );
}
