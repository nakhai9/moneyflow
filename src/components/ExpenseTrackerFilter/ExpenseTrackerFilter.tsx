import { Grid, Paper, Slider, TextField, Typography } from "@mui/material";
import { FC } from "react";

type ExpenseTrackerFilterProps = {}

const ExpenseTrackerFilter: FC<ExpenseTrackerFilterProps> = ({ }) => {
    return <>
        <Grid item container xs={12} md={12}>
            <Typography variant="h6" fontWeight={600} mb={3}>Filter</Typography>
        </Grid>
        <Grid item container xs={12} md={12} spacing={4}>
            <Grid item xs={12} md={3}>
                <TextField label="By Wallet" size="small" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
                <TextField label="By Category" size="small" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
                <TextField label="By Description" size="small" fullWidth />
            </Grid>
            <Grid item xs={12} md={3}>
                <Typography variant="subtitle2">By Amount</Typography>
                <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
            </Grid>
        </Grid>
    </>
}
export default ExpenseTrackerFilter;