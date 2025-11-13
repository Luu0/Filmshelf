import { create } from "zustand";
// 1. IMPORTA EL SERVICIO DE ADMIN
import { getUsers } from "../services/adminService"; // Asumo que creaste este archivo como te indiqué

export const useAdminStore = create((set, get) => ({
  // 2. ESTADOS INICIALES (VACÍOS, SIN DATOS FALSOS)
  users: [],
  loading: false,
  error: null,

  // 3. ACCIÓN PARA TRAER USUARIOS DE LA API
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const usersFromApi = await getUsers(); // Llama a /api/filmshelf/users

      // 4. MAPEA TUS DATOS DE API (Roles es un array de objetos)
      // Tu API devuelve 'userName' y un array 'roles'
      const mappedUsers = usersFromApi.map(user => ({
        id: user.id,
        name: user.userName, // Ajustado a 'userName' de tu DTO
        email: user.email,
        // Asume que el primer rol es el principal
        role: user.roles?.[0]?.name.toLowerCase() || "user" 
      }));
      
      set({ users: mappedUsers, loading: false });

    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

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