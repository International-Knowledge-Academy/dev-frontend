import axiosInstance from "./axiosInstance";
import type { LoginResponse, User } from "types/auth";

const authApi = {
  login: (email: string, password: string) =>
    axiosInstance.post<LoginResponse>("/auth/token/obtain", { email, password }),

  refreshToken: (refresh: string) =>
    axiosInstance.post<{ access: string }>("/auth/token/refresh/", { refresh }),

  getMe: () =>
    axiosInstance.get<User>("/auth/me"),
};

export default authApi;
