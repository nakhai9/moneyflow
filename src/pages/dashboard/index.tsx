import { FirestoreCollections, IBase, ICurrency, IWallet, WalletType } from "@/common/drafts/prisma";
import { firestoreService } from "@/common/services/firestore";
import DefaultLayout from "@/layouts/DefaultLayout";
import { toggle } from "@/store/features/backdrop/backdropSlice";
import { RootState } from "@/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';

type WalletSubmitForm = {
    name: string;
    type: WalletType,
    currencyId: string;
    amount: number;
    note?: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required("Wallet name is required"),
    type: yup.mixed<WalletType>().oneOf(Object.values(WalletType), 'Invalid wallet type').required('Type is required'),
    amount: yup.number().positive('Amount must be a positive number').required('Amount is required'),
    currencyId: yup.string().required('Currency is required').notOneOf(['none'], 'Currency must not be "None"'),
    note: yup.string(),
})

const initialForm: WalletSubmitForm = {
    name: '',
    type: WalletType.CASH,
    amount: 0,
    currencyId: 'none',
    note: ''
}

const Dashboard: NextPage = () => {

    const router = useRouter();
    const [open, setOpen] = useState<boolean>(false);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xs');
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.auth);

    const [walletsOnFirestore, setWalletsOnFirestore] = useState<(IWallet & IBase)[]>([]);
    const [currenciesOnFirestore, setCurrenciesOnFirestore] = useState<(ICurrency & IBase)[]>([]);

    const { handleSubmit, control, formState: { errors }, reset } = useForm<WalletSubmitForm>({
        defaultValues: initialForm,
        resolver: yupResolver(validationSchema)
    })

    const openWallet = (id: string) => {
        router.push(`wallet/${id}`);
    }

    const close = () => {
        setOpen(!open);
    }

    const openModal = () => {
        setOpen(!open)
    }


    const onSubmit = async (data: WalletSubmitForm) => {
        dispatch(toggle());
        try {
            setOpen(!open);
            const wallet: IWallet = {
                amount: data.amount,
                name: data.name,
                type: data.type,
                currencyId: data.currencyId,
                note: data.note ?? null,
                userId: user?.id,
                isClose: false
            }
            const add = await firestoreService.addDoc<IWallet>(FirestoreCollections.WALLETS, wallet);
            reset();
            fetchDataOnFirestore();
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(toggle());
        }
    };

    const fetchDataOnFirestore = useCallback(async () => {
        dispatch(toggle());
        try {
            const wallets = await firestoreService.getDocs(FirestoreCollections.WALLETS);
            const currencies = await firestoreService.getDocs(FirestoreCollections.CURRENCIES);
            setWalletsOnFirestore(wallets);
            setCurrenciesOnFirestore(currencies);
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(toggle())
        }

    }, [dispatch])

    const getCurrencyCode = (currencyId: string) => {
        return currenciesOnFirestore.find(currency => currency.id === currencyId)?.code.toUpperCase() ?? "XXX";
    }

    useEffect(() => {
        fetchDataOnFirestore();
    }, [fetchDataOnFirestore, reset]);

    return (
        <>
            <Dialog open={open} fullWidth={true} maxWidth={maxWidth}>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <DialogTitle>Create wallet</DialogTitle>
                    <DialogContent>
                        <Controller control={control} name="name" rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    label="Wallet name"
                                    margin="dense"
                                    autoFocus
                                    error={!!errors.name}
                                    helperText={
                                        errors.name && `${errors.name.message}`
                                    } />
                            )}
                        />
                        <Controller control={control} name="type" rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    size="small"
                                    fullWidth
                                    label="Type"
                                    margin="dense"
                                    error={!!errors.type}
                                    helperText={
                                        errors.type && `${errors.type.message}`
                                    }>
                                    {Object.values(WalletType).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Controller control={control} name="amount" rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        label="Amount"
                                        margin="dense"
                                        error={!!errors.amount}
                                        helperText={
                                            errors.amount && `${errors.amount.message}`
                                        } />
                                )}
                            />
                            <Controller control={control} name="currencyId" rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        sx={{ minWidth: 100 }}
                                        {...field}
                                        select
                                        size="small"
                                        label="Currency"
                                        margin="dense"
                                        error={!!errors.currencyId}
                                        helperText={
                                            errors.currencyId && `${errors.currencyId.message}`
                                        }>
                                        <MenuItem key="none" value="none">
                                            None
                                        </MenuItem>
                                        {
                                            currenciesOnFirestore.map((currency: (ICurrency & IBase)) => (
                                                <MenuItem key={currency.id} value={currency.id}>
                                                    {currency.code.toUpperCase()}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                )}
                            />
                        </Box>
                        <Controller control={control} name="note" rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    size="small"
                                    fullWidth
                                    label="Note"
                                    margin="dense"
                                    error={!!errors.note}
                                    helperText={
                                        errors.note && `${errors.note.message}`
                                    } />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={close} variant="contained" color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <DefaultLayout>
                <div className="vdt-my-4">
                    <Typography variant="h5">Wallets</Typography>
                </div>
                <Grid container spacing={4}>
                    {
                        walletsOnFirestore.length > 0 && walletsOnFirestore.map((item, index: number) => (
                            <Grid key={index} item xs={6} sm={4} md={3}>
                                <Paper elevation={4} onClick={() => { openWallet(item.id!) }} className="vdt-flex vdt-h-24 vdt-bg-white vdt-rounded vdt-cursor-pointer vdt-font-thin vdt-overflow-hidden hover:vdt-shadow-lg">
                                    <div className="vdt-w-5 vdt-bg-blue-500"></div>
                                    <div className="vdt-flex vdt-flex-col vdt-justify-center vdt-pl-4">
                                        <div className="vdt-text-xl">{item.name}</div>
                                        <div className="vdt-capitalize vdt-text-xs">{item.type}</div>
                                        <div className="vdt-text-xl vdt-text-blue-500 vdt-font-thin">{item.amount.toLocaleString() + ".00"} <span>{getCurrencyCode(item.currencyId!)}</span></div>
                                    </div>
                                </Paper>
                            </Grid>
                        ))
                    }
                    <Grid item xs={6} sm={4} md={3}>
                        <Box className="vdt-flex vdt-flex-col vdt-gap-4">
                            <Button type="button" fullWidth className="vdt-normal-case vdt-shadow-lg vdt-bg-white" startIcon={<AddIcon />} onClick={openModal}>Add wallet</Button>
                            <Button type="button" fullWidth className="vdt-normal-case vdt-shadow-lg vdt-bg-white">Connect a Bank Account</Button>
                        </Box>
                    </Grid>
                </Grid>
                <div className="vdt-my-4">
                    <Typography variant="h5">Overviews</Typography>
                </div>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}></Grid>
                    <Grid item xs={12} md={6}></Grid>
                </Grid>

            </DefaultLayout>
        </>
    )
}
export default Dashboard;