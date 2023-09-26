export interface IRoute {
    path: string;
    text: string;
    isHide: boolean;
    icon?: any;
}
export const ROUTES_ON_APPBAR = []

export const OPTIONS_MENU_ON_APPBAR: IRoute[] = [
    { path: "/accounts", text: 'Account', isHide: false },
    { path: "/settings", text: 'Settings', isHide: false },
    { path: "/logout", text: 'Log out', isHide: false }
]