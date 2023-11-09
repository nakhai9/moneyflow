import { Timestamp } from "firebase/firestore";
import { Category } from "../enums/category";
import { PaymentMethod } from "../enums/payment-method";
import { TransactionType } from "../enums/transaction-type";

export interface ITransaction{
    category: Category;
    name: string;
    amount: number;
    paymentMethod: PaymentMethod;
    type: TransactionType;
    excutedAt: Timestamp | Date;
    walletId: string;
    userId?: string;
    label?: string;
    description?: string;
    icon?: any;
}