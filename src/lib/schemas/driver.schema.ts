import { z } from "zod";

// Driver form validation schema
export const driverFormSchema = z.object({
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
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid mobile number (e.g., +61412345678)"
    ),
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

export type DriverFormData = z.infer<typeof driverFormSchema>;
