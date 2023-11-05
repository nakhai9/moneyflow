import { RootState } from "@/store/store";
import { Backdrop, CircularProgress, Paper } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

type AuthLayoutProps = {
    children: React.ReactNode
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: RootState) => state.backdrop)

    return <>
        <Backdrop className="vdt-z-50" open={isOpen}>
            <CircularProgress color="primary" />
        </Backdrop>
        <div className="vdt-h-screen vdt-w-full vdt-bg-zinc-100">
            <Paper className="vdt-absolute vdt-flex vdt-top-1/2 vdt-left-1/2 -vdt-translate-y-1/2 -vdt-translate-x-1/2 vdt-w-80 vdt-bg-white vdt-p-5 vdt-rounded">
                {children}
            </Paper>
        </div>
    </>
}

export default AuthLayout;