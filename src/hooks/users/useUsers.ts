import { useState, useEffect, useCallback } from "react";
import axiosInstance from "api/axiosInstance";
import type { PaginatedUsers, User, UsersParams } from "types/auth";

interface UseUsersReturn {
  users: User[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  params: UsersParams;
  setParams: (updates: Partial<UsersParams>) => void;
  refetch: () => void;
}

const useUsers = (initialParams: UsersParams = {}): UseUsersReturn => {
  const [users, setUsers]       = useState<User[]>([]);
  const [count, setCount]       = useState(0);
  const [next, setNext]         = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [params, setParamsState] = useState<UsersParams>(initialParams);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get<PaginatedUsers>("/auth/users", {
        params: {
          ...(params.page     && { page:     params.page }),
          ...(params.search   && { search:   params.search }),
          ...(params.ordering && { ordering: params.ordering }),
          ...(params.role     && { role:     params.role }),
        },
      });

      setUsers(data.results);
      setCount(data.count);
      setNext(data.next);
      setPrevious(data.previous);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string; message?: string } } })
          ?.response?.data?.detail ??
        (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ??
        "Failed to load users.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setParams = (updates: Partial<UsersParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...updates,
      // Reset to page 1 when search or ordering changes
      page: updates.search !== undefined || updates.ordering !== undefined || updates.role !== undefined
        ? 1
        : (updates.page ?? prev.page),
    }));
  };

  return {
    users,
    count,
    next,
    previous,
    loading,
    error,
    params,
    setParams,
    refetch: fetchUsers,
  };
};

export default useUsers;
