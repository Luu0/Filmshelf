import { api } from "../utils/api.js";

// LOGIN
export const signIn = async (credentials) => {
  const res = await api.post("/filmshelf/login", credentials, {
    withCredentials: true,
  });
  return res.data;
};

// REGISTER
export const registerUser = async (user) => {
  const res = await api.post("/filmshelf/register", user);
  return res.data;
};

// LOGOUT
export const signOut = async () => {
  await api.post("/filmshelf/logout");
};

// CHECK AUTH
export const checkAuth = async () => {
  try {
    const res = await api.get("/filmshelf/health");
    return res.status === 200;
  } catch {
    return false;
  }
};
