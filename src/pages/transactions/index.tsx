import { FirestoreCollections, IBase, ITransaction, IWallet, ModalType, TransactionType } from "@/common/drafts/prisma";
import { firestoreService } from "@/common/services/firestore";
import { FormatDate, formatTimestampToDateString } from "@/common/utils/date";
import { AppFilter } from "@/components";
import DialogTransaction from "@/components/Transactions/DialogTransaction";
import { AddIcon } from "@/components/common/VIcons";
import useToggle from "@/hooks/useToggle";
import DefaultLayout from "@/layouts/DefaultLayout";
import { toggleBackdrop } from "@/store/features/global/globalSlice";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const columns = ['Nr', 'Category', 'Wallet', 'Description', 'Payment method', 'Excuted Date', 'Amount'];

const Transactions = () => {

    const dispatch = useDispatch();
    const [type, setType] = useState<ModalType>();
    const [wallets, setWallets] = useState<(IWallet & IBase)[] | null>(null);
    const [transactions, setTransactions] = useState<(ITransaction & IBase)[]>([]);
    const [transaction, setTransaction] = useState<(ITransaction & IBase)>();
    const { open, handleOpen, handleClose } = useToggle();

    const handleAddTransaction = () => {
        handleOpen();
        setType(ModalType.ADD);
    }

    const handleEditTransaction = (transaction: (ITransaction & IBase)) => {
        handleOpen();
        setType(ModalType.EDIT);
        setTransaction(transaction)
    }

    const fetchTransactions = useCallback(async () => {
        const snapshotWallets = await firestoreService.getDocs(FirestoreCollections.WALLETS);
        const snapshotTransactions = await firestoreService.getDocs(FirestoreCollections.TRANSACTIONS);
        setTransactions(snapshotTransactions);
        setWallets(snapshotWallets);
    }, []);

    const getWalletName = (walletId: string): (string | undefined) => {
        return wallets?.find((wallet: IWallet & IBase) => wallet.id === walletId)?.name;
    }

    useEffect(() => {
        dispatch(toggleBackdrop(true));
        fetchTransactions();
        dispatch(toggleBackdrop(false));
    }, [fetchTransactions, dispatch])

    return (
        <DefaultLayout>
            <DialogTransaction open={open} type={type} transaction={transaction} handleClose={handleClose} />
            <Grid container spacing={4}>
                <Grid container item xs={12}>
                    <Button type="button" size="small" variant="contained" color="primary" className="vdt-normal-case" startIcon={<AddIcon />} onClick={handleAddTransaction}>
                        Add transaction
                    </Button>
                </Grid>
                <Grid container item xs={12}>
                    <Grid container item component={Paper} xs={12} p={3}>
                        <AppFilter />
                    </Grid>
                </Grid>
                <Grid container item xs={12}>
                    {
                        transactions &&
                        (<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
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
                                        !transaction && <TableRow className="vdt-cursor-pointer hover:vdt-bg-[#F4F6F8]">
                                            <TableCell colSpan={columns.length} align="center">No data to load</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        transactions.map((item, index) => {
                                            return <Tooltip key={index} title="Double click to open">
                                                <TableRow className="vdt-cursor-pointer hover:vdt-bg-[#F4F6F8]" onDoubleClick={() => { handleEditTransaction(item) }} >
                                                    <TableCell component="td" className="vdt-border-none">{index + 1}</TableCell>
                                                    <TableCell component="td" className="vdt-border-none">
                                                        {item.category}
                                                    </TableCell>
                                                    <TableCell className="vdt-border-none">
                                                        {item.walletId && getWalletName(item.walletId)}
                                                    </TableCell>
                                                    <TableCell component="td" className="vdt-border-none">{item.description ?? "---"}</TableCell>
                                                    <TableCell component="td" className="vdt-border-none">{item.paymentMethod}</TableCell>
                                                    <TableCell component="td" className="vdt-border-none">
                                                        {formatTimestampToDateString(item.excutedAt as Timestamp, FormatDate.DDMMYYYY)}
                                                    </TableCell>
                                                    <TableCell component="td" className="vdt-border-none" align="right"> <span className={`${(item.amount > 0 && item.type === TransactionType.INCOME) ? "vdt-text-blue-500" : "vdt-text-red-500"}  vdt-font-semibold`}>{item.amount.toLocaleString()}</span> </TableCell>
                                                </TableRow>
                                            </Tooltip>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>)
                    }
                </Grid>
            </Grid>
        </DefaultLayout>
    )
}
export default Transactions;