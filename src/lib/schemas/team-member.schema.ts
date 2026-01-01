import { z } from "zod";

// Base schema for team member (shared fields)
const baseTeamMemberSchema = {
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .toLowerCase(),
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(
      /^\+61\d{9}$/,
      "Please enter a valid Australian mobile number (e.g., +61412345678)"
    ),
};

// Schema for creating a new team member (password required)
export const teamMemberCreateSchema = z.object({
  ...baseTeamMemberSchema,
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

// Schema for editing a team member (password optional)
export const teamMemberEditSchema = z.object({
  ...baseTeamMemberSchema,
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 8,
      "Password must be at least 8 characters"
    )
    .refine(
      (val) =>
        !val ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/.test(
          val
        ),
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export type TeamMemberCreateData = z.infer<typeof teamMemberCreateSchema>;
export type TeamMemberEditData = z.infer<typeof teamMemberEditSchema>;
export type TeamMemberFormData = TeamMemberCreateData | TeamMemberEditData;
