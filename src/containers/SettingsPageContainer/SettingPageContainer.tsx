import { AccountCircleIcon, CategoryIcon, CreateIcon, DeleteIcon, SecurityIcon } from '@/common/constants/icons';
import { IRoute } from '@/common/constants/routes';
import { UserGender } from '@/common/enums/user';
import { IBase } from '@/common/interfaces/base';
import { ICategory } from '@/common/interfaces/category';
import { IUpdateUser, IUser } from '@/common/interfaces/user';
import { authService, categoryService, imageService } from '@/common/services/firestore';
import { formatTimestampToDateString } from '@/common/utils/date';
import { ConfirmModal } from '@/components';
import useModal from '@/hooks/useModal';
import { RootState } from '@/store/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Avatar, Box, Button, Grid, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Snackbar, SnackbarOrigin, TextField, Tooltip, Typography, styled } from '@mui/material';
import { Timestamp } from 'firebase/firestore';
import { FC, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

type SettingPageContainerProps = {}

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

type PublicAccountForm = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sex?: UserGender;
    dob: string;
}

const validationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup.string().required("Phone number is required"),
    sex: yup.mixed<UserGender>().oneOf(Object.values(UserGender)),
    dob: yup.string().required()
})

const SettingPageContainer: FC<SettingPageContainerProps> = ({ }) => {

    const { user } = useSelector((state: RootState) => state.auth)
    const [activeIndex, setActiveIndex] = useState<number>(1);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [snackPosition, setSnackPosition] = useState<SnackbarOrigin>({
        vertical: 'top',
        horizontal: 'center',
    });
    const [categories, setCategories] = useState<(ICategory & IBase)[] | null>(null);
    const { open, onOpen, onClose } = useModal();

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
            dob: "2020-01-01"
        },
        resolver: yupResolver(validationSchema)
    });
    const [avatarUpload, setAvatarUpload] = useState<string | null>(null);

    const setFormValue = useCallback(async (user: IUser & IBase) => {
        setValue("firstName", user.firstName);
        setValue("lastName", user.lastName);
        setValue("sex", user.sex);
        // setValue("email", user.email);
        setValue("phoneNumber", user.phoneNumber);
        setValue("dob", user?.dob ? formatTimestampToDateString(user?.dob as Timestamp) : "2020-01-20");
    }, [setValue])

    const onSubmit = async (data: PublicAccountForm) => {
        try {
            const newUpdate: IUpdateUser = {
                ...data,
            }
            if (avatarUpload) {
                newUpdate['photoUrl'] = avatarUpload;
            }
            newUpdate["dob"] = Timestamp.fromDate(new Date(newUpdate["dob"] as string));
            if (user && user.id) {
                await authService.updateUserInfo(user.id, newUpdate);
            }
            setIsUpdated(true);
        } catch (error) {
            setHasError(true);
            setIsUpdated(false);
        }
    }

    const handleClose = () => {
        setIsUpdated(false);
    }

    const fetchCategories = useCallback(async () => {
        try {
            const cats = await categoryService.getCategories();
            setCategories(cats);
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleAvatarChange = async (event: any) => {
        const selectedFile = event.target.files[0] as File;
        try {
            const url = await imageService.getDownloadURL(selectedFile);
            setAvatarUpload(url)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            setFormValue(user);
            fetchCategories();
        }
    }, [user, fetchCategories, setFormValue]);

    const AccountTemplate = () => (<form onSubmit={handleSubmit(onSubmit)}>
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
                            <Avatar sx={{ width: 64, height: 64 }} alt="a" src={avatarUpload ?? user?.photoUrl}></Avatar>
                            <VisuallyHiddenInput type="file" onChange={handleAvatarChange} />
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
                                        <span className="tw-capitalize">
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
                        <Typography variant="subtitle2">Currently, you cannot change the email <span className="tw-font-semibold tw-cursor-pointer hover:tw-text-blue-500">{user?.email}</span> because you are using it to log in to this account.</Typography>
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
                    <Button sx={{ mt: 2 }} type="button" variant="contained" color="error" size="small" onClick={handleOpenModal} >Delete account</Button>
                </Paper>
            </Grid>
        </Grid>
    </form>)

    const SecurityTemplate = () => <>Security template</>

    const deleteUser = async () => {
        console.log("handle delete")
        try {
            await authService.deleteUser();            
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenModal = () => {
        onOpen();
    }

    const handleCloseModal = () => {
        onClose();
    }

    return (
        <div>
            <Snackbar anchorOrigin={snackPosition} open={isUpdated} onClose={handleClose}>
                <Alert severity="success" sx={{ minWidth: 300 }}>{isUpdated ? "Your changes have been successfully saved." : "Failed to save."}</Alert>
            </Snackbar>
            <ConfirmModal open={open} title='Delete Account' type='delete' onConfirm={deleteUser} onClose={handleCloseModal} message='Are you sure you want to delete your account?'/>
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
                    {(activeIndex === 1) ? <AccountTemplate /> : <SecurityTemplate />}
                </Grid>
            </Grid>
        </div>
    )
}

export default SettingPageContainer