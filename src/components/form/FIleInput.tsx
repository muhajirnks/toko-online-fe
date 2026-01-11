import { Box, Button, FormHelperText, IconButton } from "@mui/material";
import { useEffect, useRef } from "react";
import { FaFile } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { MdDelete, MdSync, MdUpload } from "react-icons/md";
import {
   RiFileExcel2Fill,
   RiFilePdf2Fill,
   RiFileWord2Fill,
} from "react-icons/ri";

interface Props {
   placeholder?: string;
   value?: File | string | null;
   accept?: string;
   onChange?: (file: File | "_delete" | null) => void;
   error?: boolean;
   helperText?: React.ReactNode;
}

const getExtension = (fileName: string) => {
   return fileName.split(".").pop()?.toLowerCase() || "";
};

const getFileName = (file: File | string | null) => {
   if (typeof file === "string") {
      return file.split("/").pop() || "";
   }
   return file ? file.name : "";
};

const getIcon = (fileName: string) => {
   const ext = getExtension(fileName);
   switch (ext) {
      case "pdf":
         return <RiFilePdf2Fill className="text-6xl mx-auto text-gray-400" />; // PDF icon
      case "doc":
      case "docx":
         return <RiFileWord2Fill className="text-6xl mx-auto text-gray-400" />; // Word document icon
      case "xls":
      case "xlsx":
         return <RiFileExcel2Fill className="text-6xl mx-auto text-gray-400" />; // Excel document icon
      case "txt":
         return <IoDocumentText className="text-6xl mx-auto text-gray-400" />; // Text file icon
      default:
         return <FaFile className="text-6xl mx-auto text-gray-400" />; // Generic file icon
   }
};

const fileIsImage = (file: File | string | null) => {
   if (typeof file === "string") {
      return file.match(/\.(jpg|jpeg|png|gif)$/i) !== null;
   }

   return file ? file.type.startsWith('image') : false;
};

const FileInput = ({
   placeholder,
   value,
   onChange,
   accept,
   error,
   helperText,
}: Props) => {
   const fileName = getFileName(value!);

   const hasValue = value && value !== "_delete";

   const fileIcon = hasValue ? (
      getIcon(fileName)
   ) : (
      <MdUpload className="text-4xl mx-auto text-gray-400" />
   );
   const isImage = fileIsImage(value!);

   const inputRef = useRef<HTMLInputElement>(null);

   const handleDelete = () => {
      if (inputRef.current) {
         if (onChange) {
            if (inputRef.current?.files?.length || value === "_delete") {
               onChange(null);
            } else {
               onChange("_delete");
            }
         }
      }
   };

   const handleDrop = async (e: React.DragEvent<any>) => {
      e.preventDefault();

      e.currentTarget.classList.remove("bg-gray-100");

      const dt = e.dataTransfer;
      if (!dt || !dt.files || dt.files.length === 0) return;

      if (onChange) {
         onChange(dt.files[0] || null);
      }

      if (inputRef.current) {
         inputRef.current.files = dt.files;
      }
   };

   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.classList.add("bg-gray-100");
   };

   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.classList.remove("bg-gray-100");
   };

   useEffect(() => {
      if ((!value || typeof value === "string") && inputRef.current) {
         const dt = new DataTransfer();
         inputRef.current.files = dt.files;
      }
   }, [value]);

   return (
      <Box>
         <Box
            className="w-full relative overflow-hidden"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
         >
            {value && (
               <IconButton
                  className={`absolute top-2 right-2 z-10 ${
                     value !== "_delete" ? "text-red-600" : "text-gray-400"
                  }`}
                  onClick={handleDelete}
               >
                  {value !== "_delete" ? <MdDelete /> : <MdSync />}
               </IconButton>
            )}
            <Box
               color="inherit"
               className={`w-full rounded-lg py-10 p-0 border-2 border-dashed relative grid place-items-center ${
                  error ? "border-red-600" : "border-gray-300"
               }`}
            >
               {isImage ? (
                  <Box>
                     <img
                        src={
                           typeof value === "string"
                              ? value
                              : URL.createObjectURL(value!)
                        }
                        alt={fileName}
                        className="w-full h-full object-cover"
                     />
                  </Box>
               ) : (
                  <Box className="flex flex-col items-center gap-3">
                     {fileIcon}
                     <span className="font-normal text-gray-500">
                        {hasValue ? fileName : placeholder || "Upload File"}
                     </span>
                     <Button
                        variant="outlined"
                        startIcon={<MdUpload />}
                        sx={{
                           borderColor: "#000000",
                           color: "#000000",
                           borderRadius: "12px",
                           textTransform: "none",
                           fontWeight: 600,
                        }}
                        onClick={() => inputRef.current?.click()}
                     >
                        {hasValue ? "Change File" : "Choose Files"}
                     </Button>
                  </Box>
               )}

               <input
                  ref={inputRef}
                  type="file"
                  hidden
                  accept={accept}
                  onChange={(e) =>
                     onChange && onChange(e.target.files?.[0] || null)
                  }
               />
            </Box>
         </Box>

         {helperText && (
            <FormHelperText
               className={`${
                  error ? "text-red-700" : "text-gray-500"
               } text-[12px]/normal max-sm:text-[10px]/normal max-md:text-[11px]/normal`}
            >
               {helperText}
            </FormHelperText>
         )}
      </Box>
   );
};

export default FileInput;
