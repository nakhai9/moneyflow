import { Category, IBase, ITransaction, IWallet, ModalAction, PaymentMethod, TransactionType } from "@/common/drafts/prisma";
import { accountService } from "@/common/services/firestore";
import { RootState } from "@/store/store";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, MenuItem, TextField } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

type TransactionModalProps = {
    open: boolean;
    type?: ModalAction;

    transaction: (ITransaction & IBase) | null;
    onClose?: () => void;
}

type TransactionSubmitForm = {
    description: string,
    transactionType: TransactionType,
    category: Category,
    excutedAt: Timestamp | string,
    paymentMethod: PaymentMethod
    amount: number,
    paidTo: string,
    walletId: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ open, type, transaction, onClose }) => {
    const router = useRouter();
    const id = router.query.id as string;
    const [title, setTitle] = useState<string>("Transaction");
    const { user } = useSelector((state: RootState) => state.auth);
    const [wallets, setWallets] = useState<(IBase & IWallet)[] | null>(null)
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('lg');
    const [currentType, setCurrentType] = useState<TransactionType>(TransactionType.DEFAULT);
    const [initialForm] = useState<TransactionSubmitForm>({
        amount: 0,
        transactionType: TransactionType.EXPENSE,
        category: Category.NONE,
        excutedAt: "2020-01-13",
        paymentMethod: PaymentMethod.CASH,
        description: '',
        paidTo: '',
        walletId: id
    })

    const { handleSubmit, control, setValue, formState: { errors }, reset } = useForm<TransactionSubmitForm>({
        defaultValues: initialForm,
    })

    const setFormValue = (transaction: ITransaction & IBase) => {

    }

    const chooseType = (type: TransactionType) => {
        setCurrentType(type);
    }

    const onSubmitTransaction = async (data: TransactionSubmitForm) => {
        // TODO: create transactions

        console.log(data);
    }

    const fetchWalletByUserID = useCallback(async () => {
        try {
            const snapshotWallets = await accountService.getAccountsByUserId(user?.id as string);
            setWallets(snapshotWallets);
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleSetTitle = () => {
        switch (type) {
            case ModalAction.ADD:
                setTitle("Add Transaction");
                break;
            case ModalAction.EDIT:
                setTitle("Update Transaction");
                break;
            default:
                setTitle("Transaction");;
                break;
        }
    }

    useEffect(() => {
        handleSetTitle;
        fetchWalletByUserID();

        // init data to form when user click detail 

    }, [fetchWalletByUserID])

    return (<>
        <Dialog open={open} fullWidth={true} maxWidth={maxWidth} onClose={onClose} >
            <form onSubmit={handleSubmit(onSubmitTransaction)}>
                <DialogTitle> {title} </DialogTitle>
                <DialogContent >
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
                                        label="Wallet"
                                        margin="dense"
                                        autoFocus
                                        error={!!errors.walletId}
                                        helperText={
                                            errors.walletId && `${errors.walletId.message}`
                                        }>
                                        {wallets?.map((wallet, index) => (
                                            <MenuItem key={index} value={wallet.id}>
                                                {wallet.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                            {/* <Controller control={control} name="category" rules={{ required: true }}
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
                                        {Object.values(Category).map((category, index) => (
                                            <MenuItem key={index} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            /> */}
                        </Grid>
                        {/* <Grid item xs={12} md={2}>
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
                        </Grid> */}
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
                    </Grid>
                    <Grid item xs={12} md={12}>
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
                </DialogContent>
                <DialogActions>
                    <Button type="button" variant="contained" color="inherit" onClick={onClose}>Cancel</Button>
                    {
                        type === ModalAction.ADD ? <Button type="submit" variant="contained" color="primary">Create</Button> :
                            <>
                                <Button type="button" variant="contained" color="error">Delete</Button>
                                <Button type="submit" variant="contained" color="primary">Save</Button>
                            </>
                    }
                </DialogActions>
            </form>
        </Dialog>
    </>)
}

export default TransactionModal;