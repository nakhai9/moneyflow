import { FirestoreCollections, IBase, ICurrency, ITransaction, IWallet, ModalAction, TransactionType } from "@/common/drafts/prisma";
import { accountService, firestoreService } from '@/common/services/firestore';
import { FormatDate, formatTimestampToDateString } from "@/common/utils/date";
import { ConfirmModal, TransactionModal } from "@/components";
import { Modal } from "@/components/Modals/modal";
import DialogTransaction from "@/components/Transactions/DialogTransaction";
import { AddIcon, FileDownloadIcon, SettingsIcon } from "@/components/common/VIcons";
import useModal from "@/hooks/useModal";
import useToggle from "@/hooks/useToggle";
import DefaultLayout from "@/layouts/DefaultLayout";
import { togglePageLoading } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { getTotalPeriodExpenseValue, getTotalPeriodIncomeValue } from "@/utils";
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Grid, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const WalletDetailPage: NextPage = () => {

    const router = useRouter();
    const disptach = useDispatch();

    const id = router.query.id as string;

    const [columns] = useState<string[]>(['Nr', 'Category', 'Description', 'Payment method', 'Excuted Date', 'Amount']);

    const [type, setType] = useState<ModalAction>();
    const [transaction, setTransaction] = useState<ITransaction & IBase>();
    // const { open, handleOpen, handleClose } = useToggle();
    const { open, onOpen, onClose } = useModal();
    const [modal, setModal] = useState<Modal | null>(null);

    const [transactions, setTransactions] = useState<(ITransaction & IBase)[] | null>(null);
    const [currentWallet, setCurrentWallet] = useState<(IWallet & IBase) | null>(null);
    const [currency, setCurrency] = useState<string>('');

    const { pageLoading: isOpenBackdrop } = useSelector((state: RootState) => state.global);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const openAddTransactionModal = () => {
        onOpen();
        // handleOpen();
        setModal(Modal.TRANSACTION);
        setType(ModalAction.ADD);
    }

    const handleEditTransaction = (transaction: ITransaction & IBase) => {
        // handleOpen();
        // setType(ModalType.EDIT);
        // setTransaction(transaction)
    }

    const fetch = useCallback(async () => {
        setIsLoading(true);
        const snapshotTransactions = await firestoreService.getDocs(FirestoreCollections.TRANSACTIONS);
        const wallet = await firestoreService.getDocById<IWallet>(FirestoreCollections.WALLETS, id as string);
        const currency = await firestoreService.getDocById<ICurrency & IBase>(FirestoreCollections.CURRENCIES, wallet?.currencyId as string);
        if (wallet) {
            setCurrentWallet(wallet);
            setCurrency(currency?.code as string);
            const transactionsByWalletId = snapshotTransactions.filter((transaction: (ITransaction & IBase)) => transaction.walletId === id);
            if (transactionsByWalletId.length > 0) {
                setTransactions(transactionsByWalletId);
            }

        }
        setIsLoading(false);

    }, [id, disptach, isOpenBackdrop])

    const deleteWalletById = async (wallet: (IWallet & IBase) | null) => {
        disptach(togglePageLoading(true));
        try {
            if (wallet && wallet.id) {
                await accountService.deleteAccountById(wallet.id);
            }
        } catch (error) {
            console.log(error);
        } finally {
            disptach(togglePageLoading(false));
            router.push("/");
        }
    }

    const openConfirmModal = () => {
        onOpen();
        setModal(Modal.CONFIRM);
    }

    const closeConfirmModal = () => {
        deleteWalletById(currentWallet);
        onClose();
    }

    useEffect(() => {
        fetch();
    }, [fetch, disptach])

    return (
        <DefaultLayout>
            {/* <DialogTransaction transaction={transaction} walletId={id} type={type} open={open} handleClose={handleClose} /> */}
            <TransactionModal open={open && modal === Modal.TRANSACTION} type={type} onClose={onClose} transaction={null} />
            <ConfirmModal
                title="Do you want to delete wallet?"
                message="You won't be able to restore your data after deleting this account."
                type="delete"
                open={open && modal === Modal.CONFIRM}
                onClose={onClose}
            />

            <Grid container spacing={4}>
                <Grid container item xs={12} justifyContent="space-between">
                    <Button type="button" size="small" variant="contained" color="primary" className="vdt-normal-case" startIcon={<AddIcon />} onClick={openAddTransactionModal}>
                        Add transaction
                    </Button>
                </Grid>
                <Grid container item xs={12}>
                    <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>{currentWallet?.name}</Typography>
                    <Box>
                        <Tooltip title="Settings">
                            <Link href={`${id}/settings`}>
                                <IconButton aria-label="setting" size="small">
                                    <SettingsIcon />
                                </IconButton>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Export to PDF">
                            <IconButton aria-label="setting" size="small">
                                <FileDownloadIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete wallet" onClick={openConfirmModal}>
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
                            <Typography variant="h6" color="primary">
                                {transactions && (currentWallet?.amount as number + (getTotalPeriodIncomeValue(transactions) - getTotalPeriodExpenseValue(transactions))).toLocaleString('en-US')} <span className="vdt-uppercase">{currency}</span>
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer">
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Change</Typography>
                            <div>
                                <Typography variant="h6" color="primary">
                                    {transactions && (getTotalPeriodIncomeValue(transactions) - getTotalPeriodExpenseValue(transactions)).toLocaleString('en-US')} <span className="vdt-uppercase">{currency}</span>
                                </Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer" >
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Expenses</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{transactions && getTotalPeriodExpenseValue(transactions).toLocaleString('en-US')} <span className="vdt-uppercase">{currency}</span></Typography>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <Paper className="vdt-p-4 vdt-cursor-pointer" >
                            <Typography variant="body2" className="vdt-font-semibold">Total Period Income</Typography>
                            <div>
                                <Typography variant="h6" color="primary">{transactions && getTotalPeriodIncomeValue(transactions).toLocaleString('en-US')} <span className="vdt-uppercase">{currency}</span></Typography>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {
                                        columns.map((columnHeading: string, index: number) => <TableCell key={index} align={columnHeading === 'Amount' ? 'right' : 'left'} sx={{ 'fontWeight': "bold" }} component="th">{columnHeading}</TableCell>)
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    (isLoading) && <TableRow className="vdt-cursor-pointer hover:vdt-bg-[#F4F6F8]">
                                        <TableCell colSpan={columns.length} align="center">
                                            <LinearProgress />
                                        </TableCell>
                                    </TableRow>
                                }
                                {
                                    (!isLoading && !transactions?.length) && <TableRow className="vdt-cursor-pointer hover:vdt-bg-[#F4F6F8]">
                                        <TableCell colSpan={columns.length} align="center">
                                            No data
                                        </TableCell>
                                    </TableRow>
                                }
                                {
                                    transactions?.map((item, index) => {
                                        return <TableRow key={index} className="vdt-cursor-pointer hover:vdt-bg-[#F4F6F8]"
                                            onDoubleClick={() => { handleEditTransaction(item) }}
                                        // onTouchStart={() => { handleEditTransaction(item) }} onTouchEnd={(e) => e.preventDefault()}
                                        >
                                            <TableCell component="td" className="vdt-border-none">{index + 1}</TableCell>
                                            <TableCell component="td" className="vdt-border-none">{item.category}</TableCell>
                                            <TableCell component="td" className="vdt-border-none">{item.description}</TableCell>
                                            <TableCell component="td" className="vdt-border-none">{item.paymentMethod}</TableCell>
                                            <TableCell component="td" className="vdt-border-none">
                                                {formatTimestampToDateString(item.excutedAt as Timestamp, FormatDate.DDMMYYYY)}
                                            </TableCell>
                                            <TableCell className="vdt-border-none" align="right">
                                                <div className="vdt-flex vdt-justify-end vdt-gap-2 vdt-items-center">
                                                    <span className={`${(item.amount > 0 && item.type === TransactionType.INCOME) ? "vdt-text-blue-500" : "vdt-text-red-500"}  vdt-font-semibold`}>{item.amount.toLocaleString()}</span>
                                                    {
                                                        !item.isPaid && <Tooltip title="Not paid">
                                                            <ErrorOutlineIcon color="error" fontSize="small" />
                                                        </Tooltip>
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                    })
                                }

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </DefaultLayout>
    );
}

export default WalletDetailPage;