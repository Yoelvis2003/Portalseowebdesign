import { X } from 'lucide-react';
import { useState } from 'react';

interface AddKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (keyword: string, volume: number, url: string) => void;
}

export function AddKeywordModal({ isOpen, onClose, onAdd }: AddKeywordModalProps) {
  const [keyword, setKeyword] = useState('');
  const [volume, setVolume] = useState('');
  const [url, setUrl] = useState('/');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (keyword.trim() && volume) {
      onAdd(keyword.trim(), parseInt(volume), url);
      setKeyword('');
      setVolume('');
      setUrl('/');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Agregar Palabra Clave</h2>
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
              <label htmlFor="keyword" className="block text-gray-700 mb-2">
                Palabra Clave
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ej: universidad informática cuba"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
            </div>

            <div>
              <label htmlFor="volume" className="block text-gray-700 mb-2">
                Volumen de Búsqueda Mensual
              </label>
              <input
                id="volume"
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="Ej: 1200"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
                min="0"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-gray-700 mb-2">
                URL Objetivo
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Ej: /admision"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                required
              />
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
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
