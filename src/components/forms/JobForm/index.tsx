"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import backIcon from "@assets/svg/svgviewer-png-output.png";
import Button from "@common/Button";
import JobSpecifications, {
  SelectJobSpecificationRef,
} from "@forms/JobForm/steps/JobSpecifications";
import LocationDetails, {
  SelectLocationRef,
} from "@forms/JobForm/steps/LocationDetails";
import PreviewJob from "@forms/JobForm/steps/PreviewJob";
import ScheduleJob, { ScheduleJobRef } from "@forms/JobForm/steps/ScheduleJob";
import SelectEquipment, {
  type SelectEquipmentRef,
} from "@forms/JobForm/steps/SelectEquipment";
import { useJobFormStore } from "@store/useJobFormStore";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import { useCreateJobMutation } from "@/queries/job";
import { useTruckTypesQuery } from "@/queries/truck";

const OFFCANVAS_IDS = [
  "offcanvasStep1",
  "offcanvasStep2",
  "offcanvasStep3",
  "offcanvasStep4",
  "offcanvasStep5",
];

export default function JobForm() {
  const { formData, nextStep, prevStep, resetForm } = useJobFormStore();
  const { openOffcanvas, closeOffcanvas, openOffcanvasId } =
    useOffcanvasStore();

  const {
    data: truckTypes,
    isPending,
    isError,
    error,
  } = useTruckTypesQuery(openOffcanvasId === "offcanvasStep1");

  const createJobMutation = useCreateJobMutation();

  const selectEquipmentRef = useRef<SelectEquipmentRef>(null);
  const selectLocationRef = useRef<SelectLocationRef>(null);
  const selectJobSpecificationRef = useRef<SelectJobSpecificationRef>(null);
  const scheduleJobRef = useRef<ScheduleJobRef>(null);

  // Add show class to active offcanvas for smooth transitions
  useEffect(() => {
    if (!openOffcanvasId) return;

    const element = document.getElementById(openOffcanvasId);
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

  const handleNext = async (currentStepIndex: number) => {
    let isValid = true;

    // Validate current step
    if (currentStepIndex === 0) {
      // Validate equipment selection
      isValid = (await selectEquipmentRef.current?.validateForm()) ?? false;
    } else if (currentStepIndex === 1) {
      // Validate job specifications
      isValid =
        (await selectJobSpecificationRef.current?.validateForm()) ?? false;
    } else if (currentStepIndex === 2) {
      // Validate location details
      isValid = (await selectLocationRef.current?.validateForm()) ?? false;
    } else if (currentStepIndex === 3) {
      // Validate schedule job
      isValid = (await scheduleJobRef.current?.validateForm()) ?? false;
    }
    console.log("isValid", isValid);

    if (!isValid) {
      // Validation failed - errors are already shown in the form
      return;
    }

    // Validation passed, update step in store
    nextStep();

    // Close current and open next with smooth transition
    closeOffcanvas();
    setTimeout(() => {
      openOffcanvas(OFFCANVAS_IDS[currentStepIndex + 1]);
    }, 300); // Match Bootstrap's transition duration
  };

  const handleBack = (currentStepIndex: number) => {
    // Update step in store
    prevStep();

    // Close current and open previous with smooth transition
    closeOffcanvas();
    setTimeout(() => {
      openOffcanvas(OFFCANVAS_IDS[currentStepIndex - 1]);
    }, 300);
  };

  const handleCancel = () => {
    closeOffcanvas();
    resetForm();
  };

  const handleSubmit = async () => {
    try {
      await createJobMutation.mutateAsync({
        equipmentType: formData.equipmentType,
        jobSpecifications: formData.jobSpecifications,
        lineLength: formData.lineLength,
        volume: formData.volume!,
        aggregateTypes: formData.aggregateTypes,
        jobDetails: formData.jobDetails,
        washoutOption: formData.washoutOption,
        notes: formData.notes,
        onSiteLocation: formData.onSiteLocation!,
        startDate: formData.startDate!,
        startTime: formData.startTime!,
        endDate: formData.endDate,
        endTime: formData.endTime,
        recurringDays: formData.recurringDays,
        exactTimingRequired: formData.exactTimingRequired,
        preferredBufferWindow: formData.preferredBufferWindow,
      });

      // Close offcanvas
      closeOffcanvas();
      resetForm();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {openOffcanvasId && OFFCANVAS_IDS.includes(openOffcanvasId) && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleBackdropClick}
        />
      )}

      {/* Step 1: Select Equipment */}
      <div
        className="offcanvas offcanvas-end offcanvas-cm"
        tabIndex={-1}
        id="offcanvasStep1"
        aria-labelledby="offcanvasStep1Label"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasStep1Label">
              Create New Job
            </div>
            <p className="offcanvas-tl-p">Choose your equipment type</p>
          </div>
        </div>
        <form className="offcanvas-form">
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              <SelectEquipment
                data={truckTypes}
                ref={selectEquipmentRef}
                isPending={isPending}
                isError={isError}
                error={error}
              />
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
                type="button"
                variant="filled"
                onClick={() => handleNext(0)}
              >
                Continue to Job Details
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Step 2: Job Specifications */}
      <div
        className="offcanvas offcanvas-end offcanvas-cm"
        tabIndex={-1}
        id="offcanvasStep2"
        aria-labelledby="offcanvasStep2Label"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasStep2Label">
              Create New Job
            </div>
            <p className="offcanvas-tl-p">Define job requirements</p>
          </div>
        </div>
        <form className="offcanvas-form">
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              <JobSpecifications
                ref={selectJobSpecificationRef}
                data={truckTypes}
                enabled={openOffcanvasId === "offcanvasStep2"}
              />
            </div>
          </div>
          <div className="offcanvas-op-btn">
            <div className="offcanvas-btn-wrap">
              <Button
                className="offcanvas-btn-back btn btn-outline"
                title="Go Back"
                variant="outline"
                iconPosition="left"
                icon={<Image src={backIcon} alt="Back" className="me-1" />}
                onClick={() => handleBack(1)}
              />
              <Button
                type="button"
                variant="filled"
                onClick={() => handleNext(1)}
                title="Continue to Location"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Step 3: Location Details */}
      <div
        className="offcanvas offcanvas-end offcanvas-cm"
        tabIndex={-1}
        id="offcanvasStep3"
        aria-labelledby="offcanvasStep3Label"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasStep3Label">
              Create New Job
            </div>
            <p className="offcanvas-tl-p">Set job location</p>
          </div>
        </div>
        <form className="offcanvas-form">
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              <LocationDetails ref={selectLocationRef} />
            </div>
          </div>
          <div className="offcanvas-op-btn">
            <div className="offcanvas-btn-wrap">
              <Button
                className="offcanvas-btn-back btn btn-outline"
                title="Go Back"
                variant="outline"
                iconPosition="left"
                icon={<Image src={backIcon} alt="Back" className="me-1" />}
                onClick={() => handleBack(2)}
              />
              <Button
                type="button"
                variant="filled"
                onClick={() => handleNext(2)}
                title="Continue to Schedule"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Step 4: Schedule Job */}
      <div
        className="offcanvas offcanvas-end offcanvas-cm"
        tabIndex={-1}
        id="offcanvasStep4"
        aria-labelledby="offcanvasStep4Label"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasStep4Label">
              Create New Job
            </div>
            <p className="offcanvas-tl-p">
              Invite a admin team member to help manage jobs, drivers, or fleet
              operations. They’ll receive login details by email.
            </p>
          </div>
        </div>
        <form className="offcanvas-form">
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              <ScheduleJob ref={scheduleJobRef} />
            </div>
          </div>
          <div className="offcanvas-op-btn">
            <div className="offcanvas-btn-wrap">
              <Button
                className="offcanvas-btn-back btn btn-outline"
                title="Go Back"
                variant="outline"
                iconPosition="left"
                icon={<Image src={backIcon} alt="Back" className="me-1" />}
                onClick={() => handleBack(3)}
              />
              <Button
                type="button"
                variant="filled"
                onClick={() => handleNext(3)}
                title="Preview Job"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Step 5: Preview Job */}
      <div
        className="offcanvas offcanvas-end offcanvas-cm"
        tabIndex={-1}
        id="offcanvasStep5"
        aria-labelledby="offcanvasStep5Label"
      >
        <div className="offcanvas-header-cm">
          <div className="offcanvas-header">
            <div className="offcanvas-title" id="offcanvasStep5Label">
              Preview Your Job
            </div>
            <p className="offcanvas-tl-p">
              Double-check the details below before posting. You can edit any
              section if needed.
            </p>
          </div>
        </div>
        <form className="offcanvas-form">
          <div className="offcanvas-body">
            <div className="offcanvas-form-main">
              <PreviewJob />
            </div>
          </div>
          <div className="offcanvas-op-btn">
            <div className="offcanvas-btn-wrap">
              <Button
                className="offcanvas-btn-back btn btn-outline"
                title="Go Back"
                variant="outline"
                iconPosition="left"
                icon={<Image src={backIcon} alt="Back" className="me-1" />}
                onClick={() => handleBack(4)}
              />
              <Button
                type="button"
                variant="filled"
                onClick={handleSubmit}
                isLoading={createJobMutation.isPending}
                isDisabled={createJobMutation.isPending}
                title={createJobMutation.isPending ? "Submitting..." : "Submit"}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
