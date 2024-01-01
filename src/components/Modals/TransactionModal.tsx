import { Category } from "@/common/enums/categories";
import { ModalAction } from "@/common/enums/modal";
import { PaymentMethod, TransactionType } from "@/common/enums/transaction";
import { IAccount } from "@/common/interfaces/account";
import { IBase } from "@/common/interfaces/base";
import { ITransaction } from "@/common/interfaces/transaction";
import { accountService, transactionService } from "@/common/services/firestore";
import { formatTimestampToDateString } from "@/common/utils/date";
import { toggleFormSubmited } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, MenuItem, TextField } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';

type TransactionModalProps = {
    open: boolean;
    action?: ModalAction;
    transaction: (ITransaction & IBase) | null;

    onClose?: () => void;
}

type TransactionSubmitForm = {
    description: string,
    transactionType: TransactionType,
    category: Category | "none",
    excutedAt: Timestamp | string,
    paymentMethod: PaymentMethod
    amount: number,
    paidTo: string,
    walletId: string;
    isPaid: boolean;
}

const validationSchema = yup.object().shape({
    description: yup.string().required("Field is required"),
    transactionType: yup.mixed<TransactionType>().oneOf(Object.values(TransactionType), "Invalid type").required("Type is required"),
    category: yup.mixed<Category | "none">().notOneOf(["none"], "Invalid category").required("Category is required"),
    excutedAt: yup.string().required("Field is required"),
    paymentMethod: yup.mixed<PaymentMethod>().oneOf(Object.values(PaymentMethod), "Invalid type").required("Payment method is required"),
    amount: yup.number().positive('Amount must be a positive number').required('Amount is required'),
    paidTo: yup.string().nullable(),
    walletId: yup.string().required("Field is required"),
    isPaid: yup.boolean().test("isPaid", "Required", (value) => {
        return value;
    })
})

const TransactionModal: React.FC<TransactionModalProps> = ({ open, action, transaction, onClose }) => {
    const router = useRouter();
    const id = router.query.id as string;
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { formSubmited } = useSelector((state: RootState) => state.global);
    const [wallets, setWallets] = useState<(IBase & IAccount)[]>()
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('lg');
    const [currentType, setCurrentType] = useState<TransactionType>(TransactionType.DEFAULT);
    const [initialForm] = useState<TransactionSubmitForm>({
        amount: 0,
        transactionType: TransactionType.EXPENSE,
        category: "none",
        excutedAt: "2020-01-13",
        paymentMethod: PaymentMethod.CASH,
        description: '',
        paidTo: '',
        walletId: id ? id : "none",
        isPaid: false
    })

    const { handleSubmit, control, setValue, formState: { errors }, reset } = useForm<TransactionSubmitForm>({
        defaultValues: initialForm,
        // resolver: yupResolver(validationSchema)
    })

    const chooseType = (type: TransactionType) => {
        setCurrentType(type);
    }

    const onSubmitTransaction = async (data: TransactionSubmitForm) => {
        try {
            const newTransaction: ITransaction = {
                type: currentType,
                category: data.category as Category,
                description: data.description,
                excutedAt: Timestamp.fromDate(new Date(data.excutedAt as string)),
                amount: parseInt(data.amount.toString(), 10),
                paymentMethod: data.paymentMethod,
                walletId: data.walletId,
                userId: user?.id,
                payee: data.paidTo ?? null,
                isPaid: data.category === Category.LOAN || data.category === Category.DEBT ? false : true
            }
            if (action === ModalAction.ADD) {
                let id: string = '';
                let newAmount: number = 0;
                const wallet = wallets?.find(x => data.walletId === x.id);
                if (wallet) {
                    id = wallet?.id as string;
                    const walletAmount = wallet.amount;
                    const transactionAmount = parseInt(data.amount.toString(), 10)
                    newAmount = currentType === TransactionType.EXPENSE ? walletAmount - transactionAmount : walletAmount + transactionAmount;
                }
                await Promise.all([
                    transactionService.addNewTransaction(newTransaction),
                    accountService.updateAccount(id, { amount: newAmount })
                ]);
            } else {
                const transactionId = transaction?.id as string;
                // const response = await transactionService.updateTransaction(transactionId, newTransaction);
                console.log(newTransaction);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setCurrentType(TransactionType.DEFAULT);
            reset(initialForm);
            dispatch(toggleFormSubmited(true));
        }
        if (onClose) {
            onClose();
        }
    }

    const onCancel = () => {
        reset();
        if (onClose) {
            onClose();
        }
    }

    const fetchWalletByUserID = useCallback(async () => {
        try {
            const snapshotWallets = await accountService.getAccountsByUserId(user?.id as string);
            if (snapshotWallets) {
                setWallets(snapshotWallets);
            }
        } catch (error) {
            console.log(error);
        }
    }, [user?.id, formSubmited])

    const deleteTransaction = async (transaction: (ITransaction & IBase)) => {
        try {
            if (transaction) {
                const id = transaction.id as string;
                const wallet = wallets?.find(x => transaction.walletId === x.id);
                if (wallet) {
                    const id = wallet?.id as string;
                    const walletAmount = wallet.amount;
                    const transactionAmount = transaction.amount;
                    // await Promise.all([
                    //     transactionService.deleteTransaction(id),
                    //     accountService.updateAccount(id, { amount: transaction.type === TransactionType.EXPENSE ? walletAmount + transactionAmount : walletAmount - transactionAmount })
                    // ]);
                }
            }
        } catch (error) {
            console.log(error);
        }
        dispatch(toggleFormSubmited(true));
        onCancel();
    }

    const updateFormValues = useCallback(async (transaction: ITransaction) => {
        if (transaction) {
            setValue("description", transaction.description);
            setValue("amount", transaction.amount);
            setValue("category", transaction.category);
            setValue("excutedAt", formatTimestampToDateString(transaction.excutedAt as Timestamp));
            setValue("paymentMethod", transaction.paymentMethod);
            setValue("walletId", transaction.walletId as string);
            setValue("paidTo", transaction.payee as string);
            setValue("isPaid", transaction.isPaid);
        }
    }, [setValue])

    useEffect(() => {
        fetchWalletByUserID();
        if (transaction) {
            updateFormValues(transaction);
        }
    }, [transaction, updateFormValues, fetchWalletByUserID])

    return (<>
        <Dialog open={open} fullWidth={true} maxWidth={maxWidth} onClose={onCancel} >
            <form onSubmit={handleSubmit(onSubmitTransaction)}>
                <DialogTitle> <span className="tw-capitalize">{action} transaction</span>  </DialogTitle>
                <DialogContent>
                    <Box mb={2}>
                        <ButtonGroup size='small' variant="contained" >
                            <Button type="button" color={currentType === TransactionType.EXPENSE ? "warning" : "inherit"} onClick={() => { chooseType(TransactionType.EXPENSE) }}>{TransactionType.EXPENSE}</Button>
                            <Button type="button" color={currentType === TransactionType.INCOME ? "info" : "inherit"} onClick={() => { chooseType(TransactionType.INCOME) }}>{TransactionType.INCOME}</Button>
                            {/* <VButton type="button" color={currentType === TransactionType.TRANSFER ? "success" : "inherit"} onClick={() => { chooseType(TransactionType.TRANSFER) }}>{TransactionType.TRANSFER}</VButton> */}
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
                                        autoFocus
                                        error={!!errors.category}
                                        helperText={
                                            errors.category && `${errors.category.message}`
                                        }>
                                        <MenuItem key={0} value={"none"}> None </MenuItem>
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
                            <Controller control={control} name="walletId"
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        size="small"
                                        fullWidth
                                        label="Account"
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.walletId}
                                        helperText={
                                            errors.walletId && `${errors.walletId.message}`
                                        }
                                        disabled={id ? true : false}
                                    >
                                        <MenuItem key={0} value="none">
                                            None
                                        </MenuItem>
                                        {wallets?.map((wallet, index) => (
                                            <MenuItem key={index} value={wallet.id}>
                                                {wallet.name}
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
                                        label="Excuted at"
                                        type="date"
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
                        <Grid item xs={12} md={2}>
                            <Controller control={control} name="paidTo" rules={{ required: false }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Paid to (Optional)"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        margin="dense"
                                        error={!!errors.paidTo}
                                        helperText={
                                            errors.paidTo && `${errors.paidTo.message}`
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={10} md={10}>
                            <Controller control={control} name="description" rules={{ required: false }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
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
                        <Grid item xs={2} md={2}>
                            <TextField
                                select
                                size="small"
                                fullWidth
                                label="Status"
                                margin="dense"
                                error={!!errors.paymentMethod}
                                helperText={
                                    errors.paymentMethod && `${errors.paymentMethod.message}`
                                }
                                disabled={true}
                            >
                                {[false, true].map((isPaidStatus, index) => (
                                    <MenuItem key={index} value={`${isPaidStatus}`}>
                                        {isPaidStatus ? "Paid" : "Not paid"}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>


                </DialogContent>
                <DialogActions>
                    <Button type="button" variant="contained" color="inherit" onClick={onCancel}>Cancel</Button>
                    {
                        action === ModalAction.ADD ? <Button type="submit" variant="contained" color="primary">Create</Button> :
                            <>
                                <Button type="button" variant="contained" color="error" onClick={() => { transaction && deleteTransaction(transaction) }}>Delete</Button>
                                <Button type="submit" variant="contained" color="primary">Save</Button>
                            </>
                    }
                </DialogActions>
            </form>
        </Dialog>
    </>)
}

export default TransactionModal;