import Dialog from "@/components/dialog/Dialog";
import AuthLayout from "@/components/layouts/AuthLayout";
import { NextPage } from "next";
import Link from "next/link";

const RegisterPage: NextPage = () => {
    return <>
        <Dialog />
        {/* <AuthLayout>
            <form className="vdt-flex vdt-w-full vdt-flex-block vdt-flex-col vdt-space-y-2">
                <h3 className="vdt-text-xl vdt-font-semibold vdt-text-slate-500">New account</h3>
                <div className="vdt-flex-block vdt-flex-col vdt-text-sm ">
                    <label htmlFor="fullName" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Full name</label>
                    <input id="fullName" type="text" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div className="vdt-flex-block vdt-flex-col vdt-text-sm ">
                    <label htmlFor="email" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Email</label>
                    <input id="email" type="email" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div className="vdt-flex-block vdt-flex-col vdt-text-sm ">
                    <label htmlFor="email" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Phone</label>
                    <input id="email" type="email" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div className="vdt-flex vdt-flex-col vdt-text-sm">
                    <label htmlFor="password" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Password</label>
                    <input id="password" type="password" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div className="vdt-flex vdt-flex-col vdt-text-sm">
                    <label htmlFor="confirmPassword" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Confirm password</label>
                    <input id="confirmPassword" type="password" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div className="vdt-flex vdt-flex-col vdt-space-y-2">
                    <div className="vdt-flex vdt-justify-end">
                        <p className="vdt-text-sm vdt-text-blue-500 hover:vdt-text-green-500"><Link href={"/auth/login"}>Have a account. Go to log in</Link></p>
                    </div>
                    <button className="vdt-bg-green-500 vdt-py-2 vdt-w-full vdt-text-sm vdt-px-6 vdt-rounded vdt-text-white hover:vdt-bg-green-600 ">Sign up</button>
                </div>
            </form>
        </AuthLayout> */}
        <AuthLayout>
            Our system is currently under maintenance.
        </AuthLayout>
    </>
}

export default RegisterPage;