import { useState } from 'react';
import { Search, Download, Plus, Filter, SlidersHorizontal } from 'lucide-react';

interface Keyword {
  id: number;
  keyword: string;
  volume: number;
  intent: 'Informativa' | 'Transaccional' | 'Navegacional';
  cpc: number;
  difficulty: number;
}

const mockKeywords: Keyword[] = [
  {
    id: 1,
    keyword: 'universidad ciencias informáticas',
    volume: 3200,
    intent: 'Navegacional',
    cpc: 0.45,
    difficulty: 35
  },
  {
    id: 2,
    keyword: 'carrera ingeniería software',
    volume: 1800,
    intent: 'Informativa',
    cpc: 0.65,
    difficulty: 42
  },
  {
    id: 3,
    keyword: 'cursos programación online',
    volume: 5400,
    intent: 'Transaccional',
    cpc: 1.25,
    difficulty: 58
  },
  {
    id: 4,
    keyword: 'mejor universidad informática cuba',
    volume: 890,
    intent: 'Informativa',
    cpc: 0.35,
    difficulty: 28
  },
  {
    id: 5,
    keyword: 'desarrollo web uci',
    volume: 450,
    intent: 'Informativa',
    cpc: 0.55,
    difficulty: 22
  },
  {
    id: 6,
    keyword: 'inscripción universidad',
    volume: 2700,
    intent: 'Transaccional',
    cpc: 0.85,
    difficulty: 45
  }
];

export function KeywordResearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minVolume: '',
    maxVolume: '',
    minWords: '',
    maxWords: ''
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setKeywords(mockKeywords);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600 bg-green-100';
    if (difficulty < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'Informativa':
        return 'text-blue-700 bg-blue-100';
      case 'Transaccional':
        return 'text-green-700 bg-green-100';
      case 'Navegacional':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Investigación de Palabras Clave</h1>
        <p className="text-gray-600">
          Descubre oportunidades de posicionamiento y analiza el potencial de tus keywords
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="keyword-search" className="block text-gray-700 mb-2">
              Palabra Clave Principal
            </label>
            <div className="flex gap-3">
              <input
                id="keyword-search"
                type="text"
                placeholder="Ej: universidad ciencias informáticas"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Botón de filtros */}
        <div className="mt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Volumen Mínimo
                </label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.minVolume}
                  onChange={(e) =>
                    setFilters({ ...filters, minVolume: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Volumen Máximo
                </label>
                <input
                  type="number"
                  placeholder="10000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.maxVolume}
                  onChange={(e) =>
                    setFilters({ ...filters, maxVolume: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Palabras Mínimas
                </label>
                <input
                  type="number"
                  placeholder="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.minWords}
                  onChange={(e) =>
                    setFilters({ ...filters, minWords: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Palabras Máximas
                </label>
                <input
                  type="number"
                  placeholder="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.maxWords}
                  onChange={(e) =>
                    setFilters({ ...filters, maxWords: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resultados */}
      {keywords.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 mb-1">Resultados de Búsqueda</h2>
              <p className="text-gray-600">{keywords.length} palabras clave encontradas</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Plus className="w-4 h-4" />
                Agregar al Tracking
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Palabra Clave
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Volumen
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Intención
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    CPC (USD)
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Dificultad
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {keywords.map((keyword) => (
                  <tr key={keyword.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      {keyword.keyword}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {keyword.volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full ${getIntentColor(
                          keyword.intent
                        )}`}
                      >
                        {keyword.intent}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      ${keyword.cpc.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full ${getDifficultyColor(
                          keyword.difficulty
                        )}`}
                      >
                        {keyword.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-900 hover:text-blue-700 transition-colors">
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {keywords.length === 0 && searchTerm === '' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Comienza tu investigación</h3>
          <p className="text-gray-600">
            Ingresa una palabra clave para descubrir oportunidades de posicionamiento
          </p>
        </div>
      )}
    </div>
  );
}
