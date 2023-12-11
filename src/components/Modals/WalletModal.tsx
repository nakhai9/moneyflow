import { IBase, ICurrency, IOption, IWallet, WalletType } from "@/common/drafts/prisma";
import { accountService } from "@/common/services/firestore";
import { toggleBackdrop, toggleFormSubmited } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, MenuItem, TextField } from "@mui/material";
import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';

type WalletModalProp = {
    open: boolean;

    onCloseModal: () => void
}

type WalletSubmitForm = {
    name: string;
    type: WalletType,
    currencyId: string;
    amount: number;
    note?: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required("Wallet name is required"),
    type: yup.mixed<WalletType>().oneOf(Object.values(WalletType), 'Invalid wallet type').required('Type is required'),
    amount: yup.number().positive('Amount must be a positive number').required('Amount is required'),
    currencyId: yup.string().required('Currency is required').notOneOf(['none'], 'Currency must not be "None"'),
    note: yup.string(),
})

const initialForm: WalletSubmitForm = {
    name: '',
    type: WalletType.CASH,
    amount: 0,
    currencyId: 'none',
    note: ''
}

const WalletModal: FC<WalletModalProp> = ({ open, onCloseModal }) => {
    
    const dispatch = useDispatch();
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xs');

    const { user } = useSelector((state: RootState) => state.auth);
    const { currencyOptions } = useSelector((state: RootState) => state.global);

    const { handleSubmit, control, formState: { errors }, reset } = useForm<WalletSubmitForm>({
        defaultValues: initialForm,
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = async (data: WalletSubmitForm) => {
        try {
            onCloseModal();
            const wallet: IWallet = {
                amount: data.amount,
                name: data.name,
                type: data.type,
                currencyId: data.currencyId,
                note: data.note ?? null,
                userId: user?.id,
                isClose: false
            }
            await accountService.addNewAccount(wallet);
            reset();
            dispatch(toggleFormSubmited(true));
        } catch (error) {
            console.log(error);
        } 
    };

    return <Dialog open={open} fullWidth={true} maxWidth={maxWidth} onClose={onCloseModal}>
        <form onSubmit={handleSubmit(onSubmit)} >
            <DialogTitle>Create wallet</DialogTitle>
            <DialogContent>
                <Controller control={control} name="name" rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            size="small"
                            fullWidth
                            label="Wallet name"
                            margin="dense"
                            autoFocus
                            error={!!errors.name}
                            helperText={
                                errors.name && `${errors.name.message}`
                            } />
                    )}
                />
                <Controller control={control} name="type" rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            size="small"
                            fullWidth
                            label="Type"
                            margin="dense"
                            error={!!errors.type}
                            helperText={
                                errors.type && `${errors.type.message}`
                            }>
                            {Object.values(WalletType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Controller control={control} name="amount" rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                size="small"
                                fullWidth
                                label="Amount"
                                margin="dense"
                                error={!!errors.amount}
                                helperText={
                                    errors.amount && `${errors.amount.message}`
                                } />
                        )}
                    />
                    <Controller control={control} name="currencyId" rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                sx={{ minWidth: 100 }}
                                {...field}
                                select
                                size="small"
                                label="Currency"
                                margin="dense"
                                error={!!errors.currencyId}
                                helperText={
                                    errors.currencyId && `${errors.currencyId.message}`
                                }>
                                <MenuItem key="none" value="none">
                                    None
                                </MenuItem>
                                {
                                    currencyOptions?.map((option: IOption) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.prop.toUpperCase()}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        )}
                    />
                </Box>
                <Controller control={control} name="note" rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            size="small"
                            fullWidth
                            label="Note"
                            margin="dense"
                            error={!!errors.note}
                            helperText={
                                errors.note && `${errors.note.message}`
                            } />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={onCloseModal} variant="contained" color="inherit">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Create</Button>
            </DialogActions>
        </form>
    </Dialog>
}

export default WalletModal;