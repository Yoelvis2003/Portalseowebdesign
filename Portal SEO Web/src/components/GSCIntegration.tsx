import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Search, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Globe,
  Clock,
  Users,
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Datos mock de palabras clave por URL
const keywordsByURL: { [key: string]: any[] } = {
  '/cursos/ingenieria-software': [
    { keyword: 'ingeniería de software uci', clics: 450, impresiones: 8500, posicion: 2.1, ctr: 5.29 },
    { keyword: 'carrera ingeniería software cuba', clics: 320, impresiones: 6800, posicion: 3.5, ctr: 4.71 },
    { keyword: 'estudiar ingeniería software', clics: 0, impresiones: 4200, posicion: 8.2, ctr: 0 },
    { keyword: 'plan de estudios ingeniería', clics: 280, impresiones: 5100, posicion: 4.3, ctr: 5.49 },
    { keyword: 'software engineering uci', clics: 195, impresiones: 3900, posicion: 5.7, ctr: 5.00 },
    { keyword: 'universidad ciencias informáticas', clics: 0, impresiones: 7500, posicion: 12.4, ctr: 0 },
  ],
  '/admision/requisitos': [
    { keyword: 'requisitos admisión uci', clics: 580, impresiones: 9200, posicion: 1.8, ctr: 6.30 },
    { keyword: 'como entrar a la uci', clics: 420, impresiones: 8100, posicion: 2.5, ctr: 5.19 },
    { keyword: 'examen ingreso uci', clics: 310, impresiones: 6400, posicion: 3.9, ctr: 4.84 },
    { keyword: 'admisión universidad informática', clics: 0, impresiones: 5800, posicion: 9.1, ctr: 0 },
    { keyword: 'inscripción uci cuba', clics: 245, impresiones: 4700, posicion: 5.2, ctr: 5.21 },
  ],
  '/investigacion/proyectos': [
    { keyword: 'proyectos investigación uci', clics: 280, impresiones: 5600, posicion: 4.2, ctr: 5.00 },
    { keyword: 'investigación inteligencia artificial', clics: 0, impresiones: 8900, posicion: 11.3, ctr: 0 },
    { keyword: 'proyectos tecnológicos cuba', clics: 165, impresiones: 4200, posicion: 6.8, ctr: 3.93 },
    { keyword: 'investigación científica uci', clics: 198, impresiones: 3800, posicion: 5.5, ctr: 5.21 },
  ]
};

// Datos de evolución temporal
const generateTimeSeriesData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    
    data.push({
      date: dayStr,
      clics: Math.floor(1200 + Math.random() * 800),
      impresiones: Math.floor(45000 + Math.random() * 20000),
      ctr: Number((2.5 + Math.random() * 1.5).toFixed(2)),
      posicion: Number((4 + Math.random() * 3).toFixed(1))
    });
  }
  
  return data;
};

// Datos adicionales de GSC
const deviceData = [
  { device: 'Desktop', clics: 12450, impresiones: 58000, ctr: 21.5 },
  { device: 'Mobile', clics: 8920, impresiones: 42000, ctr: 21.2 },
  { device: 'Tablet', clics: 1580, impresiones: 8500, ctr: 18.6 },
];

const countryData = [
  { country: 'Cuba', clics: 18450, impresiones: 92000, flag: '🇨🇺' },
  { country: 'España', clics: 2850, impresiones: 11000, flag: '🇪🇸' },
  { country: 'México', clics: 1620, impresiones: 8500, flag: '🇲🇽' },
  { country: 'Argentina', clics: 980, impresiones: 5200, flag: '🇦🇷' },
];

// Datos de Google Analytics
const analyticsData = {
  '/cursos/ingenieria-software': {
    avgSessionDuration: '3:45',
    bounceRate: 32.5,
    activeUsers: 1240,
    sessions: 3450
  },
  '/admision/requisitos': {
    avgSessionDuration: '2:18',
    bounceRate: 28.3,
    activeUsers: 980,
    sessions: 2850
  },
  '/investigacion/proyectos': {
    avgSessionDuration: '4:12',
    bounceRate: 41.2,
    activeUsers: 560,
    sessions: 1420
  }
};

const opportunitiesGrowth = [
  { url: '/blog/machine-learning-basico', impresiones: 15600, cambio: '+340%', tipo: 'Crecimiento' },
  { url: '/recursos/python-tutorial', impresiones: 12400, cambio: '+280%', tipo: 'Crecimiento' },
  { url: '/eventos/feria-tecnologia', impresiones: 9800, cambio: '+215%', tipo: 'Crecimiento' },
];

const ctrDropQueries = [
  { query: 'cursos programación online', posicion: 3.2, ctr: 1.8, ctrAnterior: 4.5, caida: '-60%' },
  { query: 'maestría ciencias computación', posicion: 2.8, ctr: 2.1, ctrAnterior: 5.2, caida: '-60%' },
  { query: 'admisión universidad tecnológica', posicion: 4.1, ctr: 2.5, ctrAnterior: 5.8, caida: '-57%' },
];

type SortField = 'keyword' | 'clics' | 'impresiones' | 'posicion' | 'ctr';
type SortOrder = 'asc' | 'desc' | null;

export function GSCIntegration() {
  const [isSynced, setIsSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [urlToAnalyze, setUrlToAnalyze] = useState('');
  const [analyzedURL, setAnalyzedURL] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeRange, setTimeRange] = useState('7');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsSynced(true);
    }, 2500);
  };

  const handleAnalyzeURL = () => {
    if (!urlToAnalyze.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalyzedURL(urlToAnalyze);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === null) setSortOrder('asc');
      else if (sortOrder === 'asc') setSortOrder('desc');
      else {
        setSortOrder(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortedKeywords = () => {
    if (!analyzedURL || !keywordsByURL[analyzedURL]) return [];
    
    let keywords = [...keywordsByURL[analyzedURL]];
    
    if (sortField && sortOrder) {
      keywords.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    
    return keywords;
  };

  const handleDownload = (format: 'csv' | 'excel' | 'pdf') => {
    alert(`Descargando datos en formato ${format.toUpperCase()}...\n\nRango: Últimos ${timeRange} días\nURL: ${analyzedURL || 'Todo el sitio'}\nOrdenamiento: ${sortField || 'ninguno'} ${sortOrder || ''}`);
  };

  const getTimeSeriesData = () => {
    return generateTimeSeriesData(parseInt(timeRange));
  };

  const globalMetrics = {
    totalClics: 22950,
    totalImpresiones: 108500,
    ctrGlobal: 21.15,
    posicionMedia: 5.8
  };

  const getURLMetrics = () => {
    if (!analyzedURL || !keywordsByURL[analyzedURL]) return null;
    
    const keywords = keywordsByURL[analyzedURL];
    const totalClics = keywords.reduce((sum, kw) => sum + kw.clics, 0);
    const totalImpresiones = keywords.reduce((sum, kw) => sum + kw.impresiones, 0);
    const avgPosition = keywords.reduce((sum, kw) => sum + kw.posicion, 0) / keywords.length;
    const ctr = totalImpresiones > 0 ? (totalClics / totalImpresiones) * 100 : 0;
    
    return {
      totalClics,
      totalImpresiones,
      ctr: Number(ctr.toFixed(2)),
      posicionMedia: Number(avgPosition.toFixed(1))
    };
  };

  const urlMetrics = getURLMetrics();
  const analytics = analyzedURL ? analyticsData[analyzedURL as keyof typeof analyticsData] : null;

  if (!isSynced) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Integración Google Search Console y Analytics</h1>
          <p className="text-gray-600">
            Conecta tus herramientas de Google para analizar el rendimiento SEO de tu sitio
          </p>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            {isSyncing ? (
              <div className="space-y-4">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
                <div>
                  <div className="text-gray-900 mb-2">Sincronizando datos...</div>
                  <p className="text-gray-600">
                    Conectando con Google Search Console y Google Analytics
                  </p>
                </div>
                <div className="flex flex-col gap-2 max-w-sm mx-auto">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Google Search Console</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Google Analytics</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Globe className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-900 mb-2">Conecta tus herramientas de Google</div>
                  <p className="text-gray-600 max-w-md">
                    Vincula Google Search Console y Google Analytics para acceder a métricas en tiempo real de tu sitio web
                  </p>
                </div>
                <Button onClick={handleSync} size="lg" className="bg-blue-900 hover:bg-blue-800">
                  Vincular Google Search Console y Google Analytics
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Integración Google Search Console y Analytics</h1>
          <p className="text-gray-600">
            Monitorea el rendimiento de tu sitio en los resultados de búsqueda de Google
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="28">Últimos 28 días</SelectItem>
              <SelectItem value="90">Últimos 3 meses</SelectItem>
              <SelectItem value="custom">Rango personalizado</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Button
              variant="outline"
              className="border-gray-300"
              onClick={() => {
                const dropdown = document.getElementById('download-dropdown');
                if (dropdown) {
                  dropdown.classList.toggle('hidden');
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar datos
            </Button>
            <div id="download-dropdown" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => handleDownload('csv')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 rounded-t-lg"
              >
                Descargar CSV
              </button>
              <button
                onClick={() => handleDownload('excel')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
              >
                Descargar Excel (.xlsx)
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700 rounded-b-lg"
              >
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Introduce la URL a analizar (ej: /cursos/ingenieria-software)"
              value={urlToAnalyze}
              onChange={(e) => setUrlToAnalyze(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeURL()}
              className="bg-gray-50"
            />
          </div>
          <Button 
            onClick={handleAnalyzeURL}
            disabled={isAnalyzing || !urlToAnalyze.trim()}
            className="bg-blue-900 hover:bg-blue-800"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analizar URL
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-gray-900 mb-4">🌐 Métricas Globales del Sitio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="w-5 h-5 text-blue-600" />
              <p className="text-gray-600">Total de Clics</p>
            </div>
            <div className="text-gray-900 mb-1">{globalMetrics.totalClics.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-purple-600" />
              <p className="text-gray-600">Total de Impresiones</p>
            </div>
            <div className="text-gray-900 mb-1">{globalMetrics.totalImpresiones.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8.3%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-2">CTR Global</p>
            <div className="text-gray-900 mb-1">{globalMetrics.ctrGlobal}%</div>
            <div className="flex items-center gap-1 text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span>-2.1%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p className="text-gray-600 mb-2">Posición Media Global</p>
            <div className="text-gray-900 mb-1">{globalMetrics.posicionMedia}</div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>-1.2 pos</span>
            </div>
          </div>
        </div>
      </div>

      {analyzedURL && urlMetrics && (
        <div className="mb-8">
          <h2 className="text-gray-900 mb-4">📄 Métricas de la Página: <span className="text-blue-900">{analyzedURL}</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="w-5 h-5 text-blue-600" />
                <p className="text-gray-700">Clics de la URL</p>
              </div>
              <div className="text-gray-900">{urlMetrics.totalClics.toLocaleString()}</div>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <p className="text-gray-700">Impresiones de la URL</p>
              </div>
              <div className="text-gray-900">{urlMetrics.totalImpresiones.toLocaleString()}</div>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <p className="text-gray-700 mb-2">CTR de la Página</p>
              <div className="text-gray-900">{urlMetrics.ctr}%</div>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <p className="text-gray-700 mb-2">Posición Media</p>
              <div className="text-gray-900">{urlMetrics.posicionMedia}</div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-gray-900 mb-6">📈 Evolución Temporal</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-gray-700 mb-4">Clics e Impresiones</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#1e3a8a" />
                <YAxis yAxisId="right" orientation="right" stroke="#7c3aed" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="clics"
                  stroke="#1e3a8a"
                  strokeWidth={2}
                  dot={{ fill: '#1e3a8a', r: 3 }}
                  name="Clics"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="impresiones"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ fill: '#7c3aed', r: 3 }}
                  name="Impresiones"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-gray-700 mb-4">CTR (%)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#059669" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ctr"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: '#059669', r: 3 }}
                  name="CTR"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-700 mb-4">Posición Media</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getTimeSeriesData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis reversed stroke="#dc2626" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="posicion"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ fill: '#dc2626', r: 3 }}
                  name="Posición"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
            <p className="text-gray-500">Espacio para gráficas adicionales</p>
          </div>
        </div>
      </div>

      {analyzedURL && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 mb-1">🔑 Palabras Clave que Dirigen a Esta URL</h2>
            <p className="text-gray-600">
              Consultas de búsqueda que han generado clics e impresiones para {analyzedURL}
            </p>
          </div>

          {keywordsByURL[analyzedURL] ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('keyword')}
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                      >
                        Palabra Clave
                        {sortField === 'keyword' && sortOrder === 'asc' && <ArrowUp className="w-4 h-4" />}
                        {sortField === 'keyword' && sortOrder === 'desc' && <ArrowDown className="w-4 h-4" />}
                        {sortField !== 'keyword' && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('clics')}
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                      >
                        Total de Clics
                        {sortField === 'clics' && sortOrder === 'asc' && <ArrowUp className="w-4 h-4" />}
                        {sortField === 'clics' && sortOrder === 'desc' && <ArrowDown className="w-4 h-4" />}
                        {sortField !== 'clics' && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('impresiones')}
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                      >
                        Total de Impresiones
                        {sortField === 'impresiones' && sortOrder === 'asc' && <ArrowUp className="w-4 h-4" />}
                        {sortField === 'impresiones' && sortOrder === 'desc' && <ArrowDown className="w-4 h-4" />}
                        {sortField !== 'impresiones' && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('posicion')}
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                      >
                        Posición Media
                        {sortField === 'posicion' && sortOrder === 'asc' && <ArrowUp className="w-4 h-4" />}
                        {sortField === 'posicion' && sortOrder === 'desc' && <ArrowDown className="w-4 h-4" />}
                        {sortField !== 'posicion' && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('ctr')}
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                      >
                        CTR (%)
                        {sortField === 'ctr' && sortOrder === 'asc' && <ArrowUp className="w-4 h-4" />}
                        {sortField === 'ctr' && sortOrder === 'desc' && <ArrowDown className="w-4 h-4" />}
                        {sortField !== 'ctr' && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getSortedKeywords().map((kw, idx) => (
                    <tr key={idx} className={`hover:bg-gray-50 ${kw.clics === 0 && kw.impresiones > 0 ? 'bg-yellow-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">{kw.keyword}</span>
                          {kw.clics === 0 && kw.impresiones > 0 && (
                            <div className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                              <AlertCircle className="w-4 h-4" />
                              <span className="text-xs">Sin clics</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={kw.clics === 0 ? 'text-red-600' : 'text-gray-900'}>
                          {kw.clics.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {kw.impresiones.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-900">{kw.posicion}</td>
                      <td className="px-6 py-4">
                        <span className={kw.ctr === 0 ? 'text-red-600' : 'text-gray-900'}>
                          {kw.ctr.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-900 mb-2">No hay datos para esta URL</div>
              <p className="text-gray-600">
                La URL introducida no tiene información disponible en Google Search Console
              </p>
            </div>
          )}
        </div>
      )}

      {analyzedURL && analytics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 p-6">
          <h2 className="text-gray-900 mb-4">📊 Métricas de Google Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="text-gray-600">Duración Media Sesión</p>
              </div>
              <div className="text-gray-900">{analytics.avgSessionDuration}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-red-600" />
                <p className="text-gray-600">Tasa de Rebote</p>
              </div>
              <div className="text-gray-900">{analytics.bounceRate}%</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <p className="text-gray-600">Usuarios Activos</p>
              </div>
              <div className="text-gray-900">{analytics.activeUsers.toLocaleString()}</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-purple-600" />
                <p className="text-gray-600">Sesiones</p>
              </div>
              <div className="text-gray-900">{analytics.sessions.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 mb-1">📈 URLs con Mayor Crecimiento</h2>
            <p className="text-gray-600">Páginas con aumento significativo de impresiones</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {opportunitiesGrowth.map((opp, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1">
                    <div className="text-gray-900 mb-1">{opp.url}</div>
                    <div className="text-gray-600">{opp.impresiones.toLocaleString()} impresiones</div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>{opp.cambio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 mb-1">⚠️ Queries con Caída de CTR</h2>
            <p className="text-gray-600">Palabras clave que requieren optimización</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {ctrDropQueries.map((query, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div className="text-gray-900 mb-1">{query.query}</div>
                    <div className="text-gray-600">
                      Posición {query.posicion} • CTR: {query.ctr}% (antes: {query.ctrAnterior}%)
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-5 h-5" />
                    <span>{query.caida}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900 mb-1">📱 Rendimiento por Dispositivo</h2>
          <p className="text-gray-600">Distribución de clics e impresiones por tipo de dispositivo</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="device" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="clics" fill="#1e3a8a" name="Clics" />
              <Bar dataKey="impresiones" fill="#7c3aed" name="Impresiones" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900 mb-1">🌍 Países Principales</h2>
          <p className="text-gray-600">Distribución geográfica del tráfico orgánico</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">País</th>
                <th className="px-6 py-3 text-left text-gray-700">Clics</th>
                <th className="px-6 py-3 text-left text-gray-700">Impresiones</th>
                <th className="px-6 py-3 text-left text-gray-700">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {countryData.map((country, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="text-gray-900">{country.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{country.clics.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-900">{country.impresiones.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {((country.clics / country.impresiones) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
