import { Category } from "@/common/enums/category";
import { ModalType } from "@/common/enums/modal-type.enum";
import { PaymentMethod } from "@/common/enums/payment-method";
import { TransactionType, WalletType } from "@/common/enums/transaction-type";
import { ITransaction } from "@/common/interfaces/transaction";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, ButtonGroup, Container, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";

const columns = ['Category', 'Wallet', 'Description', 'Payment method', 'Amount'];

const transactions: ITransaction[] = [
    {
        id: 1,
        category: Category.FOOD_DRINK,
        walletName: "My Wallet",
        description: "Transfer from SaigonBank account",
        paymentMethod: PaymentMethod.TRANSFER,
        type: TransactionType.INCOME,
        amount: 115000,
        createdAt: new Date("2023-10-7")
    },
    {
        id: 2,
        category: Category.FOOD_DRINK,
        walletName: "My Wallet",
        description: "Paid food to cook",
        paymentMethod: PaymentMethod.CASH,
        type: TransactionType.EXPENSE,
        amount: 115000,
        createdAt: new Date("2023-10-7")
    },
    {
        id: 3,
        category: Category.FOOD_DRINK,
        walletName: "My Wallet",
        description: "Highlands",
        paymentMethod: PaymentMethod.CASH,
        amount: 45000,
        type: TransactionType.EXPENSE,
        createdAt: new Date("2023-10-7")
    },
    {
        id: 4,
        category: Category.FOOD_DRINK,
        walletName: "My Wallet",
        description: "Ái Liên",
        paymentMethod: PaymentMethod.CASH,
        amount: 45000,
        type: TransactionType.EXPENSE,
        createdAt: new Date("2023-10-7")
    },
    {
        id: 5,
        category: Category.FUEL,
        walletName: "My Wallet",
        paymentMethod: PaymentMethod.CASH,
        amount: 45000,
        type: TransactionType.EXPENSE,
        createdAt: new Date("2023-10-7")
    },
    {
        id: 6,
        category: Category.OTHER,
        walletName: "My Wallet",
        paymentMethod: PaymentMethod.TRANSFER,
        amount: 1000000,
        type: TransactionType.EXPENSE,
        createdAt: new Date("2023-10-8")
    },
    {
        id: 7,
        category: Category.FOOD_DRINK,
        walletName: "My Wallet",
        paymentMethod: PaymentMethod.CASH,
        amount: 45000,
        type: TransactionType.EXPENSE,
        createdAt: new Date("2023-10-7")
    },
    {
        id: 8,
        category: Category.LOAN,
        walletName: "My Wallet",
        paymentMethod: PaymentMethod.TRANSFER,
        amount: 300000,
        description: "Cho Nhường mượn",
        type: TransactionType.TRANSFER,
        createdAt: new Date("2023-10-9")
    },
    {
        id: 9,
        category: Category.LOAN,
        walletName: "My Wallet",
        paymentMethod: PaymentMethod.TRANSFER,
        amount: 100000,
        description: "Cho Nhường mượn",
        type: TransactionType.TRANSFER,
        createdAt: new Date("2023-10-25")
    }
];

type TransactionSubmitForm = {
    transactionType: TransactionType,
    category: Category,
    date: Date,
    paymentMethod: PaymentMethod
    amount: number,
    label?: string,
    description?: string,
}

const WalletDetailPage: NextPage = () => {
    const router = useRouter();
    // wallet id
    const { id } = router.query;
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('lg');
    const categories = Object.values(Category);
    const [open, setOpen] = useState<boolean>(false);
    const [walletBalance, setWalletBalance] = useState<number>(3000000);
    const [locale, setLocale] = useState<string>('vi-Vi');
    const [currency, setCurrency] = useState<string>('VND');
    const [currentType, setCurrentType] = useState<TransactionType>(TransactionType.DEFAULT);

    const [initialForm, setInitialForm] = useState<TransactionSubmitForm>({
        transactionType: TransactionType.EXPENSE,
        category: Category.NONE,
        date: new Date("2023-10-23"),
        paymentMethod: PaymentMethod.CASH,
        amount: 0,
        description: '',
        label: ''
    })

    const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm<TransactionSubmitForm>({
        defaultValues: initialForm,
    })

    const chooseType = (type: TransactionType) => {
        setCurrentType(type);
    }

    const close = () => {
        setOpen(!open);
    }
    const numberAsCurrency = (locale: string, iso4217code: string) => {
        const option = {
            style: "currency",
            currency: iso4217code
        }
        return Intl.NumberFormat(locale, option);
    }

    const openTransactionModal = (type: ModalType, transaction?: ITransaction) => {
        setOpen(!open);
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
            setValue("amount", transaction.amount);
            setValue("category", transaction.category);
            setValue("date", (transaction.createdAt) as Date);
            setValue("paymentMethod", transaction.paymentMethod);
            setValue("description", transaction.description);
            setValue("label", transaction.label);
        }

    }

    const gettotalPeriodExpenseValue = (): number => {
        let totalPeriodExpense: number = 0;
        transactions
            .filter((item) => {
                return item.type === TransactionType.EXPENSE
            })
            .forEach(item => {
                totalPeriodExpense += item.amount
            })

        return totalPeriodExpense;
    }

    const gettotalPeriodIncomeValue = (): number => {
        let totalPeriodIncome: number = 0;
        transactions
            .filter((item) => {
                return item.type === TransactionType.INCOME
            })
            .forEach(item => {
                totalPeriodIncome += item.amount
            })

        return totalPeriodIncome;
    }

    const onCreateTransaction = async (data: TransactionSubmitForm) => {
        console.log(data);
    }

    return (
        <>
            <Dialog open={open} fullWidth={fullWidth} maxWidth={maxWidth}>
                <form onSubmit={handleSubmit(onCreateTransaction)}>
                    <DialogTitle>Transaction</DialogTitle>
                    <DialogContent>
                        <Box mb={2}>
                            <ButtonGroup variant="contained" >
                                <Button type="button" color={currentType === TransactionType.EXPENSE ? "primary" : "inherit"} onClick={() => { chooseType(TransactionType.EXPENSE) }}>{TransactionType.EXPENSE}</Button>
                                <Button type="button" color={currentType === TransactionType.INCOME ? "error" : "inherit"} onClick={() => { chooseType(TransactionType.INCOME) }}>{TransactionType.INCOME}</Button>
                                <Button type="button" color={currentType === TransactionType.TRANSFER ? "success" : "inherit"} onClick={() => { chooseType(TransactionType.TRANSFER) }}>{TransactionType.TRANSFER}</Button>
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
                        <Button type="button" onClick={close} variant="contained" color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <DefaultLayout>
                <Stack>
                    <Grid container>
                        <Grid container item mb={2}>
                            <Grid container justifyContent="space-between">
                                <Button type="button" size="small" variant="contained" color="primary" sx={{ textTransform: "none" }} startIcon={<AddIcon />} onClick={() => { openTransactionModal(ModalType.ADD) }}>Add transaction</Button>
                                <IconButton aria-label="setting" size="small">
                                    <SettingsIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Grid container item mb={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ width: "100%", padding: 2, cursor: "pointer" }} >
                                        <Typography variant="body2" className="vdt-font-semibold">Current Wallet Balance</Typography>
                                        <div>
                                            <Typography variant="h6" color="primary">{numberAsCurrency(locale, currency).format(walletBalance)}</Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ width: "100%", padding: 2, cursor: "pointer" }} >
                                        <Typography variant="body2" className="vdt-font-semibold">Total Period Change</Typography>
                                        <div>
                                            <Typography variant="h6" color="primary">
                                                {numberAsCurrency(locale, currency).format(gettotalPeriodExpenseValue() + gettotalPeriodIncomeValue())}
                                            </Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ width: "100%", padding: 2, cursor: "pointer" }} >
                                        <Typography variant="body2" className="vdt-font-semibold">Total Period Expenses</Typography>
                                        <div>
                                            <Typography variant="h6" color="primary">{numberAsCurrency(locale, currency).format(gettotalPeriodExpenseValue())}</Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ width: "100%", padding: 2, cursor: "pointer" }} >
                                        <Typography variant="body2" className="vdt-font-semibold">Total Period Income</Typography>
                                        <div>
                                            <Typography variant="h6" color="primary">{numberAsCurrency(locale, currency).format(gettotalPeriodIncomeValue())}</Typography>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item container>
                                <Grid item xs={12} md={12}>
                                    {
                                        transactions && (<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        {
                                                            columns.map((columnHeading: string, index: number) => <TableCell key={index} align={columnHeading === 'Amount' ? 'right' : 'left'} sx={{ 'fontWeight': "bold" }} component="th">{columnHeading}</TableCell>)
                                                        }
                                                        <TableCell className="vdt-w-5">
                                                            <IconButton aria-label="actions" size="small">
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        transactions.map((item, index) => {
                                                            return <TableRow key={index} className="vdt-cursor-pointer hover:vdt-bg-[#F4F6F8]"  >
                                                                <TableCell component="td" className="vdt-border-none">
                                                                    {/* <FastfoodIcon color="primary" /> */}
                                                                    <span className="vdt-ml-2">{item.category}</span>
                                                                </TableCell>
                                                                <TableCell className="vdt-border-none">{item.walletName}</TableCell>
                                                                <TableCell className="vdt-border-none">{item.description ?? "---"}</TableCell>
                                                                <TableCell className="vdt-border-none">{item.paymentMethod}</TableCell>
                                                                <TableCell className="vdt-border-none" align="right"> <span className={`${(item.amount > 0 && item.type === TransactionType.INCOME) ? "vdt-text-blue-500" : "vdt-text-red-500"}  vdt-font-semibold`}>{item.amount.toLocaleString()}</span> </TableCell>
                                                                <TableCell className="vdt-border-none vdt-w-5">
                                                                    <IconButton aria-label="actions" size="small" onClick={() => { openTransactionModal(ModalType.EDIT, item) }}>
                                                                        <MoreVertIcon />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        })
                                                    }
                                                </TableBody>
                                            </Table>
                                        </TableContainer>)
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Stack>
            </DefaultLayout>
        </>
    );
}

export default WalletDetailPage;