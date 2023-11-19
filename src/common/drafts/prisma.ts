import { Timestamp } from "firebase/firestore";

export enum UserGender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    OTHER = "other"
}

export enum TransactionType {
    EXPENSE = 'expense',
    INCOME = 'income',
    TRANSFER = 'transfer',
    DEFAULT = 'expense'
}
export enum PaymentMethod {
    TRANSFER = 'transfer',
    CASH = 'cash'
}

export enum WalletType {
    GENERAL = 'general',
    CASH = 'cash',
    CREDIT = 'credit',
    LOAN = 'loan',
    DEBT = 'debt',
    SAVING = 'saving'
}

export enum Category {
    NONE = 'None',
    SHOPPING = 'Shopping',
    FOOD_DRINK = 'Food and Drink',
    TRAVEL = 'Travel',
    FUEL = 'Fuel',
    ENTERTAIMENT = 'Entertaiment',
    LOAN = 'Loan',
    DEBT = 'Debt',
    BODY_CARE = 'Body care',
    SALARY = 'Salary',
    OTHER = 'Other'
}

export enum FirestoreCollections {
    USERS = 'users',
    TRANSACTIONS = 'transactions',
    WALLETS = 'wallets',
    CURRENCIES = 'currencies',
    CATEGORY = 'category'
}

// Interface

export interface IUserSignIn {
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface IUserSignUp {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password?: string;
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: UserRole;
    sex: UserGender;
    photoUrl: string;
    password?: string;
}

export interface IWallet {
    name: string;
    amount: number;
    note: string | null;
    type: WalletType;
    isClose: boolean;
    userId?: string;
    currencyId?: string;
}

export interface ITransaction {
    title: string;
    amount: number;
    excutedAt: Timestamp | Date;
    type: TransactionType;
    category: Category;
    paymentMethod: PaymentMethod;
    payee: string | null;
    note?: string | null;
    label?: string | null;
    walletId?: string;
    userId?: string;
}

export interface ICurrency {
    name: string;
    code: string;
    countryName: string;
    countryCode: string;
    locale: string;
}

export interface IAccount {}

export interface IBase {
    readonly id?: string;
    // virtual id: id use uuid4
    readonly _vid: string;  
    readonly createdAt: Date | string | Timestamp;
    updatedAt: Date | string | null | Timestamp;
    isDelete: boolean;
}

// type IWalletRecord = IWallet & IBase;
// type ITransactionRecord = ITransaction & IBase;
// type ICurrencyRecord = ICurrency & IBase;
// type IUserRecord = IUser & IBase;
// type IAccountRecord = IAccount & IBase;
// or 
export interface IWalletRecord extends IWallet, IBase {}
export interface ITransactionRecord extends ITransaction, IBase {}
export interface ICurrencyRecord extends ICurrency, IBase {}
export interface IUserRecord extends IUser, IBase {}
export interface IAccountRecord extends IAccount, IBase {}
