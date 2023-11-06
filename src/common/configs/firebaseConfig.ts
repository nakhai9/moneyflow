import { initializeApp,  } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyAOXIJxreOiB2fb6rhFZWs74D3y3GsPuY8",
    authDomain: "firestore-project-6ae19.firebaseapp.com",
    projectId: "firestore-project-6ae19",
    storageBucket: "firestore-project-6ae19.appspot.com",
    messagingSenderId: "516848345418",
    appId: "1:516848345418:web:759d0f0de11bf569df61b3",
    measurementId: "G-8SMHCXW33C"
}

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)
