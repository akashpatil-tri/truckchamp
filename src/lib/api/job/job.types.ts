export interface Job {
  id: string;
  equipmentType: string;
  lineLength?: string;
  volume?: string;
  aggregateTypes?: string[];
  jobDetails?: string[];
  washoutOption?: string[];
  notes?: string;
  onSiteLocation: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  recurringDays?: string[];
  exactTimingRequired: boolean;
  preferredBufferWindow?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
