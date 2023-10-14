import { Category } from "@/common/enums/category";
import { PaymentMethod } from "@/common/enums/payment-method";
import { TransactionType } from "@/common/enums/transaction-type";
import { ITransaction } from "@/common/interfaces/transaction";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

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


type TransactionProps = {}
const Transaction: React.FC<TransactionProps> = () => {

    const categories = Object.values(Category);
    
    return <>
        <DefaultLayout>
            <div className="vdt-py-4">
                <Grid container spacing={2}>
                    <Grid item container>
                        <Grid item md={1}></Grid>
                        <Grid item md={10}>
                            <Typography variant="h6" className="vdt-text-slate-500">Transactions</Typography>
                        </Grid>
                        <Grid item md={1}></Grid>
                    </Grid>
                    <Grid item container >
                        <Grid item xs={0} md={1}></Grid>
                        <Grid item xs={12} md={10} component={Paper} className="vdt-px-4 vdt-py-2">
                            <Typography variant="body1" className="vdt-text-slate-500">Filters</Typography>
                        </Grid>
                        <Grid item xs={0} md={1}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item md={1}></Grid>
                        <Grid item xs={12} md={10}>
                            {
                                transactions && (<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    columns.map((columnHeading: string, index: number) => <TableCell key={index} align={columnHeading === 'Amount' ? 'right' : 'left'} sx={{'fontWeight': "bold"}} component="th">{columnHeading}</TableCell>)
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
                                                            <IconButton aria-label="actions" size="small">
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
                        <Grid item md={1}></Grid>
                    </Grid>
                </Grid>
            </div>
        </DefaultLayout>
    </>
}
export default Transaction;