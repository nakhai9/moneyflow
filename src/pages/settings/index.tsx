import { IRoute } from "@/common/constants/routes";
import { IBase, UserGender } from "@/common/drafts/prisma";
import { FormatDate, formatTimestampToDateString } from "@/common/utils/date";
import DefaultLayout from "@/layouts/DefaultLayout";
import { RootState } from "@/store/store";
import { Avatar, Box, Button, Grid, IconButton, MenuItem, MenuList, Paper, TextField, Typography, styled } from "@mui/material";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs"
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const SettingsPage: NextPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth)
    const [activeIndex, setActiveIndex] = useState<number>(1);
    const [dob, setDob] = useState<string | null>(null);

    const [SETTINGS] = useState<IRoute[]>([
        {
            id: 1,
            text: "Account",
            path: "/account",
            isHide: false
        },
        {
            id: 2,
            text: "Categories",
            path: "/category",
            isHide: false
        }
    ])

    function formatTimestamp(timestamp: Timestamp): string {
        const dateObject = timestamp.toDate();
        const formattedDate = dayjs(dateObject).format('YYYY-MM-DD');
        return formattedDate;
    }

    const accountTemplate = <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="body2" mb={1} fontWeight={600}>Public profile and Avatar</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 4, flex: 1 }}>
                        <TextField size="small" type="text" name="firstName" value={user?.firstName} />
                        <TextField size="small" type="text" name="lastName" value={user?.lastName} />
                    </Box>
                    <IconButton component="label">
                        <Avatar sx={{ width: 64, height: 64 }} alt="a" src={user ? user.photoUrl : ''}></Avatar>
                        <VisuallyHiddenInput type="file" />
                    </IconButton>
                </Box>
            </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="body2" mb={1} fontWeight={600}>Sex and Birthday</Typography>
                <Box sx={{ display: { md: 'flex' }, gap: 4 }}>
                    <TextField
                        select
                        sx={{ width: { md: 100, xs: "100%" } }}
                        size="small"
                        label="Your sex"
                        margin="dense"
                        defaultValue={user?.sex ?? 'other'}
                    >
                        {Object.values(UserGender).map((gender, index) => (
                            <MenuItem key={index} value={gender}>
                                <span className="vdt-capitalize">
                                    {gender}
                                </span>
                            </MenuItem>
                        ))}
                    </TextField>
                    {
                       user?.dob && <TextField
                            type="date"
                            size="small"
                            fullWidth
                            margin="dense"
                            value={formatTimestamp(user?.dob as Timestamp) as string}
                            disabled={true}
                        />
                    }

                </Box>
            </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="body2" mb={1} fontWeight={600}>Email</Typography>
                <TextField size="small" name="email" value={user?.email} sx={{ width: 300 }} />
            </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="body2" mb={1} fontWeight={600}>Phone number</Typography>
                <TextField size="small" name="phoneNumber" value={user?.phoneNumber} sx={{ width: 300 }} />
            </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
            <Button type="submit" color="success" variant="contained" size="small">Update profile</Button>
        </Grid>
        <Grid item xs={12} md={12}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="body1" fontWeight={600}>Delete account</Typography>
                <Typography variant="subtitle2">Once you delete your account, there is no going back. Please be certain.</Typography>
                <Button sx={{ mt: 2 }} type="button" variant="contained" color="error" size="small">Delete account</Button>
            </Paper>
        </Grid>
    </Grid>



    const categoriesTemplate = 'Categories Template: We are building this.'

    return <DefaultLayout>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Account Settings</Typography>
        <Grid container spacing={4}>
            <Grid item xs={0} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Paper>
                    <MenuList>
                        {
                            SETTINGS && SETTINGS.map((st) => <MenuItem selected={st.id === activeIndex} key={st.id} onClick={() => { setActiveIndex(st.id) }}>{st.text}</MenuItem>)
                        }
                    </MenuList>
                </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
                {(activeIndex === 1 && user) ? accountTemplate : categoriesTemplate}
            </Grid>
        </Grid>
    </DefaultLayout>;
}

export default SettingsPage;