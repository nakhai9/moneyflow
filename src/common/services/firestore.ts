import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp } from "firebase/firestore"
import { auth, firestore } from "../configs/firebaseConfig"
import { FirestoreCollection } from "../enums/firestore-collection";
import { IBase } from "../interfaces/base";
import { IUser, IUserLogin } from "../interfaces/user";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
            const payload = { ...data, ...base }
            return await addDoc(collection(firestore, collectionName), payload);
        } catch (error) {
            console.log(error);
        }
    },
    deleteDoc: async (collectionName: FirestoreCollection, id: string) => {
        try {
            return await deleteDoc(doc(firestore, collectionName, id));
        } catch (error) {
            console.log(error);
        }
    },
    signIn: async (user: IUserLogin) => {
        try {
            const { email, password } = user;
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result
        } catch (error) {
            console.log(error);
        }
    },
    signUp: async (user: IUser) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, user.email, user.password!);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

}