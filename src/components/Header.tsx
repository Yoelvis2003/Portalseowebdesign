import { ChevronDown, LogOut, Bell, User, Plus, Menu, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { EditProfile } from './EditProfile';
import { NewProjectModal } from './NewProjectModal';

interface HeaderProps {
  currentProject: string;
  onLogout: () => void;
  onCreateProject?: (name: string, domain: string, keywords: string) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ 
  currentProject, 
  onLogout, 
  onCreateProject, 
  onToggleSidebar, 
  sidebarOpen,
  darkMode,
  onToggleDarkMode 
}: HeaderProps) {
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
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
        <div className="flex items-center justify-between">
          {/* Botón Portal SEO y Proyecto actual */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="flex items-center gap-2 px-4 py-2 text-blue-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span>Portal SEO</span>
            </button>
            
            <div className="border-l border-gray-300 dark:border-gray-600 h-8" />
            
            <div>
              <p className="text-gray-600 dark:text-gray-400">Proyecto Activo</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white">{currentProject}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-4">
            {/* Botón Nuevo Proyecto */}
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center gap-2 bg-blue-900 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Proyecto
            </button>

            {/* Botón Dark Mode - Solo icono con efecto elegante */}
            <button
              onClick={onToggleDarkMode}
              className="relative p-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-900 dark:hover:border-blue-500 transition-all duration-300 group"
              title={darkMode ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
            >
              <div className="relative w-5 h-5">
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-400 transform group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-900 dark:text-blue-400 transform group-hover:-rotate-12 transition-transform duration-500" />
                )}
              </div>
            </button>

            {/* Notificaciones */}
            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-900 dark:bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white">U</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                  <button
                    onClick={() => {
                      setShowEditProfile(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Editar perfil
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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