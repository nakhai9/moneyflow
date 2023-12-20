import { WalletSettingsContainer } from "@/containers";
import DefaultLayout from "@/layouts/DefaultLayout";
import { NextPage } from "next";

const WalletSettingsPage: NextPage = () => {

    return (
        <DefaultLayout>
            <WalletSettingsContainer />
        </DefaultLayout>
    );
}

export default WalletSettingsPage;