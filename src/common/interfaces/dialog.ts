import { IOption } from "./option";

export interface IDialog {
    title: string;
    message?: string;
    
    isOpen: boolean;
    styles: IOption[];


    onClose: ()=>{};
    onSubmit: ()=>{}
}