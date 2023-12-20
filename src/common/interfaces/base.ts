import { Timestamp } from "firebase/firestore";
import { IAccount } from "./account";
import { ITransaction } from "./transaction";
import { ICurrency } from "./currency";
import { IUser } from "./user";

export interface IBase {
    readonly id?: string;
    // virtual id: id use uuid4
    readonly _vid: string;
    readonly createdAt: Timestamp;
    updatedAt: Timestamp | null;
    isDelete: boolean;
}

export interface IWalletRecord extends IAccount, IBase { }
export interface ITransactionRecord extends ITransaction, IBase { }
export interface ICurrencyRecord extends ICurrency, IBase { }
export interface IUserRecord extends IUser, IBase { }
export interface IAccountRecord extends IAccount, IBase { }


export interface ICommonMessages {
    success?: string;
    warning?: string;
    info?: string;
    error?: string;
}

export interface IOption {
    id?: any;
    prop: string;
    value: any;
}