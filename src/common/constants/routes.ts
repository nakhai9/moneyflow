export interface IRoute {
    id: number;
    path: string;
    text: string;
    isHide: boolean;
    icon?: any;
}

export const PAGES: IRoute[] = [
    { id: 1, text: "Dashboard", path: "/dashboard", isHide: false },
    { id: 2, text: "Transactions", path: "/transactions", isHide: false }
]

export const SETTINGS: IRoute[] = [
    { id: 2, path: "/settings", text: 'Settings', isHide: false },
]