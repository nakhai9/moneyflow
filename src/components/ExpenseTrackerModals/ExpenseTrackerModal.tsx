import { IBase, ITransaction, ModalType } from "@/common/drafts/prisma";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { useState } from "react";

type ExpenseTrackerModalProps = {
    headline: string;
    type: ModalType,
    config?: any,
    data: any,
    message?: string;
    children?: React.ReactNode
    
    onClose?: () => {},
    onDelete?: () => {}
    onCreate?: () => {}
}

const TransactionModal: React.FC<ExpenseTrackerModalProps> = ({ headline, type, config, message, data, children, onClose}) => {
    const [maxWidth] = useState<DialogProps['maxWidth']>('lg');
    return <>
        <Dialog onClose={onClose} open={true} fullWidth={true} maxWidth={maxWidth} >
            <DialogTitle>{headline}</DialogTitle>
            <DialogContent>
                {children ?? "content"}
            </DialogContent>
            <DialogActions>
                    <Button type="button" onClick={onClose} variant="contained" color="inherit">Cancel</Button>

                    {
                        type === ModalType.ADD ? <Button type="submit" variant="contained" color="primary">Create</Button> :
                            <>
                                <Button type="button" variant="contained" color="error">Delete</Button>
                                <Button type="submit" variant="contained" color="primary">Save</Button>
                            </>
                    }
                </DialogActions>
        </Dialog>
    </>
}

export default TransactionModal;