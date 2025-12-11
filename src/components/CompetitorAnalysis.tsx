import { Search, TrendingUp, TrendingDown, Plus, X, ExternalLink, Download, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner@2.0.3';

interface DomainData {
  domain: string;
  traffic: number;
  keywords: number;
  trafficChange: number;
  keywordsChange: number;
  topKeywords: KeywordDetail[];
  color: string;
}

interface KeywordDetail {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  url: string;
  change: number;
}

// Datos históricos de tráfico (últimos 12 meses)
const generateTrafficHistory = (baseDomains: string[]) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return months.map((month, index) => {
    const data: any = { month };
    
    baseDomains.forEach((domain, domainIndex) => {
      const baseTraffic = [25000, 18000, 15000, 12000, 9000][domainIndex] || 8000;
      const variation = Math.sin(index * 0.5 + domainIndex) * 3000;
      const trend = index * 500;
      data[domain] = Math.max(1000, Math.floor(baseTraffic + variation + trend));
    });
    
    return data;
  });
};

const defaultDomains: DomainData[] = [
  {
    domain: 'www.uci.cu',
    traffic: 28500,
    keywords: 156,
    trafficChange: 12.5,
    keywordsChange: 8,
    color: '#3b82f6',
    topKeywords: [
      { keyword: 'universidad ciencias informáticas', position: 1, volume: 3200, traffic: 2850, url: '/', change: 1 },
      { keyword: 'mejor universidad informática cuba', position: 2, volume: 890, traffic: 720, url: '/admision', change: -1 },
      { keyword: 'admisión universidad', position: 4, volume: 2700, traffic: 1890, url: '/admision/requisitos', change: 2 },
      { keyword: 'carrera ingeniería software', position: 3, volume: 1800, traffic: 1350, url: '/cursos/ingenieria-software', change: 0 },
      { keyword: 'cursos programación', position: 5, volume: 2400, traffic: 1560, url: '/cursos', change: 3 }
    ]
  }
];

const competitorSuggestions = [
  { domain: 'www.cujae.edu.cu', traffic: 22000, keywords: 132, color: '#10b981' },
  { domain: 'www.uh.cu', traffic: 19500, keywords: 148, color: '#f59e0b' },
  { domain: 'www.ispjae.cu', traffic: 15800, keywords: 98, color: '#8b5cf6' },
  { domain: 'www.ecured.cu', traffic: 45000, keywords: 342, color: '#ec4899' },
  { domain: 'www.infomed.cu', traffic: 38000, keywords: 267, color: '#06b6d4' }
];

const generateKeywordsForDomain = (domain: string): KeywordDetail[] => {
  const keywords = [
    'universidad informática',
    'carreras tecnología',
    'admisión universitaria',
    'cursos programación',
    'ingeniería software',
    'ciencia de datos',
    'inteligencia artificial',
    'investigación tecnológica',
    'posgrado informática',
    'biblioteca digital'
  ];

  return keywords.map((kw, index) => ({
    keyword: kw,
    position: Math.floor(Math.random() * 20) + 1,
    volume: Math.floor(Math.random() * 3000) + 500,
    traffic: Math.floor(Math.random() * 2000) + 200,
    url: `/${kw.split(' ')[0]}`,
    change: Math.floor(Math.random() * 11) - 5
  }));
};

export function CompetitorAnalysis() {
  const [domains, setDomains] = useState<DomainData[]>(defaultDomains);
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainData | null>(domains[0]);

  const trafficHistory = generateTrafficHistory(domains.map(d => d.domain));

  const handleAddDomain = () => {
    if (!searchInput.trim()) {
      toast.error('Por favor ingresa un dominio válido');
      return;
    }

    if (domains.length >= 5) {
      toast.error('Máximo 5 dominios para comparación');
      return;
    }

    if (domains.some(d => d.domain === searchInput.trim())) {
      toast.error('Este dominio ya está en la comparación');
      return;
    }

    setIsSearching(true);

    // Simular búsqueda
    setTimeout(() => {
      const suggestion = competitorSuggestions.find(s => s.domain === searchInput.trim());
      
      const newDomain: DomainData = {
        domain: searchInput.trim(),
        traffic: suggestion?.traffic || Math.floor(Math.random() * 20000) + 5000,
        keywords: suggestion?.keywords || Math.floor(Math.random() * 150) + 50,
        trafficChange: Math.floor(Math.random() * 30) - 10,
        keywordsChange: Math.floor(Math.random() * 20) - 5,
        topKeywords: generateKeywordsForDomain(searchInput.trim()),
        color: suggestion?.color || `#${Math.floor(Math.random()*16777215).toString(16)}`
      };

      setDomains([...domains, newDomain]);
      setSearchInput('');
      setIsSearching(false);
      toast.success(`Dominio "${newDomain.domain}" agregado a la comparación`);
    }, 1500);
  };

  const handleRemoveDomain = (domain: string) => {
    if (domains.length === 1) {
      toast.error('Debe haber al menos un dominio para analizar');
      return;
    }

    setDomains(domains.filter(d => d.domain !== domain));
    if (selectedDomain?.domain === domain) {
      setSelectedDomain(domains[0]);
    }
    toast.success(`Dominio "${domain}" eliminado de la comparación`);
  };

  const handleExportData = () => {
    toast.success('Informe de competencia generado');
    setTimeout(() => {
      toast.info('Descargando: analisis-competencia-2025-12-11.xlsx');
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white mb-2">Análisis de Competencia</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compara el rendimiento SEO de tu sitio con tus principales competidores
        </p>
      </div>

      {/* Buscador de dominios */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
        <h2 className="text-gray-900 dark:text-white mb-4">Agregar Dominio para Análisis</h2>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
              placeholder="Ejemplo: www.ejemplo.cu"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              disabled={isSearching}
            />
          </div>
          <button
            onClick={handleAddDomain}
            disabled={isSearching || domains.length >= 5}
            className="flex items-center gap-2 bg-blue-900 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            {isSearching ? 'Analizando...' : 'Analizar'}
          </button>
        </div>
        
        {/* Sugerencias */}
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Dominios sugeridos:</p>
          <div className="flex flex-wrap gap-2">
            {competitorSuggestions
              .filter(s => !domains.some(d => d.domain === s.domain))
              .slice(0, 5)
              .map((suggestion) => (
                <button
                  key={suggestion.domain}
                  onClick={() => {
                    setSearchInput(suggestion.domain);
                  }}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  {suggestion.domain}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Métricas comparativas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-gray-600 dark:text-gray-400">Dominios en Análisis</p>
          </div>
          <div className="text-gray-900 dark:text-white">{domains.length} de 5</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Tráfico Total Combinado</p>
          <div className="text-gray-900 dark:text-white">
            {domains.reduce((sum, d) => sum + d.traffic, 0).toLocaleString()}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">visitas/mes</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Keywords Totales</p>
          <div className="text-gray-900 dark:text-white">
            {domains.reduce((sum, d) => sum + d.keywords, 0)}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <p className="text-gray-600 dark:text-gray-400 mb-2">Mejor Performance</p>
          <div className="text-green-600 dark:text-green-400">
            {domains.reduce((max, d) => d.trafficChange > max.trafficChange ? d : max, domains[0]).domain}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            +{domains.reduce((max, d) => d.trafficChange > max.trafficChange ? d : max, domains[0]).trafficChange}% crecimiento
          </p>
        </div>
      </div>

      {/* Dominios agregados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors">
        <h2 className="text-gray-900 dark:text-white mb-4">Resumen de Dominios</h2>
        <div className="space-y-4">
          {domains.map((domain) => (
            <div
              key={domain.domain}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedDomain?.domain === domain.domain
                  ? 'border-blue-900 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setSelectedDomain(domain)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: domain.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white">{domain.domain}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tráfico: <strong className="text-gray-900 dark:text-white">{domain.traffic.toLocaleString()}</strong>
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Keywords: <strong className="text-gray-900 dark:text-white">{domain.keywords}</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {domain.trafficChange >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={
                          domain.trafficChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {domain.trafficChange >= 0 ? '+' : ''}{domain.trafficChange}%
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">vs mes anterior</p>
                  </div>
                  {domains.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveDomain(domain.domain);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evolución del tráfico orgánico */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 dark:text-white mb-1">Evolución del Tráfico Orgánico</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Comparación mensual de tráfico de los últimos 12 meses
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trafficHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Tráfico Mensual', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [value.toLocaleString() + ' visitas', '']}
              />
              <Legend />
              {domains.map((domain) => (
                <Line
                  key={domain.domain}
                  type="monotone"
                  dataKey={domain.domain}
                  stroke={domain.color}
                  strokeWidth={2}
                  dot={{ fill: domain.color, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparación de keywords */}
      {domains.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-gray-900 dark:text-white mb-1">Comparación de Keywords</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Distribución de palabras clave por dominio
            </p>
          </div>
          
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={domains.map(d => ({ name: d.domain, keywords: d.keywords }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="keywords" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabla de keywords detalladas */}
      {selectedDomain && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedDomain.color }}
              />
              <div>
                <h2 className="text-gray-900 dark:text-white">Palabras Clave de {selectedDomain.domain}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Top 10 keywords con mejor rendimiento
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                    Palabra Clave
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                    Cambio
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                    Volumen
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                    Tráfico Estimado
                  </th>
                  <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {selectedDomain.topKeywords.map((keyword, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {keyword.keyword}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          keyword.position <= 3
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : keyword.position <= 10
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        }`}
                      >
                        #{keyword.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {keyword.change > 0 ? (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span>+{keyword.change}</span>
                        </div>
                      ) : keyword.change < 0 ? (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <TrendingDown className="w-4 h-4" />
                          <span>{keyword.change}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {keyword.volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {keyword.traffic.toLocaleString()}/mes
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={keyword.url}
                        className="flex items-center gap-1 text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        {keyword.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors">
            <p className="text-gray-600 dark:text-gray-400">
              Mostrando {selectedDomain.topKeywords.length} de {selectedDomain.keywords} palabras clave
            </p>
          </div>
        </div>
      )}
    </div>
  );
}