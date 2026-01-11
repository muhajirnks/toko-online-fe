import { API_URL } from "@/lib/fetch/myFetch";

export const getExtension = (fileName: string) => {
   return fileName.split(".").pop()?.toLowerCase() || "";
};

export const getFileName = (file: File | string | null) => {
   if (typeof file === "string") {
      return file.split("/").pop() || "";
   }
   return file ? file.name : "";
};

export const getFullUrl = (url: string) => {
   return url.startsWith('http') ? url : API_URL + url
}
