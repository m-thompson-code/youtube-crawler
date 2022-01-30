import { getGeneratedMessage } from "../comment-generator/comment-generator";
import { getDateString } from "./date"
import { crawlerLog } from "./debug";
import { getYoutubeVideoId } from "./url";

export enum Status {
    IDLE = "IDLE",
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface LocalStorageInfo {
    statusId: string;
    commentId: string;
    status: Status;
    comment: string;
}

export const getVideoId = () => {
    const dateString = getDateString();
    const videoYoutubeId = getYoutubeVideoId();

    return `moo-youtube-crawler-${dateString}-${videoYoutubeId}`;
}

export const getVideoStatusId = () => {
    return `${getVideoId()}-status`;
}

export const setVideoStatus = (status: Status): void => {
    const statusId = getVideoStatusId();

    localStorage.setItem(statusId, status);
}

export const getVideoStatus = (): Status => {
    const statusId = getVideoStatusId();

    return (localStorage.getItem(statusId) || Status.IDLE) as Status;
}

export const getVideoCommentId = () => {
    return `${getVideoId()}-comment`;
}

export const setVideoComment = (comment: string): void => {
    const commentId = getVideoCommentId();

    localStorage.setItem(commentId, comment);
}

export const setGeneratedVideoComment = (): void => {
    const commentId = getVideoCommentId();

    localStorage.setItem(commentId, getGeneratedMessage());
}

export const getVideoComment = (throwOnNoValue?: boolean): string => {
    const commentId = getVideoCommentId();

    const comment = localStorage.getItem(commentId) || "";

    if (!comment) {
        if (throwOnNoValue) {
            throw new Error("Unexpected missing video comment using local storage");
        }

        setGeneratedVideoComment();

        return getVideoComment(true);
    }

    return comment;
}

export const printLocalStorage = (): LocalStorageInfo => {
    const ids = {
        statusId: getVideoStatusId(),
        status: getVideoStatus(),
        commentId: getVideoCommentId(),
        comment: getVideoComment(),
    };

    crawlerLog(ids.statusId);
    crawlerLog(ids.status);
    crawlerLog(ids.commentId);
    crawlerLog(ids.comment);
    
    return ids;
}

export const clearLocalStorage = (): void => {
    setVideoStatus("" as Status);
    setVideoComment("");

    printLocalStorage();
}
