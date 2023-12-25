import { AddIcon } from "@/common/constants/icons";
import { IAccount } from "@/common/interfaces/account";
import { IBase } from "@/common/interfaces/base";
import { accountService, currencyService } from "@/common/services/firestore";
import { AppWalletPanel } from "@/components";
import WalletModal from "@/components/Modals/WalletModal";
import useModal from "@/hooks/useModal";
import { toggleFormSubmited } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart } from '@mui/x-charts/BarChart';



type DashboardPageContainer = {}
const DashboardPageContainer: FC<DashboardPageContainer> = ({ }) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { open, onOpen, onClose } = useModal();
    const [wallets, setWallets] = useState<(IAccount & IBase)[] | null>(null);
    const { user } = useSelector((state: RootState) => state.auth);
    const { formSubmited } = useSelector((state: RootState) => state.global);

    const closeModal = () => {
        onClose();
    }

    const openModal = () => {
        onOpen();
    }

    const handleClickWalletPanel = (walletId: string) => {
        router.push(`wallet/${walletId}`);
    }



    const fetchWallets = useCallback(async () => {
        if (formSubmited) {
            dispatch(toggleFormSubmited(false));
        }
        try {
            const wallets = await accountService.getAccountsByUserId((user && user.id) ? user.id : '');
            if (wallets) {
                if (wallets) {
                    const _wallets = await Promise.all(
                        wallets.map(async (wallet) => {
                            const currency = await currencyService.convertCurrency(wallet.currencyId as string);
                            if (currency) {
                                wallet["currency"] = currency;
                            }
                            return wallet;
                        })
                    )
                    setWallets(_wallets);
                }
            }
        } catch (error) {
            console.log(error);
        }

    }, [dispatch, user, formSubmited]);

    useEffect(() => {
        fetchWallets();
    }, [fetchWallets]);

    return (
        <>
            <WalletModal open={open} onCloseModal={closeModal} />
            <div>
                <div className="tw-my-4">
                    <Typography variant="h5">Wallets</Typography>
                </div>
                <Grid container spacing={4}>
                    {
                        wallets && wallets.map((item, index: number) => (
                            <Grid key={index} item xs={6} sm={4} md={3}>
                                <AppWalletPanel onClick={() => { handleClickWalletPanel(item.id!) }} item={item} />
                            </Grid>
                        ))
                    }
                    <Grid item xs={6} sm={4} md={3}>
                        <Box className="tw-flex tw-flex-col tw-gap-4">
                            <Button type="button" fullWidth className="tw-normal-case tw-shadow-lg tw-bg-white" startIcon={<AddIcon />} onClick={openModal}>Add wallet</Button>
                        </Box>
                    </Grid>
                </Grid>
                <div className="tw-my-4">
                    <Typography variant="h5">Overviews</Typography>
                </div>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ py: 4 }}>
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, value: 10, label: 'series A' },
                                            { id: 1, value: 15, label: 'series B' },
                                            { id: 2, value: 20, label: 'series C' },
                                        ],
                                    },
                                ]}
                                height={250}
                            />
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