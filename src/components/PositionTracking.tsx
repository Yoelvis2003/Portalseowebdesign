import { TrendingUp, TrendingDown, Minus, AlertTriangle, ExternalLink } from 'lucide-react';
import type { TrackedKeyword } from '../App';

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

export function PositionTracking({ additionalKeywords }: { additionalKeywords: TrackedKeyword[] }) {
  // Combinar keywords por defecto con las agregadas desde research
  const allTrackingData = [...defaultTrackingData, ...additionalKeywords];
  
  const totalKeywords = allTrackingData.length;
  const topThree = allTrackingData.filter(k => k.currentPosition <= 3).length;
  const improving = allTrackingData.filter(k => k.change > 0).length;
  const cannibalization = allTrackingData.filter(k => k.hasCannibalization).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Tracking de Posiciones</h1>
        <p className="text-gray-600">
          Monitoreo diario del posicionamiento de tus palabras clave estratégicas
        </p>
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
          <p className="text-gray-600">
            Última actualización: 10 de Diciembre, 2025 - 08:00 AM
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
    </div>
  );
}