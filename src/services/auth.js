import { api } from "../utils/api.js";

// LOGIN
export const signIn = async (credentials) => {
  const res = await api.post("/filmshelf/login", credentials);
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

// CHECK AUTH (Este lo reemplazamos por getSelf)
export const checkAuth = async () => {
  try {
    const res = await api.get("/filmshelf/health");
    return res.status === 200;
  } catch {
    return false;
  }
};


export const getSelf = async () => {
  const res = await api.get("/filmshelf/me");
  return res.data; 
};