import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

export enum FormatDate {
    MMDDYYYY = "MM-dd-yyyy",
    DDMMYYYY = "DD-MM-YYYY",
    YYYYDDMM = "yyyy-dd-MM",
    YYYYMMDD = "YYYY-MM-DD"
}

export const formatTimestampToDateString = (timestamp: Timestamp, formatTo?: FormatDate): string => {
    const date = timestamp.toDate();
    return formatTo ? dayjs(date).format(formatTo) : dayjs(date).format(FormatDate.YYYYMMDD);
}