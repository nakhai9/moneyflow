import { Timestamp } from "firebase/firestore";
import { Category } from "../enums/categories";
import { PaymentMethod, TransactionType } from "../enums/transaction";

export interface ITransaction {
    type: TransactionType;
    category: Category;
    description: string;
    excutedAt: Timestamp;
    amount: number;
    paymentMethod: PaymentMethod;
    isPaid: boolean;
    payee?: string | null;
    quantity?: number | null;
    walletId?: string;
    userId?: string;
}