import { FirestoreCollections, IBase, ITransaction } from "@/common/drafts/prisma";
import { ModalType, TransactionType } from "@/common/enums";
import { firestoreService } from "@/common/services/firestore";
import DialogTransaction from "@/components/Transactions/DialogTransaction";
import MoreTransaction from "@/components/Transactions/MoreTransaction";
import VButton from "@/components/common/VButton";
import { AddIcon, FastfoodIcon, MoreVertIcon } from "@/components/common/VIcons";
import useToggle from "@/hooks/useToggle";
import DefaultLayout from "@/layouts/DefaultLayout";
import { Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const columns = ['Category', 'Wallet', 'Description', 'Payment method', 'Amount'];

const Transactions = () => {

    const [type, setType] = useState<ModalType>();
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

    const handleDeleteTransaction = (transactionId: string) => {
        const newTransactions = transactions?.filter(item => item.id !== transactionId);
        setTransactions(newTransactions);
        console.log(`Removed transaction have a id ${transactionId}`)
    }

    const fetchTransactions = useCallback(async () => {
        const snapshotTransactions = await firestoreService.getDocs(FirestoreCollections.TRANSACTIONS);
        setTransactions(snapshotTransactions);
    }, []);


    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions])

    return (
        <DefaultLayout>
            <DialogTransaction open={open} type={type} transaction={transaction} handleClose={handleClose} />
            <Grid container spacing={4}>
                <Grid container item xs={12}>
                    <VButton type="button" size="small" variant="contained" color="primary" className="vdt-normal-case" startIcon={<AddIcon />} onClick={handleAddTransaction}>
                        Add transaction
                    </VButton>
                </Grid>
                <Grid container item xs={12} >
                    <Paper sx={{ width: '100%', padding: 2 }}>
                        Filter
                    </Paper>
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
                                                    {item.category}
                                                </TableCell>
                                                <TableCell className="vdt-border-none">{item.walletId}</TableCell>
                                                <TableCell className="vdt-border-none">{item.description ?? "---"}</TableCell>
                                                <TableCell className="vdt-border-none">{item.paymentMethod}</TableCell>
                                                <TableCell className="vdt-border-none" align="right"> <span className={`${(item.amount > 0 && item.type === TransactionType.INCOME) ? "vdt-text-blue-500" : "vdt-text-red-500"}  vdt-font-semibold`}>{item.amount.toLocaleString()}</span> </TableCell>
                                                <TableCell className="vdt-border-none vdt-w-5">
                                                    <MoreTransaction
                                                        handleDeleteTransaction={() => handleDeleteTransaction(item.id!)}
                                                        handleEditTransaction={() => handleEditTransaction(item)}
                                                    />
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
    )
}
export default Transactions;