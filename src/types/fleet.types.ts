export type FleetStatus = "on_the_move" | "in_maintanance" | "utilized";

export interface FleetDocument {
  id: string;
  document_name?: string;
  document_url?: string;
  file_url?: string;
  truck_type_document_id?: string;
  fleet_id?: string;
  truck_type_document?:{
    document_name?:string
  }
  renew_date?: string;
  created_at?: string;
}

export interface TruckType {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_truck_id?: string | null;
}

export interface FleetImage {
  id: string;
  image_url: string;
  fleet_id?: string;
}

export interface FleetAttachment {
  id: string;
  name: string;
  price: string | number;
  fleet_id?: string;
}

export interface Fleet {
  id: string;
  truck_type_id?: string;
  truck_type: TruckType;
  truck_type_name?: string;
  company_id?: string;
  truck_number: string;
  hourly_rate: number | string;
  travel_charge: string;
  minimum_hire: string;
  truck_capacity?: string;
  status?: FleetStatus;
  is_available?: boolean;
  is_active?: boolean;
  is_verified?: boolean;
  notes?: string | null;
  images: FleetImage[] | string[];
  documents: FleetDocument[];
  specifications?: Record<string, unknown> | string;
  attachments?: FleetAttachment[];
  created_at?: string;
  updated_at?: string;
}

export interface FleetListResponse {
  data: Fleet[];
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}
