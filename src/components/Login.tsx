import { useState } from 'react';
import { LogIn, GraduationCap } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <GraduationCap className="w-8 h-8 text-blue-900" />
          </div>
          <h1 className="text-white mb-2">Portal SEO Web</h1>
          <p className="text-blue-200">Universidad de las Ciencias Informáticas</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-gray-900 mb-2">
              {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
            <p className="text-gray-600">
              {isRegister 
                ? 'Regístrate para comenzar tu análisis SEO' 
                : 'Ingresa tus credenciales para continuar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder="Ingresa tu nombre"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="apellidos" className="block text-gray-700 mb-2">
                    Apellidos
                  </label>
                  <input
                    id="apellidos"
                    type="text"
                    placeholder="Ingresa tus apellidos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="correo" className="block text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="correo"
                type="email"
                placeholder="usuario@uci.cu"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
                required
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.contrasena}
                onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-900 hover:text-blue-700 transition-colors"
            >
              {isRegister 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        </div>

        <p className="text-center text-blue-200 mt-6">
          Herramienta académica de análisis y diagnóstico SEO
        </p>
      </div>
    </div>
  );
}
