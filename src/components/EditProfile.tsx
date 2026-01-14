import { useState } from 'react';
import { X, User, Save } from 'lucide-react';

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
}

interface ProfileData {
  nombre: string;
  apellidos: string;
  correo: string;
  contrasena: string;
}

export function EditProfile({ isOpen, onClose, onSave }: EditProfileProps) {
  const [formData, setFormData] = useState<ProfileData>({
    nombre: 'Usuario',
    apellidos: 'de Prueba',
    correo: 'usuario@uci.cu',
    contrasena: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Editar Perfil</h2>
              <p className="text-gray-600">Actualiza tu información personal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="edit-nombre" className="block text-gray-700 mb-2">
              Nombre
            </label>
            <input
              id="edit-nombre"
              type="text"
              placeholder="Ingresa tu nombre"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="edit-apellidos" className="block text-gray-700 mb-2">
              Apellidos
            </label>
            <input
              id="edit-apellidos"
              type="text"
              placeholder="Ingresa tus apellidos"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.apellidos}
              onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="edit-correo" className="block text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              id="edit-correo"
              type="email"
              placeholder="usuario@uci.cu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.correo}
              onChange={(e) => setFormData({...formData, correo: e.target.value})}
              required
            />
          </div>

          <div>
            <label htmlFor="edit-contrasena" className="block text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="edit-contrasena"
              type="password"
              placeholder="Ingresa nueva contraseña (opcional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.contrasena}
              onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
            />
            <p className="text-gray-500 mt-2">
              Deja este campo vacío si no deseas cambiar tu contraseña
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}