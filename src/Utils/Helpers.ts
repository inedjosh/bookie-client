import { AxiosError } from "axios";

export const capitalizeFirstLetter = (data: string) => {
  if (!data) return "";
  return data !== "" && typeof data !== "undefined"
    ? data.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
    : "";
};

export const formatDate = (date: Date): string =>
  new Date(date).toLocaleDateString();

export const numberFormat = (number: number) => {
  if (!number) return 0;
  return new Intl.NumberFormat("en-EN").format(number);
};

export const readableDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  const [month, day, year] = formattedDate.split(" ");

  return ` ${month} ${day} ${year}`;
};

export const readableDateTime = (
  date: Date
): { date: string; time: string } => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", dateOptions);
  const formattedTime = new Date(date).toLocaleTimeString("en-US", timeOptions);

  return { date: formattedDate, time: formattedTime };
};

export const truncateText = (str: string, num: number): string => {
  if (str?.length > num) {
    return `${str.substring(0, num)}...`;
  }
  return str;
};

export const getInitials = (name: string) => {
  const initialOne = name?.split(" ")[0];
  const initialTwo = name?.split(" ")[1];

  return initialOne[0] + initialTwo[0];
};

export const capitalizeText = (str: string) => {
  if (typeof str !== "string" || str.length === 0) return str;

  const firstChar = str.charAt(0)?.toUpperCase();
  const restOfString = str.slice(1)?.toLowerCase();

  return firstChar + restOfString;
};

export function convertToSentence(inputString: string): string {
  const convertWord = inputString[0].toUpperCase();
  const remainingLetters = inputString.slice(1, inputString.length);
  const converted = convertWord + remainingLetters;

  const words: string[] = converted.match(/[A-Z][a-z]*/g) || [];

  if (!words) {
    return inputString;
  }

  const sentence: string = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return sentence;
}

export const getErrorMessge = (error: AxiosError) => {
  const message =
    (error.response && error.response.data) ||
    error.message ||
    error.toString();

  return message;
};

export function generateRandomDocumentName() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = Math.floor(Math.random() * 10) + 1;
  let documentName = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    documentName += characters[randomIndex];
  }

  return documentName + ".doc";
}
