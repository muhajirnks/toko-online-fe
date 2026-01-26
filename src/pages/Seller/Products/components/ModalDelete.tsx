import {
   Button,
   Dialog,
   DialogActions,
   DialogContent,
   Typography,
} from "@mui/material";
import { MdDeleteOutline } from "react-icons/md";

interface ModalDeleteProps {
   open: boolean;
   onClose: () => void;
   onDelete: () => void;
   loading?: boolean;
   title?: string;
   content?: string;
}

const ModalDelete = ({
   open,
   onClose,
   onDelete,
   loading,
   title = "Delete Product",
   content = "Are you sure you want to delete this item? This action cannot be undone.",
}: ModalDeleteProps) => {
   return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
         <DialogContent>
            <MdDeleteOutline className="text-center text-red-700 text-7xl mt-5 mx-auto mb-5" />
            <Typography
               variant="h5"
               className="text-center text-text-primary font-bold mb-2"
            >
               {title}
            </Typography>
            <Typography
               variant="body1"
               className="text-text-secondary text-center text-base"
            >
               {content}
            </Typography>
         </DialogContent>
         <DialogActions>
            <Button
               variant="outlined"
               type="button"
               onClick={onClose}
               className="grow basis-0"
            >
               Cancel
            </Button>
            <Button
               variant="contained"
               className="grow basis-0"
               onClick={onDelete}
               loading={loading}
            >
               Delete
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default ModalDelete;
