"use client";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import Avatar from "@common/Avatar";
import Button from "@common/Button";
import EmptyState from "@common/EmptyState";

import { getInitials } from "@/lib/utils/commanizeString.utils";
import type { TeamMember } from "@/types/team-member.types";

interface TeamMemberDetailsProps {
  teamMember: TeamMember | null;
  onEditTeamMember?: () => void;
  onDeleteTeamMember?: () => void;
}

export default function TeamMemberDetails({
  teamMember,
  onEditTeamMember,
  onDeleteTeamMember,
}: TeamMemberDetailsProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!teamMember) {
    return (
      <div className="driver-details-panel bg-white br14 border2-gray p-4 h-100">
        <EmptyState
          title="No Team Member Selected"
          description="Select a team member from the list to view their details."
        />
      </div>
    );
  }

  const displayName = teamMember?.name || teamMember?.fullName || "";

  return (
    <div className="driver-details-panel bg-white br14 border2-gray p-4 h-100">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h5 className="fw-bold mb-0">Team Member Details</h5>
        <div className="d-flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="minw-auto px-3 py-2 fs-14 br8"
            onClick={onDeleteTeamMember}
          >
            Delete Team Member
          </Button>
          <Button
            type="button"
            variant="filled"
            className="minw-auto px-3 py-2 fs-14 br8"
            onClick={onEditTeamMember}
          >
            Edit Team Member
          </Button>
        </div>
      </div>

      {/* Team Member Info */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Avatar
          initials={getInitials(displayName)}
          size="lg"
          variant="primary"
        />
        <div>
          <p className="cgray fs-12 mb-1">Full Name</p>
          <p className="fw-semibold mb-0 cblack1">{displayName}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="row mb-4">
        <div className="col-md-4">
          <p className="cgray fs-12 mb-1">Email Address</p>
          <p className="cblack1 fs-14 mb-0">{teamMember.email}</p>
        </div>
        <div className="col-md-4">
          <p className="cgray fs-12 mb-1">Phone Number</p>
          <p className="cblack1 fs-14 mb-0">{teamMember.mobile_number}</p>
        </div>
        <div className="col-md-4">
          <p className="cgray fs-12 mb-1">Password</p>
          <p className="cblack1 cblack1-password fs-14 mb-0 w-100">
            <span className="w-70">
              {showPassword ? (teamMember as any).password || "*****" : "*****"}
            </span>
            <span className="w-30 cursor-pointer">
              {showPassword ? (
                <EyeOff
                  className="w-5 h-5 text-secondary"
                  strokeWidth={1.5}
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="w-5 h-5 text-secondary"
                  strokeWidth={1.5}
                  onClick={() => setShowPassword(true)}
                />
              )}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
