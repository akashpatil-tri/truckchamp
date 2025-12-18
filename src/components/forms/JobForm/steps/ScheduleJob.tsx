"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import DateTimePicker from "@common/DateTimePicker";
import Input from "@common/Input";
import TimePicker from "@common/TimePicker";
import Toggle from "@common/Toggle";
import { DAYS_OF_WEEK } from "@constants";
import { useJobFormStore } from "@store/useJobFormStore";

import {
  scheduleJobSchema,
  type ScheduleJobData,
} from "@/lib/schemas/job.schema";

export interface ScheduleJobRef {
  validateForm: () => Promise<boolean>;
}

const ScheduleJob = forwardRef<ScheduleJobRef>((_props, ref) => {
  const { formData, updateFormData } = useJobFormStore();

  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ScheduleJobData>({
    resolver: zodResolver(scheduleJobSchema),
    mode: "onBlur",
    defaultValues: {
      startDate: formData.startDate || "",
      startTime: formData.startTime || "",
      endDate: formData.endDate,
      endTime: formData.endDate,
      recurringDays: formData.recurringDays || [],
      exactTimingRequired: formData.exactTimingRequired || false,
      preferredBufferWindow: formData.preferredBufferWindow,
    },
  });

  useImperativeHandle(ref, () => ({
    validateForm: async () => {
      return await trigger();
    },
  }));

  const [selectedDays, setSelectedDays] = useState<string[]>(
    formData.recurringDays || []
  );

  const [startDate, setStartDate] = useState<Date | null>(
    formData.startDate ? new Date(formData.startDate) : null
  );
  const [startTime, setStartTime] = useState<Date | null>(
    formData.startTime ? new Date(formData.startTime) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    formData.endDate ? new Date(formData.endDate) : null
  );
  const [endTime, setEndTime] = useState<Date | null>(
    formData.endTime ? new Date(formData.endTime) : null
  );
  const [recurringEnabled, setRecurringEnabled] = useState(
    formData.recurringDays?.length > 0
  );
  const [exactTimingEnabled, setExactTimingEnabled] = useState(
    formData.exactTimingRequired
  );

  const handleStartDateChange = (date: Date | null) => {
    const isoString = date?.toISOString() || "";
    setStartDate(date);
    setValue("startDate", isoString, { shouldValidate: true });
    updateFormData({ startDate: isoString });
  };

  const handleStartTimeChange = (date: Date | null) => {
    const isoString = date?.toISOString() || "";
    setStartTime(date);
    setValue("startTime", isoString, { shouldValidate: true });
    updateFormData({ startTime: isoString });
  };

  const handleEndDateChange = (date: Date | null) => {
    const isoString = date?.toISOString();
    setEndDate(date);
    setValue("endDate", isoString, { shouldValidate: true });
    updateFormData({ endDate: isoString });
  };

  const handleEndTimeChange = (date: Date | null) => {
    const isoString = date?.toISOString();
    setEndTime(date);
    setValue("endTime", isoString, { shouldValidate: true });
    updateFormData({ endTime: isoString });
  };

  const handleRecurringToggle = () => {
    const newValue = !recurringEnabled;
    setRecurringEnabled(newValue);
    if (!newValue) {
      setValue("recurringDays", [], { shouldValidate: true });
      setSelectedDays([]);
      updateFormData({ recurringDays: [] });
    }
  };

  const handleDayToggle = (day: string) => {
    const currentDays = watch("recurringDays") || [];
    const updated = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    setSelectedDays(updated);
    setValue("recurringDays", updated, { shouldValidate: true });
    updateFormData({ recurringDays: updated });
  };

  const handleExactTimingToggle = () => {
    const newValue = !exactTimingEnabled;
    setExactTimingEnabled(newValue);
    setValue("exactTimingRequired", newValue, { shouldValidate: true });
    updateFormData({ exactTimingRequired: newValue });
  };

  return (
    <div className="offcanvas-body-inner">
      <div className="offcanvas-body-title">Schedule Job</div>

      <div className="form-group">
        <div className="form-group mb-0">
          <label className="form-label">Start Date & Time</label>
          {errors.startDate && (
            <p role="alert" className="text-primary form-text mb-2 small">
              {errors.startDate?.message}
            </p>
          )}
          {errors.startTime && (
            <p role="alert" className="text-primary form-text mb-2 small">
              {errors.startTime?.message}
            </p>
          )}
          <div className="row gx-3">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <div className="form-group">
                <DateTimePicker
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  placeholder="Select Date"
                  minDate={new Date()}
                  id="form-sd"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <div className="bs-timepicker">
                <div className="form-group">
                  <TimePicker
                    value={startTime}
                    onChange={handleStartTimeChange}
                    placeholder="Select Time"
                    id="form-st"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {recurringEnabled && (
          <div className="recurr-timing-content mt-0">
            <div className="form-group mb-0">
              <label className="form-label">End Date & Time</label>
              <div className="row gx-3">
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <div className="form-group">
                    <DateTimePicker
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      placeholder="Select Date"
                      minDate={startDate || new Date()}
                      id="form-ed"
                    />
                  </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <div className="bs-timepicker">
                    <div className="form-group">
                      <TimePicker
                        value={endTime}
                        onChange={handleEndTimeChange}
                        placeholder="Select Time"
                        id="form-et"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <hr />
      <div className="form-group">
        <Toggle
          id="recurringToggle"
          checked={recurringEnabled}
          onChange={handleRecurringToggle}
          label="Your Recurring Days"
          labelClassName="recurr-timing-tl"
          description="Add the weekdays and time slots for your recurring job."
          descriptionClassName="recurr-timing-txt"
        />

        {recurringEnabled && (
          <div className="recurring-days-wrap d-flex flex-wrap gap-2 mt-3">
            {DAYS_OF_WEEK.map((day, index) => {
              const id = `redays-${index}`;

              return (
                <div className="checkbox-round-wrap" key={day}>
                  <div className="form-group mb-0">
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={id}
                      name="redays"
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayToggle(day)}
                    />
                    <label htmlFor={id} className="mb-0">
                      {day}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <hr />
      <div className="form-group">
        <Toggle
          id="exactTimingToggle"
          checked={exactTimingEnabled}
          onChange={handleExactTimingToggle}
          label="Exact timing required ?"
          labelClassName="recurr-timing-tl"
          description="Enable this if the job must start at an exact time."
          descriptionClassName="recurr-timing-txt"
        />
        <hr />
        <div className="mt-3">
          <label className="text-secondary fs-6 mb-2">
            Preferred buffer window
          </label>
          <Input
            id="bufferWindow"
            type="text"
            placeholder="Enter buffer window"
            {...register("preferredBufferWindow", {
              onChange: (e) =>
                updateFormData({ preferredBufferWindow: e.target.value }),
            })}
            inputClass={`form-control border ${
              errors.preferredBufferWindow ? "input-error" : ""
            }`}
            aria-invalid={errors.preferredBufferWindow ? "true" : "false"}
            aria-describedby={
              errors.preferredBufferWindow ? "buffer-error" : undefined
            }
          />
          {errors.preferredBufferWindow && (
            <p
              id="buffer-error"
              role="alert"
              className="text-primary form-text mt-2 small"
            >
              {errors.preferredBufferWindow?.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

ScheduleJob.displayName = "ScheduleJob";

export default ScheduleJob;
