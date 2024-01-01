"use client";

import { AddIcon, DeleteIcon, ErrorOutlineIcon, FileDownloadIcon, SettingsIcon } from "@/common/constants/icons";
import { ModalAction } from "@/common/enums/modal";
import { TransactionType } from "@/common/enums/transaction";
import { IAccount } from "@/common/interfaces/account";
import { IBase } from "@/common/interfaces/base";
import { ITransaction } from "@/common/interfaces/transaction";
import { accountService, currencyService, transactionService } from "@/common/services/firestore";
import { FormatDate, formatTimestampToDateString } from "@/common/utils/date";
import { ConfirmModal, TransactionModal } from "@/components";
import { Modal } from "@/components/Modals/modal";
import useModal from "@/hooks/useModal";
import { toggleFormSubmited, togglePageLoading } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { getTotalPeriodExpenseValue, getTotalPeriodIncomeValue } from "@/utils";
import { Box, Button, Grid, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type WalletDetailContainerProps = {}
const WalletDetailContainer: FC<WalletDetailContainerProps> = ({ }) => {

    const router = useRouter();
    const dispatch = useDispatch();

    const id = router.query.id as string;

    const [columns] = useState<string[]>(['Nr', 'Category', 'Description', 'Payment method', 'Excuted Date', 'Amount']);
    const [modalAction, setType] = useState<ModalAction>();
    const [transaction, setTransaction] = useState<(ITransaction & IBase) | null>(null);
    const { open, onOpen, onClose } = useModal();
    const [modal, setModal] = useState<Modal | null>(null);
    const [transactions, setTransactions] = useState<(ITransaction & IBase)[] | null>(null);
    const [currentWallet, setCurrentWallet] = useState<(IAccount & IBase) | null>(null);
    const [currency, setCurrency] = useState<string>('');
    const { formSubmited } = useSelector((state: RootState) => state.global);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [totalPeriodExpense, setTotalPeriodExpense] = useState<number>(0);
    const [totalPeriodIncome, setTotalPeriodIncome] = useState<number>(0);
    const [totalPeriodChange, setTotalPeriodChange] = useState<number>(0);
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const openAddTransactionModal = () => {
        onOpen();
        setModal(Modal.TRANSACTION);
        setType(ModalAction.ADD);
    }

    const openEditTransactionModal = (transaction: ITransaction & IBase) => {
        onOpen();
        setTransaction(transaction);
        setModal(Modal.TRANSACTION);
        setType(ModalAction.EDIT);
    }

    const fetch = useCallback(async () => {
        setIsLoading(true);
        if (formSubmited) {
            dispatch(toggleFormSubmited(false));
        }
        const snapshotWallet = await accountService.getAccountById(id as string);
        if (snapshotWallet) {
            setCurrentWallet(snapshotWallet);
            setCurrentBalance(snapshotWallet.amount);
            const [snapshotCurrency, snapshotTransactions] = await Promise.all([
                currencyService.convertCurrency(snapshotWallet.currencyId as string),
                transactionService.getTransactions(undefined, id, undefined)
            ])
            snapshotCurrency && setCurrency(snapshotCurrency);
            setTransactions(snapshotTransactions);

            setTotalPeriodIncome(getTotalPeriodIncomeValue(snapshotTransactions));
            setTotalPeriodExpense(getTotalPeriodExpenseValue(snapshotTransactions));
        }
        setIsLoading(false);

    }, [id, formSubmited])

    const deleteWalletById = async (wallet: (IAccount & IBase) | null) => {
        dispatch(togglePageLoading(true));
        try {
            if (wallet && wallet.id) {
                await accountService.deleteAccountById(wallet.id);
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(togglePageLoading(false));
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
    }, [fetch])

    return <>
        <TransactionModal open={open && modal === Modal.TRANSACTION} action={modalAction} onClose={onClose} transaction={transaction} />
        <ConfirmModal
            title="Do you want to delete wallet?"
            message="You won't be able to restore your data after deleting this account."
            type="delete"
            open={open && modal === Modal.CONFIRM}
            onClose={onClose}
        />

        <Grid container spacing={4}>
            <Grid container item xs={12} justifyContent="space-between">
                <Button type="button" size="small" variant="contained" color="primary" className="tw-normal-case" startIcon={<AddIcon />} onClick={openAddTransactionModal}>
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
                    <Paper className="tw-p-4 tw-cursor-pointer">
                        <Typography variant="body2" className="tw-font-semibold">Current Wallet Balance</Typography>
                        <Typography variant="h6" color="primary">
                            {currentBalance ? currentBalance.toLocaleString('en-US') : "0"}<span className="tw-uppercase">.00 {currency}</span>
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Paper className="tw-p-4 tw-cursor-pointer">
                        <Typography variant="body2" className="tw-font-semibold">Total Period Change</Typography>
                        <div>
                            <Typography variant="h6" color="primary">
                                {(totalPeriodIncome - totalPeriodExpense).toLocaleString('en-US')}<span className="tw-uppercase">.00 {currency}</span>
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Paper className="tw-p-4 tw-cursor-pointer" >
                        <Typography variant="body2" className="tw-font-semibold">Total Period Expenses</Typography>
                        <div>
                            <Typography variant="h6" color="primary">
                                {totalPeriodExpense.toLocaleString('en-US')}<span className="tw-uppercase">.00 {currency}</span>
                            </Typography>
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Paper className="tw-p-4 tw-cursor-pointer" >
                        <Typography variant="body2" className="tw-font-semibold">Total Period Income</Typography>
                        <div>
                            <Typography variant="h6" color="primary">
                                {totalPeriodIncome.toLocaleString('en-US')}<span className="tw-uppercase">.00 {currency}</span>
                            </Typography>
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
                                (isLoading) && <TableRow className="tw-cursor-pointer hover:tw-bg-[#F4F6F8]">
                                    <TableCell colSpan={columns.length} align="center">
                                        <LinearProgress />
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                (!isLoading && !transactions?.length) && <TableRow className="tw-cursor-pointer hover:tw-bg-[#F4F6F8]">
                                    <TableCell colSpan={columns.length} align="center">
                                        No data
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                transactions && transactions?.map((item, index) => {
                                    return <TableRow key={index} className="tw-cursor-pointer hover:tw-bg-[#F4F6F8]" onDoubleClick={() => { openEditTransactionModal(item) }}>
                                        <TableCell component="td" className="tw-border-none">{index + 1}</TableCell>
                                        <TableCell component="td" className="tw-border-none">{item.category}</TableCell>
                                        <TableCell component="td" className="tw-border-none">{item.description}</TableCell>
                                        <TableCell component="td" className="tw-border-none">{item.paymentMethod}</TableCell>
                                        <TableCell component="td" className="tw-border-none">
                                            {formatTimestampToDateString(item.excutedAt as Timestamp, FormatDate.DDMMYYYY)}
                                        </TableCell>
                                        <TableCell className="tw-border-none" align="right">
                                            <div className="tw-flex tw-justify-end tw-gap-2 tw-items-center">
                                                <span className={`${(item.amount > 0 && item.type === TransactionType.INCOME) ? "tw-text-blue-500" : "tw-text-red-500"}  tw-font-semibold`}>{item.amount.toLocaleString()}</span>
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
        </Grid></>
}
export default WalletDetailContainer;