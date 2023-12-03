import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { _db, auth } from "../configs/firebaseConfig";
import { FirestoreCollections, IBase, IUserSignIn, IUserSignUp, UserGender, UserRole } from "../drafts/prisma";

const base: IBase = {
    _vid: uuidv4(),
    createdAt: Timestamp.now(),
    isDelete: false,
    updatedAt: null
}

export const firestoreService = {
    getDocs: async (collectionName: FirestoreCollections) => {
        try {
            const _query = query(collection(_db, collectionName), orderBy('createdAt', 'desc'));
            const snapshotDocuments = await getDocs(_query);
            const result: any = [];
            snapshotDocuments.docs.forEach((doc) => {
                result.push({ id: doc.id, ...doc.data() });
            });

            return result;
        } catch (error) {
            console.error(error);
        }
    },
    getDocById: async <T>(collectionName: FirestoreCollections, docId: string) => {
        try {
            const docRef = doc(_db, collectionName, docId);
            const snapshotDocument = await getDoc(docRef);
            if (snapshotDocument && snapshotDocument.exists()) {
                return { id: snapshotDocument.id, ...snapshotDocument.data() } as (T & IBase);
            }
        } catch (error) {
            console.log(error);
        }
    },
    addDoc: async <T>(collectionName: FirestoreCollections, data: T) => {
        try {
            const payload: (T & IBase) = { ...data, ...base }
            return await addDoc(collection(_db, collectionName), payload);
        } catch (error) {
            console.log(error);
        }
    },
    deleteDoc: async (collectionName: FirestoreCollections, docId: string) => {
        try {
            const docRef = doc(_db, collectionName, docId);
            return await deleteDoc(docRef);
        } catch (error) {
            console.log(error);
        }
    },
    setDoc: async <T>(collectionName: FirestoreCollections, data: T) => {
        const docRef = doc(_db, collectionName);
        const payload: (T & IBase) = { ...data, ...base };
        return await setDoc(docRef, payload);
    },
    signIn: async (user: IUserSignIn) => {
        let userCredential = null, error = null;

        try {
            const { email, password } = user;
            userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            error = error;
        }
        return { userCredential, error };
    },
    signUp: async (user: IUserSignUp) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password!);
            if (userCredential) {
                const customId = userCredential.user.uid;
                const payload = { ...user, ...base, photoUrl: null, role: UserRole.USER, sex: UserGender.OTHER, dob: null };
                await setDoc(doc(_db, FirestoreCollections.USERS, customId), payload);
            }
            return userCredential;
        } catch (error) {
            console.log(error);
        }
    },
    updateDoc: async <T>(collectionName: FirestoreCollections, id: string, data: T) => {
        const docRef = doc(_db, collectionName, id);
        try {
            const payload = { ...data, updatedAt: Timestamp.now() }
            return await updateDoc(docRef, payload)
        } catch (error) {
            console.log(error);

        }
    }

}