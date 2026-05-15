import { api } from "@/lib/api";
import { ApiUser } from "@/types/user";

interface ApiResponse {
  status: number;
  message: string;
  data: ApiUser[];
}

export const getAllUsers = async (): Promise<ApiUser[]> => {
  const response = await api.get<ApiResponse>("/user/all");

  return response.data.data;
};