import { X } from 'lucide-react';
import { useState } from 'react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, domain: string, keywords: string) => void;
}

export function NewProjectModal({ isOpen, onClose, onCreate }: NewProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (projectName.trim() && domain.trim()) {
      onCreate(projectName.trim(), domain.trim(), keywords.trim());
      setProjectName('');
      setDomain('');
      setKeywords('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Crear Nuevo Proyecto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="projectName" className="block text-gray-700 mb-2">
                Nombre del Proyecto
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ej: Portal Facultad"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
            </div>

            <div>
              <label htmlFor="domain" className="block text-gray-700 mb-2">
                Dominio o URL
              </label>
              <input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Ej: www.ejemplo.uci.cu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
            </div>

            <div>
              <label htmlFor="keywords" className="block text-gray-700 mb-2">
                Palabras Clave Iniciales (opcional)
              </label>
              <textarea
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Ingresa las palabras clave separadas por comas&#10;Ej: universidad informática, carreras tecnología, admisión uci"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Nota:</strong> El proyecto se creará con configuración inicial para rastreo automático.
                Podrás configurar opciones avanzadas después de la creación.
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}