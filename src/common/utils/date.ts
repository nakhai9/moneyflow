import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export enum FormatDate {
    MMDDYYYY = "MM-dd-yyyy",
    DDMMYYYY = "dd-MM-yyyy",
    YYYYDDMM = "yyyy-dd-MM",
    YYYYMMDD = "yyyy-MM-dd"
}

export const formatTimestampToDateString = (timestamp: Timestamp, formatTo?: FormatDate): string => {
    const date = new Timestamp(timestamp.seconds ?? 0, timestamp.nanoseconds).toDate();
    console.log(format(date, FormatDate.YYYYMMDD));    
    return formatTo ? format(date, formatTo) : format(date, "yyyy-MM-dd");
}