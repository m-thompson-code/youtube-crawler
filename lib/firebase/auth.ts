import { signInWithEmailAndPassword, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./firebase-init";
import { crawlerLog, LogType } from "../util/debug";


export const signIn = async() => {
    const { __crawler__email__: email, __crawler__password__: password } = window;

    if (!email) {
        crawlerLog("Unexpected missing crawler email");
        throw new Error("Unexpected missing crawler email");
    }

    if (!password) {
        crawlerLog("Unexpected missing crawler password");
        throw new Error("Unexpected missing crawler password");
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch(error: any) {
        crawlerLog(error.message, LogType.ERROR);
        crawlerLog(error.code, LogType.ERROR);
        throw error;
    }
}

export const signOut = async() => {

    try {
        await firebaseSignOut(auth);
    } catch(error: any) {
        crawlerLog(error.message, LogType.ERROR);
        crawlerLog(error.code, LogType.ERROR);
        throw error;
    }
}
