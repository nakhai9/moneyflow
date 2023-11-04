import { Timestamp } from "firebase/firestore";

export interface IBase {
    id?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp | null;
    isDelete: boolean;
}
