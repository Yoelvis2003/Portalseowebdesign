import { ChevronDown, LogOut, Bell, User, Plus } from 'lucide-react';
import { useState } from 'react';
import { EditProfile } from './EditProfile';
import { NewProjectModal } from './NewProjectModal';

interface HeaderProps {
  currentProject: string;
  onLogout: () => void;
  onCreateProject?: (name: string, domain: string, keywords: string) => void;
}

export function Header({ currentProject, onLogout, onCreateProject }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const handleSaveProfile = (data: any) => {
    console.log('Perfil actualizado:', data);
    // Aquí se manejaría la actualización del perfil
  };

  const handleCreateProject = (name: string, domain: string, keywords: string) => {
    if (onCreateProject) {
      onCreateProject(name, domain, keywords);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Proyecto actual */}
          <div>
            <p className="text-gray-600">Proyecto Activo</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-900">{currentProject}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-4">
            {/* Botón Nuevo Proyecto */}
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Proyecto
            </button>

            {/* Notificaciones */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-white">U</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => {
                      setShowEditProfile(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Editar perfil
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de editar perfil */}
      <EditProfile 
        isOpen={showEditProfile} 
        onClose={() => setShowEditProfile(false)}
        onSave={handleSaveProfile}
      />

      {/* Modal de nuevo proyecto */}
      <NewProjectModal 
        isOpen={showNewProjectModal} 
        onClose={() => setShowNewProjectModal(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
}