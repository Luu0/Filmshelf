import { api } from "../utils/api.js";

// Obtiene la lista de usuarios (requiere rol Admin/Mod)
export const getUsers = async () => {
  const res = await api.get("/filmshelf/users");
  return res.data;
};
