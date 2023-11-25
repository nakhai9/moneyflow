export interface IRoute {
    path: string;
    text: string;
    isHide: boolean;
    icon?: any;
}
export const ROUTES_ON_APPBAR = []

export const SETTINGS: IRoute[] = [
    { path: "/accounts", text: 'Account', isHide: false },
    { path: "/settings", text: 'Settings', isHide: false },
]