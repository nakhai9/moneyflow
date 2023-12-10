import { FirestoreCollections, ICategory, ICurrency, IUserSignUp } from "@/common/drafts/prisma";
import { firestoreService } from "@/common/services/firestore";
import { AppSnackbar } from "@/components";
import { RootState } from "@/store/store";
import { Button, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type ComponentsProps = {}
const Components: React.FC<ComponentsProps> = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(()=> {
        // check user role
        if (user?.role === "user") {
            router.push("/dashboard")
        }
    }, [])

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

        for (let item of currencies) {
            await firestoreService.addDoc(FirestoreCollections.CURRENCIES, item);
        }
    }

    const createTransactions = async () => {

    }

    const createCategories = async () => {
        const categories: ICategory[] = [
            {
                title: "Food"
            },
            {
                title: "Drink"
            },
            {
                title: "Fuel"
            },
            {
                title: "Debt"
            },
            {
                title: "Loan"
            },
            {
                title: "Rent"
            },
            {
                title: "Entertaiment"
            }
        ]
        for (let item of categories) {
            await firestoreService.addDoc(FirestoreCollections.CATEGORIES, item);
        }
    }


    return <>
        <Stack spacing={3}>

            <Button type="button" variant="contained" color="primary" onClick={createNewWallet} disabled>
                CREATE NEW WALLET
            </Button>

            <Button type="button" variant="contained" color="primary" onClick={createCurrencies} disabled>
                CREATE CURRENCIES
            </Button>

            <Button type="button" variant="contained" color="primary" onClick={createTransactions} >
                CREATE TRANSACTIONS
            </Button>

            <Button type="button" variant="contained" color="primary" onClick={createCategories} disabled>
                CREATE CATEGORIES
            </Button>

        </Stack>

        {/* {JSON.stringify(user)}
        <AppSnackbar open={true} positions="top-center" severity="success" message="Success" /> */}
    </>
}
export default Components;