import { Backdrop, CircularProgress } from "@mui/material";
import { FC } from "react"

type AppBackdropProps = {
    loading: boolean;
}

const AppBackdrop: FC<AppBackdropProps> = ({ loading }) => {
    return <Backdrop className="tw-z-50" sx={{ bgcolor: "#FFFFFF" }} open={loading}>
        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4">
            <div className="tw-text-2xl tw-font-semibold tw-text-slate-400">
                MoneyFlow
            </div>
            <CircularProgress className="tw-text-slate-400" />
        </div>
    </Backdrop>
}
export default AppBackdrop;