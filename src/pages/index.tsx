import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import DefaultLayout from "@/components/layouts/DefaultLayout";

const Home: NextPage = () => {
  const router = useRouter();

  const goto = () => {
    router.push('/wallet');
  }

  const openWallet = (id: string) => {
    router.push(`wallet/${id}`);
  }

  const [wallets, setWallets] = useState<any[]>([
    {
      id: "123-1",
      walletName: "Cash Wallet",
      walletType: "Cash",
      initial: 292,
      currency: "USD"
    },
    {
      id: "123-2",
      walletName: "Saving Wallet",
      walletType: "Cash",
      initial: 292,
      currency: "USD"
    },
    {
      id: "123-3",
      walletName: "First wallet",
      walletType: "Cash",
      initial: 292,
      currency: "USD"
    }
  ]);

  return (
    <DefaultLayout>
      <div className="vdt-container vdt-mx-auto vdt-p-4 ">
        <h2 className="vdt-mb-2 vdt-text-xl vdt-font-semibold vdt-text-slate-500">Wallets</h2>
        <div className="vdt-grid vdt-grid-cols-5 vdt-gap-4">
          {
            wallets.length > 0 && wallets.map((item, index: number) => (<div key={index} onClick={() => { openWallet(item.id) }} className="vdt-flex vdt-h-28 vdt-shadow vdt-bg-white vdt-rounded vdt-cursor-pointer vdt-font-thin vdt-overflow-hidden hover:vdt-shadow-lg">
              <div className="vdt-w-10 vdt-bg-green-300"></div>
              <div className="vdt-flex vdt-flex-col vdt-justify-center vdt-pl-4">
                <div className="vdt-text-xl">{item.walletName}</div>
                <div>Cash</div>
                <div className="vdt-text-xl vdt-text-green-500">{item.initial} <span>{item.currency}</span></div>
              </div>
            </div>))
          }
          <div className="vdt-flex vdt-flex-col vdt-justify-start vdt-font-thin vdt-space-y-4">
            <button type="button" className="vdt-bg-white vdt-p-2 vdt-rounded vdt-text-sm vdt-font-semibold vdt-text-green-500 vdt-shadow hover:vdt-shadow-lg" onClick={goto}>  <FontAwesomeIcon icon={faPlus} className="" /> Add New Wallet</button>
            <button type="button" className="vdt-bg-white vdt-p-2 vdt-rounded vdt-text-sm vdt-font-semibold vdt-text-green-500 vdt-shadow hover:vdt-shadow-lg">Connect a Bank Account</button>
          </div>
        </div>
        <h2 className="vdt-mb-2 vdt-mt-6 vdt-text-xl vdt-font-semibold vdt-text-slate-500">Overview</h2>
        <div className="vdt-grid vdt-grid-cols-3 vdt-gap-4">
          <div className="vdt-bg-white vdt-rounded vdt-p-4">
            <h3 className="vdt-font-semibold vdt-text-slate-500">Total Balance</h3>
            <div className="vdt-text-xl vdt-text-green-500">0.00 <span>USD</span></div>
          </div>
          <div className="vdt-bg-white vdt-rounded vdt-p-4">
            <h3 className="vdt-font-semibold vdt-text-slate-500">Total Period Income</h3>
            <div className="vdt-text-xl vdt-text-green-500">0.00 <span>USD</span></div>
          </div>
          <div className="vdt-bg-white vdt-rounded vdt-p-4">
            <h3 className="vdt-font-semibold vdt-text-slate-500">Total Period Expenses</h3>
            <div className="vdt-text-xl vdt-text-green-500">0.00 <span>USD</span></div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
export default Home;