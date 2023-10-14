import { SubmitHandler, useForm } from "react-hook-form";
// import Dialog from "@/components/dialog/Dialog";
import Dialog from "@/components/dialog/Dialog";
import AuthLayout from "@/components/layouts/AuthLayout";
import { NextPage } from "next";
import Link from "next/link";
import { TextField, Button, Paper, Stack, FormControlLabel, Checkbox, Typography, Backdrop, CircularProgress } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from "next/router";
import { useState } from "react";
import { API_SERVICES } from "@/common/services/service";

const schema = yup.object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(8).required("Password is required")
}).required();

type LoginForm = yup.InferType<typeof schema>;

const LoginPage: NextPage = () => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: yupResolver(schema) })

    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
        setIsLoading(true);
        const response = await API_SERVICES.login({
            email: data.email,
            password: data.password
        });

        if (response) {
            localStorage.setItem("token", response.data.accessToken);
            setIsLoading(false);
            router.push("/");
        } else {
            setIsLoading(true);
        }
    };

    return <>
        <Backdrop sx={{ color: '#00a67d', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
            <CircularProgress color="inherit" />
        </Backdrop>

        {/* <AuthLayout className="v1">
            <form className="vdt-flex vdt-w-full vdt-flex-block vdt-flex-col vdt-space-y-4">
                <h3 className="vdt-text-xl vdt-font-semibold vdt-text-slate-500">Sign in</h3>
                <div className="vdt-flex-block vdt-flex-col vdt-text-sm ">
                    <label htmlFor="email" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Email</label>
                    <input id="email" type="email" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div className="vdt-flex vdt-flex-col vdt-text-sm">
                    <label htmlFor="password" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Password</label>
                    <input id="password" type="password" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div className="vdt-flex vdt-flex-col  vdt-space-y-2">
                    <div className="vdt-flex vdt-justify-between">
                        <p className="vdt-text-xs vdt-text-slate-500 hover:vdt-text-blue-500"><Link href={"/auth/register"}>New account</Link></p>
                        <p className="vdt-text-xs vdt-text-slate-500 hover:vdt-text-blue-500"><Link href={"/forgot-password"}>Forgot password?</Link></p>
                    </div>
                    <button className="vdt-bg-blue-500 vdt-py-2 vdt-w-full vdt-text-sm vdt-px-6 vdt-rounded vdt-text-white hover:vdt-bg-green-600 ">Sign in</button>
                </div>
            </form>
        </AuthLayout> */}
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="vdt-flex vdt-w-full vdt-flex-block vdt-flex-col vdt-space-y-2">
                <Typography variant="h6" className="vdt-text-slate-500">Sign in</Typography>
                <Stack className="vdt-flex vdt-flex-col vdt-space-y-3">
                    <TextField id="standard-basic" className="vdt-w-full" label="Email" type="text" variant="standard"
                        {...register("email", { required: true })}
                        error={errors.email?.message ? true : false}
                        helperText={errors.email?.message} />

                    <TextField id="standard-basic" className="vdt-w-full" label="Password" type="password" variant="standard"
                        {...register("password", { required: true })}
                        error={errors.password?.message ? true : false}
                        helperText={errors.password?.message} />

                    <Stack className="vdt-flex vdt-flex-col vdt-space-y-2">
                        <div className="vdt-flex vdt-justify-between">
                            <p className="vdt-text-xs vdt-text-slate-500 hover:vdt-text-blue-500"><Link href={"/auth/register"}>New account</Link></p>
                            <p className="vdt-text-xs vdt-text-slate-500 hover:vdt-text-blue-500"><Link href={"/forgot-password"}>Forgot password?</Link></p>
                        </div>
                        <Button type="submit" className="vdt-bg-green-500 vdt-w-full hover:vdt-bg-green-600" variant="contained">Login</Button>
                    </Stack>
                </Stack>
            </form>
        </AuthLayout>
    </>
}

export default LoginPage;