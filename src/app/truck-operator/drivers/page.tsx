"use client";

import { useEffect, useMemo, useState } from "react";

import DriverForm from "@forms/DriverForm";
import { useOffcanvasStore } from "@store/useOffcanvasStore";

import DeleteModal from "@/components/common/DeleteModal";
import { DriverDetails, DriverList } from "@/components/drivers";
import {
  useDeleteDriverMutation,
  useDriversInfiniteQuery,
} from "@/queries/driver";
import type { Driver } from "@/types/driver.types";

export default function DriversPage() {
  const { openOffcanvas, openOffcanvasId } = useOffcanvasStore();
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
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

  // Infinite query for drivers
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useDriversInfiniteQuery(debouncedSearch);

  const { mutateAsync: deleteDriver } = useDeleteDriverMutation();

  // Flatten pages to get all drivers - Fixed: use data.pages directly
  const drivers = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  // Derive current selected driver - no effect needed
  const currentSelectedDriver = useMemo(() => {
    // If we have a selected driver and it's still in the list, use it
    if (selectedDriver && drivers.find((d) => d.id === selectedDriver.id)) {
      return selectedDriver;
    }
    // Otherwise fall back to first driver
    return drivers[0] ?? null;
  }, [selectedDriver, drivers]);

  const handleAddDriver = () => {
    openOffcanvas("offcanvasAddDriver");
  };

  const handleEditDriver = () => {
    openOffcanvas("offcanvasEditDriver");
  };

  const handleDeleteDriver = async () => {
    try {
      await deleteDriver(currentSelectedDriver?.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      return error;
    }
  };

  const handleRemoveDriver = () => {
    setIsDeleteModalOpen(true);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="content">
          <div className="row gx-3">
            {/* Left Panel - Driver List */}
            <div className="col-12 col-lg-5 col-xl-4 mb-3 mb-lg-0">
              <DriverList
                drivers={drivers}
                selectedDriver={currentSelectedDriver}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onDriverSelect={setSelectedDriver}
                onAddDriver={handleAddDriver}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
              />
            </div>

            {/* Right Panel - Driver Details */}
            <div className="col-12 col-lg-7 col-xl-8">
              <DriverDetails
                driver={currentSelectedDriver}
                onEditDriver={handleEditDriver}
                onRemoveDriver={handleRemoveDriver}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Driver Form Modal */}
      {/* Driver Form Modal */}
      <DriverForm
        driver={currentSelectedDriver}
        mode={openOffcanvasId === "offcanvasEditDriver" ? "edit" : "add"}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Driver"
        description="Are you sure you want to delete this driver?"
        onConfirm={handleDeleteDriver}
      />
    </>
  );
}
