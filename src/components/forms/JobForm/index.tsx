"use client";

import { useEffect, useRef } from "react";

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
              <SelectEquipment ref={selectEquipmentRef} />
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
              <JobSpecifications ref={selectJobSpecificationRef} />
            </div>
          </div>
          <div className="offcanvas-op-btn">
            <div className="offcanvas-btn-wrap">
              <button
                type="button"
                onClick={() => handleBack(1)}
                className="offcanvas-btn-back btn btn-outline"
                data-offcanvas-prev="#offcanvasSelectFleet"
              >
                <span className="btn-outline-arr-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      d="M19 11.0001H9L12.29 7.71006C12.3837 7.6171 12.4581 7.5065 12.5089 7.38464C12.5597 7.26278 12.5858 7.13207 12.5858 7.00006C12.5858 6.86805 12.5597 6.73734 12.5089 6.61548C12.4581 6.49362 12.3837 6.38302 12.29 6.29006C12.1026 6.10381 11.8492 5.99927 11.585 5.99927C11.3208 5.99927 11.0674 6.10381 10.88 6.29006L6.59 10.5901C6.21441 10.9634 6.00223 11.4705 6 12.0001C6.00487 12.5262 6.21684 13.0292 6.59 13.4001L10.88 17.7001C10.9732 17.7926 11.0838 17.866 11.2054 17.9158C11.3269 17.9657 11.4571 17.9911 11.5885 17.9906C11.7199 17.9902 11.8499 17.9638 11.9712 17.9131C12.0924 17.8624 12.2024 17.7883 12.295 17.6951C12.3876 17.6018 12.4609 17.4913 12.5107 17.3697C12.5606 17.2481 12.586 17.1179 12.5856 16.9865C12.5851 16.8551 12.5588 16.7251 12.508 16.6039C12.4573 16.4827 12.3832 16.3726 12.29 16.2801L9 13.0001H19C19.2652 13.0001 19.5196 12.8947 19.7071 12.7072C19.8946 12.5196 20 12.2653 20 12.0001C20 11.7348 19.8946 11.4805 19.7071 11.293C19.5196 11.1054 19.2652 11.0001 19 11.0001Z"
                      fill="#797979"
                    />{" "}
                  </svg>
                </span>
                Go Back
              </button>
              <Button
                type="button"
                variant="filled"
                onClick={() => handleNext(1)}
              >
                Continue to Location
              </Button>
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
              <button
                type="button"
                className="offcanvas-btn-back btn btn-outline"
                data-offcanvas-prev="#offcanvasSelectFleet"
                onClick={() => handleBack(2)}
              >
                <span className="btn-outline-arr-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      d="M19 11.0001H9L12.29 7.71006C12.3837 7.6171 12.4581 7.5065 12.5089 7.38464C12.5597 7.26278 12.5858 7.13207 12.5858 7.00006C12.5858 6.86805 12.5597 6.73734 12.5089 6.61548C12.4581 6.49362 12.3837 6.38302 12.29 6.29006C12.1026 6.10381 11.8492 5.99927 11.585 5.99927C11.3208 5.99927 11.0674 6.10381 10.88 6.29006L6.59 10.5901C6.21441 10.9634 6.00223 11.4705 6 12.0001C6.00487 12.5262 6.21684 13.0292 6.59 13.4001L10.88 17.7001C10.9732 17.7926 11.0838 17.866 11.2054 17.9158C11.3269 17.9657 11.4571 17.9911 11.5885 17.9906C11.7199 17.9902 11.8499 17.9638 11.9712 17.9131C12.0924 17.8624 12.2024 17.7883 12.295 17.6951C12.3876 17.6018 12.4609 17.4913 12.5107 17.3697C12.5606 17.2481 12.586 17.1179 12.5856 16.9865C12.5851 16.8551 12.5588 16.7251 12.508 16.6039C12.4573 16.4827 12.3832 16.3726 12.29 16.2801L9 13.0001H19C19.2652 13.0001 19.5196 12.8947 19.7071 12.7072C19.8946 12.5196 20 12.2653 20 12.0001C20 11.7348 19.8946 11.4805 19.7071 11.293C19.5196 11.1054 19.2652 11.0001 19 11.0001Z"
                      fill="#797979"
                    />{" "}
                  </svg>
                </span>
                Go Back
              </button>
              <Button
                type="button"
                variant="filled"
                onClick={() => handleNext(2)}
              >
                Continue to Schedule
              </Button>
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
              <button
                type="button"
                className="offcanvas-btn-back btn btn-outline"
                data-offcanvas-prev="#offcanvasSelectFleet"
                onClick={() => handleBack(3)}
              >
                <span className="btn-outline-arr-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      d="M19 11.0001H9L12.29 7.71006C12.3837 7.6171 12.4581 7.5065 12.5089 7.38464C12.5597 7.26278 12.5858 7.13207 12.5858 7.00006C12.5858 6.86805 12.5597 6.73734 12.5089 6.61548C12.4581 6.49362 12.3837 6.38302 12.29 6.29006C12.1026 6.10381 11.8492 5.99927 11.585 5.99927C11.3208 5.99927 11.0674 6.10381 10.88 6.29006L6.59 10.5901C6.21441 10.9634 6.00223 11.4705 6 12.0001C6.00487 12.5262 6.21684 13.0292 6.59 13.4001L10.88 17.7001C10.9732 17.7926 11.0838 17.866 11.2054 17.9158C11.3269 17.9657 11.4571 17.9911 11.5885 17.9906C11.7199 17.9902 11.8499 17.9638 11.9712 17.9131C12.0924 17.8624 12.2024 17.7883 12.295 17.6951C12.3876 17.6018 12.4609 17.4913 12.5107 17.3697C12.5606 17.2481 12.586 17.1179 12.5856 16.9865C12.5851 16.8551 12.5588 16.7251 12.508 16.6039C12.4573 16.4827 12.3832 16.3726 12.29 16.2801L9 13.0001H19C19.2652 13.0001 19.5196 12.8947 19.7071 12.7072C19.8946 12.5196 20 12.2653 20 12.0001C20 11.7348 19.8946 11.4805 19.7071 11.293C19.5196 11.1054 19.2652 11.0001 19 11.0001Z"
                      fill="#797979"
                    />{" "}
                  </svg>
                </span>
                Go Back
              </button>

              <Button
                type="button"
                variant="filled"
                onClick={() => handleNext(3)}
              >
                Preview Job
              </Button>
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
              <button
                type="button"
                onClick={() => handleBack(4)}
                className="offcanvas-btn-back btn btn-outline"
                data-offcanvas-prev="#offcanvasSelectFleet"
              >
                <span className="btn-outline-arr-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {" "}
                    <path
                      d="M19 11.0001H9L12.29 7.71006C12.3837 7.6171 12.4581 7.5065 12.5089 7.38464C12.5597 7.26278 12.5858 7.13207 12.5858 7.00006C12.5858 6.86805 12.5597 6.73734 12.5089 6.61548C12.4581 6.49362 12.3837 6.38302 12.29 6.29006C12.1026 6.10381 11.8492 5.99927 11.585 5.99927C11.3208 5.99927 11.0674 6.10381 10.88 6.29006L6.59 10.5901C6.21441 10.9634 6.00223 11.4705 6 12.0001C6.00487 12.5262 6.21684 13.0292 6.59 13.4001L10.88 17.7001C10.9732 17.7926 11.0838 17.866 11.2054 17.9158C11.3269 17.9657 11.4571 17.9911 11.5885 17.9906C11.7199 17.9902 11.8499 17.9638 11.9712 17.9131C12.0924 17.8624 12.2024 17.7883 12.295 17.6951C12.3876 17.6018 12.4609 17.4913 12.5107 17.3697C12.5606 17.2481 12.586 17.1179 12.5856 16.9865C12.5851 16.8551 12.5588 16.7251 12.508 16.6039C12.4573 16.4827 12.3832 16.3726 12.29 16.2801L9 13.0001H19C19.2652 13.0001 19.5196 12.8947 19.7071 12.7072C19.8946 12.5196 20 12.2653 20 12.0001C20 11.7348 19.8946 11.4805 19.7071 11.293C19.5196 11.1054 19.2652 11.0001 19 11.0001Z"
                      fill="#797979"
                    />{" "}
                  </svg>
                </span>
                Go Back
              </button>
              <Button
                type="button"
                variant="filled"
                onClick={handleSubmit}
                isLoading={createJobMutation.isPending}
                isDisabled={createJobMutation.isPending}
              >
                {createJobMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
