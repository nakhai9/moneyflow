import { FirestoreCollections, IBase, ITransaction, IWallet } from "@/common/drafts/prisma";
import { ModalType, TransactionType } from "@/common/enums";
import { firestoreService } from '@/common/services/firestore';
import DialogTransaction from "@/components/Transactions/DialogTransaction";
import { AddIcon, FileDownloadIcon, MoreVertIcon, SettingsIcon } from "@/components/common/VIcons";
import useToggle from "@/hooks/useToggle";
import DefaultLayout from "@/layouts/DefaultLayout";
import { setLoadData, toggle } from '@/store/features/backdrop/backdropSlice';
import { getTotalPeriodExpenseValue, getTotalPeriodIncomeValue } from "@/utils";
import { Box, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { RootState } from "@/store/store";
import { Timestamp } from "firebase/firestore";
import { FormatDate, formatTimestampToDateString } from "@/common/utils/date";
import { format } from 'date-fns';

const WalletDetailPage: NextPage = () => {

    const router = useRouter();
    const disptach = useDispatch();

    const id = router.query.id as string;

    const [columns] = useState<string[]>(['Category', 'Description', 'Payment method', 'Excuted Date', 'Amount']);

    const [type, setType] = useState<ModalType>();
    const [transaction, setTransaction] = useState<ITransaction & IBase>();
    const { open, handleOpen, handleClose } = useToggle();

    const [transactions, setTransactions] = useState<(ITransaction & IBase)[]>([]);
    const [currentWallet, setCurrentWallet] = useState<(IWallet & IBase) | null>(null);

    const { loadData } = useSelector((state: RootState) => state.backdrop);

    const handleAddTransaction = () => {
        handleOpen();
        setType(ModalType.ADD);
    }

    const handleEditTransaction = (transaction: ITransaction & IBase) => {
        handleOpen();
        setType(ModalType.EDIT);
        setTransaction(transaction)
    }

    const fetch = useCallback(async () => {
        const snapshotTransactions = await firestoreService.getDocs(FirestoreCollections.TRANSACTIONS);
        const wallet = await firestoreService.getDocById<IWallet>(FirestoreCollections.WALLETS, id as string);
        if (wallet) {
            setCurrentWallet(wallet);
            const transactionsByWalletId = snapshotTransactions.filter((transaction: (ITransaction & IBase)) => transaction.walletId === id);
            setTransactions(transactionsByWalletId);
        }
        disptach(setLoadData(false));
    }, [id, disptach, loadData])

    const deleteWalletById = async (wallet: (IWallet & IBase) | null) => {
        disptach(toggle());
        try {
            if (wallet && wallet.id) {
                await firestoreService.deleteDoc(FirestoreCollections.WALLETS, wallet.id);
            }
        } catch (error) {
            console.log(error);
        } finally {
            disptach(toggle());
            router.push("/");
        }
    }

    useEffect(() => {
        fetch()
    }, [fetch])

    return (
        <DefaultLayout>
            <DialogTransaction transaction={transaction} walletId={id} type={type} open={open} handleClose={handleClose} />
            <Grid container spacing={4}>
                <Grid container item xs={12} justifyContent="space-between">
                    <Button type="button" size="small" variant="contained" color="primary" className="vdt-normal-case" startIcon={<AddIcon />} onClick={handleAddTransaction}>
                        Add transaction
                    </Button>

                </Grid>
                <Grid container item xs={12}>
                    <Typography variant="h6" sx={{ flex: 1 }}>{currentWallet?.name}</Typography>
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
                        <Tooltip title="Delete wallet" onClick={() => { deleteWalletById(currentWallet) }}>
                            <IconButton aria-label="setting" size="small">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Grid>
                <Grid container item xs={12} spacing={4}>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer">
                            <Typography variant="body2" className="vdt-font-semibold">Current Wallet Balance</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{(currentWallet?.amount! - (getTotalPeriodExpenseValue(transactions) + getTotalPeriodIncomeValue(transactions))).toLocaleString('en-US')}</Typography>
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
                                                <TableCell component="td" className="vdt-border-none">{item.category}</TableCell>
                                                <TableCell className="vdt-border-none">{item.description}</TableCell>
                                                <TableCell className="vdt-border-none">{item.paymentMethod}</TableCell>
                                                <TableCell className="vdt-border-none">
                                                    {formatTimestampToDateString(item.excutedAt as Timestamp, FormatDate.DDMMYYYY)}
                                                </TableCell>
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