"use client";

import { forwardRef, useImperativeHandle } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

import Checkbox from "@common/Checkbox";
import Input from "@common/Input";
import Radio from "@common/Radio";
import {
  AGGREGATE_TYPES,
  EQUIPMENT_TYPES,
  JOB_DETAILS,
  LINE_LENGTHS,
  WASHOUT_OPTIONS,
} from "@constants";
import { useJobFormStore } from "@store/useJobFormStore";

import {
  jobSpecificationsSchema,
  type JobSpecificationsData,
} from "@/lib/schemas/job.schema";

export interface SelectJobSpecificationRef {
  validateForm: () => Promise<boolean>;
}

const JobSpecifications = forwardRef<SelectJobSpecificationRef>((_props, ref) => {
  const { formData, updateFormData } = useJobFormStore();

  const selectedEquipment = EQUIPMENT_TYPES.find(
    (e) => e.id === formData.equipmentType
  );

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<JobSpecificationsData>({
    resolver: zodResolver(jobSpecificationsSchema),
    mode: "onBlur",
    defaultValues: {
      lineLength: formData.lineLength,
      volume: formData.volume,
      aggregateTypes: formData.aggregateTypes,
      jobDetails: formData.jobDetails,
      washoutOption: formData.washoutOption,
      notes: formData.notes,
    },
  });

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      return await trigger();
    },
  }));

  const handleLineLengthChange = (lineLength: string) => {
    setValue("lineLength", lineLength, { shouldValidate: true });
    updateFormData({ lineLength });
  };

  const handleAggregateTypeChange = (type: string, checked: boolean) => {
    const current = watch("aggregateTypes") || [];
    const updated = checked
      ? [...current, type]
      : current.filter((t) => t !== type);
    setValue("aggregateTypes", updated, { shouldValidate: true });
    updateFormData({ aggregateTypes: updated });
  };

  const handleJobDetailChange = (detail: string, checked: boolean) => {
    const current = watch("jobDetails") || [];
    const updated = checked
      ? [...current, detail]
      : current.filter((d) => d !== detail);
    setValue("jobDetails", updated, { shouldValidate: true });
    updateFormData({ jobDetails: updated });
  };

  const handleWashoutChange = (option: string, checked: boolean) => {
    const current = watch("washoutOption") || [];
    const updated = checked
      ? [...current, option]
      : current.filter((o) => o !== option);
    setValue("washoutOption", updated, { shouldValidate: true });
    updateFormData({ washoutOption: updated });
  };

  // Separate register for volume and notes with custom onChange
  const volumeRegister = register("volume", {
    onChange: (e) => updateFormData({ volume: e.target.value }),
  });

  const notesRegister = register("notes", {
    onChange: (e) => updateFormData({ notes: e.target.value }),
  });

  return (
    <div className="offcanvas-body-inner">
      <div className="offcanvas-body-title">Job Specifications</div>

      <div className="selected-fleet-wrap">
        <div className="selected-fleet-tl">Selected Fleet</div>
        <div className="selected-fleet-nm">
          {selectedEquipment?.image && (
            <Image
              src={selectedEquipment.image}
              alt={selectedEquipment.name}
              width={24}
              height={24}
              className="img-fluid"
            />
          )}
          <span className="selected-fleet-nm-t">{selectedEquipment?.name}</span>
        </div>
      </div>

      <hr />

      {/* Show Line Length only for specific equipment types */}
      {(formData.equipmentType === "line-pump" ||
        formData.equipmentType === "boom-pump") && (
        <div className="form-group">
          <label className="form-label">Line Length Required</label>
          <div className="radio-rounded-main">
            {LINE_LENGTHS.map((length, index) => (
              <Radio
                key={length}
                id={`lineLength${index + 1}`}
                name="lineLength"
                value={length}
                label={length}
                variant="rounded"
                checked={watch("lineLength") === length}
                onChange={() => handleLineLengthChange(length)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="form-vol" className="form-label">
          Volume (m³)
        </label>
        <Input
          id="form-vol"
          type="number"
          placeholder="Enter Volume (m³)"
          {...volumeRegister}
          inputClass={`form-control border ${
            errors.volume ? "input-error" : ""
          }`}
          aria-invalid={errors.volume ? "true" : "false"}
          aria-describedby={errors.volume ? "volume-error" : undefined}
        />
        {errors.volume && (
          <p
            id="volume-error"
            role="alert"
            className="text-primary form-text mt-2 small"
          >
            {errors.volume?.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Aggregate Type</label>
        <div className="checkbox-square-main">
          {AGGREGATE_TYPES.map((type, index) => (
            <Checkbox
              key={type}
              id={`atype${index}`}
              name={`atype${index}`}
              label={type}
              value={type}
              checked={watch("aggregateTypes")?.includes(type) || false}
              onChange={(e) =>
                handleAggregateTypeChange(type, e.target.checked)
              }
            />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Job Details</label>
        <div className="checkbox-square-main">
          {JOB_DETAILS.map((detail, index) => (
            <Checkbox
              key={detail}
              id={`jde${index}`}
              name={`jde${index}`}
              label={detail}
              value={detail}
              checked={watch("jobDetails")?.includes(detail) || false}
              onChange={(e) => handleJobDetailChange(detail, e.target.checked)}
            />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Washout Option</label>
        <div className="checkbox-square-main">
          {WASHOUT_OPTIONS.map((option, index) => (
            <Checkbox
              key={option}
              id={`washout${index}`}
              name={`washout${index}`}
              label={option}
              value={option}
              checked={watch("washoutOption")?.includes(option) || false}
              onChange={(e) => handleWashoutChange(option, e.target.checked)}
            />
          ))}
        </div>
      </div>

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
