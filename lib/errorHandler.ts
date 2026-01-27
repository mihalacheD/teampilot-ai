import axios from "axios";

export function getErrorMessage(error: unknown): string {
  let message = "An unexpected error occurred. Please try again.";

  if (axios.isAxiosError(error)) {
    message = error.response?.data?.message || error.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return message;
}