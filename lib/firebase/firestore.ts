import { deleteDoc, doc, DocumentData, DocumentReference, getDoc, writeBatch } from "firebase/firestore";
import { crawlerLog } from "../util/debug";
import { getDateString } from "../util/date";
import { db } from "./firebase-init";
import { getYoutubeVideoId } from "../util/url";

export interface Metadata {
    status: Status;
    log: string;
    comment: string;
    timestamp?: number;
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

const getGlobalDocument = (): DocumentReference<DocumentData>  => {
    return doc(db, 'global', 'state');
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

    const batch = writeBatch(db);

    const instance = {...metadata, timestamp: Date.now()};

    batch.set(getDocument(), instance);
    batch.set(getGlobalDocument(), instance);

    await batch.commit();
};

export const updateVideoMetadata = async(metadata: UpdateMetadata): Promise<void> => {
    const { status, comment, log } = metadata ?? {} as Partial<Metadata>;
    
    crawlerLog(log);

    const docInstance = { log, timestamp: Date.now() } as Metadata;

    if (status) {
        docInstance.status = status;
    }

    if (comment) {
        docInstance.comment = comment;
    }

    const batch = writeBatch(db);

    const instance = {...docInstance, timestamp: Date.now()};

    batch.update(getDocument(), instance);
    batch.update(getGlobalDocument(), instance);

    await batch.commit();
};

export const getVideoMetadata = async(): Promise<Metadata> => {
    const snapshot = await getDoc(getDocument());

    const { comment, status, log, timestamp } =  snapshot.data() ?? {};

    return {
        comment, status: status ?? Status.IDLE, log, timestamp
    };
}
