import React, { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";

export default function AdminPanel() {
  const { users, addUser, deleteUser, updateUser } =
    useAdminStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim()) {
      if (editingId) {
        updateUser(editingId, formData);
        setEditingId(null);
      } else {
        addUser(formData);
      }
      setFormData({ name: "", email: "", role: "user" });
      setShowForm(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditingId(user.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", email: "", role: "user" });
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#1d1c1b] to-[#3a3636] text-white p-4 pt-20 md:p-8 md:pt-8">
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <i className="fa-solid fa-user-shield me-3"></i>Panel Administrativo
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <i className={`fa-solid ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showForm ? "Cancelar" : "Nuevo Usuario"}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Editar Usuario" : "Agregar Nuevo Usuario"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-[#1a1a1a] border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-[#1a1a1a] border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="bg-[#1a1a1a] border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="user">Usuario</option>
                <option value="admin">Admin</option>
              </select>
              <div className="md:col-span-3 flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  {editingId ? "Guardar Cambios" : "Agregar"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded font-semibold transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de usuarios */}
        <div className="bg-[#2a2a2a] rounded-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border-b border-gray-700">
                <tr>
                  <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">ID</th>
                  <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">Correo</th>
                  <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">Rol</th>
                  <th className="px-3 py-4 md:px-6 text-left text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-700 ${
                        index % 2 === 0 ? "bg-[#2a2a2a]" : "bg-[#1f1f1f]"
                      } hover:bg-[#333333] transition`}
                    >
                      <td className="px-3 py-4 md:px-6 text-sm">{user.id}</td>
                      <td className="px-3 py-4 md:px-6 text-sm font-medium">{user.name}</td>
                      <td className="px-3 py-4 md:px-6 text-sm text-gray-400">{user.email}</td>
                      <td className="px-3 py-4 md:px-6 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-red-900 text-red-200"
                            : "bg-blue-900 text-blue-200"
                        }`}>
                          {user.role === "admin" ? "Admin" : "Usuario"}
                        </span>
                      </td>
                      <td className="px-3 py-4 md:px-6 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 md:px-3 rounded text-xs transition flex items-center gap-1"
                          title="Editar"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                          <span className="hidden md:inline ml-1">Editar</span>
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700 px-2 py-1 md:px-3 rounded text-xs transition flex items-center gap-1"
                          title="Eliminar"
                        >
                          <i className="fa-solid fa-trash"></i>
                          <span className="hidden md:inline ml-1">Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-[#1a1a1a] px-4 md:px-6 py-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Total de usuarios: <span className="font-bold text-white">{users.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}