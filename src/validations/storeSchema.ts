import { memoize } from "@/utils/singleton";
import * as Yup from "yup";

export const getStoreSchema = memoize(() =>
   Yup.object({
      name: Yup.string().required("Store name is required"),
      description: Yup.string().nullable().optional(),
      avatar: Yup.mixed<File>().nullable().optional(),
   })
);

export type StoreFormData = Yup.InferType<ReturnType<typeof getStoreSchema>>;
