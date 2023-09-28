export interface IBase {
    id: number;
    isDelete: boolean;
    isActive: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface IResponseBody<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: any
}


export interface ILoginResponse {
    accessToken: string,
    expiresIn: string;
}