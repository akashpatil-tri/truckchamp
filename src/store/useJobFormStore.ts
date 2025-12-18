import { create } from "zustand";

export interface JobFormData {
  // Step 1: Equipment Selection
  equipmentType: string;

  // Step 2: Job Specifications
  lineLength?: string;
  volume?: string;
  aggregateTypes: string[];
  jobDetails: string[];
  washoutOption: string[];
  notes?: string;

  // Step 3: Location Details
  onSiteLocation?: string;
  onSiteLocationDetails?: {
    address: string;
    lat?: number;
    lng?: number;
  };

  // Step 4: Schedule
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  recurringDays: string[];
  exactTimingRequired: boolean;
  preferredBufferWindow?: string;
}

interface JobFormStore {
  currentStep: number;
  formData: JobFormData;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<JobFormData>) => void;
  resetForm: () => void;
}

const initialFormData: JobFormData = {
  equipmentType: "",
  aggregateTypes: [],
  jobDetails: [],
  washoutOption: [],
  recurringDays: [],
  exactTimingRequired: false,
};

export const useJobFormStore = create<JobFormStore>((set) => ({
  currentStep: 1,
  formData: initialFormData,

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 5),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set({
      currentStep: 1,
      formData: initialFormData,
    }),
}));
