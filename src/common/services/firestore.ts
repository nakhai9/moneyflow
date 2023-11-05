import { Timestamp, addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore"
import { firestore } from "../configs/firebaseConfig"
import { FirestoreCollection } from "../enums/firestore-collection";
import { IBase } from "../interfaces/base";

export const firestoreService = {
    getDocs: async (collectionName: FirestoreCollection) => {
        try {
            const snapshotDocuments = await getDocs(collection(firestore, collectionName));
            const result: any = [];
            snapshotDocuments.forEach((doc) => {
                result.push({ id: doc.id, ...doc.data() });
            });

            return result;
        } catch (error) {
            console.log(error);

        }
    },
    addDoc: async <T>(collectionName: FirestoreCollection, data: T) => {
        try {
            const base: IBase = {
                createdAt: Timestamp.now(),
                isDelete: false,
                updatedAt: null
            }
            const payload= {...data, ...base} 
            return await addDoc(collection(firestore, collectionName), payload);
        } catch (error) {
            console.log(error);
        }
    }
}