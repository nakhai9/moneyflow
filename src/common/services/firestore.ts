import { addDoc, collection, getDocs } from "firebase/firestore"
import { firestore } from "../configs/firebaseConfig"
import { FirestoreCollection } from "../enums/firestore-collection";

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
            await addDoc(collection(firestore, collectionName), { data });
        } catch (error) {
            console.log(error);
        }
    }
}