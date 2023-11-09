import { Timestamp } from "firebase/firestore";
import { Category } from "../enums/category";
import { PaymentMethod } from "../enums/payment-method";
import { TransactionType } from "../enums/transaction-type";

export interface ITransaction {
    id: number;
    category: Category;
    walletName: string;
    description?: string;
    amount: number;
    paymentMethod: PaymentMethod;
    type: TransactionType;
    label?: string;
    createdAt?: Date;
    updatedAt?: Date;
    icon?: any;
}

export interface ITransaction2 {
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