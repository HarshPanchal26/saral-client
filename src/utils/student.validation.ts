import * as z from "zod"

export const personalDetailsSchema = z.object({
  name: z.string()
    .min(5, { message: "Name must be at least 5 characters." })
    .max(20, { message: "Name must be at most 20 characters." })
    .regex(/^[A-Za-z\s]+$/, {message: "Name must contain only alphabet characters and spaces." }),

  aadhar_dise_no: z.string()
    .length(12, { message: "Aadhar/DISE number must be exactly 12 digits." })
    .regex(/^\d{12}$/, { message: "Aadhar/DISE number must be a 12-digit number." }),

  birth_place: z.string()
    .min(3, { message: "Birth place must be at least 3 characters." })
    .max(15, { message: "Birth place must be at most 15 characters." })
    .regex(/^[A-Za-z\s]+$/, {message: "Birth place must contain only alphabet characters and spaces." }),

  birth_place_in_guj: z.string()
    .min(2, { message: "Birth place in Gujarati must be at least 2 characters." }),

  religion: z.string()
    .min(3, { message: "Religion must be at least 3 characters." })
    .max(7, { message: "Religion must be at most 7 characters." })
    .regex(/^[A-Za-z\s]+$/, { message: "Religion must contain only alphabet characters and spaces." }),

  religion_in_guj: z.string()
    .min(2, { message: "Religion in Gujarati must be at least 2 characters." }),

  caste: z.string()
    .max(4, { message: "Caste must be at most 4 characters." })
    .regex(/^[A-Za-z\s]+$/, { message: "Caste must contain only alphabet characters and spaces." }),

  caste_in_guj: z.string()
    .min(2, { message: "Caste in Gujarati must be at least 2 characters." }),

  category: z.enum(["ST", "SC", "OBC", "OPEN"]),
});

export const admissionDetailsSchema = z.object({
  admission_date: z.string(), // Assuming date as a string, consider changing to `z.date()` if necessary.

  admission_std: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]),

  division: z.enum(["A", "B", "C", "D", "E", "F", "G", "H"]),

  mobile_number_2: z.string()
    .regex(/^[6-9]\d{9}$/, { message: "Invalid mobile number. Must start with 6-9 and be 10 digits long." }),

  previous_school: z.string()
    .max(25, { message: "School name should not exceed 25 characters." })
    .nullable()
    .refine((val) => val === null || /^[A-Za-z0-9\s]+$/.test(val), {
      message: "School name should only contain letters, numbers, and spaces.",
    }),

  previous_school_in_guj: z.string().nullable(),
});

export const addressSchema = z.object({
  address: z.string()
    .min(5, { message: "Address must be at least 5 characters." })
    .max(50, { message: "Address must not exceed 50 characters." })
    .regex(/^[A-Za-z0-9\s,.-]*$/, { message: "Address can contain letters, numbers, spaces, and basic punctuation." }),

  district: z.string()
    .min(3, { message: "District must be at least 3 characters." })
    .regex(/^[A-Za-z\s]+$/, { message: "District must contain only letters and spaces." }),

  city: z.string()
    .min(5, { message: "City must be at least 5 characters." })
    .max(20, { message: "City must be at most 20 characters." })
    .regex(/^[A-Za-z\s]+$/, { message: "City must contain only alphabetic characters and spaces." }),

  state: z.string()
    .min(5, { message: "State must be at least 5 characters." })
    .max(20, { message: "State must be at most 20 characters." })
    .regex(/^[A-Za-z\s]+$/, { message: "State must contain only alphabetic characters and spaces." }),

  postal_code: z.string()
    .length(6, { message: "Postal code must be exactly 6 digits." })
    .regex(/^\d{6}$/, { message: "Postal code must contain only digits." }),
});

export const bankDetailsSchema = z.object({
  bank_name: z.string()
    .min(5, { message: "Bank name must be at least 5 characters." })
    .max(15, { message: "Bank name must be at most 15 characters." })
    .regex(/^[A-Za-z\s]+$/, { message: "Bank name must contain only alphabetic characters and spaces." }),

  account_no: z.string()
    .min(9, { message: "Account number must be at least 9 characters." })
    .max(15, { message: "Account number must be at most 15 characters." })
    .regex(/^\d+$/, { message: "Account number must contain only digits." }),

  IFSC_code: z.string()
    .length(11, { message: "IFSC code must be exactly 11 characters." })
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Invalid IFSC code format." }),
});

export const studentFormSchema = personalDetailsSchema
  .merge(admissionDetailsSchema)
  .merge(addressSchema)
  .merge(bankDetailsSchema);

export type StudentFormData = z.infer<typeof studentFormSchema>;
