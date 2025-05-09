import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
}; 