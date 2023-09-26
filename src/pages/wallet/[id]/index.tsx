import DefaultLayout from "@/components/layouts/DefaultLayout";
import { NextPage } from "next";
import { useRouter } from "next/router";

const WalletDetailPage: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return (<DefaultLayout>
        <div className="vdt-pt-8 vdt-h-full vdt-flex vdt-flex-col">
            <div className="vdt-bg-white vdt-w-4/5 vdt-mx-auto vdt-rounded-t-xl vdt-overflow-auto vdt-flex-1 vdt-pt-6 vdt-px-6 ">
                <div className="vdt-w-80 vdt-flex vdt-flex-col vdt-space-y-4 vdt-text-slate-500">
                    <h3 className="vdt-text-xl vdt-font-semibold vdt-text-slate-500">Edit New Wallet</h3>
                    <p>Current wallet have Id is {id}</p>
                </div>
                {/* <table className="vdt-w-full vdt-table-fixed vdt-text-sm vdt-rounded-xl">
                    <thead className="vdt-overflow-hidden">
                        <tr className="vdt-overflow-hidden vdt-bg-green-500 vdt-text-white">
                            <th className="vdt-w-8"><input type="checkbox" /></th>
                            <th>Category</th>
                            <th>Wallet</th>
                            <th>Description</th>
                            <th className="vdt-text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item: number, index: number) => {
                                return (<tr key={index} className={`${index % 2 && 'vdt-bg-slate-100'}`}>
                                    <td className="vdt-w-8 vdt-text-center"><input type="checkbox" /></td>
                                    <td>Food & Drink</td>
                                    <td>{id}</td>
                                    <td></td>
                                    <td className="vdt-text-right">
                                        <span>-1230</span>
                                        <span className="vdt-ml-2"><FontAwesomeIcon icon={faEllipsisVertical} /></span>
                                    </td>
                                </tr>)
                            })
                        }
                    </tbody>
                </table> */}
            </div>
        </div>
    </DefaultLayout>);
}

export default WalletDetailPage;