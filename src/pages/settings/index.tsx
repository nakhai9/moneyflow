import { IRoute } from "@/common/constants/routes";
import { FirestoreCollections, IBase, IUser, UserGender } from "@/common/drafts/prisma";
import { firestoreService } from "@/common/services/firestore";
import { formatTimestampToDateString } from "@/common/utils/date";
import DefaultLayout from "@/layouts/DefaultLayout";
import { toggleBackdrop } from "@/store/features/global/globalSlice";
import { RootState } from "@/store/store";
import { yupResolver } from "@hookform/resolvers/yup";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import SecurityIcon from '@mui/icons-material/Security';
import { Alert, Avatar, Box, Button, Grid, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Snackbar, SnackbarOrigin, TextField, Typography, styled } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';

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

const validationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    // email: yup.string().email().required('Email is required'),
    phoneNumber: yup.string().required("Phone number is required"),
    sex: yup.mixed<UserGender>().oneOf(Object.values(UserGender)),
    dob: yup.string().required()
})

type PublicAccountForm = {
    firstName: string;
    lastName: string;
    // email: string;
    phoneNumber: string;
    sex?: UserGender;
    dob: string;
}

const SettingsPage: NextPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth)
    const [activeIndex, setActiveIndex] = useState<number>(1);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [snackPosition, setSnackPosition] = useState<SnackbarOrigin>({
        vertical: 'top',
        horizontal: 'center',
    });

    const [ACCOUNT_SETTINGS] = useState<IRoute[]>([
        {
            id: 1,
            text: "Account",
            path: "/account",
            isHide: false,
            icon: <AccountCircleIcon fontSize="small" />
        },
        {
            id: 2,
            text: "Categories",
            path: "/category",
            isHide: false,
            icon: <CategoryIcon fontSize="small" />
        },
        {
            id: 3,
            text: "Password and Security",
            path: "/security",
            isHide: false,
            icon: <SecurityIcon fontSize="small" />
        }
    ]);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<PublicAccountForm>({
        defaultValues: {
            firstName: '',
            lastName: '',
            sex: UserGender.OTHER,
            // email: '',
            phoneNumber: '',
            dob: ""
        },
        resolver: yupResolver(validationSchema)
    });

    const setFormValue = (user: IUser & IBase) => {
        setValue("firstName", user.firstName);
        setValue("lastName", user.lastName);
        setValue("sex", user.sex);
        // setValue("email", user.email);
        setValue("phoneNumber", user.phoneNumber);
        setValue("dob", formatTimestampToDateString(user?.dob as Timestamp));
    }

    const onSubmit = async (data: PublicAccountForm) => {
        try {
            if (user && user.id) {
                await firestoreService.updateDoc(FirestoreCollections.USERS, user.id, data);
            }
            setIsUpdated(true);
        } catch (error) {
            setHasError(true)
        }

    }

    const handleClose = () => {
        setIsUpdated(false);
    }

    useEffect(() => {
        dispatch(toggleBackdrop(true));
        if (user) {
            setFormValue(user);
            dispatch(toggleBackdrop(false));
        }
    }, [user, dispatch]);

    const accountTemplate = <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="body2" mb={1} fontWeight={600}>Public profile and Avatar</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 4, flex: 1 }}>
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field }) => (<TextField {...field} size="small" type="text" />)}
                            />
                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (<TextField {...field} size="small" type="text" />)}
                            />
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
                    <Box sx={{ display: { md: 'flex', xs: 'flex' }, gap: 4 }}>
                        <Controller name="sex" control={control} render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                sx={{ width: { md: 200, xs: 200 } }}
                                size="small"
                                label="Your sex"
                                margin="dense"
                            >
                                {Object.values(UserGender).map((gender, index) => (
                                    <MenuItem key={index} value={gender}>
                                        <span className="vdt-capitalize">
                                            {gender}
                                        </span>
                                    </MenuItem>
                                ))}
                            </TextField>)}
                        />

                        <Controller control={control} name="dob" render={({ field }) => (
                            <TextField
                                {...field}
                                type="date"
                                size="small"
                                label="Month / Day / Year (Optional)"
                                fullWidth
                                margin="dense"
                                disabled={true}
                            />)}
                        />
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="body2" mb={1} fontWeight={600}>Email</Typography>
                    <div>
                        <Typography variant="subtitle2">Currently, you cannot change the email <span className="vdt-font-semibold vdt-cursor-pointer hover:vdt-text-blue-500">{user?.email}</span> because you are using it to log in to this account.</Typography>
                    </div>
                    {/* <Controller control={control} name="email" render={({ field }) => <TextField {...field} size="small" sx={{ width: 300 }} disabled={true} />} /> */}
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="body2" mb={1} fontWeight={600}>Phone number</Typography>
                    <Controller control={control} name="phoneNumber" render={({ field }) => <TextField {...field} size="small" sx={{ width: 300 }} />} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
                <Button type="submit" color="success" variant="contained" size="small">Update profile</Button>
            </Grid>
            <Grid item xs={12} md={12}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="body1" fontWeight={600}>Delete account</Typography>
                    <Typography variant="subtitle2">Once you delete your account, there is no going back. Please be certain.</Typography>
                    <Button sx={{ mt: 2 }} type="button" variant="contained" color="error" size="small" disabled={true}>Delete account</Button>
                </Paper>
            </Grid>
        </Grid>
    </form>

    const categoriesTemplate = 'Categories Template: We are building this.'
    const securityTemplate = 'Security Template: We are building this.'

    return <DefaultLayout>
        <Snackbar anchorOrigin={snackPosition} open={isUpdated} onClose={handleClose}>
            <Alert severity="success" sx={{ minWidth: 300 }}>{isUpdated ? "Your changes have been successfully saved." : "Failed to save."}</Alert>
        </Snackbar>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Account Settings</Typography>
        <Grid container spacing={4}>
            <Grid item xs={0} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Paper>
                    <MenuList>
                        {
                            ACCOUNT_SETTINGS && ACCOUNT_SETTINGS.map((st) => <MenuItem selected={st.id === activeIndex} key={st.id} onClick={() => { setActiveIndex(st.id) }}>
                                <ListItemIcon>
                                    {st.icon}
                                </ListItemIcon>
                                <ListItemText>
                                    {st.text}
                                </ListItemText>
                            </MenuItem>)
                        }
                    </MenuList>
                </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
                {(activeIndex === 1) ? accountTemplate : categoriesTemplate}
            </Grid>
        </Grid>
    </DefaultLayout>;
}

export default SettingsPage;