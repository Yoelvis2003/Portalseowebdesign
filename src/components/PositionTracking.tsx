import { TrendingUp, TrendingDown, Minus, AlertTriangle, ExternalLink, Plus, Download, FileSpreadsheet, FileText, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { TrackedKeyword } from '../App';
import { AddKeywordModal } from './AddKeywordModal';
import { toast } from 'sonner@2.0.3';

interface KeywordTracking {
  id: number;
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  change: number;
  volume: number;
  url: string;
  hasCannibalization: boolean;
  cannibalizationUrl?: string;
}

interface PositionTrackingProps {
  additionalKeywords: TrackedKeyword[];
  onAddKeyword?: (keyword: string, volume: number, url: string) => void;
}

const defaultTrackingData: KeywordTracking[] = [
  {
    id: 1,
    keyword: 'universidad ciencias informáticas',
    currentPosition: 1,
    previousPosition: 2,
    change: 1,
    volume: 3200,
    url: '/',
    hasCannibalization: false
  },
  {
    id: 2,
    keyword: 'carrera ingeniería software',
    currentPosition: 3,
    previousPosition: 3,
    change: 0,
    volume: 1800,
    url: '/cursos/ingenieria-software',
    hasCannibalization: false
  },
  {
    id: 3,
    keyword: 'mejor universidad informática cuba',
    currentPosition: 2,
    previousPosition: 1,
    change: -1,
    volume: 890,
    url: '/admision',
    hasCannibalization: false
  },
  {
    id: 4,
    keyword: 'cursos programación',
    currentPosition: 5,
    previousPosition: 8,
    change: 3,
    volume: 2400,
    url: '/cursos',
    hasCannibalization: true,
    cannibalizationUrl: '/cursos/ingenieria-software'
  },
  {
    id: 5,
    keyword: 'investigación tecnológica',
    currentPosition: 7,
    previousPosition: 5,
    change: -2,
    volume: 1200,
    url: '/investigacion',
    hasCannibalization: false
  },
  {
    id: 6,
    keyword: 'admisión universidad',
    currentPosition: 4,
    previousPosition: 6,
    change: 2,
    volume: 2700,
    url: '/admision/requisitos',
    hasCannibalization: false
  },
  {
    id: 7,
    keyword: 'inteligencia artificial cuba',
    currentPosition: 8,
    previousPosition: 7,
    change: -1,
    volume: 650,
    url: '/cursos/inteligencia-artificial',
    hasCannibalization: false
  },
  {
    id: 8,
    keyword: 'ciencia de datos',
    currentPosition: 6,
    previousPosition: 9,
    change: 3,
    volume: 1950,
    url: '/cursos/ciencia-datos',
    hasCannibalization: true,
    cannibalizationUrl: '/investigacion/proyectos'
  },
  {
    id: 9,
    keyword: 'eventos tecnológicos',
    currentPosition: 12,
    previousPosition: 11,
    change: -1,
    volume: 580,
    url: '/noticias/eventos',
    hasCannibalization: false
  },
  {
    id: 10,
    keyword: 'biblioteca virtual uci',
    currentPosition: 2,
    previousPosition: 4,
    change: 2,
    volume: 450,
    url: '/biblioteca',
    hasCannibalization: false
  }
];

// Datos de evolución temporal (últimos 30 días)
const generateEvolutionData = () => {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
  }
  
  return dates.map((date, index) => ({
    date,
    'universidad ciencias informáticas': Math.max(1, Math.floor(2 + Math.sin(index * 0.3) * 0.5)),
    'cursos programación': Math.max(3, Math.floor(6 + Math.cos(index * 0.2) * 2)),
    'mejor universidad informática cuba': Math.max(1, Math.floor(2 + Math.sin(index * 0.4) * 1)),
    'admisión universidad': Math.max(3, Math.floor(5 + Math.sin(index * 0.25) * 1.5)),
    'ciencia de datos': Math.max(4, Math.floor(7 + Math.cos(index * 0.3) * 2))
  }));
};

// Datos de competidores
const competitorData = [
  {
    id: 1,
    domain: 'www.cujae.edu.cu',
    position: 2,
    keywords: 45,
    traffic: 12500,
    change: 5,
    visibility: 78
  },
  {
    id: 2,
    domain: 'www.uh.cu',
    position: 3,
    keywords: 38,
    traffic: 9800,
    change: -2,
    visibility: 65
  },
  {
    id: 3,
    domain: 'www.ispjae.cu',
    position: 4,
    keywords: 32,
    traffic: 7200,
    change: 3,
    visibility: 58
  },
  {
    id: 4,
    domain: 'www.infomed.cu',
    position: 5,
    keywords: 28,
    traffic: 6100,
    change: 0,
    visibility: 52
  },
  {
    id: 5,
    domain: 'www.ecured.cu',
    position: 6,
    keywords: 24,
    traffic: 4800,
    change: -1,
    visibility: 45
  }
];

// Datos para gráfico de distribución de posiciones
const positionDistribution = [
  { range: 'Top 3', count: 3, color: '#10b981' },
  { range: 'Top 10', count: 5, color: '#3b82f6' },
  { range: 'Top 20', count: 2, color: '#fbbf24' },
  { range: '+20', count: 2, color: '#9ca3af' }
];

function PositionChange({ change }: { change: number }) {
  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <TrendingUp className="w-4 h-4" />
        <span>+{change}</span>
      </div>
    );
  }
  
  if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-red-600">
        <TrendingDown className="w-4 h-4" />
        <span>{change}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1 text-gray-500">
      <Minus className="w-4 h-4" />
      <span>0</span>
    </div>
  );
}

function PositionBadge({ position }: { position: number }) {
  let colorClass = 'bg-gray-100 text-gray-700';
  
  if (position <= 3) {
    colorClass = 'bg-green-100 text-green-700';
  } else if (position <= 10) {
    colorClass = 'bg-blue-100 text-blue-700';
  } else if (position <= 20) {
    colorClass = 'bg-yellow-100 text-yellow-700';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full ${colorClass}`}>
      #{position}
    </span>
  );
}

export function PositionTracking({ additionalKeywords, onAddKeyword }: PositionTrackingProps) {
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [showReportOptions, setShowReportOptions] = useState(false);

  // Combinar keywords por defecto con las agregadas desde research
  const allTrackingData = [...defaultTrackingData, ...additionalKeywords];
  
  const totalKeywords = allTrackingData.length;
  const topThree = allTrackingData.filter(k => k.currentPosition <= 3).length;
  const improving = allTrackingData.filter(k => k.change > 0).length;
  const cannibalization = allTrackingData.filter(k => k.hasCannibalization).length;

  const evolutionData = generateEvolutionData();

  const handleAddKeyword = (keyword: string, volume: number, url: string) => {
    if (onAddKeyword) {
      onAddKeyword(keyword, volume, url);
      toast.success(`Palabra clave "${keyword}" agregada al tracking`);
    }
  };

  const handleExportPDF = () => {
    toast.success('Informe PDF generado exitosamente');
    // Simulación de descarga
    setTimeout(() => {
      toast.info('Descargando: tracking-posiciones-2025-12-11.pdf');
    }, 500);
  };

  const handleExportExcel = () => {
    toast.success('Informe Excel generado exitosamente');
    setTimeout(() => {
      toast.info('Descargando: tracking-posiciones-2025-12-11.xlsx');
    }, 500);
  };

  const handleSendEmail = () => {
    toast.success('Informe enviado por correo electrónico');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Tracking de Posiciones</h1>
          <p className="text-gray-600">
            Monitoreo diario del posicionamiento de tus palabras clave estratégicas
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowReportOptions(!showReportOptions)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar Informe
            </button>
            
            {showReportOptions && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  Exportar como PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Exportar como Excel
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={handleSendEmail}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  Enviar por Email
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setShowAddKeywordModal(true)}
            className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Palabra Clave
          </button>
        </div>
      </div>

      {/* Métricas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Keywords en Tracking</p>
          <div className="text-gray-900">{totalKeywords}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Top 3 Posiciones</p>
          <div className="text-green-600">{topThree}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Mejorando</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-green-600">{improving}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Canibalizaciones</p>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-600">{cannibalization}</span>
          </div>
        </div>
      </div>

      {/* Evolución Temporal de Palabras Clave */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 mb-1">Evolución de Posiciones</h2>
              <p className="text-gray-600">
                Seguimiento histórico de las principales palabras clave
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod('7d')}
                className={`px-3 py-1 rounded ${
                  selectedPeriod === '7d' 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                7 días
              </button>
              <button
                onClick={() => setSelectedPeriod('30d')}
                className={`px-3 py-1 rounded ${
                  selectedPeriod === '30d' 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                30 días
              </button>
              <button
                onClick={() => setSelectedPeriod('90d')}
                className={`px-3 py-1 rounded ${
                  selectedPeriod === '90d' 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                90 días
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                reversed
                domain={[1, 20]}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Posición', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="universidad ciencias informáticas" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="cursos programación" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="mejor universidad informática cuba" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="admisión universidad" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="ciencia de datos" 
                stroke="#ec4899" 
                strokeWidth={2}
                dot={{ fill: '#ec4899', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribución de Posiciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 mb-1">Distribución de Posiciones</h2>
            <p className="text-gray-600">
              Clasificación de keywords por rangos de posición
            </p>
          </div>
          
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="range" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
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
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Análisis de Competencia */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900 mb-1">Análisis de Competencia</h2>
            <p className="text-gray-600">
              Principales competidores por las mismas keywords
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {competitorData.slice(0, 5).map((competitor, index) => (
                <div 
                  key={competitor.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-gray-900 flex items-center gap-2">
                        {competitor.domain}
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="text-gray-600">
                        {competitor.keywords} keywords comunes
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900">
                      {competitor.traffic.toLocaleString()} visitas/mes
                    </div>
                    <PositionChange change={competitor.change} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de canibalización */}
      {cannibalization > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">Alerta de Canibalización Detectada</h3>
              <p className="text-gray-700 mb-3">
                Se han detectado {cannibalization} casos donde múltiples URLs compiten por la misma palabra clave. 
                Esto puede dividir tu autoridad y afectar tu posicionamiento.
              </p>
              <div className="space-y-2">
                {allTrackingData
                  .filter(k => k.hasCannibalization)
                  .map(keyword => (
                    <div key={keyword.id} className="bg-white border border-red-200 rounded p-3">
                      <div className="text-gray-900 mb-1">
                        <strong>{keyword.keyword}</strong>
                      </div>
                      <div className="text-gray-600 space-y-1">
                        <div>URL Principal: {keyword.url}</div>
                        <div>URL Competidora: {keyword.cannibalizationUrl}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de tracking */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900 mb-1">Seguimiento Diario de Posiciones</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Última actualización: 11 de Diciembre, 2025 - 08:00 AM
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">
                  Palabra Clave
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Posición Actual
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Cambio
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Volumen
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  URL que Rankea
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allTrackingData.map((keyword) => (
                <tr 
                  key={keyword.id} 
                  className={`hover:bg-gray-50 ${
                    keyword.hasCannibalization ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{keyword.keyword}</span>
                      {keyword.hasCannibalization && (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <PositionBadge position={keyword.currentPosition} />
                  </td>
                  <td className="px-6 py-4">
                    <PositionChange change={keyword.change} />
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {keyword.volume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={keyword.url}
                      className="flex items-center gap-1 text-blue-900 hover:text-blue-700"
                    >
                      {keyword.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {keyword.hasCannibalization ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                        Canibalización
                      </span>
                    ) : keyword.change > 0 ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        Mejorando
                      </span>
                    ) : keyword.change < 0 ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                        Descendiendo
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        Estable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-gray-600">
            <span>Mostrando {allTrackingData.length} de {allTrackingData.length} keywords</span>
            <div className="flex gap-2">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Top 3
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Top 10
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Top 20
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                +20
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar palabra clave */}
      <AddKeywordModal 
        isOpen={showAddKeywordModal}
        onClose={() => setShowAddKeywordModal(false)}
        onAdd={handleAddKeyword}
      />
    </div>
  );
}
