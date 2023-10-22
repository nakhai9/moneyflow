import { TransactionType, WalletType } from "@/common/enums/transaction-type";
import { AppBar, Avatar, Box, Button, ButtonGroup, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Select, Stack, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
type ComponentsProps = {}
const Components: React.FC<ComponentsProps> = () => {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('xs');
    const [color, setColor] = useState('');
    const colors = ['Red', 'Blue', 'Green'];

    const [open, setOpen] = useState<boolean>(false);

    const chooseType = (type: TransactionType) => { }

    const close = () => {
        setOpen(!open);
    }

    const pages = ['Products', 'Pricing', 'Blog'];
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return <>
        <Dialog open={open} fullWidth={fullWidth} maxWidth={maxWidth}>
            <DialogTitle>Create wallet / transaction </DialogTitle>
            <DialogContent>

                {/* <form action="">
                <TextField select label="Type" margin="dense" size="small" fullWidth>
                    {Object.values(WalletType).map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField id="name" type="datetime-local" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                <TextField id="name" type="text" label="Description" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                <TextField id="name" type="text" label="Amount" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                <TextField select label="Type" margin="dense" size="small" fullWidth>
                    {Object.values(WalletType).map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
            </form> */}

                {/* <Box mb={2}>
                <ButtonGroup variant="contained" >
                    <Button type="button" color="primary" onClick={() => { chooseType(TransactionType.EXPENSE) }}>{TransactionType.EXPENSE}</Button>
                    <Button type="button" color="error" onClick={() => { chooseType(TransactionType.INCOME) }}>{TransactionType.INCOME}</Button>
                    <Button type="button" color="success" onClick={() => { chooseType(TransactionType.TRANSFER) }}>{TransactionType.TRANSFER}</Button>
                </ButtonGroup>
            </Box>
            <form>
                <Grid container spacing={1}>
                    <Grid item xs={12} md={2}>
                        <TextField select label="Category" margin="dense" size="small" fullWidth>
                            {Object.values(WalletType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField id="name" type="datetime-local" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField id="name" type="text" label="Description" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField id="name" type="text" label="Amount" variant="outlined" size="small" margin="dense" autoFocus fullWidth />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField select label="Type" margin="dense" size="small" fullWidth>
                            {Object.values(WalletType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField select label="Payment method" margin="dense" size="small" fullWidth>
                            {Object.values(WalletType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </form> */}

            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={close} variant="contained" color="inherit">Cancel</Button>
                <Button type="button" variant="contained" color="primary">Create</Button>
            </DialogActions>
        </Dialog>
        <AppBar >
            <Container maxWidth="xl">
                <Toolbar >
                    
                </Toolbar>
            </Container>
        </AppBar>
    </>
}
export default Components;