import { memoize } from "@/utils/singleton";
import * as Yup from "yup";

// ========================================
// Product Validations
// ========================================
export const getProductSchema = memoize(() =>
   Yup.object({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number()
         .typeError("Price must be a number")
         .min(0, "Price must be positive")
         .required("Price is required"),
      stock: Yup.number()
         .typeError("Stock must be a number")
         .min(0, "Stock must be positive")
         .required("Stock is required"),
      category: Yup.string().required("Category is required"),
      image: Yup.mixed<File>().nullable(),
   })
);

// ========================================
// Types
// ========================================
export type ProductFormData = Yup.InferType<ReturnType<typeof getProductSchema>>;
