import api from "@/lib/axios";
import { getErrorMessage } from "@/lib/errorHandler";
import { useEffect, useState } from "react";

export type Employee = {
  id: string;
  name: string;
  email: string;
};

export default function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { data } = await api.get("/users");
        if (mounted) setEmployees(data);
      } catch (err) {
        if (mounted) setError(getErrorMessage(err));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { employees, isLoading, error };
}
