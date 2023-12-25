import { IUserInfo } from "@/common/interfaces/user";
import { authService } from "@/common/services/firestore";
import { AppSnackbar } from "@/components";
import AuthLayout from "@/layouts/AuthLayout";
import { setUserInfo } from "@/store/features/auth/authSlice";
import { togglePageLoading } from "@/store/features/global/globalSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from 'yup';

const loginSchema = yup.object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(8).required("Password is required")
}).required();

type LoginSubmitForm = yup.InferType<typeof loginSchema>;

const LoginPage: NextPage = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginSubmitForm>({ resolver: yupResolver(loginSchema) })
    const [error, setError] = useState<any>(null);
    const [open, setOpen] = useState<boolean>(false);
    const onSubmit: SubmitHandler<LoginSubmitForm> = async (data) => {
        dispatch(togglePageLoading(true))
        try {
            const { userCredential, error } = await authService.signIn({ ...data });
            if (userCredential && userCredential.user) {
                const userInfo: IUserInfo = {
                    id: userCredential.user.uid,
                    email: userCredential.user.email!
                }
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                dispatch(setUserInfo(userInfo));
                router.push("/dashboard");
            } else {
                setError(error);
                setOpen(true);
                reset();
            }
        } catch (error) {
            throw error
        } finally {
            dispatch(togglePageLoading(false));
        }
    };

    const handleCloseSnackbar = () => {
        setOpen(false);
    };


    return <>
        <AppSnackbar open={open} severity="error" message={error && "Login failed"} handleClose={handleCloseSnackbar}/>

        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="tw-flex tw-w-full tw-flex-block tw-flex-col tw-space-y-2">
                <Typography variant="h6" className="tw-text-slate-500">Sign in</Typography>
                <Stack className="tw-flex tw-flex-col tw-space-y-3">
                    <TextField id="standard-basic" fullWidth label="Email" type="text" variant="standard"
                        {...register("email", { required: true })}
                        error={errors.email?.message ? true : false}
                        helperText={errors.email?.message} />

                    <TextField id="standard-basic" fullWidth label="Password" type="password" variant="standard"
                        {...register("password", { required: true })}
                        error={errors.password?.message ? true : false}
                        helperText={errors.password?.message} />

                    <Stack className="tw-flex tw-flex-col tw-space-y-2">
                        <div className="tw-flex tw-justify-between">
                            <p className="tw-text-xs tw-text-slate-500 hover:tw-text-blue-500"><Link href={"/auth/register"}>New account</Link></p>
                            <p className="tw-text-xs tw-text-slate-500 hover:tw-text-blue-500"><Link href={"/forgot-password"}>Forgot password?</Link></p>
                        </div>
                        <Button type="submit" className="tw-bg-blue-500 tw-w-full hover:tw-bg-blue-600" variant="contained">Login</Button>
                    </Stack>
                </Stack>
            </form>
        </AuthLayout>
    </>
}

export default LoginPage;