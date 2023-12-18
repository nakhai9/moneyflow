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
    CASH = 'cash',
    TRANSFER = 'transfer',
    MOMO = 'momo',
    PAYPAL = 'paypal',
    EPAY = 'ePay'
}

export enum WalletType {
    GENERAL = 'general',
    CASH = 'cash',
    CREDIT = 'credit',
    LOAN = 'loan',
    DEBT = 'debt',
    SAVING = 'saving',
    BANK = 'bank'
}

export enum Category {
    // Default
    NONE = 'None',
    DEBT = 'Debt',
    LOAN = 'Loan',
    SALARY = 'Salary',
    OTHER = 'Other',

    // Custom
    SHOPPING = 'Shopping',
    FOOD_DRINK = 'Food Drink',
    TRAVEL = 'Travel',
    FUEL = 'Fuel',
    ENTERTAIMENT = 'Entertaiment',
    BODY_CARE = 'Body care',
    RENT = "Rent",
    TRANSFER = "Transfer",
    LAUNDRY = 'Laundry',
    FOOD_ONLY = "Food only",
    DRINK_ONLY = "Drink only",
    MAINTENANCE = "Maintenance"

}

export enum FirestoreCollections {
    USERS = 'users',
    TRANSACTIONS = 'transactions',
    WALLETS = 'wallets',
    CURRENCIES = 'currencies',
    CATEGORIES = 'categories'
}

export enum ModalAction {
    ADD = "add",
    EDIT = "edit",
    DELETE = "delete",
    DEFAULT = "primary"
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

export interface IUpdateUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sex?: UserGender;
    dob: string;
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
    dob?: Timestamp;
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

export interface ICurrency {
    name: string;
    code: string;
    countryName: string;
    countryCode: string;
    locale: string;
}

export interface ICategory {
    title: string;
    icon?: any;
}

export interface IAccount { }

export interface IBase {
    readonly id?: string;
    // virtual id: id use uuid4
    readonly _vid: string;
    readonly createdAt: Timestamp;
    updatedAt: Timestamp | null;
    isDelete: boolean;
}

export interface IUserInfo {
    email: string;
    id: string;
}

// type IWalletRecord = IWallet & IBase;
// type ITransactionRecord = ITransaction & IBase;
// type ICurrencyRecord = ICurrency & IBase;
// type IUserRecord = IUser & IBase;
// type IAccountRecord = IAccount & IBase;
// or 
export interface IWalletRecord extends IWallet, IBase { }
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