import { EmailAuthProvider, createUserWithEmailAndPassword, deleteUser, getAuth, reauthenticateWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { QueryFieldFilterConstraint, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { _db, auth, storage } from "../configs/firebaseConfig";
import { log } from "console";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { IBase, IOption } from "../interfaces/base";
import { FirestoreCollections } from "../enums/firestore-collections";
import { IUpdateUser, IUserSignIn, IUserSignUp } from "../interfaces/user";
import { UserGender, UserRole } from "../enums/user";
import { IAccount } from "../interfaces/account";
import { ITransaction } from "../interfaces/transaction";
import { ICurrency } from "../interfaces/currency";

const base: IBase = {
    _vid: uuidv4(),
    createdAt: Timestamp.now(),
    isDelete: false,
    updatedAt: null
}

export const firestoreService = {
    getDocs: async <T>(collectionName: FirestoreCollections) => {
        try {
            const _query = query(collection(_db, collectionName), orderBy('createdAt', 'desc'));
            const snapshotDocuments = await getDocs(_query);
            const result: (T & IBase)[] = [];
            snapshotDocuments.docs.forEach((doc) => {
                result.push({ id: doc.id, ...doc.data() } as (T & IBase));
            });

            return result;
        } catch (error) {
            console.error(error);
        }
    },
    getDocById: async <T>(collectionName: FirestoreCollections, docId: string) => {
        try {
            const docRef = doc(collection(_db, collectionName), docId);
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
            return await updateDoc(docRef, payload);
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
        } catch (e) {
            error = e;
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
    updateUserInfo: async (userId: string, newUpdate: IUpdateUser) => {
        try {
            await firestoreService.updateDoc(FirestoreCollections.USERS, userId, newUpdate);
        } catch (error) {
            console.log(error);
        }
    },
    deleteUser: async () => {
        try {
            // const user = auth.currentUser;
            // if (user) {
            //     const credential = EmailAuthProvider.credential(
            //         "test@app.com",
            //         "12345678"
            //     )

            //     const result = await reauthenticateWithCredential(
            //         user,
            //         credential
            //     )
            //     // Pass result.user here
            //     await deleteUser(result.user)
            // }
        } catch (error) {
            console.log(error);
        }
    }
}

export const accountService = {
    addNewAccount: async (wallet: IAccount) => {
        try {
            await firestoreService.addDoc<IAccount>(FirestoreCollections.WALLETS, wallet);
        } catch (error) {
            throw error;
        }
    },
    getAccountById: async (walletId: string) => {
        try {
            return await firestoreService.getDocById<IAccount>(FirestoreCollections.WALLETS, walletId);
        } catch (error) {
            console.log(walletId);
        }
    },
    getAccountsByUserId: async (userId: string) => {
        try {
            const _query = query(collection(_db, FirestoreCollections.WALLETS), where('userId', '==', userId));
            const snapshotDocuments = await getDocs(_query);
            const result: (IAccount & IBase)[] = [];
            snapshotDocuments.docs.forEach((doc) => {
                result.push({ id: doc.id, ...doc.data() } as (IAccount & IBase));
            });

            return result as (IAccount & IBase)[]; 
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
    },
    updateAccount: async (accountId: string, changedData: any) => {
        let response: any = {}
        try {
            const docRef = await firestoreService.updateDoc(FirestoreCollections.WALLETS, accountId, changedData);
            console.log(docRef);
        } catch (error) {
            console.log(error)
            response["status"] = false;
            response["error"] = error;
        }
        return response;

    }
}

export const transactionService = {
    getTransactions: async (userId?: string, walletId?: string, title?: string) => {
        const constraints: QueryFieldFilterConstraint[] = [];
        if (userId) {
            constraints.push(where("userId", '==', userId));
        }
        if (walletId) {
            constraints.push(where('walletId', '==', walletId));
        }
        if (title) {
            constraints.push(where('title', '>=', title));
        }
        const _query = query(collection(_db, FirestoreCollections.TRANSACTIONS), ...constraints);
        const snapshotDocuments = await getDocs(_query);
        const result: any = [];
        snapshotDocuments.docs.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
        });
        return result as (ITransaction & IBase)[];
    },
    addNewTransaction: async (transactions: ITransaction) => {
        try {
            return await firestoreService.addDoc<ITransaction>(FirestoreCollections.TRANSACTIONS, transactions);
        } catch (error) {
            console.log(error);
        }
    },
    updateTransaction: async (transactionId: string, updatedTransaction: ITransaction) => {
        try {
            await firestoreService.updateDoc(FirestoreCollections.TRANSACTIONS, transactionId, updatedTransaction)
        } catch (error) {
            console.log(error);
        }
    },
    deleteTransaction: async (transactionId: string) => {
        try {
            await firestoreService.deleteDoc(FirestoreCollections.TRANSACTIONS, transactionId);
        } catch (error) {
            console.log(error);
        }
    }
}

export const currencyService = {
    getCurrencies: async () => {
        try {
            let options: IOption[] = [];
            const currencies = await firestoreService.getDocs<ICurrency>(FirestoreCollections.CURRENCIES);
            if (currencies) {
                options = currencies.map((c) => {
                    return {
                        id: c.id,
                        prop: c.code,
                        value: c.id
                    }
                })
            }
            return options;
        } catch (error) {
            console.log(error);
        }
    },
    convertCurrency: async (currencyId: string) => {
        try {
            const currency = await firestoreService.getDocById<ICurrency>(FirestoreCollections.CURRENCIES, currencyId);
            
            return currency?.code;
        } catch (error) {
            console.log(error)
        }
    },
}

export const categoryService = {
    getCategories: async () => {
        try {
            const collectionRef = collection(_db, FirestoreCollections.CATEGORIES)
            const q = query(collectionRef, orderBy("createdAt", "asc"));
            const snapshotDocuments = await getDocs(q);
            const categories: any = [];
            snapshotDocuments.docs.forEach((doc) => {
                categories.push({ id: doc.id, ...doc.data() });
            });
            return categories;
        } catch (error) {
            throw error;
        }
    }
}

export const imageService = {
    getDownloadURL: async (file: File): Promise<string> => {
        const storagePath = "images";
        const imageName = uuidv4();
        let downloadUrl = ''
        const storageRef = ref(storage, `${storagePath}/firestore-${imageName}`);
        try {
            await uploadBytes(storageRef, file);
            downloadUrl = await getDownloadURL(storageRef);
        } catch (error) {
            console.log(error);
        }
        return downloadUrl;
    }
}