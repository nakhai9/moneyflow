import { WalletType } from "../enums/transaction-type";

export interface IWallet {
    id: number;
    name: string;
    amount: number;
    type: WalletType,
    currency: string;
    userId: number;
    note?: string;
    currencyId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    isDelete?: boolean;
}