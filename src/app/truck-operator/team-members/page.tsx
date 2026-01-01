"use client";

import { useEffect, useMemo, useState } from "react";

import TeamMemberForm from "@forms/TeamMemberForm";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import DeleteModal from "@/components/common/DeleteModal";
import { TeamMemberDetails, TeamMemberList } from "@/components/team-members";
import {
  useDeleteTeamMemberMutation,
  useTeamMembersListQuery,
} from "@/queries/team-member";
import type { TeamMember } from "@/types/team-member.types";

export default function TeamMembersPage() {
  const { openOffcanvas, openOffcanvasId } = useOffcanvasStore();
  const [selectedTeamMember, setSelectedTeamMember] =
    useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query for team members
  const { data: teamMembers = [], isLoading } =
    useTeamMembersListQuery(debouncedSearch);

  const { mutateAsync: deleteTeamMember } = useDeleteTeamMemberMutation();

  // Derive current selected team member
  const currentSelectedTeamMember = useMemo(() => {
    // If we have a selected team member and it's still in the list, use it
    if (
      selectedTeamMember &&
      teamMembers.find((tm) => tm.id === selectedTeamMember.id)
    ) {
      return selectedTeamMember;
    }
    // Otherwise fall back to first team member
    return teamMembers[0] ?? null;
  }, [selectedTeamMember, teamMembers]);

  const handleAddTeamMember = () => {
    openOffcanvas("offcanvasAddTeamMember");
  };

  const handleEditTeamMember = () => {
    openOffcanvas("offcanvasEditTeamMember");
  };

  const handleDeleteTeamMember = async () => {
    try {
      if (currentSelectedTeamMember?.id) {
        await deleteTeamMember(currentSelectedTeamMember.id);
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      return error;
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content">
          <div className="row gx-3">
            {/* Left Panel - Team Member List */}
            <div className="col-12 col-lg-5 col-xl-4 mb-3 mb-lg-0">
              <TeamMemberList
                teamMembers={teamMembers}
                selectedTeamMember={currentSelectedTeamMember}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onTeamMemberSelect={setSelectedTeamMember}
                onAddTeamMember={handleAddTeamMember}
                isLoading={isLoading}
              />
            </div>

            {/* Right Panel - Team Member Details */}
            <div className="col-12 col-lg-7 col-xl-8">
              <TeamMemberDetails
                teamMember={currentSelectedTeamMember}
                onEditTeamMember={handleEditTeamMember}
                onDeleteTeamMember={handleOpenDeleteModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Member Form Modal */}
      <TeamMemberForm
        teamMember={currentSelectedTeamMember}
        mode={openOffcanvasId === "offcanvasEditTeamMember" ? "edit" : "add"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member?"
        onConfirm={handleDeleteTeamMember}
      />
    </>
  );
}
