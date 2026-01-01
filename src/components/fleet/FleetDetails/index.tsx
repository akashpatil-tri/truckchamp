"use client";

import Image from "next/image";

import Button from "@common/Button";
import EmptyState from "@common/EmptyState";

import DollarIcon from "@/assets/svg/dollar_icon.svg";
import LocationIcon from "@/assets/svg/location_icon.svg";
import NumberIcon from "@/assets/svg/number_icon.svg";
import TimeIcon from "@/assets/svg/time_icon.svg";
import TruckIcon from "@/assets/svg/truck_icon.svg";
import type { Fleet, FleetImage, TruckType } from "@/types/fleet.types";

interface FleetDetailsProps {
  fleet: Fleet | null;
  onEditFleet?: () => void;
  onRemoveFleet?: () => void;
}



// Helper to get truck type object
const getTruckType = (truckType: TruckType | string): TruckType | null => {
  if (typeof truckType === "object" && truckType !== null) {
    return truckType;
  }
  return null;
};

// Helper to get image URL from fleet images
const getImageUrl = (image: FleetImage | string): string => {
  if (typeof image === "object" && image !== null) {
    return image.image_url;
  }
  console.log(image);

  return image;
};

export default function FleetDetails({
  fleet,
  onEditFleet,
  onRemoveFleet,
}: FleetDetailsProps) {
  if (!fleet) {
    return (
      <div className="driver-details-panel bg-white br14 border2-gray p-4 h-100">
        <EmptyState
          title="No Fleet Selected"
          description="Select a vehicle from the list to view its details."
        />
      </div>
    );
  }

  

  const truckType = getTruckType(fleet.truck_type);

  return (
    <>
      <div className="bg-white br-fleet-up p-3">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0 text-dark fs-5">Fleet Details</h5>
          <div className="d-flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="minw-auto fs-14 rounded-pill px-4 py-2 fw-medium"
              onClick={onRemoveFleet}
              title="Remove Truck"
            />

            <Button
              type="button"
              variant="filled"
              className="minw-auto fs-14 rounded-pill px-4 py-2 fw-medium"
              onClick={onEditFleet}
              title="Edit Truck"
            />
          </div>
        </div>
      </div>
      <hr className="bg-grey border-0 border-top border-grey m-0" />
      <div className="bg-white br-fleet-down p-3">
        {/* Fleet Images */}
        {fleet?.images && fleet?.images?.length > 0 && (
          <div>
            <div className="d-flex gap-3">
              {fleet?.images?.slice(0, 3)?.map((image, index) => {
                const imageUrl = getImageUrl(image);
                return (
                  <div key={imageUrl || index} className="position-relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${imageUrl}`}
                      alt={`${fleet.truck_type_name} - ${index + 1}`}
                      unoptimized
                      width={180}
                      height={130}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fleet Info Grid - Row with dividers */}
      <div className="d-flex align-items-stretch mt-3 mb-3 gap-3 fleet-info-grid">
        {/* Truck Number */}
        <div className="bg-white flex-fill p-3 rounded-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Image src={NumberIcon} alt="Truck Number" width={20} height={20} />
            <span className="fleet-info-label">Truck Number</span>
          </div>
          <p className="mb-0 fw-semibold fleet-info-value">
            {fleet.truck_number}
          </p>
        </div>

        {/* Truck Type */}
        <div className="bg-white flex-fill p-3 rounded-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Image src={TruckIcon} alt="Truck Type" width={18} height={18} />
            <span className="fleet-info-label">Truck Type</span>
          </div>
          <p className="mb-0 fw-semibold fleet-info-value">
            {truckType?.name || fleet.truck_type_name}
          </p>
        </div>

        {/* Travel Charge */}
        <div className="bg-white flex-fill p-3 rounded-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Image
              src={LocationIcon}
              alt="Travel Charge"
              width={18}
              height={18}
            />
            <span className="fleet-info-label">Travel Charge</span>
          </div>
          <p className="mb-0 fw-semibold fleet-info-value">
            {fleet.travel_charge}
          </p>
        </div>

        {/* Minimum Hire */}
        <div className="bg-white flex-fill p-3 rounded-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Image src={TimeIcon} alt="Minimum Hire" width={18} height={18} />
            <span className="fleet-info-label">Minimum Hire</span>
          </div>
          <p className="mb-0 fw-semibold fleet-info-value">
            {fleet.minimum_hire}
          </p>
        </div>

        {/* Hourly Rate */}
        <div className="bg-white flex-fill p-3 rounded-4">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Image src={DollarIcon} alt="Hourly Rate" width={18} height={18} />
            <span className="fleet-info-label">Hourly Rate</span>
          </div>
          <p className="mb-0 fw-semibold fleet-info-value">
            ${fleet.hourly_rate}
          </p>
        </div>
      </div>

      {/* Certificate & Document History */}
      <div className="bg-white p-3 rounded-4">
        <h6 className="fw-bold fs-5 mb-3 text-1a1a1a">
          Certificate & Document History
        </h6>
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr className="doc-table-header-row">
                <th className="fw-semibold doc-table-header doc-table-header-first">
                  Document Name
                </th>
                <th className="fw-semibold doc-table-header">Renew Date</th>
                <th className="fw-semibold text-end doc-table-header doc-table-header-last">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {fleet.documents && fleet.documents.length > 0 ? (
                fleet.documents.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className={
                      index < fleet.documents.length - 1
                        ? "doc-table-row-border"
                        : ""
                    }
                  >
                    <td className="doc-table-cell-name">{doc?.truck_type_document?.document_name}</td>
                    <td className="doc-table-cell-date">
                      {doc.renew_date || "-"}
                    </td>
                    <td className="doc-table-cell-action text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <a
                          href={doc.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-inline-flex align-items-center gap-1 doc-view-btn"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <circle
                              cx="7"
                              cy="7"
                              r="2"
                              stroke="#1E40AF"
                              strokeWidth="1.5"
                              fill="none"
                            />
                            <path
                              d="M1 7c1.2-2.5 3.3-4 6-4s4.8 1.5 6 4c-1.2 2.5-3.3 4-6 4s-4.8-1.5-6-4z"
                              stroke="#1E40AF"
                              strokeWidth="1.2"
                              fill="none"
                            />
                          </svg>
                          View
                        </a>
                        <button
                          type="button"
                          className="d-inline-flex align-items-center gap-1 doc-replace-btn"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M11.5 7.5v2a1.5 1.5 0 01-1.5 1.5H4a1.5 1.5 0 01-1.5-1.5v-2M7 3v5.5M4.5 5.5L7 3l2.5 2.5"
                              stroke="#D74315"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Replace
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center doc-empty-message">
                    No documents available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
