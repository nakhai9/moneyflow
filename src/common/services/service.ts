import { IBase, ILoginResponse, IResponseBody } from "../interfaces/base";
import { IUser, IUserLogin } from "../interfaces/user";
import instance from "./config";

const HOST_SERVER = "http://localhost:3200";

export const ENDPOINTS = {
    register: `${HOST_SERVER}/auth/register`,
    login: `${HOST_SERVER}/auth/login`,
    me: `${HOST_SERVER}/api/v1/users/me`
}

export const API_SERVICES = {
    register: async (user: IUser) => {
        try {
            await instance.post(ENDPOINTS.register, user);
        } catch (error) {
            console.log(error);
        }
    },
    login: async (user: IUserLogin): Promise<IResponseBody<ILoginResponse> | undefined> => {
        try {
            const { data } = await instance.post<IResponseBody<ILoginResponse>>(ENDPOINTS.login, user);
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    me: async (): Promise<IResponseBody<IUser & IBase> | undefined> => {
        try {
            const { data } = await instance.get<IResponseBody<IUser & IBase>>(ENDPOINTS.me);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}