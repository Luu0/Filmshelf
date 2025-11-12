import { create } from "zustand";

export const useAdminStore = create((set, get) => ({
  users: [
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "user" },
    { id: 2, name: "María García", email: "maria@example.com", role: "user" },
    { id: 3, name: "Carlos López", email: "carlos@example.com", role: "admin" },
    { id: 4, name: "Ana Martínez", email: "ana@example.com", role: "user" },
  ],

  // Acciones
  getUsers: () => get().users,

  addUser: (userData) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          id: Math.max(...state.users.map((u) => u.id), 0) + 1,
          ...userData,
        },
      ],
    })),

  updateUser: (userId, updatedData) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...updatedData } : user
      ),
    })),

  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    })),
}));
