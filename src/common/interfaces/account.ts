import { AccountType } from "../enums/account";

export interface IAccount {
    name: string;
    amount: number;
    note: string | null;
    type: AccountType;
    isClose: boolean;
    userId?: string;
    currencyId?: string;
}

