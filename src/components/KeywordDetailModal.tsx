import { X, TrendingUp, Users, DollarSign, Target, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Keyword {
  id: number;
  keyword: string;
  volume: number;
  intent: string;
  cpc: number;
  difficulty: number;
  competition: string;
  competitionScore: number;
}

interface KeywordDetailModalProps {
  keyword: Keyword;
  isOpen: boolean;
  onClose: () => void;
}

const competitorData = [
  { name: 'Tu sitio', authority: 35, optimization: 42 },
  { name: 'Competidor 1', authority: 85, optimization: 78 },
  { name: 'Competidor 2', authority: 72, optimization: 68 },
  { name: 'Competidor 3', authority: 68, optimization: 72 },
  { name: 'Competidor 4', authority: 58, optimization: 55 },
];

const trendData = [
  { month: 'Jun', volume: 2800 },
  { month: 'Jul', volume: 3000 },
  { month: 'Ago', volume: 3100 },
  { month: 'Sep', volume: 2900 },
  { month: 'Oct', volume: 3200 },
  { month: 'Nov', volume: 3400 },
  { month: 'Dic', volume: 3200 },
];

export function KeywordDetailModal({ keyword, isOpen, onClose }: KeywordDetailModalProps) {
  if (!isOpen) return null;

  const getCompetitionInsight = () => {
    if (keyword.competitionScore < 30) {
      return {
        level: 'Baja',
        color: 'text-green-700 bg-green-100',
        description: 'Excelente oportunidad para posicionarse rápidamente',
        recommendation: 'Esta keyword tiene baja competencia. Considera crear contenido de calidad inmediatamente.'
      };
    } else if (keyword.competitionScore < 60) {
      return {
        level: 'Media',
        color: 'text-yellow-700 bg-yellow-100',
        description: 'Competencia moderada, requiere estrategia sólida',
        recommendation: 'Necesitarás contenido bien optimizado y algunos enlaces de calidad para competir.'
      };
    } else {
      return {
        level: 'Alta',
        color: 'text-red-700 bg-red-100',
        description: 'Dominio altamente competido, requiere inversión significativa',
        recommendation: 'Alta competencia. Considera keywords long-tail relacionadas o mejora significativamente tu autoridad de dominio.'
      };
    }
  };

  const insight = getCompetitionInsight();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-gray-900 mb-1">Análisis de Competencia</h2>
            <p className="text-gray-600">{keyword.keyword}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600">Volumen</span>
              </div>
              <div className="text-gray-900">{keyword.volume.toLocaleString()}</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">CPC</span>
              </div>
              <div className="text-gray-900">${keyword.cpc.toFixed(2)}</div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-600">Dificultad</span>
              </div>
              <div className="text-gray-900">{keyword.difficulty}</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">Intención</span>
              </div>
              <div className="text-gray-900">{keyword.intent}</div>
            </div>
          </div>

          {/* Análisis de competencia */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Nivel de Competencia
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-4 py-2 rounded-full ${insight.color}`}>
                  Competencia {insight.level}
                </span>
                <span className="text-gray-900">Score: {keyword.competitionScore}/100</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full ${
                    keyword.competitionScore < 30
                      ? 'bg-green-500'
                      : keyword.competitionScore < 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${keyword.competitionScore}%` }}
                ></div>
              </div>
              
              <p className="text-gray-700 mb-2">{insight.description}</p>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-700">
                  <strong>Recomendación:</strong> {insight.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Comparativa con competidores */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-gray-900 mb-4">Comparativa con Competidores</h3>
            <p className="text-gray-600 mb-4">
              Análisis de autoridad de dominio y optimización on-page
            </p>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={competitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="authority" fill="#1e3a8a" name="Autoridad" radius={[8, 8, 0, 0]} />
                <Bar dataKey="optimization" fill="#3b82f6" name="Optimización" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tendencia de volumen */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-gray-900 mb-4">Tendencia de Volumen de Búsqueda</h3>
            <p className="text-gray-600 mb-4">
              Evolución del interés en los últimos 6 meses
            </p>
            
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#1e3a8a" 
                  strokeWidth={2}
                  dot={{ fill: '#1e3a8a', r: 4 }}
                  name="Volumen"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top competidores */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-gray-900 mb-4">Top 5 Competidores para esta Keyword</h3>
            
            <div className="space-y-3">
              {[
                { position: 1, domain: 'www.universidad-top.edu', da: 85, pages: 45 },
                { position: 2, domain: 'www.educacion-superior.cu', da: 78, pages: 38 },
                { position: 3, domain: 'www.portal-estudiantil.edu', da: 72, pages: 52 },
                { position: 4, domain: 'www.guia-universidades.com', da: 68, pages: 28 },
                { position: 5, domain: 'www.tech-education.net', da: 65, pages: 34 },
              ].map((competitor) => (
                <div key={competitor.position} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center">
                      {competitor.position}
                    </span>
                    <div>
                      <div className="text-gray-900">{competitor.domain}</div>
                      <div className="text-gray-600">
                        DA: {competitor.da} • {competitor.pages} páginas rankeando
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-900 hover:text-blue-700 transition-colors">
                    Ver análisis
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones recomendadas */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-gray-900 mb-3">Pasos Recomendados</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-gray-700">
                  Analiza el contenido de los top 3 competidores para identificar patrones
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-gray-700">
                  Crea contenido más completo y de mayor calidad que la competencia
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-gray-700">
                  Optimiza tu página con la keyword en título, H1, meta description y URL
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span className="text-gray-700">
                  Construye enlaces internos desde páginas relevantes de tu sitio
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cerrar
            </button>
            <button className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
              Agregar al Tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
