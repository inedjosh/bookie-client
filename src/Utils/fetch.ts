import axios from "axios";
import axiosInstance from "./Https";
import { toast } from "react-toastify";

export interface FetchResponse<T> {
  data: T | null;
  error?: string;
}

// Error handling utility
function extractErrorMessage(error: unknown): string {
  let errorMessage: string;
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server error
      errorMessage =
        error.response.data?.message ||
        error.response.statusText ||
        "Server error";
    } else if (error.request) {
      // No response
      errorMessage = "No response received from server";
    } else {
      // Request setup error
      errorMessage = error.message || "Request setup error";
    }
  } else if (error instanceof Error) {
    // Non-Axios error
    errorMessage = error.message;
  } else {
    errorMessage = "An unknown error occurred";
  }

  toast.error(errorMessage);
  return errorMessage;
}

// Generic fetch function
export async function fetchData<T>(url: string): Promise<FetchResponse<T>> {
  try {
    const response = await axiosInstance.get(url);

    return { data: response.data.data };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    return { data: null, error: errorMessage };
  }
}

// Function for POST requests
export async function postData<T>(
  url: string,
  payload: Record<string, unknown>,
  showToast: boolean = true
): Promise<FetchResponse<T>> {
  try {
    const response = await axiosInstance.post(url, payload);

    if (
      response.data &&
      Object.keys(response.data).length > 0 &&
      response.status
    ) {
      if (showToast) toast.success(response.data.message);

      return { data: response.data.data };
    }

    return { data: null, error: "No data found" };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    toast.error(errorMessage);

    return { data: null, error: errorMessage };
  }
}

// Function for PUT requests
export async function updateData<T>(
  url: string,
  payload: Record<string, unknown>,
  showToast: boolean = true
): Promise<FetchResponse<T>> {
  try {
    const response = await axiosInstance.put(url, payload);

    if (
      response.data &&
      Object.keys(response.data).length > 0 &&
      response.status
    ) {
      if (showToast) toast.success(response.data.message);
      return { data: response.data.data };
    }

    return { data: null, error: "No data found" };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    toast.error(errorMessage);

    return { data: null, error: errorMessage };
  }
}

// Function for DELETE requests
export async function deleteData<T>(url: string): Promise<FetchResponse<T>> {
  try {
    const response = await axiosInstance.delete(url);

    if (
      response.data &&
      Object.keys(response.data).length > 0 &&
      response.status
    ) {
      toast.success(response.data.message);

      return { data: response.data.data };
    }

    return { data: null, error: "No data found" };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    toast.error(errorMessage);

    return { data: null, error: errorMessage };
  }
}
