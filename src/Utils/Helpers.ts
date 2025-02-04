import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const readableDate = (date: Date | string): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Get individual components
  const day = parsedDate.getUTCDate();
  const dayOfWeek = parsedDate.toLocaleDateString("en-US", {
    weekday: "short", // e.g., "Tue"
    timeZone: "UTC",
  });
  const month = parsedDate.toLocaleDateString("en-US", {
    month: "short", // e.g., "Sep"
    timeZone: "UTC",
  });
  const year = parsedDate.getUTCFullYear();

  // Get ordinal suffix for the day
  const ordinalSuffix = (n: number) => {
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dayWithSuffix = `${day}${ordinalSuffix(day)}`;

  // Return the formatted string
  return `${dayWithSuffix} ${dayOfWeek} ${month} ${year}`;
};

export const formatDateWithNumbers = (date: Date | string): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Extract components and pad with leading zeros
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const year = parsedDate.getFullYear();

  // Return formatted date
  return `${month}/${day}/${year}`;
};

export const formatDateForInput = (isoString: string): string => {
  // Ensure that the input string is treated as UTC
  const date = new Date(isoString + "T00:00:00Z");
  return date.toISOString().split("T")[0]; // Returns "2024-12-30"
};

export const readableDateTime = (
  date: Date | string
): { date: string; time: string } => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Reuse the readableDate function for the date part
  const formattedDate = readableDate(parsedDate);

  // Format the time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // Ensure no timezone offset is applied
  };
  const formattedTime = parsedDate.toLocaleTimeString("en-US", timeOptions);

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

export function calculateCurrentWeek(userScore: number) {
  const totalPointsPerWeek = 170;
  const minimumPointsPerWeek = 85;
  console.log(userScore);
  if (userScore < 0) {
    throw new Error("User score cannot be negative.");
  }

  if (userScore < minimumPointsPerWeek) {
    return 1; // If the user hasn't reached the minimum points for Week 1
  }

  // Calculate the current week
  const week = Math.ceil(userScore / totalPointsPerWeek) + 1;
  console.log({ week });
  return week;
}

export const getFileType = (file: File): string | null => {
  const fileTypeMap: { [key: string]: string } = {
    "application/pdf": "pdf", // For PDF
    "application/zip": "zip", // For ZIP
    "text/csv": "csv", // For CSV
  };

  return fileTypeMap[file.type] || null;
};

export const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export function formatTimeAgo(date: string | Date): string {
  const now = new Date();
  const inputDate = new Date(date);

  const timeDifference = now.getTime() - inputDate.getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (days === 1) {
    return `Yesterday, ${new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(new Date(date))}`;
  }
  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
