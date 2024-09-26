// @typescript-eslint/no-explicit-any
import { useState } from "react";
import { toast } from "react-toastify";

export function useRequestError({ useToast = false } = {}) {
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRequestError = async (arg: any) => {
    let error;
    if (typeof arg === "function") {
      // if arg is a function invoke it
      try {
        await Promise.resolve(arg());
      } catch (err) {
        error = err;
      }
    } else {
      error = arg;
    }

    if (error) {
      const errMessage =
        error?.response?.data?.message || error?.response?.data?.message.join();
      if (useToast) {
        toast.error(errMessage?.toString(), { toastId: "error-message" });
        return;
      } else {
        setError(errMessage);
      }
    }
  };

  const resetError = () => setError(null);

  return {
    error,
    resetError,
    handleRequestError,
    catch: handleRequestError,
  };
}
