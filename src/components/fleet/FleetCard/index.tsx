"use client";

import Image from "next/image";

import truckCapacityIcon from "@/assets/svg/capacity-icon.svg";
import hourlyRateIcon from "@/assets/svg/hourly-rate-icon.svg";
import type { Fleet, TruckType } from "@/types/fleet.types";

interface FleetCardProps {
  fleet: Fleet;
  isSelected: boolean;
  onClick: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  on_the_move: "On the Move",
  in_maintanance: "In Maintenance",
  utilized: "Unutilized",
};

// Helper to get truck type object
const getTruckType = (truckType: TruckType | string): TruckType | null => {
  if (typeof truckType === "object" && truckType !== null) {
    return truckType;
  }
  return null;
};

const STATUS_CLASSES: Record<string, string> = {
  on_the_move: "fleet-status-on-the-move",
  in_maintanance: "fleet-status-in-maintanance",
  utilized: "fleet-status-utilized",
};

export default function FleetCard({
  fleet,
  isSelected,
  onClick,
}: FleetCardProps) {
  const statusClass = STATUS_CLASSES[fleet.status || "utilized"] || STATUS_CLASSES.utilized;
  const truckType = getTruckType(fleet.truck_type);

  return (
    <div
      className={`fleet-card mx-3 mb-2 br14 card-clickable ${
        isSelected ? "bg-red3 card-selected-border" : "border2-gray"
      }`}
      onClick={onClick}
    >
      <div className="d-flex align-items-start p-3 justify-content-between">
        <div className="d-flex align-items-center gap-3">
          {truckType?.image_url ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}${truckType.image_url}`}
              alt={truckType.name || fleet.truck_type_name || "Truck"}
              width={48}
              height={48}
              className="br8 object-fit-cover"
              unoptimized
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center bg-light br8 truck-type-placeholder">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#797979"
                strokeWidth="1.5"
              >
                <rect x="1" y="3" width="15" height="13" rx="2" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
          )}
          <div>
            <p className="fw-semibold mb-1 cblack1">
              {fleet?.truck_type?.name}
            </p>
            <p className="cgray fs-12 mb-0">{fleet.truck_number}</p>
          </div>
        </div>
        <span className={`px-2 py-1 br20 fs-12 ${statusClass}`}>
          {STATUS_LABELS[fleet.status || "utilized"] || fleet.status || "Unutilized"}
        </span>
      </div>
      <hr className="bg-grey border-0 border-top border-grey m-0" />
      <div className="d-flex p-3 align-items-center justify-content-around gap-4">
        <div className="d-flex flex-column align-items-center justify-content-center gap-1">
          <div>
            <Image
              src={hourlyRateIcon}
              alt="Hourly Rate"
              width={20}
              height={20}
            />
            <span className="cgray fs-12">Hourly Rate</span>
          </div>
          <div>
            <p className="mb-0 fs-14 cblack1 fw-semibold">
              $ {fleet.hourly_rate}
            </p>
          </div>
        </div>
        <hr className="vr" />
        <div className="d-flex flex-column align-items-center justify-content-center gap-1">
          <div className="d-flex align-items-center justify-content-center flex-column gap-1">
            <div className="d-flex align-items-center gap-1">
              <Image
                src={truckCapacityIcon}
                alt="Truck Capacity"
                width={20}
                height={20}
              />
              <span className="cgray fs-12">Truck Capacity</span>
            </div>
            <div>
              <p className="mb-0 fs-14 cblack1 fw-semibold">N/A</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
