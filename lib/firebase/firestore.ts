import { deleteDoc, doc, DocumentData, DocumentReference, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { crawlerLog } from "../util/debug";
import { getDateString } from "../util/date";
import { db } from "./firebase-init";
import { getYoutubeVideoId } from "../util/url";

export interface Metadata {
    status: Status;
    log: string;
    comment: string;
}

export interface UpdateMetadata {
    status?: Status;
    log: string;
    comment?: string;
}

export enum Status {
    IDLE = "IDLE",
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    ERROR = "ERROR"
}

const getDocument = (): DocumentReference<DocumentData>  => {
    const dateString = getDateString();

    const videoId = getYoutubeVideoId();

    if (!dateString) {
        throw new Error("Unexpected missing date string");
    }

    if (!videoId) {
        throw new Error("Unexpected missing video id");
    }

    return doc(db, dateString, videoId);
}

export const clearVideoMetadata = async(): Promise<void> => {
    await deleteDoc(getDocument());
}

export const setVideoMetadata = async(metadata: Metadata): Promise<void> => {
    crawlerLog(metadata.log);

    await setDoc(getDocument(), metadata);
};

export const updateVideoMetadata = async(metadata: UpdateMetadata): Promise<void> => {
    const { status, comment, log } = metadata ?? {} as Partial<Metadata>;
    
    crawlerLog(log);

    const docInstance = { log } as Metadata;
    if (status) {
        docInstance.status = status;
    }

    if (comment) {
        docInstance.comment = comment;
    }

    await updateDoc(getDocument(), docInstance as any);
};

export const getVideoMetadata = async(): Promise<Metadata> => {
    const snapshot = await getDoc(getDocument());

    const metadata =  snapshot.data() ?? {};

    const comment = metadata.comment;
    const status = metadata.status ?? Status.IDLE;
    const log = metadata.log;

    return {
        comment, status, log
    };
}
