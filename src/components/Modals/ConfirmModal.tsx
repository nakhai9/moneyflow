import { RootState } from "@/store/store";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type ConfirmModalProp = {
    open: boolean,
    title: string;
    message: string;
    type: "primary" | "delete"

    onClose?: () => void,
    onConfirm?: () => void,
}
const ConfirmModal: FC<ConfirmModalProp> = ({ open, title, message, type, onClose }) => {

    const dispatch = useDispatch();
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xs');

    const { user } = useSelector((state: RootState) => state.auth);

    return <Dialog open={open} fullWidth={true} maxWidth={maxWidth} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            type === "delete" && <Button color="error" variant="contained">Delete</Button>
          }
          <Button color="inherit" variant="contained" onClick={onClose}>Cancel</Button>
        </DialogActions>
    </Dialog>
}

export default ConfirmModal;