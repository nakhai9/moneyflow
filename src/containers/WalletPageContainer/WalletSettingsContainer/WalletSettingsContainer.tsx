import { IOption } from "@/common/interfaces/base";
import { accountService, currencyService } from "@/common/services/firestore";
import { RootState } from "@/store/store";
import { Box, Button, Grid, ListItemText, MenuItem, MenuList, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from 'yup';

type WalletSettingsContainerProps = {}

type WalletSubmitForm = {
    name: string;
    currencyId: string;
    amount: number;
    note?: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required("Wallet name is required"),
    amount: yup.number().positive('Amount must be a positive number').required('Amount is required'),
    currencyId: yup.string().required('Currency is required').notOneOf(['none'], 'Currency must not be "None"'),
    note: yup.string(),
})

const initialForm: WalletSubmitForm = {
    name: '',
    amount: 0,
    currencyId: 'none',
    note: ''
}

const WalletSettingsContainer: FC<WalletSettingsContainerProps> = ({ }) => {
    const router = useRouter();
    const { control, setValue } = useForm<WalletSubmitForm>({
        defaultValues: initialForm
    });
    const [tabIndex, setTabIndex] = useState<number>(1);

    const fetch = useCallback(async () => {
        try {
            const wallet = await accountService.getAccountById(router.query.id as string);
            if (wallet) {
                const currency = await currencyService.convertCurrency(wallet.currencyId as string);
                setValue("name", wallet.name);
                setValue("amount", wallet.amount);
                setValue("note", wallet?.note as string);
                if (currency) {
                    setValue("currencyId", currency);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [setValue])

    const MainSettingsTemplate = () => (
        <div>
            <Typography variant="body1" fontWeight={600} mb={3}>General information</Typography>
            <form>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={12}>
                        <Controller control={control} name="name"
                            render={({ field }) => <TextField {...field} label="Name" size="small" sx={{ background: "white" }} fullWidth />} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Box component="form" sx={{ display: "flex", gap: 2 }}>
                            <Controller control={control} name="amount"
                                render={({ field }) => <TextField {...field} label="Initial Balance" size="small" fullWidth sx={{ background: "white", flexGrow: 1 }} />} />
                            <TextField select label="Currency" size="small" disabled={true} sx={{ width: 150, background: "white" }}>
                                <MenuItem key="none" value="none">
                                    None
                                </MenuItem>
                            </TextField>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Controller control={control} name="note"
                            render={({ field }) => <TextField {...field} label="Note" size="small" sx={{ background: "white" }} fullWidth />} />
                    </Grid>
                    <Grid item container justifyContent="end">
                        <Box sx={{ display: "flex", gap: 4 }}>
                            <Button variant="contained" color="inherit" size="small">Update settings</Button>
                            <Button variant="contained" color="error" size="small">Delete wallet</Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </div>
    )

    const CaterogiesSettingsTemplate = () => (<div>
        <Typography variant="body1" fontWeight={600} mb={3}>General information</Typography>
    </div>)

    useEffect(() => {

        fetch();

    }, [fetch])

    return <>
        <div className="tw-mb-4">
            <Typography variant="h6">Wallet Settings</Typography>
        </div>
        <Grid container>
            <Grid item sx={{ display: { xs: "none", md: "block" } }} md={3}>
                <MenuList>
                    <MenuItem onClick={() => { setTabIndex(1) }} sx={tabIndex === 1 ? { background: "#FFFFFF", color: "#1976d2" } : {}}>
                        <Typography fontWeight={600}>Main Settings</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { setTabIndex(2) }} sx={tabIndex === 2 ? { background: "#FFFFFF", color: "#1976d2" } : {}}>
                        <Typography fontWeight={600}>Categories Settings</Typography>
                    </MenuItem>
                </MenuList>
            </Grid>
            <Grid item container xs={12} md={9}>
                <Grid item xs={12} md={12}>
                    <Box sx={{ px: 20, py: 10, background: "white", minHeight: 400 }}>
                        {tabIndex === 1 ? <MainSettingsTemplate /> : <CaterogiesSettingsTemplate />}
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    </>
}
export default WalletSettingsContainer;