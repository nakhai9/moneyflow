import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FieldValue, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { _db, auth } from "../configs/firebaseConfig";
import { FirestoreCollections, IBase, ICurrency, IOption, IUserSignIn, IUserSignUp, IWallet, UserGender, UserRole } from "../drafts/prisma";

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
    updateDoc: async <T>(collectionName: FirestoreCollections, id: string, data: T) => {
        const docRef = doc(_db, collectionName, id);
        try {
            const payload = { ...data, updatedAt: Timestamp.now() }
            return await updateDoc(docRef, payload)
        } catch (error) {
            console.log(error);

        }
    },
}

export const authService = {
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
}

export const accountService = {
    addNewAccount: async (wallet: IWallet) => {
        try {
            await firestoreService.addDoc<IWallet>(FirestoreCollections.WALLETS, wallet);
        } catch (error) {
            throw error;
        }
    },
    getAccountsByUserId: async (userId: string) => {
        try {
            const _query = query(collection(_db, FirestoreCollections.WALLETS), where('userId', '==', userId));
            const snapshotDocuments = await getDocs(_query);
            const result: any = [];
            snapshotDocuments.docs.forEach((doc) => {
                result.push({ id: doc.id, ...doc.data() });
            });

            return result;
        } catch (error) {
            console.log(error);
        }
    },
    deleteAccountById: async (accountId: string) => {
        try {
            await firestoreService.deleteDoc(FirestoreCollections.WALLETS, accountId);
        } catch (error) {
            throw error;
        }
    }
}

export const transactionService = {
    getTransactions: async () => {
        try {
            const collectionRef = collection(_db, FirestoreCollections.TRANSACTIONS)
            const q = query(collectionRef, orderBy("createdAt", "asc"));
            const snapshotDocuments = await getDocs(q);
            const transactions: any = [];
            snapshotDocuments.docs.forEach((doc) => {
                transactions.push({ id: doc.id, ...doc.data() });
            });
            return transactions;
        } catch (error) {
            throw error;
        }
    },
    getTransactionsByUserID: async () => {},
    getTransactionsByWalletID: async () => {},
    addNewTransaction: async () => {},
    updateTransaction: async () => {},
    deleteTransaction: async () => {},
}

export const currencyService = {
    getCurrencies: async () => {
        try {
            const result = await firestoreService.getDocs(FirestoreCollections.CURRENCIES);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}