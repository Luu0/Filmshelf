import React, { useState, useEffect } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { useMovieStore } from "../store/useMovieStore"; 
import PageLoader from "../Components/pageloader"; 
import { Redirect } from "wouter"; 


const AdminPanelContent = () => {
  const { users, loading, error, fetchUsers, addUser, deleteUser, updateUser } =
    useAdminStore();
    
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
  });


  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
  
  if (loading && users.length === 0) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="w-full min-h-screen ... text-center text-red-400">
        Error al cargar usuarios: {error}
      </div>
    );
  }

  // Tu JSX original (sin cambios, solo se renderiza si pasa el auth)
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-[#1d1c1b] to-[#3a3636] text-white p-4 pt-20 md:p-8 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <i className="fa-solid fa-user-shield me-3"></i>Panel
              Administrativo
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <i className={`fa-solid ${showForm ? "fa-times" : "fa-plus"}`}></i>
            {showForm ? "Cancelar" : "Nuevo Usuario"}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8 border border-gray-700">
            {/* ... (tu formulario no cambia) ... */}
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
                      (Aún no se han agregado usuarios)
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
                          user.role.toLowerCase() === "admin"
                            ? "bg-red-900 text-red-200"
                            : "bg-blue-900 text-blue-200"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-3 py-4 md:px-6 text-sm flex gap-2">
                        {/* ... (botones de editar/eliminar) ... */}
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
};


// --- 7. EL COMPONENTE "PADRE" QUE CONTROLA EL ACCESO ---
export default function AdminPanel() {
  const { user, isAuthenticated, isAuthLoading } = useMovieStore();

  // 1. Muestra "Cargando..." mientras se verifica el token
  if (isAuthLoading) {
    return <PageLoader />;
  }

  // 2. Si no está logueado, redirige a /login
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  // Tu API devuelve un array de roles, así que buscamos "Admin".

  // const isAdmin = user?.roles?.some(role => role.name === "Admin") ?? false;
  const isAdmin = true; // <-- ¡PUESTO EN 'true' A PROPÓSITO PARA PROBAR!
  
  if (isAdmin) {
    // 4. Si es Admin, muestra el panel
    return <AdminPanelContent />;
  }

  // 5. Si está logueado pero NO es Admin, muestra error 404
  return <Redirect to="/404" />; 
}