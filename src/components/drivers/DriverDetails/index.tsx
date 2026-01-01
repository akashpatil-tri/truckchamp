// "use client";
import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import Avatar from "@common/Avatar";
import Button from "@common/Button";
import EmptyState from "@common/EmptyState";

import { getInitials } from "@/lib/utils/commanizeString.utils";
import type { Driver } from "@/types/driver.types";

interface DriverDetailsProps {
  driver: Driver | null;
  onEditDriver?: () => void;
  onRemoveDriver?: () => void;
}

export default function DriverDetails({
  driver,
  onEditDriver,
  onRemoveDriver,
}: DriverDetailsProps) {

  const [showPassword, setShowPassword] = useState(false);

  if (!driver) {
    return (
      <div className="driver-details-panel bg-white br14 border2-gray p-4 h-100">
        <EmptyState
          title="No Driver Selected"
          description="Select a driver from the list to view their details."
        />
      </div>
    );
  }

  return (
    <div className="driver-details-panel bg-white br14 border2-gray p-4 h-100">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold mb-0">Driver Details</h5>
        <div className="d-flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="minw-auto px-3 py-2 fs-14 br8"
            onClick={onRemoveDriver}
          >
            Remove Driver
          </Button>
          <Button
            type="button"
            variant="filled"
            className="minw-auto px-3 py-2 fs-14 br8"
            onClick={onEditDriver}
          >
            Edit Driver
          </Button>
        </div>
      </div>

      {/* Driver Info */}
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <Avatar
            initials={getInitials(driver?.name)}
            size="lg"
            variant="primary"
          />
          <div>
            <p className="cgray fs-12 mb-1">Full Name</p>
            <p className="fw-semibold mb-0 cblack1">{driver.name}</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#2e7d32" strokeWidth="1.5" />
            <path
              d="M5 8L7 10L11 6"
              stroke="#2e7d32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="cgreen1 fs-14">Availability</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="row mb-4">
        <div className="col-md-4">
          <p className="cgray fs-12 mb-1">Email Address</p>
          <p className="cblack1 fs-14 mb-0">{driver.email}</p>
        </div>
        <div className="col-md-4">
          <p className="cgray fs-12 mb-1">Phone Number</p>
          <p className="cblack1 fs-14 mb-0">{driver.mobile_number}</p>
        </div>
        <div className="col-md-4">
          <p className="cgray fs-12 mb-1">Password</p>
          <p className="cblack1 cblack1-password fs-14 mb-0 w-100">
            <span className="w-70">{showPassword ? driver.password : "*****"}</span>
            <span className="w-30 cursor-pointer">{showPassword ? (
              <EyeOff
                className="w-5 h-5 text-secondary"
                strokeWidth={1.5}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye className="w-5 h-5 text-secondary" strokeWidth={1.5} onClick={() => setShowPassword(true)} />
            )
            }</span>
          </p>
        </div>
      </div>

      <hr />

      {/* Certificate & Document */}
      {/* <DriverDocuments documents={driver.driver_documents} /> */}
    </div>
  );
}
