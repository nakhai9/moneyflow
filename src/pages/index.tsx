import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { IWallet } from "@/common/interfaces/wallet";
import { WalletType } from "@/common/enums/transaction-type";

const wallets: IWallet[] = [
  {
    id: 1,
    name: "Eximbank Account",
    amount: 3461920,
    currency: "VND",
    type: WalletType.CASH,
    userId: 1
  },
  {
    id: 2,
    name: "Loan Notebook",
    amount: 600000,
    currency: "VND",
    type: WalletType.LOAN,
    userId: 1
  }
]

const Home: NextPage = () => {
  const router = useRouter();

  const goto = () => {
    router.push('/wallet');
  }

  const openWallet = (id: number) => {
    router.push(`wallet/${id}`);
  }

  return (
    <DefaultLayout>
      <div className="vdt-container vdt-mx-auto vdt-p-4 ">
        <h2 className="vdt-mb-2 vdt-text-xl vdt-font-semibold vdt-text-slate-500">Wallets</h2>
        <div className="vdt-grid vdt-grid-cols-5 vdt-gap-4">
          {
            wallets.length > 0 && wallets.map((item, index: number) => (<div key={index} onClick={() => { openWallet(item.id) }} className="vdt-flex vdt-h-28 vdt-shadow-lg vdt-bg-white vdt-rounded vdt-cursor-pointer vdt-font-thin vdt-overflow-hidden hover:vdt-shadow-lg">
              <div className="vdt-w-5 vdt-bg-blue-500"></div>
              <div className="vdt-flex vdt-flex-col vdt-justify-center vdt-pl-4">
                <div className="vdt-text-xl">{item.name}</div>
                <div className="vdt-capitalize">{item.type}</div>
                <div className="vdt-text-xl vdt-text-blue-500 vdt-font-semibold">{item.amount.toLocaleString()} <span>{item.currency}</span></div>
              </div>
            </div>))
          }
          <div className="vdt-flex vdt-flex-col vdt-justify-start vdt-font-thin vdt-space-y-4">
            <button type="button" className="vdt-bg-white vdt-p-2 vdt-rounded vdt-text-sm vdt-font-semibold vdt-text-blue-500 vdt-shadow hover:vdt-shadow-lg" onClick={goto}>  <FontAwesomeIcon icon={faPlus} className="" /> Add New Wallet</button>
            <button type="button" className="vdt-bg-white vdt-p-2 vdt-rounded vdt-text-sm vdt-font-semibold vdt-text-blue-500 vdt-shadow hover:vdt-shadow-lg">Connect a Bank Account</button>
          </div>
        </div>
        {/* <h2 className="vdt-mb-2 vdt-mt-6 vdt-text-xl vdt-font-semibold vdt-text-slate-500">Overview</h2>
        <div className="vdt-grid vdt-grid-cols-3 vdt-gap-4">
          <div className="vdt-bg-white vdt-rounded vdt-p-4">
            <h3 className="vdt-font-semibold vdt-text-slate-500">Total Balance</h3>
            <div className="vdt-text-xl vdt-text-blue-500">0.00 <span>USD</span></div>
          </div>
          <div className="vdt-bg-white vdt-rounded vdt-p-4">
            <h3 className="vdt-font-semibold vdt-text-slate-500">Total Period Income</h3>
            <div className="vdt-text-xl vdt-text-blue-500">0.00 <span>USD</span></div>
          </div>
          <div className="vdt-bg-white vdt-rounded vdt-p-4">
            <h3 className="vdt-font-semibold vdt-text-slate-500">Total Period Expenses</h3>
            <div className="vdt-text-xl vdt-text-blue-500">0.00 <span>USD</span></div>
          </div>
        </div> */}
      </div>
    </DefaultLayout>
  )
}
export default Home;