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
