export interface Equipment {
  id: string;
  name: string;
  image_url: string;
}

export interface EquipmentListResponse {
  data: Equipment[];
}

export interface SelectEquipmentProps {
  data?: EquipmentListResponse;
  isPending?: boolean;
  isError?: boolean;
  error?: Error | null;
  enabled?: boolean;
}
