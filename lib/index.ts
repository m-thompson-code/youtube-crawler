import { capitalizeRandomLetter, getGeneratedMessage, removeRandomLetter } from "./comment-generator/comment-generator";
import { activateTextAreaEditableContent, clickSubmitButton, enableSubmitButton, getChannelName, getExistingComment, getTextAreaEditableContent, getTextAreaPlaceholder, getVideoLinks, injectComment, scrollToBottomOfPage } from "./dom/dom";
import { crawlerLog, LogType } from "./util/debug";
import { delay, iteratePromiseFunctions } from "./util/promises";

import { clearVideoMetadata, getVideoMetadata, setVideoMetadata, Status, updateVideoMetadata } from "./firebase/firestore";
import { signIn, signOut } from "./firebase/auth";

const authenticateBot = async() => {
    crawlerLog("Authenticating...");

    try {
        await signIn();
        return true;
    } catch(error) {
        crawlerLog(`Unexpected issue authenticating. Don't forget to set global email and password`, LogType.ERROR);
        crawlerLog(`window.__crawler__email__ = "..."; window.__crawler__password__ = "...";`, LogType.ERROR);
        throw error;
    }
}

const isCorrectChannel = async () => {
    const channelName = getChannelName();

    // Assume page hasn't rendered yet to show channel name,
    // try again
    if (!channelName) {
        return false;
    }

    if (channelName !== 'Philip DeFranco') {
        await updateVideoMetadata({ status: Status.CANCELLED, log: `Unexpected channel isn't correct: ${channelName}` });

        throw new Error("Unexpected incorrect channel found");
    }

    return true;
}

const cancel = async(): Promise<void> => {
    const { status } = await getVideoMetadata();

    if (status === Status.COMPLETED) {
        crawlerLog("Status is already complete", LogType.WARN);
        return;
    }

    await updateVideoMetadata({ status: Status.CANCELLED, log: "Manual cancel called" });

    crawlerLog("CANCELLING, CANCELLING, CANCELLING, CANCELLING, CANCELLING", LogType.ERROR);
}

const startIfIdle = async(): Promise<boolean> => {
    const { status } = await getVideoMetadata();

    if (status !== Status.IDLE) {
        crawlerLog("Video is not IDLE for the day, skipping");
        throw new Error("Video is not IDLE for the day, skipping");
    }

    await setVideoMetadata({
        status: Status.PENDING, 
        log: "Generating comment started",
        comment: getGeneratedMessage()
    });

    return true;
}

const continueIfPending = async(): Promise<void> => {
    const { status } = await getVideoMetadata();

    if (status !== Status.PENDING) {
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
    await updateVideoMetadata({ log: "Finding placeholder..." });

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
    
    await updateVideoMetadata({ log: "Found placeholder" });

    return true;
}

const prepareTextArea = async (): Promise<boolean> => {
    await updateVideoMetadata({ log: "Activating text area editable content..." });

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

const injectGeneratedComment = async (): Promise<boolean> => {
    await updateVideoMetadata({ log: "Injecting generated comment..." });

    const { comment } = await getVideoMetadata();

    await delay(200);

    try {
        injectComment(comment);
    } catch(error) {
        return false;
    }

    return true;
}

const saveComment = async (): Promise<boolean> => {
    await updateVideoMetadata({ log: "Saving generated comment..." });

    await delay(200);

    try {
        enableSubmitButton();

        await delay(200);

        clickSubmitButton();

        await updateVideoMetadata({ log: "Saved generated comment" });
    } catch(error) {
        return false;
    }

    return true;
}

const confirmCommentSaved = async(): Promise<boolean> => {
    await updateVideoMetadata({ log: "Verifying generated comment was created..." });


    const { comment } = await getVideoMetadata();

    await delay(1000);

    const existingComment = getExistingComment(comment);
    
    if (!existingComment) {
        return false;
    }

    await updateVideoMetadata({ status: Status.COMPLETED, log: "Verified generated comment" });

    return true;
}

const main = async(): Promise<void> => {
    await authenticateBot();

    await startIfIdle();

    const asyncFunctions: (() => Promise<boolean>)[] = [
        () => isCorrectChannel(),
        () => displayWarning(3),
        () => displayWarning(2),
        () => displayWarning(1),
        () => findTextAreaPlaceHolder(),
        () => prepareTextArea(),
        () => injectGeneratedComment(),
        () => saveComment(),
        () => confirmCommentSaved(),
        // TODO: close?
    ];

    await iteratePromiseFunctions(asyncFunctions, () => continueIfPending());
}

window.moo = main;
(window as any).clearVideoMetadata = clearVideoMetadata;
(window as any).cancel = cancel;
(window as any).getVideoLinks = getVideoLinks;
(window as any).getGeneratedMessage = getGeneratedMessage;
(window as any).capitalizeRandomLetter = capitalizeRandomLetter;
(window as any).removeRandomLetter = removeRandomLetter;
(window as any).getChannelName = getChannelName;
(window as any).signOut = signOut;
