"use client";

import { useCallback, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import Button from "@common/Button";
import DocumentUploadModal from "@common/DocumentUploadModal";
import Dropdown from "@common/Dropdown";
import Input from "@common/Input";
import DynamicPropertyFields, {
  Property,
  type PropertyValue,
} from "@forms/JobForm/DynamicPropertyFields";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import { addFleet, updateFleet } from "@/lib/api/fleet/fleet.service";
import {
  getTruckProperties,
  loadTruckTypes,
} from "@/lib/api/truck/truck.service";
import {
  Attachment,
  fleetFormSchema,
  type FleetFormData,
} from "@/lib/schemas/fleet.schema";
import type {
  Fleet,
  FleetAttachment,
  FleetDocument as FleetDocType,
  FleetImage,
  TruckType,
} from "@/types/fleet.types";

import AttachmentModal from "./AttachmentModal";

import "./FleetForm.css";

// Add this function before the component
const createDynamicValidationSchema = (properties: Property[]) => {
  const schemaFields: Record<string, unknown> = {};

  properties.forEach((prop) => {
    const {
      property_key,
      property_label,
      is_required,
      html_type,
      options,
      min_value,
      max_value,
    } = prop;

    if (html_type === "radio-input" && options) {
      // Radio - single string
      schemaFields[property_key] = is_required
        ? z.string().min(1, `${property_label} is required`)
        : z.string().optional();
    } else if (html_type === "checkbox-input" && options) {
      // Multi-select checkbox - array
      schemaFields[property_key] = is_required
        ? z
            .array(z.string())
            .min(1, `At least one ${property_label} is required`)
        : z.array(z.string()).optional();
    } else if (html_type === "checkbox-input" && !options) {
      // Single checkbox - boolean
      schemaFields[property_key] = is_required && z.boolean().optional();
    } else if (html_type === "number-input") {
      let schema = z.coerce.number({
        message: `${property_label} must be a number`,
      });

      if (min_value !== null) {
        schema = schema.min(
          min_value,
          `${property_label} must be at least ${min_value}`
        );
      }
      if (max_value !== null) {
        schema = schema.max(
          max_value,
          `${property_label} must be at most ${max_value}`
        );
      }

      schemaFields[property_key] = is_required ? schema : schema.optional();
    } else if (html_type === "text-input") {
      schemaFields[property_key] = is_required
        ? z.string().min(1, `${property_label} is required`)
        : z.string().optional();
    } else if (html_type === "range-input") {
      schemaFields[property_key] = is_required
        ? z
            .number()
            .min(min_value || 0)
            .max(max_value || 100)
        : z.number().optional();
    }
  });

  return z.object(schemaFields);
};

export default function FleetForm() {
  const { closeOffcanvas, openOffcanvasId, offcanvasData } =
    useOffcanvasStore();

  // Determine if we're in edit mode
  const isEditMode = openOffcanvasId === "offcanvasEditFleet";
  const fleetToEdit = isEditMode ? (offcanvasData as Fleet | null) : null;

  // Helper to get truck type ID
  const getTruckTypeId = (
    truckType: TruckType | string | undefined
  ): string => {
    if (!truckType) return "";
    if (typeof truckType === "object" && truckType !== null) {
      return truckType.id;
    }
    return truckType;
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
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

  // Watch form values for dynamic updates using useWatch for React Compiler compatibility
  const attachments = useWatch({ control, name: "attachments" }) || [];
  const fleetImages = useWatch({ control, name: "fleetImages" }) || [];
  const truckType = useWatch({ control, name: "truckType" }) || "";

  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);

  // State for dynamic properties
  const [truckProperties, setTruckProperties] = useState<Property[]>([]);
  const [dynamicPropertyValues, setDynamicPropertyValues] = useState<
    Record<string, PropertyValue>
  >({});
  const [propertyErrors, setPropertyErrors] = useState<Record<string, string>>(
    {}
  );
  const [dynamicSchema, setDynamicSchema] = useState<z.ZodTypeAny | null>(null);

  // State for dynamic documents and operator requirements
  interface TruckDocument {
    id: string;
    truck_type_id: string;
    document_name: string;
    is_required: boolean;
    description: string | null;
  }

  interface OperatorRequirement {
    id: string;
    truck_type_id: string;
    requirement_name: string;
    requires_upload: boolean;
    description: string | null;
  }

  const [truckDocuments, setTruckDocuments] = useState<TruckDocument[]>([]);
  const [operatorRequirements, setOperatorRequirements] = useState<
    OperatorRequirement[]
  >([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<
    Record<string, File>
  >({});
  const [uploadedRequirements, setUploadedRequirements] = useState<
    Record<string, File>
  >({});

  // State for existing images (URLs from server) in edit mode
  const [existingImages, setExistingImages] = useState<FleetImage[]>([]);

  // State for existing documents in edit mode
  const [existingDocuments, setExistingDocuments] = useState<FleetDocType[]>(
    []
  );

  // Document upload modal state
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [activeDocumentType, setActiveDocumentType] = useState<
    "document" | "requirement" | null
  >(null);

  // Handle document button click - opens modal
  const handleDocumentClick = useCallback(
    (documentId: string, type: "document" | "requirement") => {
      setActiveDocumentId(documentId);
      setActiveDocumentType(type);
      setIsDocumentModalOpen(true);
    },
    []
  );

  // Handle document upload from modal
  const handleDocumentUploadFromModal = useCallback(
    (file: File) => {
      if (activeDocumentId && activeDocumentType === "document") {
        setUploadedDocuments((prev) => ({
          ...prev,
          [activeDocumentId]: file,
        }));
      } else if (activeDocumentId && activeDocumentType === "requirement") {
        setUploadedRequirements((prev) => ({
          ...prev,
          [activeDocumentId]: file,
        }));
      }
      setIsDocumentModalOpen(false);
      setActiveDocumentId(null);
      setActiveDocumentType(null);
    },
    [activeDocumentId, activeDocumentType]
  );

  // Handle document modal close
  const handleDocumentModalClose = useCallback(() => {
    setIsDocumentModalOpen(false);
    setActiveDocumentId(null);
    setActiveDocumentType(null);
  }, []);

  // Handle remove uploaded document
  const handleRemoveDocument = useCallback(
    (
      e: React.MouseEvent,
      documentId: string,
      type: "document" | "requirement"
    ) => {
      e.stopPropagation();
      if (type === "document") {
        setUploadedDocuments((prev) => {
          const newDocs = { ...prev };
          delete newDocs[documentId];
          return newDocs;
        });
      } else {
        setUploadedRequirements((prev) => {
          const newReqs = { ...prev };
          delete newReqs[documentId];
          return newReqs;
        });
      }
    },
    []
  );

  useEffect(() => {
    if (
      openOffcanvasId !== "offcanvasAddFleet" &&
      openOffcanvasId !== "offcanvasEditFleet"
    )
      return;

    const elementId = isEditMode ? "offcanvasEditFleet" : "offcanvasAddFleet";
    const element = document.getElementById(elementId);
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
  }, [openOffcanvasId, isEditMode]);

  // Effect to populate form when editing
  useEffect(() => {
    if (!isEditMode || !fleetToEdit) return;

    const truckTypeId = getTruckTypeId(fleetToEdit.truck_type);

    // Set basic form fields
    setValue("truckType", truckTypeId);
    setValue("truckNumber", fleetToEdit.truck_number);
    setValue("hourlyRate", String(fleetToEdit.hourly_rate));
    setValue("travelCharge", fleetToEdit.travel_charge);
    setValue("minimumHire", fleetToEdit.minimum_hire);

    // Set attachments if available - convert price to number
    if (fleetToEdit.attachments && Array.isArray(fleetToEdit.attachments)) {
      const formattedAttachments = fleetToEdit.attachments.map(
        (att: FleetAttachment) => ({
          id: att.id,
          name: att.name,
          price:
            typeof att.price === "string" ? parseFloat(att.price) : att.price,
        })
      );
      setValue("attachments", formattedAttachments);
    }

    // Set existing images from server - batch state updates
    const imageArray =
      fleetToEdit.images && Array.isArray(fleetToEdit.images)
        ? fleetToEdit.images.map((img) => {
            if (typeof img === "object" && img !== null) {
              return img as FleetImage;
            }
            return { id: "", image_url: img as string };
          })
        : [];

    // Set existing documents
    const docArray =
      fleetToEdit.documents && Array.isArray(fleetToEdit.documents)
        ? fleetToEdit.documents
        : [];

    // Batch state updates using startTransition or setTimeout
    setTimeout(() => {
      setExistingImages(imageArray);
      setExistingDocuments(docArray);
    }, 0);

    // Load truck properties for the selected truck type
    if (truckTypeId) {
      getTruckProperties(truckTypeId).then(
        ({ properties, operatorRequirements: opReqs, documents }) => {
          setTruckProperties(properties);
          setTruckDocuments(documents || []);
          setOperatorRequirements(opReqs || []);

          const schema = createDynamicValidationSchema(properties);
          setDynamicSchema(schema);

          // Pre-fill specifications from fleet data - handle JSON string
          let specs = fleetToEdit.specifications;
          if (typeof specs === "string") {
            try {
              specs = JSON.parse(specs);
            } catch {
              specs = {};
            }
          }

          if (specs && typeof specs === "object") {
            setDynamicPropertyValues(specs as Record<string, PropertyValue>);
          } else {
            // Use default values from properties
            const initialValues: Record<string, PropertyValue> = {};
            properties.forEach((prop: Property) => {
              if (prop.html_type === "checkbox-input" && prop.options) {
                initialValues[prop.property_key] = prop.default_value
                  ? Array.isArray(prop.default_value)
                    ? prop.default_value
                    : []
                  : [];
              } else if (prop.html_type === "checkbox-input" && !prop.options) {
                initialValues[prop.property_key] =
                  prop.default_value === "true";
              } else if (
                prop.default_value !== null &&
                prop.default_value !== undefined
              ) {
                initialValues[prop.property_key] = prop.default_value;
              }
            });
            setDynamicPropertyValues(initialValues);
          }
        }
      );
    }
  }, [isEditMode, fleetToEdit, setValue]);

  const handleDropdownChange = (name: string, value: string) => {
    setValue(name as keyof FleetFormData, value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    getTruckProperties(value).then(
      ({ properties, operatorRequirements, documents }) => {
        setTruckProperties(properties);
        setTruckDocuments(documents || []);
        setOperatorRequirements(operatorRequirements || []);

        const schema = createDynamicValidationSchema(properties); // ADD THIS
        setDynamicSchema(schema); // ADD THIS

        const initialValues: Record<string, PropertyValue> = {};
        properties.forEach((prop: Property) => {
          if (prop.html_type === "checkbox-input" && prop.options) {
            // Multi-select checkboxes - array of strings
            initialValues[prop.property_key] = prop.default_value
              ? Array.isArray(prop.default_value)
                ? prop.default_value
                : []
              : [];
          } else if (prop.html_type === "checkbox-input" && !prop.options) {
            // Single checkbox - boolean
            initialValues[prop.property_key] = prop.default_value === "true";
          } else if (
            prop.default_value !== null &&
            prop.default_value !== undefined
          ) {
            // All other input types with default values
            initialValues[prop.property_key] = prop.default_value;
          }
        });

        setDynamicPropertyValues(initialValues);
        // Clear uploaded documents and requirements when truck type changes
        setUploadedDocuments({});
        setUploadedRequirements({});
      }
    );
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

  // Handler for dynamic property changes
  const handleDynamicPropertyChange = (key: string, value: PropertyValue) => {
    setDynamicPropertyValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear error when user updates field
    if (propertyErrors[key]) {
      setPropertyErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const onSubmit = async (data: FleetFormData) => {
    try {
      // Validate dynamic properties using Zod schema
      if (dynamicSchema) {
        try {
          // Convert number strings to actual numbers for validation
          const valuesToValidate = { ...dynamicPropertyValues };
          console.log("valuesToValidate", valuesToValidate);

          truckProperties.forEach((prop) => {
            if (
              prop.html_type === "number-input" &&
              valuesToValidate[prop.property_key]
            ) {
              valuesToValidate[prop.property_key] = Number(
                valuesToValidate[prop.property_key]
              );
            }
          });

          dynamicSchema.parse(valuesToValidate);
          setPropertyErrors({}); // Clear errors if validation passes
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            console.log("error", error);

            error.issues.forEach((err) => {
              if (err.path[0]) {
                errors[err.path[0] as string] = err.message;
              }
            });
            setPropertyErrors(errors);

            // Scroll to first error
            const firstErrorKey = Object.keys(errors)[0];
            if (firstErrorKey) {
              const element = document.getElementById(firstErrorKey);
              element?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
          }
        }
      }

      if (isEditMode && fleetToEdit) {
        // Update existing fleet
        const formData = new FormData();

        formData.append("truckType", data.truckType);
        formData.append("truckNumber", data.truckNumber);
        formData.append("hourlyRate", data.hourlyRate);
        formData.append("travelCharge", data.travelCharge);
        formData.append("minimumHire", data.minimumHire);
        formData.append(
          "specifications",
          JSON.stringify(dynamicPropertyValues)
        );
        formData.append("attachments", JSON.stringify(data.attachments));

        // Fleet images - only append new files
        data.fleetImages.forEach((file) => {
          if (file instanceof File) {
            formData.append("fleetImages", file);
          }
        });

        // Document files
        if (data.vehicleRegistrationCertificate) {
          formData.append(
            "vehicleRegistrationCertificate",
            data.vehicleRegistrationCertificate
          );
        }
        if (data.publicLiabilityInsurance) {
          formData.append(
            "publicLiabilityInsurance",
            data.publicLiabilityInsurance
          );
        }
        if (data.maintenanceRecords) {
          formData.append("maintenanceRecords", data.maintenanceRecords);
        }
        if (data.truckInsurance) {
          formData.append("truckInsurance", data.truckInsurance);
        }
        if (data.motorVehicleRegistrationCertificate) {
          formData.append(
            "motorVehicleRegistrationCertificate",
            data.motorVehicleRegistrationCertificate
          );
        }
        if (data.vehicleInsuranceDocument) {
          formData.append(
            "vehicleInsuranceDocument",
            data.vehicleInsuranceDocument
          );
        }
        if (data.swmsDocument) {
          formData.append("swmsDocument", data.swmsDocument);
        }

        // Truck type documents
        if (Object.keys(uploadedDocuments).length > 0) {
          const ids = Object.keys(uploadedDocuments);
          const files = Object.values(uploadedDocuments);
          ids.forEach((id) => {
            formData.append("truckTypeDocumentIds", id);
          });
          files.forEach((file) => {
            formData.append("truckTypeDocuments", file);
          });
        }

        // Operator requirements
        if (Object.keys(uploadedRequirements).length > 0) {
          const reqIds = Object.keys(uploadedRequirements);
          const reqFiles = Object.values(uploadedRequirements);
          reqIds.forEach((id) => {
            formData.append("operatorRequirementIds", id);
          });
          reqFiles.forEach((file) => {
            formData.append("operatorRequirements", file);
          });
        }

        await updateFleet(fleetToEdit.id, formData);
        console.log("Fleet updated successfully!");
        handleCancel();
      } else {
        // Add new fleet
        await addFleet({
          truckType: data.truckType,
          truckNumber: data.truckNumber,
          hourlyRate: data.hourlyRate,
          travelCharge: data.travelCharge,
          minimumHire: data.minimumHire,
          specifications: dynamicPropertyValues,
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
          truckTypeDocuments: uploadedDocuments,
          operatorRequirements: uploadedRequirements,
        });

        console.log("Fleet added successfully!");
        handleCancel();
      }
    } catch (error) {
      console.error("Error saving fleet:", error);
    }
  };

  const handleCancel = () => {
    closeOffcanvas();
    setTimeout(() => {
      reset();
      setTruckProperties([]);
      setDynamicPropertyValues({});
      setPropertyErrors({});
      setDynamicSchema(null);
      setTruckDocuments([]);
      setOperatorRequirements([]);
      setUploadedDocuments({});
      setUploadedRequirements({});
      setExistingImages([]);
      setExistingDocuments([]);
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <>
      {(openOffcanvasId === "offcanvasAddFleet" ||
        openOffcanvasId === "offcanvasEditFleet") && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleBackdropClick}
        />
      )}

      <div
        className="offcanvas offcanvas-end offcanvas-cm offcanvas-med"
        tabIndex={-1}
        id={isEditMode ? "offcanvasEditFleet" : "offcanvasAddFleet"}
        aria-labelledby="offcanvasFleetLabel"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasFleetLabel">
              {isEditMode ? "Edit Fleet" : "Add New Fleet"}
            </div>
            <p className="offcanvas-tl-p">
              {isEditMode
                ? "Update your truck details and compliance documents to keep your fleet verified and up to date."
                : "Provide your truck details and upload the required compliance documents to keep your fleet verified and up to date."}
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
                  value={truckType}
                  onChange={(value) =>
                    handleDropdownChange("truckType", value as string)
                  }
                  loadOptions={(page, searchTerm) =>
                    loadTruckTypes(page, searchTerm)
                  }
                  queryKey="truck-types"
                  isSearchable={true}
                  error={errors.truckType?.message}
                  loadMoreButtonText="Load More Truck Types"
                />
              </div>
              <hr />
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

              <hr />

              {/* Fleet Images */}
              <div className="form-group">
                <label className="form-label">Fleet Images</label>
                <p className="mb-2 fs-12 cgray">
                  Only support jpg, jpeg, and png files
                </p>
                <div className="row gx-2">
                  {[0, 1, 2].map((index) => {
                    // Check for existing image first (in edit mode)
                    const existingImage = existingImages[index];
                    // Then check for new uploaded image
                    const newImage = fleetImages[index];

                    return (
                      <div key={index} className="col-4 mb-2">
                        {existingImage ? (
                          // Show existing image from server
                          <div className="position-relative">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${existingImage.image_url}`}
                              alt={`Fleet ${index + 1}`}
                              className="w-100 br10 fleet-image-thumbnail object-fit-cover"
                              width={100}
                              height={80}
                              unoptimized
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setExistingImages((prev) =>
                                  prev.filter((_, i) => i !== index)
                                );
                              }}
                              className="btn-unstyled position-absolute fleet-image-remove-btn"
                            >
                              ×
                            </button>
                          </div>
                        ) : newImage ? (
                          // Show newly uploaded image
                          <div className="position-relative">
                            <Image
                              src={URL.createObjectURL(newImage)}
                              alt={`Fleet ${index + 1}`}
                              className="w-100 br10 fleet-image-thumbnail object-fit-cover"
                              width={100}
                              height={80}
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
                          // Show upload slot
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
                    );
                  })}
                </div>
                {errors.fleetImages && (
                  <p className="text-primary form-text mt-2 small">
                    {errors.fleetImages.message}
                  </p>
                )}
              </div>

              <hr />

              {/* <div className="m-4">
                <div className="title">Properties</div>
              </div> */}

              {/* Dynamic Properties from API */}
              {truckProperties.length > 0 ? (
                <DynamicPropertyFields
                  properties={truckProperties}
                  values={dynamicPropertyValues}
                  onChange={handleDynamicPropertyChange}
                  errors={propertyErrors}
                />
              ) : (
                <div className="alert alert-warning">
                  Please select a truck type to see properties
                </div>
              )}

              <hr />

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
              <hr />
              {/* Upload Required Documents */}
              <div className="form-group">
                {/* <h6 className="fw-bold mb-2">Upload Required Documents</h6> */}

                {/* Dynamic Truck Type Documents */}
                {truckDocuments?.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Truck Type Documents
                    </label>
                    <p className="mb-2 fs-12 cgray">
                      Upload the required documents for this truck type
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      {truckDocuments.map((doc) => {
                        // Check if document already exists (from server)
                        const existingDoc = existingDocuments.find(
                          (d) => d.truck_type_document_id === doc.id
                        );
                        const isUploaded =
                          uploadedDocuments[doc.id] || existingDoc;

                        const buttonClass = !doc.is_required
                          ? "doc-upload-btn doc-upload-btn-disabled"
                          : isUploaded
                          ? "doc-upload-btn doc-upload-btn-uploaded"
                          : "doc-upload-btn doc-upload-btn-default";

                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() =>
                              doc.is_required &&
                              handleDocumentClick(doc.id, "document")
                            }
                            disabled={!doc.is_required}
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
                              doc.is_required && (
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
                              )
                            )}
                            {doc.document_name}
                            {uploadedDocuments[doc.id] && (
                              <span
                                onClick={(e) =>
                                  handleRemoveDocument(e, doc.id, "document")
                                }
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
                )}

                {/* Dynamic Operator Requirements */}
                {operatorRequirements?.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Operator Requirements
                    </label>
                    <p className="mb-2 fs-12 cgray">
                      Upload the required operator certifications and documents
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      {operatorRequirements.map((req) => {
                        const isUploaded = uploadedRequirements[req.id];
                        const buttonClass = !req.requires_upload
                          ? "doc-upload-btn doc-upload-btn-disabled"
                          : isUploaded
                          ? "doc-upload-btn doc-upload-btn-uploaded"
                          : "doc-upload-btn doc-upload-btn-default";

                        return (
                          <button
                            key={req.id}
                            type="button"
                            onClick={() =>
                              req.requires_upload &&
                              handleDocumentClick(req.id, "requirement")
                            }
                            disabled={!req.requires_upload}
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
                              req.requires_upload && (
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
                              )
                            )}
                            {req.requirement_name}
                            {isUploaded && (
                              <span
                                onClick={(e) =>
                                  handleRemoveDocument(e, req.id, "requirement")
                                }
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
              <Button
                type="submit"
                variant="filled"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating Fleet..."
                    : "Adding Fleet..."
                  : isEditMode
                  ? "Update Fleet"
                  : "Add New Fleet"}
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

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isDocumentModalOpen}
        onClose={handleDocumentModalClose}
        onUpload={handleDocumentUploadFromModal}
        title="Upload Document"
        description="Choose the document you want to upload from your device. Ensure the file is clear, valid, and up to date so we can verify compliance smoothly."
      />
    </>
  );
}
