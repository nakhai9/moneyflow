import { WalletDetailContainer } from "@/containers";
import DefaultLayout from "@/layouts/DefaultLayout";
import { NextPage } from "next";

const WalletDetailPage: NextPage = () => {
    return (
        <DefaultLayout>
            <WalletDetailContainer />
        </DefaultLayout>
    );
}

export default WalletDetailPage;