export const getParams = (): Record<string, string> => {
    // source: https://stackoverflow.com/a/901144
    const urlSearchParams = new URLSearchParams(window.location.search);

    return Object.fromEntries(urlSearchParams.entries());
}

export const getYoutubeVideoId = (): string | null => {
    return getParams().v ?? null;
}
