import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, getDoc } from "firebase/firestore"
import { auth, firestore } from "../configs/firebaseConfig"
import { FirestoreCollection } from "../enums/firestore-collection";
import { IBase } from "../interfaces/base";
import { IUser, IUser2, IUserLogin } from "../interfaces/user";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';

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
    getDocById: async <T>(collectionName: FirestoreCollection, docId: string) => {
        try {
            const docRef = doc(firestore, collectionName, docId);
            const snapshotDocument = await getDoc(docRef);

            if (snapshotDocument && snapshotDocument.exists()) {
                return snapshotDocument.data() as (T & IBase);
            }
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
            const payload: (T & IBase) = { ...data, ...base }
            return await addDoc(collection(firestore, collectionName), payload);
        } catch (error) {
            console.log(error);
        }
    },
    deleteDoc: async (collectionName: FirestoreCollection, docId: string) => {
        try {
            const docRef = doc(firestore, collectionName, docId);
            return await deleteDoc(docRef);
        } catch (error) {
            console.log(error);
        }
    },
    setDoc: async <T>(collectionName: FirestoreCollection, data: T) => {
        const docRef = doc(firestore, collectionName, uuidv4());
        const base: IBase = {
            createdAt: Timestamp.now(),
            isDelete: false,
            updatedAt: null
        }
        const payload: (T & IBase) = { ...data, ...base };
        return await setDoc(docRef, payload);
    }
    ,
    signIn: async (user: IUserLogin) => {
        try {
            const { email, password } = user;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);

            return userCredential;
        } catch (error) {
            console.log(error);
        }
    },
    signUp: async (user: IUser2) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password!);
            if (userCredential) {
                const customId = userCredential.user.uid;
                const base: IBase = {
                    createdAt: Timestamp.now(),
                    isDelete: false,
                    updatedAt: null
                }
                const payload = { ...user, ...base };
                await setDoc(doc(firestore, FirestoreCollection.USERS, customId), payload);
            }
            return userCredential;
        } catch (error) {
            console.log(error);
        }
    }

}