import { useState, useCallback, useEffect } from 'react'
import { Box, ButtonGroup, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, MenuItem, TextField } from '@mui/material'
import VButton from '../common/VButton'
import { Controller, useForm } from "react-hook-form";
import { ITransaction } from "@/common/interfaces/transaction";
import { Category, ModalType, PaymentMethod, TransactionType } from '@/common/enums';

type TransactionSubmitForm = {
    transactionType: TransactionType,
    category: Category,
    date: Date,
    paymentMethod: PaymentMethod
    amount: number,
    label?: string,
    description?: string,
}

type DialogTransactionProps = {
    open: boolean;
    handleOpen?: () => void;
    handleClose?: () => void;
    type?: ModalType;
    transaction?: ITransaction
}

export default function DialogTransaction({ open, type, transaction, handleClose }: DialogTransactionProps) {

    const [fullWidth] = useState(true);
    const [maxWidth] = useState<DialogProps['maxWidth']>('lg');
    const [currentType, setCurrentType] = useState<TransactionType>(TransactionType.DEFAULT);

    const [initialForm] = useState<TransactionSubmitForm>({
        transactionType: TransactionType.EXPENSE,
        category: Category.NONE,
        date: new Date("2023-10-23"),
        paymentMethod: PaymentMethod.CASH,
        amount: 0,
        description: '',
        label: ''
    })

    const { handleSubmit, control, setValue, formState: { errors } } = useForm<TransactionSubmitForm>({
        defaultValues: initialForm,
    })

    const chooseType = (type: TransactionType) => {
        setCurrentType(type);
    }

    const onCreateTransaction = async (data: TransactionSubmitForm) => {
        console.log(data);
        handleClose && handleClose();
    }

    const handleCloseDialog = () => {
        handleClose && handleClose();
    }

    const handleSetValues = useCallback((transaction: ITransaction) => {
        setValue("amount", transaction.amount);
        setValue("category", transaction.category);
        setValue("date", (transaction.createdAt) as Date);
        setValue("paymentMethod", transaction.paymentMethod);
        setValue("description", transaction.description);
        setValue("label", transaction.label);
    }, [setValue]);

    useEffect(() => {
        const openTransactionModal = (type: ModalType, transaction?: ITransaction) => {
            if (!type) return
            if (transaction) {
                const transactionDetail: TransactionSubmitForm = {
                    amount: transaction.amount,
                    category: transaction.category,
                    date: transaction.createdAt as Date,
                    paymentMethod: transaction.paymentMethod,
                    transactionType: transaction.type,
                    description: transaction.description,
                    label: transaction.label
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
                            <Controller control={control} name="date" rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="datetime-local"
                                        size="small"
                                        fullWidth
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.date}
                                        helperText={
                                            errors.date && `${errors.date.message}`
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Controller control={control} name="description" rules={{ required: false }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description (optional)"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.description}
                                        helperText={
                                            errors.description && `${errors.description.message}`
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
                            <Controller control={control} name="label" rules={{ required: false }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Label (optional)"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.label}
                                        helperText={
                                            errors.label && `${errors.label.message}`
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
