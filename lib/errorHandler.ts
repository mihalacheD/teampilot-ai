import axios from "axios";

export function getErrorMessage(error: unknown): string {
  const fallback = "An unexpected error occurred. Please try again.";

  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
