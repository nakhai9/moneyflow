import { SubmitHandler, useForm } from "react-hook-form";
// import Dialog from "@/components/dialog/Dialog";
import { API_SERVICES } from "@/common/services/service";
import AuthLayout from "@/layouts/AuthLayout";
import { yupResolver } from '@hookform/resolvers/yup';
import { Backdrop, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import * as yup from 'yup';

const loginSchema = yup.object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(8).required("Password is required")
}).required();

type LoginSubmitForm = yup.InferType<typeof loginSchema>;

const LoginPage: NextPage = () => {

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginSubmitForm>({ resolver: yupResolver(loginSchema) })

    const onSubmit: SubmitHandler<LoginSubmitForm> = async (data) => {
        setIsLoading(true);
        console.log(data);

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