import { TransactionType, WalletType } from "@/common/enums/transaction-type";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useState } from "react";

type ComponentsProps = {}
const Components: React.FC<ComponentsProps> = () => {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('lg');
    const [color, setColor] = useState('');
    const colors = ['Red', 'Blue', 'Green'];

    const chooseType = (type: TransactionType) => {

    }
    return <Dialog open={true} fullWidth={fullWidth} maxWidth={maxWidth}>
        <DialogTitle>Create wallet / transaction </DialogTitle>
        <DialogContent>
            <Box>
                <ButtonGroup variant="contained" >
                    <Button type="button" onClick={() => { chooseType(TransactionType.EXPENSE) }}>{TransactionType.EXPENSE}</Button>
                    <Button type="button" onClick={() => { chooseType(TransactionType.INCOME) }}>{TransactionType.INCOME}</Button>
                    <Button type="button" onClick={() => { chooseType(TransactionType.TRANSFER) }}>{TransactionType.TRANSFER}</Button>
                </ButtonGroup>
            </Box>
            <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
                <FormControl variant="outlined" margin="dense">
                    <InputLabel id="cat-label" size="small">Category</InputLabel>
                    <Select
                        labelId="cat-label"
                        id="cat-select"
                        value={color}
                        label=""
                        size="small"
                    >
                        {Object.values(WalletType).map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    id="name"
                    type="datetime-local"
                    variant="outlined"
                    size="small"
                    margin="dense"
                    autoFocus
                />
                <TextField
                    id="name"
                    type="text"
                    label="Description"
                    variant="outlined"
                    size="small"
                    margin="dense"
                    autoFocus
                />
                <TextField
                    id="name"
                    type="text"
                    label="Amount"
                    variant="outlined"
                    size="small"
                    margin="dense"
                    autoFocus
                />
                <FormControl variant="outlined" margin="dense">
                    <InputLabel id="color-label" size="small">Type</InputLabel>
                    <Select
                        labelId="color-label"
                        id="color-select"
                        value={color}
                        label="Color"
                        size="small"
                    >
                        {Object.values(WalletType).map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Grid container spacing={2}>
                <Grid item>
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel id="cat-label" size="small">Category</InputLabel>
                        <Select
                            labelId="cat-label"
                            id="cat-select"
                            value={color}
                            label=""
                            size="small"
                        >
                            {Object.values(WalletType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <TextField
                        id="name"
                        type="datetime-local"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        autoFocus
                    />
                </Grid>
                <Grid item>
                    <TextField
                        id="name"
                        type="text"
                        label="Description"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        autoFocus
                    />
                </Grid>
                <Grid item>
                    <TextField
                        id="name"
                        type="text"
                        label="Amount"
                        variant="outlined"
                        size="small"
                        margin="dense"
                        autoFocus
                    />
                </Grid>
                <Grid item>
                    <FormControl variant="outlined" margin="dense">
                        <InputLabel id="color-label" size="small">Type</InputLabel>
                        <Select
                            labelId="color-label"
                            id="color-select"
                            value={color}
                            label="Color"
                            size="small"
                        >
                            {Object.values(WalletType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {/* <TextField
                id="name"
                type="text"
                label="Name"
                variant="outlined"
                size="small"
                margin="dense"
                autoFocus
                fullWidth
            />
            <div className="vdt-flex">
                <TextField
                    id="initial"
                    type="text"
                    label="Amount"
                    variant="outlined"
                    size="small"
                    margin="dense"
                    autoFocus
                    fullWidth
                />
                <FormControl fullWidth variant="outlined" margin="dense">
                    <InputLabel id="color-label" size="small">Type</InputLabel>
                    <Select
                        labelId="color-label"
                        id="color-select"
                        value={color}
                        label="Color"
                        size="small"
                    >
                        {Object.values(WalletType).map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <TextField
                id="description"
                type="text"
                label="Description"
                variant="outlined"
                size="small"
                margin="dense"
                autoFocus
                fullWidth
            />
            <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel id="color-label" size="small">Type</InputLabel>
                <Select
                    labelId="color-label"
                    id="color-select"
                    value={color}
                    label="Color"
                    size="small"
                >
                    {colors.map((c) => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl> */}

        </DialogContent>
        <DialogActions>
            <Button type="button" variant="contained" color="inherit">Cancel</Button>
            <Button type="button" variant="contained" color="primary">Create</Button>
        </DialogActions>
    </Dialog>
}
export default Components;