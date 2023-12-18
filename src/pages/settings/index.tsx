import { SettingPageContainer } from "@/containers";
import DefaultLayout from "@/layouts/DefaultLayout";
import { NextPage } from "next";

const SettingsPage: NextPage = () => {
    return <DefaultLayout>
        <SettingPageContainer />
    </DefaultLayout>;
}

export default SettingsPage;