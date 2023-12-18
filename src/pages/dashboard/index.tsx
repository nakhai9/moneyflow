import { DashboardPageContainer } from "@/containers";
import DefaultLayout from "@/layouts/DefaultLayout";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
    return (
        <DefaultLayout>
            <DashboardPageContainer />
        </DefaultLayout>
    )

}
export default Dashboard;