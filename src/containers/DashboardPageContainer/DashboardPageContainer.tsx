import { IBase, IOption, IWallet } from "@/common/drafts/prisma";
import { accountService, currencyService } from "@/common/services/firestore";
import WalletModal from "@/components/Modals/WalletModal";
import useModal from "@/hooks/useModal";
import { setCurrencyOptions, toggleFormSubmited, togglePageLoading } from "@/store/features/global/globalSlice";
import { setWallets } from "@/store/features/wallet/walletSlice";
import { RootState } from "@/store/store";
import AddIcon from '@mui/icons-material/Add';
import { Backdrop, Box, Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type DashboardPageContainer = {}
const DashboardPageContainer: FC<DashboardPageContainer> = ({ }) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { open, onOpen, onClose } = useModal();
    const { user } = useSelector((state: RootState) => state.auth);
    const [walletsOnFirestore, setWalletsOnFirestore] = useState<(IWallet & IBase)[] | null>(null);
    const { formSubmited, currencyOptions } = useSelector((state: RootState) => state.global);

    const openWallet = (id: string) => {
        router.push(`wallet/${id}`);
    }

    const closeModal = () => {
        onClose();
    }

    const openModal = () => {
        onOpen();
    }

    const fetchDataOnFirestore = useCallback(async () => {

        if (formSubmited) {
            dispatch(toggleFormSubmited(false));
        }
        try {
            const wallets = await accountService.getAccountsByUserId((user && user.id) ? user.id : '');
            setWalletsOnFirestore(wallets);
            const currencies = await currencyService.getCurrencies();
            dispatch(setCurrencyOptions(currencies));
        } catch (error) {
            console.log(error);
        }

    }, [dispatch, user, formSubmited])

    const getCurrencyCode = (currencyId: string) => {
        return currencyOptions?.find((currency: IOption) => currency.id === currencyId)?.prop.toUpperCase() ?? "XXX";
    }

    useEffect(() => {
        fetchDataOnFirestore();
    }, [fetchDataOnFirestore]);

    return (
        <>
            <WalletModal open={open} onCloseModal={closeModal} />
            <div>
                <div className="vdt-my-4">
                    <Typography variant="h5">Wallets</Typography>
                </div>
                <Grid container spacing={4}>
                    {
                        walletsOnFirestore && walletsOnFirestore.map((item, index: number) => (
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
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ py: 4 }}>
                           
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ py: 4 }}>
                           
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}
export default DashboardPageContainer;