import { UserGender, UserRole } from "../enums/user";

export interface IUser {
    email: string;
    fullName: string;
    phone: string;
    password?: string;
    sex?: 'male' | 'female' | 'other';
    photoUrl?: string;
}

export interface IUserLogin {
    email: string;
    password: string;
    phone?: string;
}

export interface IUser2 {
    email: string;
    fullName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;

    role: UserRole,
    emailVerify?: boolean;
    password?: string;
    sex?: UserGender
    photoUrl?: string;
}