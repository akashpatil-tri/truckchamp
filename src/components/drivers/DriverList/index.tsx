"use client";

import EmptyState from "@common/EmptyState";
import SearchInput from "@common/SearchInput";

import Button from "@/components/common/Button";
import type { Driver } from "@/types/driver.types";

import DriverCard from "../DriverCard";

interface DriverListProps {
  drivers: Driver[];
  selectedDriver: Driver | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDriverSelect: (driver: Driver) => void;
  onAddDriver: () => void;
  // Infinite query props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

export default function DriverList({
  drivers,
  selectedDriver,
  searchQuery,
  onSearchChange,
  onDriverSelect,
  onAddDriver,
  hasNextPage = false,
  isFetchingNextPage = false,
  isLoading = false,
  onLoadMore,
}: DriverListProps) {
  return (
    <div className="driver-list-panel bg-white br14 border2-gray h-100">
      {/* Search */}
      <div className="p-3">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search Driver Here..."
        />
      </div>

      {/* Add New Driver Button */}
      <div className="px-3 pb-3">
        <Button
          title={"+ Add New Driver"}
          onClick={onAddDriver}
          className="w-100 py-3 text-primary fw-medium bg-transparent rounded-3 btn-add-driver"
        />
      </div>

      {/* Driver List */}
      <div className="driver-list scrollable-list-short">
        {isLoading && drivers.length === 0 ? (
          <div className="text-center py-5">
            <p className="cgray fs-14 mb-0">Loading drivers...</p>
          </div>
        ) : drivers.length === 0 ? (
          <EmptyState
            title="No Drivers Added Yet"
            description="Add your first driver to keep your jobs on the road without delays."
          />
        ) : (
          <>
            {drivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                isSelected={selectedDriver?.id === driver.id}
                onClick={() => onDriverSelect(driver)}
              />
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="p-2 text-center border-top-separator">
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={isFetchingNextPage}
                  className="load-more-btn"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
