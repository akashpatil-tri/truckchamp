"use client";

import { useEffect, useMemo, useState } from "react";

import FleetForm from "@forms/FleetForm";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import DeleteModal from "@/components/common/DeleteModal";
import { FleetDetails, FleetList } from "@/components/fleet";
import { useDeleteFleetMutation, useFleetsListQuery } from "@/queries/fleet";
import type { Fleet } from "@/types/fleet.types";

export default function FleetManagementPage() {
  const { openOffcanvas } = useOffcanvasStore();
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query for fleets
  const { data: fleets = [], isLoading } = useFleetsListQuery(
    debouncedSearch,
    statusFilter
  );

  const { mutateAsync: deleteFleet } = useDeleteFleetMutation();

  // Derive current selected fleet
  const currentSelectedFleet = useMemo(() => {
    // If we have a selected fleet and it's still in the list, use it
    if (selectedFleet && fleets.find((f) => f.id === selectedFleet.id)) {
      return selectedFleet;
    }
    // Otherwise fall back to first fleet
    return fleets[0] ?? null;
  }, [selectedFleet, fleets]);

  const handleAddFleet = () => {
    openOffcanvas("offcanvasAddFleet");
  };

  const handleEditFleet = () => {
    openOffcanvas("offcanvasEditFleet", currentSelectedFleet);
  };

  const handleDeleteFleet = async () => {
    try {
      if (currentSelectedFleet?.id) {
        await deleteFleet(currentSelectedFleet.id);
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
            {/* Left Panel - Fleet List */}
            <div className="col-12 col-lg-5 col-xl-4 mb-3 mb-lg-0">
              <FleetList
                fleets={fleets}
                selectedFleet={currentSelectedFleet}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onSearchChange={setSearchQuery}
                onStatusFilterChange={setStatusFilter}
                onFleetSelect={setSelectedFleet}
                onAddFleet={handleAddFleet}
                isLoading={isLoading}
              />
            </div>

            {/* Right Panel - Fleet Details */}
            <div className="col-12 col-lg-7 col-xl-8">
              <FleetDetails
                fleet={currentSelectedFleet}
                onEditFleet={handleEditFleet}
                onRemoveFleet={handleOpenDeleteModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Form Modal */}
      <FleetForm />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Fleet"
        description="Deleting this fleet will permanently remove all associated vehicles and data. Please provide a reason if required, and confirm only if you're sure."
        onConfirm={handleDeleteFleet}
      />
    </>
  );
}
