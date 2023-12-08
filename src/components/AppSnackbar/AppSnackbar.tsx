import { ICommonMessages } from "@/common/drafts/prisma";
import { Alert, Snackbar, SnackbarOrigin } from "@mui/material";
import { FC } from "react";

export type SnackbarSeverity = "error" | "success" | "warning" | "info";

const SNACKBAR_POSITIONS = new Map<string, SnackbarOrigin>([
    ["top-center", { vertical: "top", horizontal: "center" }],
    ["top-left", { vertical: "top", horizontal: "left" }],
    ["top-right", { vertical: "top", horizontal: "right" }],
    ["bottom-left", { vertical: "bottom", horizontal: "left" }],
    ["bottom-right", { vertical: "bottom", horizontal: "right" }],
    ["bottom-center", { vertical: "bottom", horizontal: "center" }]
])

type AppSnackbarProps = {
    open: boolean;
    message: string | ICommonMessages;
    positions?: string;
    severity?: SnackbarSeverity;

    onClose?: () => void;
}

const AppSnackbar: FC<AppSnackbarProps> = ({ positions = "top-center", severity = "success", message, open, onClose }) => {
    return (<>
        <Snackbar anchorOrigin={SNACKBAR_POSITIONS.get(positions)} open={open} onClose={onClose}>
            <Alert severity={severity} sx={{ minWidth: 300 }}>{message as string}</Alert>
        </Snackbar>
    </>)
}

export default AppSnackbar;