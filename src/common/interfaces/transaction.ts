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