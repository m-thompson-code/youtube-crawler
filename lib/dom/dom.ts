import { crawlerLog } from "../util/debug";

export const scrollElementIntoView = (element: Element): void => {
    element.scrollIntoView({
        block: 'center'
    });
}

export const scrollToBottomOfPage = () => {
    const scrollHeightElement = document.scrollingElement || document.body;
    window.scrollTo(0, scrollHeightElement.scrollHeight);
};

export const getTextAreaPlaceholder = (): HTMLElement => {
    const placeholder = document.getElementById('placeholder-area');

    if (!placeholder) {
        throw new Error("Unexpected missing placeholder for content");
    }

    return placeholder;
};

export const getTextAreaEditableContent = (): HTMLElement => {
    const editableContent = document.getElementById('contenteditable-root');

    if (!editableContent) {
        throw Error("Unexpected missing editable content");
    }

    return editableContent;
}

export const getSubmitButton = (): HTMLButtonElement => {
    const button = document.getElementById('submit-button') as HTMLButtonElement;

    if (!button) {
        throw Error("Unexpected missing submit button");
    }

    return button;
}

export const activateTextAreaEditableContent = () => {
    const placeholder = getTextAreaPlaceholder();
    scrollElementIntoView(placeholder);
    placeholder.click();
};

export const injectComment = (comment: string) => {
    const editableContent = getTextAreaEditableContent();
    scrollElementIntoView(editableContent);

    if (!comment) {
        throw new Error("Unexpected missing comment");
    }

    editableContent.innerText = comment;
}

export const enableSubmitButton = () => {
    const button = getSubmitButton();
    scrollElementIntoView(button);
    button.disabled = false;
}

export const clickSubmitButton = () => {
    const button = getSubmitButton();
    scrollElementIntoView(button);

    if (window.__crawler_dry_run__) {
        crawlerLog("DRY RUN: skipping click submit button");
        return;
    }

    button.click();
}

export const getChannelName = (): string | null => {
    const videoOwnerRenderer = document.getElementsByTagName('ytd-video-owner-renderer')[0];

    if (!videoOwnerRenderer) {
        return null;
    }

    const channelNameElements = Array.from(videoOwnerRenderer.getElementsByTagName('ytd-channel-name')) as HTMLElement[];
    const channelNames = channelNameElements.filter(element => !!element.innerText).map(element => element.innerText);

    if (channelNames.length > 1) {
        throw new Error("Unexpected multiple channel names");
    }
    
    return channelNames[0];
}

export const getExistingComment = (message: string): HTMLElement | null => {
    const commentsWrapper = document.getElementById('contents');

    if (!commentsWrapper) {
        throw new Error("Unexpected missing contents");
    }

    if (window.__crawler_dry_run__) {
        crawlerLog("DRY RUN: skipping get existing comment. Returning mock HTML Element");
        return {} as HTMLElement;
    }

    const commentElements = Array.from(commentsWrapper.getElementsByTagName('yt-formatted-string')) as HTMLElement[];
    
    return commentElements.find(ele => {
        const cleanedElementText = ele.innerText;
        const cleanedMessage = message;

        return cleanedElementText === cleanedMessage;
    }) ?? null;
}

export const getVideoLinks = (): string[] => {
    const thumbnails = Array.from(document.getElementsByTagName('ytd-grid-video-renderer'));

    return thumbnails.map(thumbnail => thumbnail.getElementsByTagName('a')[0]?.href).filter(link => !!link);
}
