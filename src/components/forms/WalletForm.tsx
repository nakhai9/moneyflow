import React from 'react'
import { SubmitHandler, useForm } from "react-hook-form";

type WalletFormType = {};



const WalletForm: React.FC<WalletFormType> = () => {

    return (
        <form className="vdt-w-80 vdt-flex vdt-flex-col vdt-space-y-4 vdt-text-slate-500">
            <h3 className="vdt-text-xl vdt-font-semibold vdt-text-slate-500">Create New Wallet</h3>

            <div className="vdt-flex vdt-flex-col vdt-text-sm">
                <label htmlFor="name" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Wallet Name</label>
                <input id="name" type="text" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none"  />
            </div>

            <div className="vdt-flex vdt-text-sm vdt-gap-4">
                <div className="vdt-flex vdt-flex-col vdt-flex-1">
                    <label htmlFor="income" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Initial balance (Income value)</label>
                    <input id="income" type="text" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div>
                    <label htmlFor="currency" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Wallet currency</label>
                    <select name="" id="currency" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none">
                        <option value="1">USD</option>
                    </select>
                </div>
            </div>

            <div className="vdt-flex vdt-flex-col vdt-text-sm">
                <label htmlFor="type" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Wallet type</label>
                <select name="" id="type" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none">
                    <option value="1">Saving</option>
                    <option value="4">Credit</option>
                    <option value="2">Loan</option>
                    <option value="3">Debt</option>
                    <option value="5">Cash</option>
                </select>
            </div>

            <div className="vdt-flex vdt-justify-end vdt-space-x-4">
                <button className="vdt-bg-slate-500 vdt-py-2 vdt-px-6 vdt-rounded vdt-text-white hover:vdt-bg-slate-600 vdt-inline vdt-text-sm">Cancel</button>
                <button className="vdt-bg-green-500 vdt-py-2 vdt-px-6 vdt-rounded vdt-text-white hover:vdt-bg-green-600 vdt-inline vdt-text-sm">Create</button>
            </div>
        </form>
    )
}

export default WalletForm;
