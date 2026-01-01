"use client";

import EmptyState from "@common/EmptyState";
import SearchInput from "@common/SearchInput";

import Button from "@/components/common/Button";
import type { TeamMember } from "@/types/team-member.types";

import TeamMemberCard from "../TeamMemberCard";

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  selectedTeamMember: TeamMember | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTeamMemberSelect: (teamMember: TeamMember) => void;
  onAddTeamMember: () => void;
  isLoading?: boolean;
}

export default function TeamMemberList({
  teamMembers,
  selectedTeamMember,
  searchQuery,
  onSearchChange,
  onTeamMemberSelect,
  onAddTeamMember,
  isLoading = false,
}: TeamMemberListProps) {
  return (
    <div className="driver-list-panel bg-white br14 border2-gray h-100">
      {/* Search */}
      <div className="p-3">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search Team Member Here..."
        />
      </div>

      {/* Add New Team Member Button */}
      <div className="px-3 pb-3">
        <Button
          title={"+ Add New Team Member"}
          onClick={onAddTeamMember}
          className="w-100 py-3 text-primary fw-medium bg-transparent rounded-3 btn-add-driver"
        />
      </div>

      {/* Team Member List */}
      <div className="driver-list scrollable-list-short">
        {isLoading && teamMembers.length === 0 ? (
          <div className="text-center py-4 px-4">
            <p className="cgray fs-14 mb-0">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <EmptyState
            title="No Team Members Yet"
            description="Add your first team member to start working together smoothly."
          />
        ) : (
          <>
            {teamMembers.map((teamMember) => (
              <TeamMemberCard
                key={teamMember.id}
                teamMember={teamMember}
                isSelected={selectedTeamMember?.id === teamMember.id}
                onClick={() => onTeamMemberSelect(teamMember)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
