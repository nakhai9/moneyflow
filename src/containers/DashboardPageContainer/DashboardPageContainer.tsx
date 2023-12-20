import { AddIcon } from "@/common/constants/icons";
import { IAccount } from "@/common/interfaces/account";
import { IBase, IOption } from "@/common/interfaces/base";
import { accountService, currencyService } from "@/common/services/firestore";
import WalletModal from "@/components/Modals/WalletModal";
import useModal from "@/hooks/useModal";
import { setCurrencyOptions, toggleFormSubmited } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type DashboardPageContainer = {}
const DashboardPageContainer: FC<DashboardPageContainer> = ({ }) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { open, onOpen, onClose } = useModal();
    const { user } = useSelector((state: RootState) => state.auth);
    const [walletsOnFirestore, setWalletsOnFirestore] = useState<(IAccount & IBase)[] | null>(null);
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
                <div className="tw-my-4">
                    <Typography variant="h5">Wallets</Typography>
                </div>
                <Grid container spacing={4}>
                    {
                        walletsOnFirestore && walletsOnFirestore.map((item, index: number) => (
                            <Grid key={index} item xs={6} sm={4} md={3}>
                                <Paper elevation={4} onClick={() => { openWallet(item.id!) }} className="tw-flex tw-h-24 tw-bg-white tw-rounded tw-cursor-pointer tw-font-thin tw-overflow-hidden hover:tw-shadow-lg">
                                    <div className="tw-w-5 tw-bg-blue-500"></div>
                                    <div className="tw-flex tw-flex-col tw-justify-center tw-pl-4">
                                        <div className="tw-text-xl">{item.name}</div>
                                        <div className="tw-capitalize tw-text-xs">{item.type}</div>
                                        <div className="tw-text-xl tw-text-blue-500 tw-font-thin">{item.amount.toLocaleString() + ".00"} <span>{getCurrencyCode(item.currencyId!)}</span></div>
                                    </div>
                                </Paper>
                            </Grid>
                        ))
                    }
                    <Grid item xs={6} sm={4} md={3}>
                        <Box className="tw-flex tw-flex-col tw-gap-4">
                            <Button type="button" fullWidth className="tw-normal-case tw-shadow-lg tw-bg-white" startIcon={<AddIcon />} onClick={openModal}>Add wallet</Button>
                            <Button type="button" fullWidth className="tw-normal-case tw-shadow-lg tw-bg-white">Connect a Bank Account</Button>
                        </Box>
                    </Grid>
                </Grid>
                <div className="tw-my-4">
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