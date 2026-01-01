import { z } from "zod";

export const editProfileSchema = z.object({
  abnNumber: z.string().min(1, "ABN / Business Registration Number is required"),
  primaryContactName: z.string().min(1, "Primary contact name is required"),
  primaryContactEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
});

export const deleteAccountSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  reason: z.string().min(1, "Please select a reason"),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
