import { Box, Button, type ButtonProps } from "@mui/material";

const ButtonLinear = (props: ButtonProps) => {
   return (
      <Button
         variant="contained"
         {...props}
         className={`relative overflow-hidden group ${props.className}`}
      >
         <Box
            className={`${
               props.loading || props.disabled ? "opacity-0" : "opacity-100"
            } duration-100 transition-opacity absolute w-full aspect-square`}
         >
            <Box
               className={`bg-linear-to-r from-primary to-secondary w-full h-full group-hover:rotate-180 group-hover:brightness-75 transition-all duration-700`}
            ></Box>
         </Box>
         <span className="relative z-10">{props.children}</span>
      </Button>
   );
};

export default ButtonLinear;
