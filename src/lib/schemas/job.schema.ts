import { z } from "zod";

// Step 1: Equipment Selection Schema
export const equipmentSelectionSchema = z.object({
  equipmentType: z.string().min(1, "Please select an equipment type"),
});

// Step 2: Job Specifications Schema
export const jobSpecificationsSchema = z.object({
  lineLength: z.string().optional(),
  volume: z
    .string()
    .nonempty({ message: "Volume is required" })
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Volume must be a positive number" }
    ),
  aggregateTypes: z.array(z.string()).optional(),
  jobDetails: z.array(z.string()).optional(),
  washoutOption: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Step 3: Location Details Schema
export const locationDetailsSchema = z.object({
  onSiteLocation: z.string().min(1, "Please enter on site location"),
  onSiteLocationDetails: z
    .object({
      address: z.string(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
});

// Step 4: Schedule Job Schema
export const scheduleJobSchema = z.object({
  startDate: z.string().min(1, "Please select start date"),
  startTime: z.string().min(1, "Please select start time"),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  recurringDays: z.array(z.string()).optional(),
  exactTimingRequired: z.boolean().optional(),
  preferredBufferWindow: z.string().optional(),
});

// Complete Job Form Schema
export const createJobSchema = equipmentSelectionSchema
  .merge(jobSpecificationsSchema)
  .merge(locationDetailsSchema)
  .merge(scheduleJobSchema);

// Type exports
export type EquipmentSelectionData = z.infer<typeof equipmentSelectionSchema>;
export type JobSpecificationsData = z.infer<typeof jobSpecificationsSchema>;
export type LocationDetailsData = z.infer<typeof locationDetailsSchema>;
export type ScheduleJobData = z.infer<typeof scheduleJobSchema>;
export type CreateJobData = z.infer<typeof createJobSchema>;
