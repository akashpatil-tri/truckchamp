import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// File validation schema for images
const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, and .png files are supported"
  );

// File validation schema for documents
const documentFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
  .refine(
    (file) => ACCEPTED_DOCUMENT_TYPES.includes(file.type),
    "Only .pdf, .doc, and .docx files are supported"
  );

// Attachment schema
export const attachmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Attachment name is required"),
  price: z.number().min(0, "Price must be a positive number"),
});

export const fleetFormSchema = z.object({
  truckType: z.string().min(1, "Truck type is required"),
  truckNumber: z.string().min(1, "Truck number is required"),
  hourlyRate: z
    .string()
    .min(1, "Hourly rate is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Hourly rate must be a positive number",
    }),
  travelCharge: z
    .string()
    .min(1, "Travel charge is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Travel charge must be a valid number",
    }),
  minimumHire: z.string().min(1, "Minimum hire is required"),
  attachments: z.array(attachmentSchema),
  fleetImages: z
    .array(imageFileSchema)
    .min(1, "At least one fleet image is required")
    .max(3, "Maximum 3 fleet images allowed"),
  // Common documents (optional)
  vehicleRegistrationCertificate: documentFileSchema.nullable().optional(),
  publicLiabilityInsurance: documentFileSchema.nullable().optional(),
  maintenanceRecords: documentFileSchema.nullable().optional(),
  truckInsurance: documentFileSchema.nullable().optional(),
  // Motor vehicle certification (optional)
  motorVehicleRegistrationCertificate: documentFileSchema.nullable().optional(),
  vehicleInsuranceDocument: documentFileSchema.nullable().optional(),
  swmsDocument: documentFileSchema.nullable().optional(),
});

export type FleetFormData = z.infer<typeof fleetFormSchema>;
export type Attachment = z.infer<typeof attachmentSchema>;
