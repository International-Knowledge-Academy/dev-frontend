import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import authApi from "api/auth";
import type { User, UserRole } from "types/auth";

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  setUserFromData: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("access");
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await authApi.getMe();
        setUser(data);
        setRole(data.role);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const setUserFromData = useCallback((userData: User) => {
    setUser(userData);
    setRole(userData.role);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, setUserFromData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
