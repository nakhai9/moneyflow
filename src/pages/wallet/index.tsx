import WalletForm from "@/components/forms/WalletForm";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const WalletPage: NextPage = () => {
    return (<DefaultLayout>
        <div className="vdt-pt-8 vdt-h-full vdt-flex vdt-flex-col">
            <div className="vdt-bg-white vdt-w-4/5 vdt-mx-auto vdt-rounded-t-xl vdt-overflow-auto vdt-flex-1 vdt-pt-6 vdt-px-6 ">
                <WalletForm />
            </div>
        </div>
    </DefaultLayout>);
}

export default WalletPage;