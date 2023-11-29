import { firestoreService } from "@/common/services/firestore";
import AuthLayout from "@/layouts/AuthLayout";
import { toggleBackdrop } from "@/store/features/global/globalSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from 'yup';

const signupSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup.string().required("Phone is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(8).required("Password is required"),
    confirmPassword: yup.string().min(8).required("Confirm password is required").oneOf([yup.ref("password")], "Passwords do not match")
}).required();

type SignUpForm = yup.InferType<typeof signupSchema>;


const RegisterPage: NextPage = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({ resolver: yupResolver(signupSchema) })

    const onSubmit: SubmitHandler<SignUpForm> = async (data) => {

        if (data.password === data.confirmPassword) {
            dispatch(toggleBackdrop(true));
            try {
                const response = await firestoreService.signUp({
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    password: data.password
                })
                if (response) {
                    localStorage.clear();
                    localStorage.setItem("user", JSON.stringify({
                        email: response.user.email,
                        id: response.user.uid
                    }));
                    router.push("/dashboard");
                }
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(toggleBackdrop(false));
            }
        }
    }

    return <>
        <AuthLayout>
            <form onSubmit={handleSubmit(onSubmit)} className="vdt-flex vdt-w-full vdt-flex-block vdt-flex-col vdt-space-y-2">
                <Typography variant="h6" className="vdt-text-slate-500">Sign up</Typography>
                <Stack className="vdt-flex vdt-flex-col vdt-space-y-3">
                    <TextField id="standard-basic" fullWidth label="First name" type="text" variant="standard" autoFocus
                        {...register("firstName", { required: true })}
                        error={errors.firstName?.message ? true : false}
                        helperText={errors.firstName?.message} />

                    <TextField id="standard-basic" fullWidth label="Last name" type="text" variant="standard"
                        {...register("lastName", { required: true })}
                        error={errors.lastName?.message ? true : false}
                        helperText={errors.lastName?.message} />

                    <TextField id="standard-basic" fullWidth label="Email" type="text" variant="standard"
                        {...register("email", { required: true })}
                        error={errors.email?.message ? true : false}
                        helperText={errors.email?.message} />

                    <TextField id="standard-basic" fullWidth label="Phone" type="text" variant="standard"
                        {...register("phoneNumber", { required: true })}
                        error={errors.phoneNumber?.message ? true : false}
                        helperText={errors.phoneNumber?.message} />

                    <TextField id="standard-basic" fullWidth label="Password" type="password" variant="standard"
                        {...register("password", { required: true })}
                        error={errors.password?.message ? true : false}
                        helperText={errors.password?.message} />

                    <TextField id="standard-basic" fullWidth label="Confirm Password" type="password" variant="standard"
                        {...register("confirmPassword", { required: true })}
                        error={errors.confirmPassword?.message ? true : false}
                        helperText={errors.confirmPassword?.message} />

                    <Stack className="vdt-flex vdt-flex-col vdt-space-y-2">
                        <Button type="submit" className="vdt-bg-blue-500 vdt-w-full hover:vdt-bg-blue-600" variant="contained">Sign up</Button>
                    </Stack>
                </Stack>
            </form>
        </AuthLayout>
    </>
}

export default RegisterPage;