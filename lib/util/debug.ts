export enum LogType {
    "INFO" = "INFO",
    "WARN" = "WARN",
    "ERROR" = "ERROR",
}

export const crawlerLog = (message: string, logType?: LogType):void => {
    switch(logType) {
        case LogType.ERROR:
            console.error(` ~~~ [MOO] - ${message}`);
            break;
        case LogType.WARN:
            console.warn(` ~~~ [MOO] - ${message}`);
            break;
        default:
            console.log(` ~~~ [MOO] - ${message}`);
    }
}
