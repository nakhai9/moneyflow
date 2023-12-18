import { FirestoreCollections, IBase, ITransaction, IWallet, ModalAction, TransactionType } from "@/common/drafts/prisma";
import { accountService, firestoreService, transactionService } from "@/common/services/firestore";
import { FormatDate, formatTimestampToDateString } from "@/common/utils/date";
import { AppFilter, TransactionModal } from "@/components";
import DialogTransaction from "@/components/Transactions/DialogTransaction";
import { AddIcon } from "@/components/common/VIcons";
import useModal from "@/hooks/useModal";
import useToggle from "@/hooks/useToggle";
import { togglePageLoading } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { Button, Grid, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
type TransactionsPageContainerProps = {}

const TransactionsPageContainer: FC<TransactionsPageContainerProps> = ({ }) => {

    const dispatch = useDispatch();
    const [modalType, setModalType] = useState<ModalAction>();
    const [wallets, setWallets] = useState<(IWallet & IBase)[] | null>(null);
    const [transactions, setTransactions] = useState<(ITransaction & IBase)[] | null>(null);
    const [transaction, setTransaction] = useState<(ITransaction & IBase) | null>(null);
    const { open, onOpen, onClose } = useModal();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { formSubmited } = useSelector((state: RootState) => state.global);
    const { user } = useSelector((state: RootState) => state.auth);
    const [columns] = useState(['Nr', 'Category', 'Wallet', 'Description', 'Payment method', 'Excuted Date', 'Amount']);

    const handleAddTransaction = () => {
        onOpen();
        setModalType(ModalAction.ADD);
    }

    const handleEditTransaction = (transaction: (ITransaction & IBase)) => {
        onOpen();
        setModalType(ModalAction.EDIT);
        setTransaction(transaction)
    }

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        if (user) {
            const snapshotWallets = await accountService.getAccountsByUserId(user?.id as string);
            const snapshotTransactions = await transactionService.getTransactionsByUserID(user?.id as string);
            setTransactions(snapshotTransactions);
            setWallets(snapshotWallets);
        }
        setIsLoading(false);
    }, [formSubmited]);

    const getWalletName = (walletId: string): (string | undefined) => {
        return wallets?.find((wallet: IWallet & IBase) => wallet.id === walletId)?.name;
    }

    const closeModal = () => {
        onClose();
    }

    useEffect(() => {
        dispatch(togglePageLoading(true));
        fetchTransactions();
        dispatch(togglePageLoading(false));
    }, [fetchTransactions, dispatch])

    return <div>
        {/* <DialogTransaction open={open} type={type} transaction={transaction} handleClose={handleClose} /> */}
        <TransactionModal open={open} onClose={closeModal} type={modalType} transaction={transaction}/>
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
                                    return <TableRow key={index} className="vdt-cursor-pointer hover:vdt-bg-[#F4F6F8]" onDoubleClick={() => { handleEditTransaction(item) }} >
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
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    </div>
}
export default TransactionsPageContainer;