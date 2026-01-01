"use client";

import EmptyState from "@common/EmptyState";
import SearchInput from "@common/SearchInput";

import Button from "@/components/common/Button";
import type { Fleet } from "@/types/fleet.types";

import FleetCard from "../FleetCard";

interface FleetListProps {
  fleets: Fleet[];
  selectedFleet: Fleet | null;
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onFleetSelect: (fleet: Fleet) => void;
  onAddFleet: () => void;
  isLoading?: boolean;
}

const STATUS_TABS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "on_the_move", label: "On the Move" },
  { value: "in_maintanance", label: "In Maintenance" },
  { value: "utilized", label: "Unutilized" },
];

export default function FleetList({
  fleets,
  selectedFleet,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onFleetSelect,
  onAddFleet,
  isLoading = false,
}: FleetListProps) {
  return (
    <div className="driver-list-panel bg-white br14 border2-gray h-100">
      {/* Search */}
      <div className="p-3">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search Truck Here..."
        />
      </div>

      {/* Add to Fleet Button */}
      <div className="px-3 pb-3">
        <Button
          title={"+ Add to Fleet"}
          onClick={onAddFleet}
          className="w-100 py-3 text-primary fw-medium bg-transparent rounded-3 btn-add-driver"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="px-3 pb-3">
        <div className="d-flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusFilterChange(tab.value)}
              className={`px-3 py-2 br20 fs-14 border-0 status-tab-btn ${
                statusFilter === tab.value
                  ? "bg-primary text-white"
                  : "bg-light cgray"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet List */}
      <div className="driver-list scrollable-list">
        {isLoading && fleets.length === 0 ? (
          <div className="text-center py-5">
            <p className="cgray fs-14 mb-0">Loading fleet...</p>
          </div>
        ) : fleets.length === 0 ? (
          <EmptyState
            title="No Vehicles in Your Fleet"
            description="Add your first vehicle to start building a your fleet for upcoming jobs."
          />
        ) : (
          <>
            {fleets.map((fleet) => (
              <FleetCard
                key={fleet.id}
                fleet={fleet}
                isSelected={selectedFleet?.id === fleet.id}
                onClick={() => onFleetSelect(fleet)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
