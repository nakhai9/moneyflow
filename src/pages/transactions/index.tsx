import DefaultLayout from "@/components/layouts/DefaultLayout";
import { Box, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import MoreVertIcon from '@mui/icons-material/MoreVert';
type TransactionProps = {}
const Transaction: React.FC<TransactionProps> = () => {

    function createData(
        name: string,
        calories: number,
        fat: number,
        carbs: number,
    ) {
        return { name, calories, fat, carbs };
    }

    // date, Description, payment method, status

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24),
        createData('Ice cream sandwich', 237, 9.0, 37),
        createData('Eclair', 262, 16.0, 24),
        createData('Cupcake', 305, 3.7, 67),
        createData('Bun dau mam tom', 305, 3.7, 67),
        createData('Salary', 305, 3.7, 67),
    ];


    const table = {
        name: "Transaction",
        columns: ['Category', 'Wallet', 'Description', 'Payment method', 'Amount'],
        rows: [
            ["Coffe and cake", "First Wallet", "--", "Cash", "-20"],
            ["Coffe and cake", "First Wallet", "--", "Cash", "-20"],
            ["Coffe and cake", "First Wallet", "--", "Cash", "-20"],
            ["Coffe and cake", "First Wallet", "--", "Cash", "-20"],
        ]
    }


    return <>
        <DefaultLayout>
            <div className="vdt-py-4">
                <Grid container spacing={2}>
                    <Grid item container>
                        <Grid item md={1}></Grid>
                        <Grid item md={10}>
                            <Typography variant="h6" className="vdt-text-slate-500">All transactions</Typography>
                        </Grid>
                        <Grid item md={1}></Grid>
                    </Grid>
                    <Grid item container >
                        <Grid item md={1}></Grid>
                        <Grid item md={10} component={Paper} className="vdt-px-4 vdt-py-2">
                            <Typography variant="body1" className="vdt-text-slate-500">Filters</Typography>
                        </Grid>
                        <Grid item md={1}></Grid>
                    </Grid>
                    <Grid item container>
                        <Grid item md={1}></Grid>
                        <Grid item xs={12} md={10}>
                            {
                                table && (<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    table.columns.map((columnHeading: string, index: number) => <TableCell key={index} className={`vdt-font-semibold ${columnHeading === 'Amount' ? 'vdt-text-right' : ''}`} component="th">{columnHeading}</TableCell>)
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {table.rows.map((row: string[], index: number) => (
                                                <TableRow key={index} className="vdt-cursor-pointer hover:vdt-bg-[#F4F6F8]"  >
                                                    <TableCell component="td" className="vdt-border-none">
                                                        <FastfoodIcon color="primary"  /> <span className="vdt-ml-2">{row[0]}</span>
                                                    </TableCell>
                                                    <TableCell className="vdt-border-none">{row[1]}</TableCell>
                                                    <TableCell className="vdt-border-none">{row[2]}</TableCell>
                                                    <TableCell className="vdt-border-none">{row[3]}</TableCell>
                                                    <TableCell className="vdt-border-none" align="right"> <span className="vdt-text-red-500 vdt-font-semibold ">{row[4]}</span> </TableCell>
                                                </TableRow>
                                            ))}
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

// rem là ăn theo thằng cha 
// px để 