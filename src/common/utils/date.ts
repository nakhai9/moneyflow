import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export enum FormatDate {
    MMDDYYYY = "MM-dd-yyyy",
    DDMMYYYY = "dd-MM-yyyy",
    YYYYDDMM = "yyyy-dd-MM",
    YYYYMMDD = "yyyy-MM-dd"
}

export const formatTimestampToDateString = (timestamp: Timestamp, formatTo?: FormatDate): string => {
    let result: string = ''
    const timeStamp = new Timestamp(timestamp.seconds, timestamp.nanoseconds);
    const date = timeStamp.toDate();
    return formatTo ? format(date, formatTo) : format(date, FormatDate.YYYYMMDD);
}