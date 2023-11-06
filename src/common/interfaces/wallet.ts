import { WalletType } from "../enums/transaction-type";

// export interface IWallet {
//     id: number;
//     name: string;
//     amount: number;
//     type: WalletType,
//     currency: string;
//     userId: number;
//     note?: string;
//     currencyId?: number;
//     createdAt?: Date;
//     updatedAt?: Date;
//     isDelete?: boolean;
// }

export interface IWallet {
    id?: string;
    name: string;
    amount: number;
    type: WalletType,
    currencyId?: string;
    userId?: string;
    note?: string;
}