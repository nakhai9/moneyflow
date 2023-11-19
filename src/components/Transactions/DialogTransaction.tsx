import { FirestoreCollections, IBase, ITransaction, PaymentMethod, TransactionType } from '@/common/drafts/prisma';
import { Category, ModalType, } from '@/common/enums';
import { firestoreService } from '@/common/services/firestore';
import { toggle } from '@/store/features/backdrop/backdropSlice';
import { RootState } from '@/store/store';
import { Box, ButtonGroup, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, MenuItem, TextField } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import VButton from '../common/VButton';

type TransactionSubmitForm = {
    title: string,
    transactionType: TransactionType,
    category: Category,
    excutedAt: Date | Timestamp,
    paymentMethod: PaymentMethod
    amount: number,
    note?: string | null,
}

type DialogTransactionProps = {
    open: boolean;
    handleOpen?: () => void;
    handleClose?: () => void;
    type?: ModalType;
    walletId?: string;
    transaction?: (ITransaction & IBase)
}

export default function DialogTransaction({ open, type, transaction, walletId, handleClose }: DialogTransactionProps) {

    const dispatch = useDispatch();
    const [fullWidth] = useState(true);
    const [maxWidth] = useState<DialogProps['maxWidth']>('lg');
    const [currentType, setCurrentType] = useState<TransactionType>(TransactionType.DEFAULT);
    const { user } = useSelector((state: RootState) => state.user)

    const [initialForm] = useState<TransactionSubmitForm>({
        title: '',
        amount: 0,
        transactionType: TransactionType.EXPENSE,
        category: Category.NONE,
        excutedAt: new Date("2023-10-23"),
        paymentMethod: PaymentMethod.CASH,
        note: '',
    })

    const { handleSubmit, control, setValue, formState: { errors }, reset } = useForm<TransactionSubmitForm>({
        defaultValues: initialForm,
    })

    const chooseType = (type: TransactionType) => {
        setCurrentType(type);
    }

    const onCreateTransaction = async (data: TransactionSubmitForm) => {
        dispatch(toggle())
        try {
            const newTransaction: ITransaction = {
                title: data.title,
                amount: parseInt(data.amount.toString(), 10),
                excutedAt: Timestamp.now(),
                type: currentType,
                paymentMethod: data.paymentMethod,
                category: data.category,
                note: data.note ?? null,
                walletId: walletId,
                userId: user?.id,
                label: null,
                payee: null
            }
            console.log(newTransaction);
            
            const response = await firestoreService.addDoc(FirestoreCollections.TRANSACTIONS, newTransaction);
        } catch (error) {
            console.log(error);
        } finally {
            reset(initialForm);
            dispatch(toggle())
        }

        handleClose && handleClose();
    }

    const handleCloseDialog = () => {
        handleClose && handleClose();
    }

    const handleSetValues = useCallback(async (transaction: (ITransaction & IBase)) => {
        setValue("title", transaction.title);
        setValue("amount", transaction.amount);
        setValue("category", transaction.category);
        setValue("excutedAt", (transaction.createdAt) as Date);
        setValue("paymentMethod", transaction.paymentMethod);
        setValue("note", transaction.note!);
    }, [setValue]);

    useEffect(() => {
        const openTransactionModal = (type: ModalType, transaction?: (ITransaction & IBase)) => {
            if (!type) return
            if (transaction) {
                const transactionDetail: TransactionSubmitForm = {
                    title: transaction.title,
                    amount: transaction.amount,
                    category: transaction.category,
                    excutedAt: transaction.createdAt as Date,
                    paymentMethod: transaction.paymentMethod,
                    transactionType: transaction.type,
                    note: transaction.note as string,
                }
                setCurrentType(transaction.type);
                handleSetValues(transaction);
            }
        }
        if (type && !transaction) {
            openTransactionModal(type);
        }
        if (type && transaction) {
            openTransactionModal(type, transaction);
        }
    }, [type, transaction, handleSetValues]);


    return (
        <Dialog onClose={handleCloseDialog} open={open} fullWidth={fullWidth} maxWidth={maxWidth} >
            <form onSubmit={handleSubmit(onCreateTransaction)} >
                <DialogTitle>Transaction</DialogTitle>
                <DialogContent >
                    <Box mb={2}>
                        <ButtonGroup size='small' variant="contained" >
                            <VButton type="button" color={currentType === TransactionType.EXPENSE ? "primary" : "inherit"} onClick={() => { chooseType(TransactionType.EXPENSE) }}>{TransactionType.EXPENSE}</VButton>
                            <VButton type="button" color={currentType === TransactionType.INCOME ? "error" : "inherit"} onClick={() => { chooseType(TransactionType.INCOME) }}>{TransactionType.INCOME}</VButton>
                            <VButton type="button" color={currentType === TransactionType.TRANSFER ? "success" : "inherit"} onClick={() => { chooseType(TransactionType.TRANSFER) }}>{TransactionType.TRANSFER}</VButton>
                        </ButtonGroup>
                    </Box>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={2}>
                            <Controller control={control} name="title" rules={{ required: false }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Title"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.title}
                                        helperText={
                                            errors.title && `${errors.title.message}`
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Controller control={control} name="category" rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        size="small"
                                        fullWidth
                                        label="Category"
                                        margin="dense"
                                        error={!!errors.category}
                                        helperText={
                                            errors.category && `${errors.category.message}`
                                        }>
                                        {Object.values(Category).map((category, index) => (
                                            <MenuItem key={index} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Controller control={control} name="excutedAt" rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="datetime-local"
                                        size="small"
                                        fullWidth
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.excutedAt}
                                        helperText={
                                            errors.excutedAt && `${errors.excutedAt.message}`
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Controller control={control} name="note" rules={{ required: false }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description (optional)"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.note}
                                        helperText={
                                            errors.note && `${errors.note.message}`
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Controller control={control} name="amount" rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Amount"
                                        type="number"
                                        size="small"
                                        fullWidth
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.amount}
                                        helperText={
                                            errors.amount && `${errors.amount.message}`
                                        }
                                        
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Controller control={control} name="paymentMethod" rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        size="small"
                                        fullWidth
                                        label="Payment method"
                                        margin="dense"
                                        error={!!errors.paymentMethod}
                                        helperText={
                                            errors.paymentMethod && `${errors.paymentMethod.message}`
                                        }>
                                        {Object.values(PaymentMethod).map((paymentMethod, index) => (
                                            <MenuItem key={index} value={paymentMethod}>
                                                {paymentMethod}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <VButton type="button" onClick={handleCloseDialog} variant="contained" color="inherit">Cancel</VButton>
                    <VButton type="submit" variant="contained" color="primary">Create</VButton>
                </DialogActions>
            </form>
        </Dialog>
    )
}
