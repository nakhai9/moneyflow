import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Box, Button, ButtonGroup, Container, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { NextPage } from "next";
import { useRouter } from "next/router";
import AddIcon from '@mui/icons-material/Add';
import { Category } from "@/common/enums/category";
import { TransactionType, WalletType } from "@/common/enums/transaction-type";
import { PaymentMethod } from "@/common/enums/payment-method";
import { ITransaction } from "@/common/interfaces/transaction";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import { ModalType } from "@/common/enums/modal-type.enum";
import SettingsIcon from '@mui/icons-material/Settings';

const STATISTICS = [
    {
        label: "Current Wallet Balance",
        value: 157000,
        locale: "vi-VN",
        currency: "VND"
    },
    {
        label: "Total Period Change",
        value: 0,
        locale: "vi-VN",
        currency: "VND"
    },
    {
        label: "Current Wallet Balance",
        value: 0,
        locale: "vi-VN",
        currency: "VND"
    },
    {
        label: "Current Wallet Balance",
        value: 0,
        locale: "vi-VN",
        currency: "VND"
    }
];

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
    }
];


const WalletDetailPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('lg');
    const categories = Object.values(Category);
    const [open, setOpen] = useState<boolean>(false);

    const chooseType = (type: TransactionType) => { }

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

    const openTransactionModal = (type: ModalType, transactionId?: number) => {
        setOpen(!open);
    }
    return (
        <>
            <Dialog open={open} fullWidth={fullWidth} maxWidth={maxWidth}>
                <DialogTitle>Transaction</DialogTitle>
                <DialogContent>
                    <Box mb={2}>
                        <ButtonGroup variant="contained" >
                            <Button type="button" color="primary" onClick={() => { chooseType(TransactionType.EXPENSE) }}>{TransactionType.EXPENSE}</Button>
                            <Button type="button" color="error" onClick={() => { chooseType(TransactionType.INCOME) }}>{TransactionType.INCOME}</Button>
                            <Button type="button" color="success" onClick={() => { chooseType(TransactionType.TRANSFER) }}>{TransactionType.TRANSFER}</Button>
                        </ButtonGroup>
                    </Box>
                    <form>
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={2}>
                                <TextField select label="Category" margin="dense" size="small" fullWidth>
                                    {Object.values(WalletType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField id="name" type="datetime-local" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField id="name" type="text" label="Description" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField id="name" type="text" label="Amount" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField select label="Type" margin="dense" size="small" fullWidth>
                                    {Object.values(WalletType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField select label="Payment method" margin="dense" size="small" fullWidth>
                                    {Object.values(WalletType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={close} variant="contained" color="inherit">Cancel</Button>
                    <Button type="button" variant="contained" color="primary">Create</Button>
                </DialogActions>
            </Dialog>
            <DefaultLayout>
                <Container>
                    <Stack p={2}>
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
                                    {
                                        STATISTICS.map((item, index) => (<Grid item xs={6} md={3} key={index}>
                                            <Paper sx={{ backgroundColor: red, width: "100%", padding: 2, cursor: "pointer" }} >
                                                <Typography variant="body2" className="vdt-font-semibold">{item.label}</Typography>
                                                <div>
                                                    <Typography variant="h6" color="primary">{numberAsCurrency(item.locale, item.currency).format(item.value).toString()}</Typography>
                                                </div>
                                            </Paper>
                                        </Grid>))
                                    }
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
                                                                        <IconButton aria-label="actions" size="small" onClick={() => { openTransactionModal(ModalType.EDIT, item.id) }}>
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
                </Container>
            </DefaultLayout>
        </>
    );
}

export default WalletDetailPage;