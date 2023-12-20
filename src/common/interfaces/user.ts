import { Timestamp } from "firebase/firestore";
import { UserGender, UserRole } from "../enums/user";

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
    dob: Timestamp | string;
    photoUrl?: string;
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

export interface IUserInfo {
    email: string;
    id: string;
}