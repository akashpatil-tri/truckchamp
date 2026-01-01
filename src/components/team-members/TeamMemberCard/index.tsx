"use client";

import Avatar from "@common/Avatar";

import { getInitials } from "@/lib/utils/commanizeString.utils";
import type { TeamMember } from "@/types/team-member.types";

interface TeamMemberCardProps {
  teamMember: TeamMember;
  isSelected: boolean;
  onClick: () => void;
}

export default function TeamMemberCard({
  teamMember,
  isSelected,
  onClick,
}: TeamMemberCardProps) {
  const displayName = teamMember?.name || teamMember?.fullName || "";

  return (
    <div
      className={`driver-card p-3 mx-3 mb-2 br14 card-clickable ${
        isSelected ? "bg-red3 card-selected-border" : "border2-gray"
      }`}
      onClick={onClick}
    >
      <div className="d-flex align-items-start">
        <div className="d-flex align-items-center gap-3">
          <Avatar
            initials={getInitials(displayName)}
            size="md"
            variant="primary"
          />
          <div>
            <p className="fw-semibold mb-1 cblack1">{displayName}</p>
            <p className="cgray fs-12 mb-0">{teamMember.mobile_number}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 d-flex align-items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2.66675 4.66667C2.66675 3.56 3.56008 2.66667 4.66675 2.66667H11.3334C12.4401 2.66667 13.3334 3.56 13.3334 4.66667V11.3333C13.3334 12.44 12.4401 13.3333 11.3334 13.3333H4.66675C3.56008 13.3333 2.66675 12.44 2.66675 11.3333V4.66667Z"
            stroke="#797979"
            strokeWidth="1.2"
          />
          <path d="M2.66675 6H13.3334" stroke="#797979" strokeWidth="1.2" />
        </svg>
        <span className="cgray fs-12">Email Address</span>
      </div>
      <p className="mb-0 fs-14 cblack1 ps-4">{teamMember.email}</p>
    </div>
  );
}
