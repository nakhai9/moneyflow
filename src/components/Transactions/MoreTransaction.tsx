import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { VButton } from '../common'
import DropdownMore from '../Dropdowns/DropdownMore'
import { DeleteIcon, EditIcon } from '../common/VIcons'
import { blue, red } from '@mui/material/colors'

type MoreTransactionProps = {
    handleEditTransaction: () => void;
    handleDeleteTransaction: () => void;
}

export default function MoreTransaction({ handleEditTransaction, handleDeleteTransaction }: MoreTransactionProps) {

    const renderEditMore =
        <Grid item container>
            <Grid item >
                <Box sx={{ display: 'flex', alignItems: "center" }} onClick={handleEditTransaction} >
                    <Typography sx={{ color: blue[500], fontWeight: 700, marginRight: "8px" }} >Edit</Typography>
                    <EditIcon sx={{ color: blue[500] }} />
                </Box>
            </Grid>
        </Grid>

    const renderDeleteMore =
        <Grid item container>
            <Grid item>
                <Box sx={{ display: 'flex', alignItems: "center" }} onClick={handleDeleteTransaction} >
                    <Typography sx={{ color: red[500], fontWeight: 700, marginRight: "8px" }}>Delete</Typography>
                    <DeleteIcon sx={{ color: red[500] }} />
                </Box>
            </Grid>
        </Grid>

    const actions = [renderEditMore, renderDeleteMore]

    return (
        <DropdownMore
            actions={actions}
        />
    )
}
