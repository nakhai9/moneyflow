import { TransactionType } from "@/common/enums/transaction-type";
import { useState } from "react";

type TransactionFormProps = {}
const TransactionForm: React.FC<TransactionFormProps> = () => {
    const [active, setActive] = useState<string>(TransactionType.DEFAULT);
    const chooseType = (transactionType: string) => {
        setActive(transactionType);
    }
    return (<>
        <div className="vdt-flex vdt-flex-col vdt-space-y-2 vdt-text-slate-500 vdt-bg-white vdt-p-6 vdt-rounded">
            <h3 className="vdt-text-xl vdt-font-semibold vdt-text-slate-500">Add New Transaction </h3>

            <div className="vdt-flex vdt-justify-end vdt-space-x-2">
                <button type="button" onClick={() => { chooseType(TransactionType.EXPENSE) }} className={`vdt-py-2 vdt-px-6 vdt-rounded vdt-text-white vdt-inline vdt-text-sm ${active == TransactionType.EXPENSE ? 'vdt-bg-red-400 hover:vdt-bg-red-300' : 'vdt-bg-slate-300'}`}>Expense</button>
                <button type="button" onClick={() => { chooseType(TransactionType.INCOME) }} className={`vdt-py-2 vdt-px-6 vdt-rounded vdt-text-white vdt-inline vdt-text-sm ${active == TransactionType.INCOME ? 'vdt-bg-green-400 hover:vdt-bg-green-300' : 'vdt-bg-slate-300'}`}>Income</button>
                <button type="button" onClick={() => { chooseType(TransactionType.TRANSFER) }} className={`vdt-py-2 vdt-px-6 vdt-rounded vdt-text-white vdt-inline vdt-text-sm ${active == TransactionType.TRANSFER ? 'vdt-bg-slate-400 hover:vdt-bg-slate-300' : 'vdt-bg-slate-300'}`}>Transfer</button>
            </div>

            <div className="vdt-flex vdt-flex-col vdt-text-sm">
                <label htmlFor="type" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Category</label>
                <select name="" id="type" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none">
                    <option value="1">Cash Wallet</option>
                </select>
            </div>

            <div className="vdt-flex vdt-flex-col vdt-text-sm">
                <label htmlFor="date" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Date</label>
                <input id="date" type="date" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
            </div>

            {
                active === TransactionType.EXPENSE && <div className="vdt-flex vdt-flex-col vdt-text-sm">
                    <label htmlFor="payee" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Payee</label>
                    <input id="payee" type="text" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
            }

            {active === TransactionType.INCOME &&
                <div className="vdt-flex vdt-flex-col vdt-text-sm">
                    <label htmlFor="payer" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Payer</label>
                    <input id="payer" type="text" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
            }

            <div className="vdt-flex vdt-text-sm vdt-gap-4">
                <div className="vdt-flex vdt-flex-col vdt-flex-1">
                    <label htmlFor="amount" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Amount</label>
                    <input id="amount" type="text" placeholder="" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" />
                </div>
                <div>
                    <label htmlFor="currency" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Currency</label>
                    <select name="" id="currency" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none">
                        <option value="1">USD</option>
                    </select>
                </div>
            </div>

            <div className="vdt-flex vdt-flex-col vdt-text-sm">
                <label htmlFor="type" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Wallet</label>
                <select name="" id="type" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none">
                    <option value="1">Cash Wallet</option>
                </select>
            </div>

            <div className="vdt-flex vdt-flex-col vdt-text-sm">
                <label htmlFor="note" className="vdt-text-slate-500 vdt-block vdt-mb-1 vdt-font-semibold">Note</label>
                <textarea name="note" id="note" className="vdt-border vdt-w-full vdt-rounded vdt-p-2 vdt-outline-none" rows={3}></textarea>
            </div>

            <div className="vdt-flex vdt-justify-end vdt-space-x-4">
                <button className="vdt-bg-slate-500 vdt-py-2 vdt-px-6 vdt-rounded vdt-text-white hover:vdt-bg-slate-600 vdt-inline vdt-text-sm">Cancel</button>
                <button className="vdt-bg-blue-500 vdt-py-2 vdt-px-6 vdt-rounded vdt-text-white hover:vdt-bg-green-600 vdt-inline vdt-text-sm">Save</button>
            </div>
        </div>
    </>);
}
export default TransactionForm;