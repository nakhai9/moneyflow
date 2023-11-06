import { useState } from 'react';
import { NextPage } from "next";
import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import useToggle from "@/hooks/useToggle";
import DefaultLayout from "@/layouts/DefaultLayout";
import { Category, ModalType, PaymentMethod, TransactionType } from "@/common/enums";
import { ITransaction } from "@/common/interfaces/transaction";
import DialogTransaction from "@/components/Transactions/DialogTransaction";
import { getTotalPeriodExpenseValue, getTotalPeriodIncomeValue, numberAsCurrency } from "@/utils";
import { AddIcon, FileDownloadIcon, MoreVertIcon, SettingsIcon } from "@/components/common/VIcons";
import { VButton } from '@/components/common';

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

const LOCALE = 'vi-Vi';
const CURRENCY = 'VND'
const WALLETBALANCE = 3000000;

const WalletDetailPage: NextPage = () => {

    const [type, setType] = useState<ModalType>();
    const [transaction, setTransaction] = useState<ITransaction>();
    const { open, handleOpen, handleClose } = useToggle();

    const handleAddTransaction = () => {
        handleOpen();
        setType(ModalType.ADD);
    }

    const handleEditTransaction = (transaction: ITransaction) => {
        handleOpen();
        setType(ModalType.EDIT);
        setTransaction(transaction)
    }

    return (
        <DefaultLayout>
            <DialogTransaction transaction={transaction} type={type} open={open} handleClose={handleClose} />
            <Grid container spacing={4}>
                <Grid container item xs={12} justifyContent="space-between">
                    <VButton type="button" size="small" variant="contained" color="primary" className="vdt-normal-case" startIcon={<AddIcon />} onClick={handleAddTransaction}>
                        Add transaction
                    </VButton>
                    <Box>
                        <Tooltip title="Settings">
                            <IconButton aria-label="setting" size="small">
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export to PDF">
                            <IconButton aria-label="setting" size="small">
                                <FileDownloadIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Grid>
                <Grid container item xs={12} spacing={4}>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer">
                            <Typography variant="body2" className="vdt-font-semibold">Current Wallet Balance</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{numberAsCurrency(LOCALE, CURRENCY).format(WALLETBALANCE)}</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer">
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Change</Typography>
                            <div>
                                <Typography variant="h6" color="primary">
                                    {numberAsCurrency(LOCALE, CURRENCY).format(getTotalPeriodExpenseValue(transactions) + getTotalPeriodIncomeValue(transactions))}
                                </Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer" >
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Expenses</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{numberAsCurrency(LOCALE, CURRENCY).format(getTotalPeriodExpenseValue(transactions))}</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer" >
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Income</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{numberAsCurrency(LOCALE, CURRENCY).format(getTotalPeriodIncomeValue(transactions))}</Typography>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
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
                                                    <span className="vdt-ml-2">{item.category}</span>
                                                </TableCell>
                                                <TableCell className="vdt-border-none">{item.walletName}</TableCell>
                                                <TableCell className="vdt-border-none">{item.description ?? "---"}</TableCell>
                                                <TableCell className="vdt-border-none">{item.paymentMethod}</TableCell>
                                                <TableCell className="vdt-border-none" align="right"> <span className={`${(item.amount > 0 && item.type === TransactionType.INCOME) ? "vdt-text-blue-500" : "vdt-text-red-500"}  vdt-font-semibold`}>{item.amount.toLocaleString()}</span> </TableCell>
                                                <TableCell className="vdt-border-none vdt-w-5">
                                                    <IconButton aria-label="actions" size="small"
                                                        onClick={() => { handleEditTransaction(item) }}
                                                    >
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
        </DefaultLayout>
    );
}

export default WalletDetailPage;