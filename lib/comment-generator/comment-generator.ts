import { adjustives, betweens, endings, intros, monkeyLogos, nouns, pdfs, shirtAdjectives, shirtIntros, shirtNouns } from "./random-words";

export const endsWithPunctuation = (value: string): boolean => {
    return [".", "?", "!", ","].some(punctuation => value.endsWith(punctuation));
}

export const capitalizeFirstLetter = (value: string) => {
    if (!value) {
        return value;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const capitalizeRandomLetter = (value: string) => {
    if (!value) {
        return value;
    }

    const index = Math.random() * value.length;

    return value.slice(0, index) + value.charAt(index).toUpperCase() + value.slice(index + 1);
}

export const removeRandomLetter = (value: string) => {
    if (!value) {
        return value;
    }

    const index = Math.random() * value.length;

    return value.slice(0, index) + value.slice(index + 1);
}

export const getRandomValue = <T>(values: T[]): T => {
    const seed = Math.floor(values.length * Math.random());

    return values[seed];
}

export const getRandomIntro = (): string => {
    return getRandomValue(intros);
}

export const getRandomBetween = (): string => {
    return getRandomValue(betweens);
}

export const getRandomPDF = (): string => {
    return getRandomValue(pdfs);
}

export const getRandomAdjustive = (noun: string): string => {
    if (noun === 'channel') {
        return getRandomValue(adjustives.filter(adjustive => !['classic', 'good', 'great', 'relaxing'].includes(adjustive)));
    }

    return getRandomValue(adjustives);
}

export const getRandomNoun = (between: string): string => {
    if (between === 'these') {
        return getRandomValue(nouns.filter(noun => !['show', 'series', 'channel'].includes(noun)))
    }

    if (between !== 'the') {
        return getRandomValue(nouns.filter(noun => noun === 'series'))
    }
    return getRandomValue(nouns);
}

export const getRandomShirtIntro = (): string => {
    return getRandomValue(shirtIntros);
}
export const getRandomShirtAdjective = (): string => {
    return getRandomValue(shirtAdjectives);
}
export const getRandomMonkeyLogo = (): string => {
    return getRandomValue(monkeyLogos);
}
export const getRandomShirtNoun = (): string => {
    return getRandomValue(shirtNouns);
}

export const getRandomEndings = (isQuestion: boolean): string => {
    if (isQuestion) {
        return getRandomValue(["?", "?", "?", "??", ...endings]);
    }
    return getRandomValue(endings);
}

export const addWord = (source: string, word: string): string => {
    if (!source) {
        return word;
    }

    if (!word) {
        return source;
    }

    return `${source} ${word}`;
}

export const combineStatements = (first: string, second: string): string => {
    if (!first) {
        return second;
    }

    if (!second) {
        return first;
    }

    if (!endsWithPunctuation(first.trim()) && Math.random() < .9) {
        return `${first.trim()}, ${second.trim()}`;
    }

    return `${first} ${second.trim()}`;
}

export const getGeneratedFanMessage = () => {
    const intro = getRandomIntro();
    const between = getRandomBetween();
    const noun = getRandomNoun(between);
    const possibleAdjustive = Math.random() < .8 ? getRandomAdjustive(noun) : '';
    
    let message = "";

    if (!possibleAdjustive || (between !== 'the' && Math.random() < .6)) {
        message = addWord(message, intro);
        message = addWord(message, between);
    }

    message = addWord(message, possibleAdjustive);

    if (between == 'the' && Math.random() < .7) {
        message = addWord(message, getRandomPDF());
    }

    message  = addWord(message, between === 'these' ? `${noun}s` : noun);

    const finalMessage = message + getRandomEndings(false);

    if (Math.random() < .5) {
        return finalMessage
    }

    return capitalizeFirstLetter(finalMessage);
};

export const getGeneratedShirtMessage = () => {
    const intro = getRandomShirtIntro();
    const adjective = getRandomShirtAdjective();
    const monkeyLogo = getRandomMonkeyLogo();
    const noun = getRandomShirtNoun();

    let message = intro;
    if (Math.random() < .8) {
        message = addWord(message, adjective);
    }

    if (Math.random() < .2) {
        message = addWord(message, getRandomPDF());
    }

    message = addWord(message, monkeyLogo);
    message = addWord(message, noun);

    const finalMessage = message + getRandomEndings(true);

    if (Math.random() < .5) {
        return finalMessage
    }

    return capitalizeFirstLetter(finalMessage);
};

export const getCombinedGeneratedMessage = (): string => {
    const shirtMessage = getGeneratedShirtMessage();

    if (Math.random() < .3) {
        return shirtMessage;
    }

    const fanMessage = getGeneratedFanMessage();

    if (Math.random() < .5) {
        return combineStatements(fanMessage, shirtMessage).trim();
    }

    return combineStatements(shirtMessage, fanMessage).trim();
}

export const getGeneratedMessage = (): string => {
    let message = getCombinedGeneratedMessage();

    if (Math.random() < .05) {
        message =  capitalizeRandomLetter(message);
    }

    if (Math.random() < .05) {
        message = removeRandomLetter(message);
    }

    return message.trim();
}
