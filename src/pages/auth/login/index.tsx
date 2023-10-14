// import Dialog from "@/components/dialog/Dialog";
import Dialog from "@/components/dialog/Dialog";
import AuthLayout from "@/components/layouts/AuthLayout";
import { NextPage } from "next";
import Link from "next/link";
import { TextField, Button, Paper, Stack } from '@mui/material';

const LoginPage: NextPage = () => {
    return <>
        <Dialog />

        {/* <AuthLayout>
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
            <form className="vdt-flex vdt-w-full vdt-flex-block vdt-flex-col vdt-space-y-2">
                <h3 className="vdt-text-xl vdt-font-semibold vdt-text-slate-500">Sign in</h3>
                <Stack className="vdt-flex vdt-flex-col vdt-space-y-3">
                    <TextField id="standard-basic" className="vdt-w-full" label="Email" type="text" variant="standard" />
                    <TextField id="standard-basic" className="vdt-w-full" label="Password" type="password" variant="standard" />
                    <div className="vdt-flex vdt-flex-col  vdt-space-y-2">
                        <div className="vdt-flex vdt-justify-between">
                            <p className="vdt-text-xs vdt-text-slate-500 hover:vdt-text-blue-500"><Link href={"/auth/register"}>New account</Link></p>
                            <p className="vdt-text-xs vdt-text-slate-500 hover:vdt-text-blue-500"><Link href={"/forgot-password"}>Forgot password?</Link></p>
                        </div>
                        <Button className="vdt-bg-blue-500 vdt-w-full hover:vdt-bg-green-600" variant="contained">Login</Button>
                    </div>
                </Stack>
            </form>
        </AuthLayout>
    </>
}

export default LoginPage;