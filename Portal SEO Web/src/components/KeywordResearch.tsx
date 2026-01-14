import { useState, useMemo } from 'react';
import { Search, Download, SlidersHorizontal, ArrowUpDown, Eye, GitCompare, Bookmark, Lightbulb, MoreVertical, Check, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { KeywordDetailModal } from './KeywordDetailModal';

interface Keyword {
  id: number;
  keyword: string;
  volume: number;
  intent: 'Informacional' | 'Transaccional' | 'Navegacional' | 'Comercial';
  cpc: number;
  difficulty: number;
  competition: 'Baja' | 'Media' | 'Alta';
  competitionScore: number;
}

const mockKeywords: Keyword[] = [
  {
    id: 1,
    keyword: 'universidad ciencias informáticas',
    volume: 3200,
    intent: 'Navegacional',
    cpc: 0.45,
    difficulty: 35,
    competition: 'Media',
    competitionScore: 35
  },
  {
    id: 2,
    keyword: 'carrera ingeniería software',
    volume: 1800,
    intent: 'Informacional',
    cpc: 0.65,
    difficulty: 42,
    competition: 'Media',
    competitionScore: 42
  },
  {
    id: 3,
    keyword: 'cursos programación online',
    volume: 5400,
    intent: 'Transaccional',
    cpc: 1.25,
    difficulty: 58,
    competition: 'Alta',
    competitionScore: 58
  },
  {
    id: 4,
    keyword: 'mejor universidad informática cuba',
    volume: 890,
    intent: 'Informacional',
    cpc: 0.35,
    difficulty: 28,
    competition: 'Baja',
    competitionScore: 28
  },
  {
    id: 5,
    keyword: 'desarrollo web uci',
    volume: 450,
    intent: 'Informacional',
    cpc: 0.55,
    difficulty: 22,
    competition: 'Baja',
    competitionScore: 22
  },
  {
    id: 6,
    keyword: 'inscripción universidad',
    volume: 2700,
    intent: 'Transaccional',
    cpc: 0.85,
    difficulty: 45,
    competition: 'Media',
    competitionScore: 45
  },
  {
    id: 7,
    keyword: 'estudiar inteligencia artificial',
    volume: 1950,
    intent: 'Informacional',
    cpc: 0.75,
    difficulty: 38,
    competition: 'Media',
    competitionScore: 38
  },
  {
    id: 8,
    keyword: 'comprar curso programación',
    volume: 3100,
    intent: 'Comercial',
    cpc: 1.85,
    difficulty: 65,
    competition: 'Alta',
    competitionScore: 65
  },
  {
    id: 9,
    keyword: 'mejores universidades tecnología',
    volume: 1200,
    intent: 'Informacional',
    cpc: 0.48,
    difficulty: 31,
    competition: 'Baja',
    competitionScore: 31
  },
  {
    id: 10,
    keyword: 'portal estudiantes uci',
    volume: 680,
    intent: 'Navegacional',
    cpc: 0.25,
    difficulty: 18,
    competition: 'Baja',
    competitionScore: 18
  }
];

type SortField = 'volume' | 'cpc' | 'difficulty' | null;
type SortDirection = 'asc' | 'desc';

interface KeywordResearchProps {
  onAddToTracking: (keyword: string, volume: number) => boolean;
  onNavigateToTracking: () => void;
}

export function KeywordResearch({ onAddToTracking, onNavigateToTracking }: KeywordResearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [savedKeywords, setSavedKeywords] = useState<number[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState<Keyword | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [trackedKeywords, setTrackedKeywords] = useState<number[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successKeyword, setSuccessKeyword] = useState('');
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    minVolume: '',
    maxVolume: '',
    minWords: '',
    maxWords: '',
    intentFilters: [] as string[]
  });

  // Estados de ordenamiento
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setKeywords(mockKeywords);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleIntentFilter = (intent: string) => {
    setFilters(prev => ({
      ...prev,
      intentFilters: prev.intentFilters.includes(intent)
        ? prev.intentFilters.filter(i => i !== intent)
        : [...prev.intentFilters, intent]
    }));
  };

  const toggleSaveKeyword = (id: number) => {
    setSavedKeywords(prev =>
      prev.includes(id) ? prev.filter(kw => kw !== id) : [...prev, id]
    );
  };

  const handleViewDetail = (keyword: Keyword) => {
    setSelectedKeyword(keyword);
    setShowDetailModal(true);
    setActiveMenu(null);
  };

  const handleAddToTracking = (keyword: Keyword) => {
    const added = onAddToTracking(keyword.keyword, keyword.volume);
    if (added) {
      setTrackedKeywords(prev => [...prev, keyword.id]);
      setShowSuccessMessage(true);
      setSuccessKeyword(keyword.keyword);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  // Aplicar filtros y ordenamiento
  const filteredAndSortedKeywords = useMemo(() => {
    let result = [...keywords];

    // Aplicar filtros de volumen
    if (filters.minVolume) {
      result = result.filter(k => k.volume >= parseInt(filters.minVolume));
    }
    if (filters.maxVolume) {
      result = result.filter(k => k.volume <= parseInt(filters.maxVolume));
    }

    // Aplicar filtros de número de palabras
    if (filters.minWords || filters.maxWords) {
      result = result.filter(k => {
        const wordCount = k.keyword.split(' ').length;
        const min = filters.minWords ? parseInt(filters.minWords) : 0;
        const max = filters.maxWords ? parseInt(filters.maxWords) : Infinity;
        return wordCount >= min && wordCount <= max;
      });
    }

    // Aplicar filtros de intención
    if (filters.intentFilters.length > 0) {
      result = result.filter(k => filters.intentFilters.includes(k.intent));
    }

    // Aplicar ordenamiento
    if (sortField) {
      result.sort((a, b) => {
        let comparison = 0;
        if (sortField === 'volume') {
          comparison = a.volume - b.volume;
        } else if (sortField === 'cpc') {
          comparison = a.cpc - b.cpc;
        } else if (sortField === 'difficulty') {
          comparison = a.difficulty - b.difficulty;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [keywords, filters, sortField, sortDirection]);

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'Baja':
        return 'text-green-700 bg-green-100';
      case 'Media':
        return 'text-yellow-700 bg-yellow-100';
      case 'Alta':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-green-600 bg-green-100';
    if (difficulty < 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'Informacional':
        return 'text-blue-700 bg-blue-100';
      case 'Transaccional':
        return 'text-green-700 bg-green-100';
      case 'Navegacional':
        return 'text-purple-700 bg-purple-100';
      case 'Comercial':
        return 'text-orange-700 bg-orange-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortDirection === 'desc' ? 'text-blue-600' : 'text-blue-600 rotate-180'}`} 
      />
    );
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
            <div className="space-y-4">
              {/* Filtros de volumen y palabras */}
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

              {/* Filtros de intención */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Intención de Búsqueda
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Informacional', 'Transaccional', 'Navegacional', 'Comercial'].map((intent) => (
                    <button
                      key={intent}
                      onClick={() => toggleIntentFilter(intent)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        filters.intentFilters.includes(intent)
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {intent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Indicador de filtros activos */}
              {(filters.minVolume || filters.maxVolume || filters.minWords || filters.maxWords || filters.intentFilters.length > 0) && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-blue-700">
                    {filteredAndSortedKeywords.length} resultados con filtros activos
                  </span>
                  <button
                    onClick={() => setFilters({
                      minVolume: '',
                      maxVolume: '',
                      minWords: '',
                      maxWords: '',
                      intentFilters: []
                    })}
                    className="text-blue-700 hover:text-blue-900 underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
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
              <p className="text-gray-600">
                {filteredAndSortedKeywords.length} de {keywords.length} palabras clave
              </p>
            </div>
            <div className="flex gap-3">
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
                    <button
                      onClick={() => handleSort('volume')}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      Volumen
                      {getSortIcon('volume')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Intención
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    <button
                      onClick={() => handleSort('cpc')}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      CPC (USD)
                      {getSortIcon('cpc')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    <button
                      onClick={() => handleSort('difficulty')}
                      className="flex items-center gap-2 hover:text-gray-900"
                    >
                      Dificultad
                      {getSortIcon('difficulty')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Competencia
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedKeywords.map((keyword) => (
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
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full ${getCompetitionColor(
                            keyword.competition
                          )}`}
                        >
                          {keyword.competition}
                        </span>
                        <span className="text-gray-600">
                          ({keyword.competitionScore})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === keyword.id ? null : keyword.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {activeMenu === keyword.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                            <button
                              onClick={() => handleViewDetail(keyword)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Ver detalle de competencia
                            </button>
                            <button
                              onClick={() => setActiveMenu(null)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <GitCompare className="w-4 h-4" />
                              Comparar keywords
                            </button>
                            <button
                              onClick={() => {
                                toggleSaveKeyword(keyword.id);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Bookmark 
                                className={`w-4 h-4 ${savedKeywords.includes(keyword.id) ? 'fill-blue-600 text-blue-600' : ''}`} 
                              />
                              {savedKeywords.includes(keyword.id) ? 'Guardada' : 'Guardar keyword'}
                            </button>
                            <button
                              onClick={() => setActiveMenu(null)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Lightbulb className="w-4 h-4" />
                              Analizar oportunidades
                            </button>
                            <button
                              onClick={() => handleAddToTracking(keyword)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <TrendingUpIcon className="w-4 h-4" />
                              Añadir a seguimiento
                            </button>
                          </div>
                        )}
                      </div>
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

      {/* Modal de detalle */}
      {showDetailModal && selectedKeyword && (
        <KeywordDetailModal
          keyword={selectedKeyword}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedKeyword(null);
          }}
        />
      )}

      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Keyword "{successKeyword}" añadida a seguimiento</span>
        </div>
      )}
    </div>
  );
}