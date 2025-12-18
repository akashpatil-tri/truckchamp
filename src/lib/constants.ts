// Authentication constants
export const AUTH_TOKEN_KEY = "authToken";

import boomPump from "@assets/images/select-fleet/boom-pump.png";
import concreteAgitator from "@assets/images/select-fleet/concreate-agitator.png";
import flatbedTruck from "@assets/images/select-fleet/flatbed-truck.png";
import floatTruck from "@assets/images/select-fleet/float.png";
import hiabCrane from "@assets/images/select-fleet/hiab-crane.png";
import linePump from "@assets/images/select-fleet/line-pump.png";
import skidSteerCombo from "@assets/images/select-fleet/skid-steer-combo.png";
import tiltTray from "@assets/images/select-fleet/tilt-tray.png";
import tripperTruck from "@assets/images/select-fleet/tipper-truck.png";
import truckCombo from "@assets/images/select-fleet/truck-combo.png";
import vacuumTruck from "@assets/images/select-fleet/vacuum-truck.png";
import waterTruck from "@assets/images/select-fleet/water-truck.png";

// Job Form Constants
export const EQUIPMENT_TYPES = [
  { id: "tipper-truck", name: "Tipper Truck", image: tripperTruck },
  { id: "flatbed-truck", name: "Flatbed Truck", image: flatbedTruck },
  { id: "tilt-tray", name: "Tilt Tray", image: tiltTray },
  { id: "water-truck", name: "Water Truck", image: waterTruck },
  { id: "truck-combo", name: "Truck Combo", image: truckCombo },
  { id: "float", name: "Float", image: floatTruck },
  { id: "boom-pump", name: "Boom Pump", image: boomPump },
  { id: "line-pump", name: "Line Pump", image: linePump },
  { id: "vacuum-truck", name: "Vacuum Truck", image: vacuumTruck },
  { id: "hiab-crane", name: "Hiab Crane", image: hiabCrane },
  {
    id: "concrete-agitator",
    name: "Concrete Agitator",
    image: concreteAgitator,
  },
  { id: "skid-steer-combo", name: "Skid Steer Combo", image: skidSteerCombo },
];

export const LINE_LENGTHS = ["10-30 m", "30-50 m", "50-70 m", "90 m+"];

export const AGGREGATE_TYPES = [
  "10 mm",
  "20 mm",
  "Exposed Aggregate",
  "Long line mix",
  "Early strength",
];

export const JOB_DETAILS = [
  "Ground slab",
  "Suspended slab",
  "Retaining walls",
  "Footings",
  "Columns",
  "Lift shaf",
  "Stairs",
  "Driveway",
  "Tight access / long line",
];

export const WASHOUT_OPTIONS = ["On-site washout", "Off-site washout"];

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = "AIzaSyCSNiu3Z68DO5UGT-5dRKz6tmvtd0pcqWs";
