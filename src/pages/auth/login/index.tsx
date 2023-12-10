import { IUserInfo } from "@/common/drafts/prisma";
import { authService } from "@/common/services/firestore";
import AuthLayout from "@/layouts/AuthLayout";
import { setUserInfo } from "@/store/features/auth/authSlice";
import { toggleBackdrop } from "@/store/features/global/globalSlice";
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField, Typography } from '@mui/material';
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
    const { register, handleSubmit, formState: { errors } } = useForm<LoginSubmitForm>({ resolver: yupResolver(loginSchema) })
    const onSubmit: SubmitHandler<LoginSubmitForm> = async (data) => {
        dispatch(toggleBackdrop(true))
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
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(toggleBackdrop(false));
        }
    };

    return <>
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="vdt-flex vdt-w-full vdt-flex-block vdt-flex-col vdt-space-y-2">
                <Typography variant="h6" className="vdt-text-slate-500">Sign in</Typography>
                <Stack className="vdt-flex vdt-flex-col vdt-space-y-3">
                    <TextField id="standard-basic" fullWidth label="Email" type="text" variant="standard"
                        {...register("email", { required: true })}
                        error={errors.email?.message ? true : false}
                        helperText={errors.email?.message} />

                    <TextField id="standard-basic" fullWidth label="Password" type="password" variant="standard"
                        {...register("password", { required: true })}
                        error={errors.password?.message ? true : false}
                        helperText={errors.password?.message} />

                    <Stack className="vdt-flex vdt-flex-col vdt-space-y-2">
                        <div className="vdt-flex vdt-justify-between">
                            <p className="vdt-text-xs vdt-text-slate-500 hover:vdt-text-blue-500"><Link href={"/auth/register"}>New account</Link></p>
                            <p className="vdt-text-xs vdt-text-slate-500 hover:vdt-text-blue-500"><Link href={"/forgot-password"}>Forgot password?</Link></p>
                        </div>
                        <Button type="submit" className="vdt-bg-blue-500 vdt-w-full hover:vdt-bg-blue-600" variant="contained">Login</Button>
                    </Stack>
                </Stack>
            </form>
        </AuthLayout>
    </>
}

export default LoginPage;