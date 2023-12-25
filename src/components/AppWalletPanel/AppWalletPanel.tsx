import { IAccount } from "@/common/interfaces/account";
import { IBase } from "@/common/interfaces/base";
import { Box, Paper, Skeleton } from "@mui/material";
import { FC } from "react";

type AppWalletPanelProps = {
    item: IAccount & IBase;

    onClick?: () => void;
}
const AppWalletPanel: FC<AppWalletPanelProps> = ({ item, onClick }) => {

    const handleClick = () => {
        onClick && onClick()
    }

    return <Paper elevation={4} className="tw-flex tw-h-24 tw-bg-white tw-rounded tw-cursor-pointer tw-font-thin tw-overflow-hidden hover:tw-shadow-lg" onClick={handleClick}>
        <div className="tw-w-5 tw-bg-blue-500"></div>
        <Box className="tw-flex tw-flex-col tw-justify-center tw-pl-4">
            <Box className="tw-text-xl">{item.name ? item.name : <Skeleton variant="text" sx={{ fontSize: '1rem' }} />}</Box>
            <Box className="tw-capitalize tw-text-xs">{item.type ? item.type : <Skeleton variant="text" sx={{ fontSize: '1rem' }} />}</Box>
            <Box className="tw-text-xl tw-text-blue-500 tw-font-thin">
                {
                    (item.amount && item?.currency) ? <span className="tw-uppercase">{item.amount.toLocaleString() + ".00"} {item.currency}  </span> : <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                }
            </Box>
        </Box>
    </Paper>
}

export default AppWalletPanel;