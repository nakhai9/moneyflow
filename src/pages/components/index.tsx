import { Category, FirestoreCollection, PaymentMethod, TransactionType, UserRole, WalletType } from "@/common/enums";
import { ICurrency } from "@/common/interfaces/currency";
import { ITransaction2 } from "@/common/interfaces/transaction";
import { IWallet } from "@/common/interfaces/wallet";
import { firestoreService } from "@/common/services/firestore";
import { Button } from "@mui/material";
import { useState } from "react";

type ComponentsProps = {}
const Components: React.FC<ComponentsProps> = () => {

    const [user, setUser] = useState<any>(null);

    const signIn = async () => {
        const response = await firestoreService.signIn({
            email: "khainguyen@app.com",
            password: "12345678",
        })
        console.log(response);
        setUser(response);
    }

    const signUp = async () => {
        const response = await firestoreService.signUp({
            email: "khainguyen@app.com",
            fullName: "Khai Nguyen Anh",
            firstName: "Khai",
            lastName: "Nguyen",
            phoneNumber: "0945757051",
            role: UserRole.ADMIN,
            password: "12345678"
        })
    }

    const createNewWallet = async () => {
        const wallet: IWallet = {
            amount: 0,
            name: "Tài khoản nợ",
            type: WalletType.LOAN,
            currencyId: "",
            userId: "vjnLYPH5rAa3bJUGKB2xmibKiYv2",
            note: "Đây là tài khoản đem tiền cho vay"
        }

        await firestoreService.setDoc<IWallet>(FirestoreCollection.WALLETS, wallet)
    }

    const createCurrencies = async () => {
        const currencies: ICurrency[] = [
            {
                code: "vnd",
                countryCode: "vnm",
                countryName: "Vietnamese",
                locale: "vi-VN",
                name: "Viet Nam Dong"
            },
            {
                code: "usd",
                countryCode: "us",
                countryName: "United States",
                locale: "us-EN",
                name: "US Dollar"
            },
        ];

        for(let item of currencies) {
            await firestoreService.setDoc(FirestoreCollection.CURRENCIES, item);
        }
    }

    const createTransactions = async () => {
        const transactions: ITransaction2[] = [
            {
                name: "Cho Nhường mượn 500",
                amount: 500000,
                category: Category.LOAN,
                paymentMethod: PaymentMethod.CASH,
                type: TransactionType.EXPENSE,
                walletId: "f677d4a1-7c68-45b3-a176-fe9a1726df37",
                userId: "vjnLYPH5rAa3bJUGKB2xmibKiYv2",
                excutedAt: new Date("2023-11-07")
            },
            {
                name: "Tiền Băng mượn",
                amount: 4000000,
                category: Category.LOAN,
                paymentMethod: PaymentMethod.TRANSFER,
                type: TransactionType.EXPENSE,
                walletId: "f677d4a1-7c68-45b3-a176-fe9a1726df37",
                userId: "vjnLYPH5rAa3bJUGKB2xmibKiYv2",
                excutedAt: new Date("2023-11-04")
            }
        ]

        for(let item of transactions) {
            await firestoreService.setDoc(FirestoreCollection.TRANSACTIONS, item);
        }
    }

    return <>
        <Button type="button" variant="contained" color="primary" onClick={signUp}>
            CREATE USER ON FIRESTORE
        </Button>

        <Button type="button" variant="contained" color="primary" onClick={signIn}>
            Login
        </Button>

        <Button type="button" variant="contained" color="primary" onClick={createNewWallet}>
            CREATE NEW WALLET
        </Button>

        <Button type="button" variant="contained" color="primary" onClick={createCurrencies}>
            CREATE CURRENCIES
        </Button>

        <Button type="button" variant="contained" color="primary" onClick={createTransactions}>
            CREATE TRANSACTIONS
        </Button>

        {JSON.stringify(user)}
    </>
}
export default Components;