import * as Yup from "yup";

// ========================================
// Auth Validations
// ========================================
export const getLoginSchema = memoize(() =>
   Yup.object({
      email: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
   })
);

export const getForgotPasswordSchema = memoize(() =>
   Yup.object({
      email: Yup.string()
         .required("Email address is required.")
         .email("Email address is not valid."),
   })
);

export const getResetPasswordSchema = memoize(() =>
   Yup.object({
      newPassword: Yup.string()
         .required("New password is required.")
         .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string()
         .required("Confirm password is required.")
         .oneOf([Yup.ref("newPassword")], "Passwords must match"),
   })
);

export const getUpdatePasswordSchema = memoize(() =>
   Yup.object({
      oldPassword: Yup.string()
         .required("Current password is required")
         .min(8, "Current password length at least 8 characters"),
      newPassword: Yup.string()
         .required("New password is required")
         .min(8, "New password length at least 8 characters"),
      confirmPassword: Yup.string()
         .required("Confirm password is required")
         .min(8, "Confirm password length at least 8 characters")
         .oneOf([Yup.ref("newPassword")], "Password didn't match"),
   })
);

export const getUpdateProfileSchema = memoize(() =>
   Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().required("Email is required"),
      avatar: Yup.mixed<File | string>()
         .nullable()
         .test("fileType", "File format not supported", (value: any) => {
            // jika string (misal URL lama), lewati validasi
            if (!value || typeof value === "string") return true;
            return (value.type as string).startsWith("image/");
         })
         .test("fileSize", "Maximum file size is 2MB", (value: any) => {
            // jika string (misal URL lama), lewati validasi
            if (!value || typeof value === "string") return true;
            return value.size <= 2 * 1024 * 1024;
         }),
   })
);



// ========================================
// Types
// ========================================
export type LoginFormData = Yup.InferType<typeof loginSchema>;
export type ForgotPasswordFormData = Yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = Yup.InferType<typeof resetPasswordSchema>;
export type UpdatePasswordFormData = Yup.InferType<ReturnType<typeof getUpdatePasswordSchema>>;
export type UpdateProfileFormData = Yup.InferType<ReturnType<typeof getUpdateProfileSchema>>;
