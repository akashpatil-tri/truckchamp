"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import DynamicPropertyFields, {
  Property,
  type PropertyValue,
} from "@forms/JobForm/DynamicPropertyFields";
import { useJobFormStore } from "@store/useJobFormStore";

import { SelectEquipmentProps } from "@/lib/api/truck/truck.types";
import { useTruckPropertiesQuery } from "@/queries/truck";

export interface SelectJobSpecificationRef {
  validateForm: () => Promise<boolean>;
}

// Add dynamic validation schema creator
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
      schemaFields[property_key] = is_required
        ? z.string().min(1, `${property_label} is required`)
        : z.string().optional();
    } else if (html_type === "checkbox-input" && options) {
      schemaFields[property_key] = is_required
        ? z
            .array(z.string())
            .min(1, `At least one ${property_label} is required`)
        : z.array(z.string()).optional();
    } else if (html_type === "checkbox-input" && !options) {
      schemaFields[property_key] = is_required
        ? z.boolean().refine((val) => val === true, {
            message: `${property_label} must be checked`,
          })
        : z.boolean().optional();
    } else if (html_type === "number-input") {
      let schema = z.string(); // Start with string validation

      if (is_required) {
        schema = schema.min(1, `${property_label} is required`);
      }

      // Then transform and validate as number
      let numberSchema = schema.transform((val, ctx) => {
        if (val === "" || val === undefined) {
          if (is_required) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${property_label} is required`,
            });
            return z.NEVER;
          }
          return undefined;
        }

        const num = Number(val);
        if (isNaN(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${property_label} must be a valid number`,
          });
          return z.NEVER;
        }
        return num;
      });

      if (min_value !== null && min_value !== undefined) {
        numberSchema = numberSchema.refine(
          (val) => val === undefined || val >= min_value,
          { message: `${property_label} must be at least ${min_value}` }
        );
      }

      if (max_value !== null && max_value !== undefined) {
        numberSchema = numberSchema.refine(
          (val) => val === undefined || val <= max_value,
          { message: `${property_label} must be at most ${max_value}` }
        );
      }

      schemaFields[property_key] = numberSchema;
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

const JobSpecifications = forwardRef<
  SelectJobSpecificationRef,
  SelectEquipmentProps
>((props, ref) => {
  const { data, enabled } = props;

  const { formData, updateFormData } = useJobFormStore();
  const [truckProperties, setTruckProperties] = useState<Property[]>([]);
  const [dynamicPropertyValues, setDynamicPropertyValues] = useState<
    Record<string, PropertyValue>
  >({});
  const [propertyErrors, setPropertyErrors] = useState<Record<string, string>>(
    {}
  );
  const [dynamicSchema, setDynamicSchema] = useState<z.ZodTypeAny | null>(null);

  const selectedEquipment = data?.data?.find(
    (e: { id: string }) => e.id === formData.equipmentType
  );

  const { data: truckPropertiesData, isPending } = useTruckPropertiesQuery(
    selectedEquipment?.id || null,
    enabled
  );

  useEffect(() => {
    if (!Array.isArray(truckPropertiesData) || !enabled || isPending) {
      return;
    }

    const properties = truckPropertiesData.filter(Boolean) as Property[];

    const initializeProperties = () => {
      const schema = createDynamicValidationSchema(properties);

      const initialValues: Record<string, PropertyValue> = {};
      properties.forEach((prop) => {
        if (prop.default_value) {
          initialValues[prop.property_key] = prop.default_value;
        } else if (prop.html_type === "checkbox-input" && prop.options) {
          initialValues[prop.property_key] = [];
        } else if (prop.html_type === "checkbox-input" && !prop.options) {
          initialValues[prop.property_key] = false;
        } else if (prop.html_type === "radio-input") {
          initialValues[prop.property_key] = "";
        } else if (prop.html_type === "text-input") {
          initialValues[prop.property_key] = "";
        } else if (prop.html_type === "number-input") {
          initialValues[prop.property_key] = "";
        }
      });

      setTruckProperties(properties);
      setDynamicSchema(schema);
      setDynamicPropertyValues(initialValues);
      updateFormData({ jobSpecifications: initialValues });
    };

    initializeProperties();
  }, [truckPropertiesData, enabled, isPending, updateFormData]);

  const notesOnlySchema = z.object({
    notes: z.string().optional(),
  });

  const {
    register,
    formState: { errors },
    trigger,
  } = useForm<{ notes?: string }>({
    resolver: zodResolver(notesOnlySchema),
    mode: "onBlur",
    defaultValues: {
      notes: formData.notes,
    },
  });

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      const notesValid = await trigger();

      if (dynamicSchema) {
        try {
          const valuesToValidate = { ...dynamicPropertyValues };
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

          setPropertyErrors({});
          return notesValid;
        } catch (error) {
          if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            error.issues.forEach((err) => {
              if (err.path[0]) {
                errors[err.path[0] as string] = err.message;
              }
            });
            setPropertyErrors(errors);

            const firstErrorKey = Object.keys(errors)[0];
            if (firstErrorKey) {
              const element = document.getElementById(firstErrorKey);
              element?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return false;
          }
        }
      }

      return notesValid;
    },
  }));

  const handleDynamicPropertyChange = (key: string, value: PropertyValue) => {
    const updatedValues = {
      ...dynamicPropertyValues,
      [key]: value,
    };

    setDynamicPropertyValues(updatedValues);

    updateFormData({ jobSpecifications: updatedValues });

    if (propertyErrors[key]) {
      setPropertyErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  // Separate register for notes with custom onChange
  const notesRegister = register("notes", {
    onChange: (e) => updateFormData({ notes: e.target.value }),
  });

  if (isPending)
    return (
      <div className="offcanvas-body-inner text-center py-5">
        <p className="mb-0">Loading truck properties…</p>
      </div>
    );

  return (
    <div className="offcanvas-body-inner">
      <div className="offcanvas-body-title">Job Specifications</div>

      <div className="selected-fleet-wrap">
        <div className="selected-fleet-tl">Selected Fleet</div>
        <div className="selected-fleet-nm">
          {selectedEquipment?.image_url && (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${selectedEquipment.image_url}`}
              alt={selectedEquipment.name}
              width={24}
              height={24}
              className="img-fluid"
              unoptimized
            />
          )}
          <span className="selected-fleet-nm-t">{selectedEquipment?.name}</span>
        </div>
      </div>

      <hr />

      {truckProperties?.length > 0 ? (
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

      <div className="form-group">
        <label htmlFor="form-notes" className="form-label">
          Additional Notes
        </label>
        <textarea
          id="form-notes"
          className={`form-control border ${errors.notes ? "input-error" : ""}`}
          placeholder="Enter any additional notes"
          rows={4}
          {...notesRegister}
          aria-invalid={errors.notes ? "true" : "false"}
          aria-describedby={errors.notes ? "notes-error" : undefined}
        />
        {errors.notes && (
          <p
            id="notes-error"
            role="alert"
            className="text-primary form-text mt-2 small"
          >
            {errors.notes?.message}
          </p>
        )}
      </div>
    </div>
  );
});

JobSpecifications.displayName = "JobSpecifications";

export default JobSpecifications;
