import {
   TextField,
   type TextFieldProps,
   type TextFieldVariants,
} from "@mui/material";

function Input({
   ...props
}: {
   variant?: TextFieldVariants;
} & Omit<TextFieldProps, "variant">) {
   return (
      <TextField
         {...props}
         sx={{
            "& .MuiInputBase-root": {
               borderRadius: props.size == "small" ? "8px" : "12px",
               backgroundColor: "var(--color-background-paper-dark)",
               ...((props.sx as Record<string, any>)?.[
                  "& .MuiInputBase-root:hover fieldset"
               ] ?? {}),
            },
            "& input": {
               borderRadius: props.size == "small" ? "8px" : "12px",
               ...((props.sx as Record<string, any>)?.[
                  "& input"
               ] ?? {}),
            },
            "& fieldset": {
               border: "0.6px solid var(--color-background-paper-light)",
               transitionProperty: "border-color",
               transitionDuration: "100ms",
               borderRadius: props.size == "small" ? "8px" : "12px",
               ...((props.sx as Record<string, any>)?.[
                  "& fieldset"
               ] ?? {}),
            },
            "& .MuiInputBase-root:hover fieldset": {
               border: "0.6px solid var(--color-text-secondary)",
               ...((props.sx as Record<string, any>)?.[
                  "& .MuiInputBase-root:hover fieldset"
               ] ?? {}),
            },
            "& input:focus ~ fieldset": {
               border: "0.6px solid var(--color-primary) !important",
               ...((props.sx as Record<string, any>)?.[
                  "& input:focus ~ fieldset"
               ] ?? {}),
            },
            "& input:-webkit-autofill": {
               WebkitBoxShadow:
                  "1000px 1000px 1000px 1000px var(--color-background-paper-light) inset",
               WebkitTextFillColor: "#fff",
               caretColor: "#fff",
               ...((props.sx as Record<string, any>)?.[
                  "& input:-webkit-autofill"
               ] ?? {}),
            },
            ...(props.sx ?? {}),
         }}
      />
   );
}

export default Input;
