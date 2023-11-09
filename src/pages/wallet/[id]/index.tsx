import { useCallback, useEffect, useState } from 'react';
import { NextPage } from "next";
import { Box, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import useToggle from "@/hooks/useToggle";
import DefaultLayout from "@/layouts/DefaultLayout";
import { Category, FirestoreCollection, ModalType, PaymentMethod, TransactionType } from "@/common/enums";
import { ITransaction } from "@/common/interfaces/transaction";
import DialogTransaction from "@/components/Transactions/DialogTransaction";
import { getTotalPeriodExpenseValue, getTotalPeriodIncomeValue, numberAsCurrency } from "@/utils";
import { AddIcon, FileDownloadIcon, MoreVertIcon, SettingsIcon } from "@/components/common/VIcons";
import { VButton } from '@/components/common';
import { IBase } from '@/common/interfaces/base';
import { useRouter } from 'next/router';
import { firestoreService } from '@/common/services/firestore';
import { IWallet } from '@/common/interfaces/wallet';
import { useDispatch } from 'react-redux';
import { toggle } from '@/store/features/backdrop/backdropSlice';
import WalletIcon from '@mui/icons-material/Wallet';

const WalletDetailPage: NextPage = () => {

    const router = useRouter();
    const disptach = useDispatch();

    const { id } = router.query;

    const [columns] = useState<string[]>(['Category', 'Name', 'Description', 'Payment method', 'Amount']);

    const [type, setType] = useState<ModalType>();
    const [transaction, setTransaction] = useState<ITransaction>();
    const { open, handleOpen, handleClose } = useToggle();

    const [transactions, setTransactions] = useState<(ITransaction & IBase)[]>([]);
    const [currentWallet, setCurrentWallet] = useState<(IWallet & IBase) | null>(null);

    const handleAddTransaction = () => {
        handleOpen();
        setType(ModalType.ADD);
    }

    const handleEditTransaction = (transaction: ITransaction) => {
        handleOpen();
        setType(ModalType.EDIT);
        setTransaction(transaction)
    }

    const fetch = useCallback(async () => {
        disptach(toggle());
        const snapshotTransactions = await firestoreService.getDocs(FirestoreCollection.TRANSACTIONS);
        const wallet = await firestoreService.getDocById<IWallet>(FirestoreCollection.WALLETS, id as string);
        if (wallet) {
            console.log(wallet);

            setCurrentWallet(wallet);
        }
        const transactionsByWalletId = snapshotTransactions.filter((transaction: (ITransaction & IBase)) => transaction.walletId === id);

        setTransactions(transactionsByWalletId);
        disptach(toggle())
    }, [id])

    useEffect(() => {
        fetch()
    }, [fetch])

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
                <Grid container item xs={12}>
                    <Typography variant="h6">{currentWallet?.name}</Typography>
                </Grid>
                <Grid container item xs={12} spacing={4}>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer">
                            <Typography variant="body2" className="vdt-font-semibold">Current Wallet Balance</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{currentWallet?.amount.toLocaleString('en-US')}</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer">
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Change</Typography>
                            <div>
                                <Typography variant="h6" color="primary">
                                    {(getTotalPeriodExpenseValue(transactions) + getTotalPeriodIncomeValue(transactions)).toLocaleString('en-US')}
                                </Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer" >
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Expenses</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{getTotalPeriodExpenseValue(transactions).toLocaleString('en-US')}</Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer" >
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Income</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{getTotalPeriodIncomeValue(transactions).toLocaleString('en-US')}</Typography>
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
                                                <TableCell className="vdt-border-none">{item.name}</TableCell>
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