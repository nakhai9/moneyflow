import { ICurrency, IUserSignUp } from "@/common/drafts/prisma";
import { FirestoreCollection } from "@/common/enums";
import { firestoreService } from "@/common/services/firestore";
import { Button, Stack } from "@mui/material";
import { useState } from "react";

type ComponentsProps = {}
const Components: React.FC<ComponentsProps> = () => {

    const [user, setUser] = useState<any>(null);

    const signIn = async () => {
        const response = await firestoreService.signIn({
            email: "khai.fordev@gmail.com",
            password: "open4me",
        })
        console.log(response);
        setUser(response);
    }

    const signUp = async () => {

        const newUser: IUserSignUp = {
            email: "admin@app.com",
            firstName: "Super",
            lastName: "Admin",
            phoneNumber: "0945757051",
            password: "admin1234"
        }

        const response = await firestoreService.signUp(newUser)
    }

    const createNewWallet = async () => {
        // const wallet: IWallet = {
        // }

        // await firestoreService.setDoc<IWallet>(FirestoreCollection.WALLETS, wallet)
    }

    const createCurrencies = async () => {
        const currencies: ICurrency[] = [
            {
                code: "vnd",
                countryCode: "vnm",
                countryName: "Vietnamese",
                locale: "vi-VN",
                name: "Viet Nam Dong",
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
            await firestoreService.addDoc(FirestoreCollection.CURRENCIES, item);
        }
    }

    const createTransactions = async () => {
        // const transactions: ITransaction[] = []

        // for(let item of transactions) {
        //     await firestoreService.setDoc(FirestoreCollection.TRANSACTIONS, item);
        // }
    }

    return <>
        <Stack spacing={3}>
            <Button type="button" variant="contained" color="primary" onClick={signUp}>
                Sign up new user
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

        </Stack>

        {JSON.stringify(user)}
    </>
}
export default Components;