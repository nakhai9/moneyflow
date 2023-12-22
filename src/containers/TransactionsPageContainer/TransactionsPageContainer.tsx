import { AddIcon } from "@/common/constants/icons";
import { ModalAction } from "@/common/enums/modal";
import { TransactionType } from "@/common/enums/transaction";
import { IAccount } from "@/common/interfaces/account";
import { IBase } from "@/common/interfaces/base";
import { ITransaction, ITransactionsFilterProps } from "@/common/interfaces/transaction";
import { accountService, transactionService } from "@/common/services/firestore";
import { FormatDate, formatTimestampToDateString } from "@/common/utils/date";
import { AppFilter, TransactionModal } from "@/components";
import useModal from "@/hooks/useModal";
import { toggleFormSubmited, togglePageLoading } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { Button, Grid, LinearProgress, Paper, Slider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
type TransactionsPageContainerProps = {}

const TransactionsPageContainer: FC<TransactionsPageContainerProps> = ({ }) => {

    const dispatch = useDispatch();
    const [modalType, setModalType] = useState<ModalAction>();
    const [wallets, setWallets] = useState<(IAccount & IBase)[] | null>(null);
    const [transactions, setTransactions] = useState<(ITransaction & IBase)[] | null>(null);
    const [transaction, setTransaction] = useState<(ITransaction & IBase) | null>(null);
    const { open, onOpen, onClose } = useModal();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { formSubmited } = useSelector((state: RootState) => state.global);
    const { user } = useSelector((state: RootState) => state.auth);
    const [columns] = useState(['Nr', 'Category', 'Wallet', 'Description', 'Payment method', 'Excuted Date', 'Amount']);
    const [initForm] = useState<ITransactionsFilterProps>({
        walletName: '',
        categoryName: '',
        description: '',
        // amount: 0
    });
    const { handleSubmit, control, setValue, formState: { errors }, reset } = useForm<ITransactionsFilterProps>({
        defaultValues: initForm
    })

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
        if (formSubmited) {
            dispatch(toggleFormSubmited(false));
        }
        setIsLoading(true);
        if (user) {
            const snapshotWallets = await accountService.getAccountsByUserId(user?.id as string);
            const snapshotTransactions = await transactionService.getTransactions(user?.id as string, undefined);
            setTransactions(snapshotTransactions);
            setWallets(snapshotWallets);
        }
        setIsLoading(false);
    }, [user, formSubmited]);

    const getWalletName = (walletId: string): (string | undefined) => {
        return wallets?.find((wallet: IAccount & IBase) => wallet.id === walletId)?.name;
    }

    const closeModal = () => {
        onClose();
    }

    const onFilter = async (data: ITransactionsFilterProps) => {
        console.log(data);

    }

    useEffect(() => {
        dispatch(togglePageLoading(true));
        fetchTransactions();
        dispatch(togglePageLoading(false));
    }, [fetchTransactions, dispatch])

    return <div>
        <TransactionModal open={open} onClose={closeModal} action={modalType} transaction={transaction} />
        <Grid container spacing={4}>
            <Grid container item xs={12}>
                <Button type="button" size="small" variant="contained" color="primary" className="tw-normal-case" startIcon={<AddIcon />} onClick={handleAddTransaction}>
                    Add transaction
                </Button>
            </Grid>
            <Grid container item xs={12}>
                <Grid container item component={Paper} xs={12} p={3}>
                    <Grid item container xs={12} md={12}>
                        <Typography variant="h6" fontWeight={600} mb={3}>Filter</Typography>
                    </Grid>
                    {/* Filter Component */}
                    <Grid component={"form"} item container xs={12} md={12} spacing={2} onSubmit={handleSubmit(onFilter)}>
                        <Grid item xs={12} md={3}>
                            <Controller name="walletName" control={control}
                                render={({ field }) => (<TextField {...field} label="By Wallet" size="small" fullWidth />)} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Controller name="categoryName" control={control}
                                render={({ field }) => (<TextField {...field} label="By Category" size="small" fullWidth />)} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Controller name="description" control={control}
                                render={({ field }) => (<TextField {...field} label="By Description" size="small" fullWidth />)} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Typography variant="subtitle2">By Amount</Typography>
                            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
                        </Grid>
                        <Grid item container xs={12} md={12} justifyContent={"right"}>
                            <Button type="submit" size="small">Filter</Button>
                        </Grid>
                    </Grid>
                    {/* End Filter Component */}
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
                                transactions?.map((item, index) => {
                                    return <TableRow key={index} className="tw-cursor-pointer hover:tw-bg-[#F4F6F8]" onDoubleClick={() => { handleEditTransaction(item) }} >
                                        <TableCell component="td" className="tw-border-none">{index + 1}</TableCell>
                                        <TableCell component="td" className="tw-border-none">
                                            {item.category}
                                        </TableCell>
                                        <TableCell className="tw-border-none">
                                            {item.walletId && getWalletName(item.walletId)}
                                        </TableCell>
                                        <TableCell component="td" className="tw-border-none">{item.description ?? "---"}</TableCell>
                                        <TableCell component="td" className="tw-border-none">{item.paymentMethod}</TableCell>
                                        <TableCell component="td" className="tw-border-none">
                                            {formatTimestampToDateString(item.excutedAt as Timestamp, FormatDate.DDMMYYYY)}
                                        </TableCell>
                                        <TableCell component="td" className="tw-border-none" align="right"> <span className={`${(item.amount > 0 && item.type === TransactionType.INCOME) ? "tw-text-blue-500" : "tw-text-red-500"}  tw-font-semibold`}>{item.amount.toLocaleString()}</span> </TableCell>
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