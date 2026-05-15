import { useEffect, useState } from "react";

import { ApiUser } from "@/types/user";
import { getAllUsers } from "@/services/userService";

export const useUsers = () => {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    setUsers,
    loading,
    fetchUsers,
  };
};