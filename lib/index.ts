import { capitalizeRandomLetter, getGeneratedMessage, removeRandomLetter } from "./comment-generator/comment-generator";
import { activateTextAreaEditableContent, clickSubmitButton, enableSubmitButton, getChannelName, getExistingComment, getTextAreaEditableContent, getTextAreaPlaceholder, getVideoLinks, injectComment, scrollToBottomOfPage } from "./dom/dom";
import { crawlerLog, LogType } from "./util/debug";
import { getVideoStatus, getVideoComment, setVideoComment, Status, setVideoStatus, printLocalStorage, clearLocalStorage } from "./util/local-storage";
import { delay, iteratePromiseFunctions } from "./util/promises";

const isCorrectChannel = async () => {
    const channelName = getChannelName();

    if (!channelName) {
        return false;
    }

    if (channelName !== 'Philip DeFranco') {
        crawlerLog(`Unexpected channel isn't correct: ${getChannelName()}`);
        return false;
    }

    return true;
}

const cancel = (): void => {
    const status = getVideoStatus();

    if (status === Status.COMPLETED) {
        crawlerLog("Status is already complete", LogType.WARN);
        return;
    }

    setVideoStatus(Status.CANCELLED);
    crawlerLog("CANCELLING, CANCELLING, CANCELLING, ,CANCELLING ,CANCELLING", LogType.ERROR);
}

const continueIfPending = (): Promise<void> => {
    const videoStatus = getVideoStatus();

    if (videoStatus !== Status.PENDING) {
        crawlerLog("Comment injection no longer is PENDING. Will not continue");
        throw new Error("Comment injection cancelled");
    }

    return Promise.resolve();
}

const displayWarning = async (count: number): Promise<boolean> => {
    crawlerLog(`Going to inject comment in ${count} second(s)... Call 'window.cancel()' to cancel`);
    await delay(1000);
    return true;
}

const findTextAreaPlaceHolder = async (): Promise<boolean> => {
    crawlerLog("Finding placeholder...");

    await delay(1000);

    scrollToBottomOfPage();

    try {
        const placeholder = getTextAreaPlaceholder();

        if (!placeholder) {
            return false;
        }
    } catch(error) {
        return false;
    }
    
    crawlerLog("Found placeholder");
    return true;
}

const prepareTextArea = async (): Promise<boolean> => {
    crawlerLog("Activating text area editable content...");

    await delay(200);

    activateTextAreaEditableContent();

    try {
        const editableContent = getTextAreaEditableContent();

        if (!editableContent) {
            return false;
        }
    } catch(error) {
        return false;
    }

    return true;
}

const injectGeneratedComment = async (message: string): Promise<boolean> => {
    crawlerLog("Injecting generated comment...");

    await delay(200);

    try {
        injectComment(message);
    } catch(error) {
        return false;
    }

    return true;
}

const saveComment = async (): Promise<boolean> => {
    crawlerLog("Saving generated comment...");

    await delay(200);

    try {
        enableSubmitButton();

        await delay(200);

        clickSubmitButton();

        crawlerLog("Saved generated comment!");
    } catch(error) {
        return false;
    }

    return true;
}

const confirmCommentSaved = async(message: string): Promise<boolean> => {
    crawlerLog("Verifying generated comment was created...");

    await delay(1000);

    const existingComment = getExistingComment(message);
    
    if (!existingComment) {
        return false;
    }

    setVideoComment(Status.COMPLETED);
    crawlerLog("Verified generated comment!");
    return true;
}

const main = (): void => {
    const status = getVideoStatus();

    if (status !== Status.IDLE) {
        crawlerLog("Video is not IDLE for the day, skipping");
        return;
    }

    setVideoComment(Status.PENDING);

    const message = getVideoComment();

    const asyncFunctions: (() => Promise<boolean>)[] = [
        () => isCorrectChannel(),
        () => displayWarning(3),
        () => displayWarning(2),
        () => displayWarning(1),
        () => findTextAreaPlaceHolder(),
        () => prepareTextArea(),
        () => injectGeneratedComment(message),
        () => saveComment(),
        () => confirmCommentSaved(message),
        // TODO: close?
    ];

    iteratePromiseFunctions(asyncFunctions, () => continueIfPending());
}

main();

window.moo = main;
(window as any).printLocalStorage = printLocalStorage;
(window as any).clearLocalStorage = clearLocalStorage;
(window as any).cancel = cancel;
(window as any).getVideoLinks = getVideoLinks;
(window as any).getGeneratedMessage = getGeneratedMessage;
(window as any).capitalizeRandomLetter = capitalizeRandomLetter;
(window as any).removeRandomLetter = removeRandomLetter;
