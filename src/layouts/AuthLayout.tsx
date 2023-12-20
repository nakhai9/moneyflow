import { Paper } from "@mui/material";

type AuthLayoutProps = {
    children: React.ReactNode
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return <div className="tw-h-screen tw-w-full tw-bg-zinc-100">
        <Paper className="tw-absolute tw-flex tw-top-1/2 tw-left-1/2 -tw-translate-y-1/2 -tw-translate-x-1/2 tw-w-80 tw-bg-white tw-p-5 tw-rounded">
            {children}
        </Paper>
    </div>
}

export default AuthLayout;