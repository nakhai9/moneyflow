import { useRouter } from "next/router";
import { FC } from "react";

type WalletSettingsContainerProps = {}
const WalletSettingsContainer: FC<WalletSettingsContainerProps> = ({}) => {
    const router = useRouter();
    return <>Wallet have the <span className="tw-font-semibold">{router.query.id as string}</span></>
}
export default WalletSettingsContainer;