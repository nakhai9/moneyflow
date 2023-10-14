import WalletForm from "../forms/TransactionForm";

type DialogProp = {
    open?: boolean,
    type?: "default" | "spin" | "message"
}

const Dialog: React.FC<DialogProp> = ({ open = false, type = 'default' }) => {
    return (open && <div className="vdt-fixed vdt-top-0 vdt-h-screen vdt-w-full vdt-bg-star-dust/40 vdt-z-10">
        <div className="vdt-absolute vdt-right-1/2 vdt-bottom-1/2 vdt-transform vdt-translate-x-1/2 vdt-translate-y-1/2">

            {
                type === "spin" && (<div className="vdt-flex vdt-flex-col vdt-justify-center vdt-items-center vdt-gap-2">
                    <div className="vdt-border-t-transparent vdt-border-solid vdt-animate-spin vdt-rounded-full vdt-border-green-500 vdt-border-4 vdt-h-10 vdt-w-10"></div>
                    <p className="vdt-text-blue-500 vdt-font-semibold">Loading</p>
                </div>)
            }

            {
                type === "default" && <WalletForm />
            }
        </div>
    </div >);
}

export default Dialog;