import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Minus, TrendingUp, ExternalLink } from 'lucide-react';

const prominenceData = [
  { url: 'Tu Sitio', score: 72 },
  { url: 'Competidor 1', score: 85 },
  { url: 'Competidor 2', score: 78 },
  { url: 'Competidor 3', score: 81 },
  { url: 'Competidor 4', score: 68 },
  { url: 'Competidor 5', score: 75 }
];

const wordsToAdd = [
  { word: 'tecnología', frequency: 45, competitors: 8 },
  { word: 'innovación', frequency: 38, competitors: 7 },
  { word: 'desarrollo', frequency: 35, competitors: 9 },
  { word: 'inteligencia artificial', frequency: 28, competitors: 6 },
  { word: 'ciencia de datos', frequency: 22, competitors: 5 }
];

const wordsToReduce = [
  { word: 'clic', frequency: 67, risk: 'Alto' },
  { word: 'mejor', frequency: 54, risk: 'Medio' },
  { word: 'gratis', frequency: 48, risk: 'Medio' },
  { word: 'único', frequency: 42, risk: 'Alto' }
];

const competitors = [
  {
    id: 1,
    name: 'Universidad Tecnológica',
    url: 'www.utec.edu',
    traffic: 125000,
    topKeywords: ['ingeniería software', 'programación', 'tecnología educativa']
  },
  {
    id: 2,
    name: 'Instituto Superior Politécnico',
    url: 'www.politecnico.edu',
    traffic: 98000,
    topKeywords: ['carrera informática', 'ciencias computación', 'desarrollo web']
  },
  {
    id: 3,
    name: 'Academia de Ingeniería',
    url: 'www.acadingenieria.edu',
    traffic: 87000,
    topKeywords: ['ingeniería', 'tecnología', 'innovación']
  }
];

export function SemanticAnalysis() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Análisis Semántico y Competencia</h1>
        <p className="text-gray-600">
          Optimiza tu contenido basándote en el análisis de tus principales competidores
        </p>
      </div>

      {/* Gráfico de prominencia semántica */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-gray-900 mb-6">Prominencia Semántica Comparativa</h2>
        <p className="text-gray-600 mb-6">
          Comparación de relevancia de contenido entre tu sitio y el top 5 de competidores
        </p>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={prominenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="url" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="score" 
              fill="#1e3a8a"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-gray-700">
            <strong>Análisis:</strong> Tu contenido tiene un 15% menos de relevancia semántica que el competidor líder. 
            Considera añadir las palabras recomendadas para mejorar tu posicionamiento.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Palabras a añadir */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-green-600" />
            <h2 className="text-gray-900">Palabras a Añadir</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Términos que tus competidores usan con frecuencia y que te faltan
          </p>

          <div className="space-y-3">
            {wordsToAdd.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-green-200 bg-green-50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-gray-900">{item.word}</span>
                  <span className="px-2 py-1 bg-green-600 text-white rounded">
                    +{item.frequency}
                  </span>
                </div>
                <p className="text-gray-600">
                  Usado por {item.competitors} competidores
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Palabras a reducir */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Minus className="w-5 h-5 text-red-600" />
            <h2 className="text-gray-900">Palabras a Reducir</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Términos sobre-optimizados que pueden parecer spam
          </p>

          <div className="space-y-3">
            {wordsToReduce.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-red-200 bg-red-50 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-gray-900">{item.word}</span>
                  <span
                    className={`px-2 py-1 rounded ${
                      item.risk === 'Alto'
                        ? 'bg-red-600 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {item.risk}
                  </span>
                </div>
                <p className="text-gray-600">
                  Frecuencia actual: {item.frequency} veces
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de competidores */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900 mb-1">Análisis de Competidores</h2>
          <p className="text-gray-600">
            Principales competidores en tu nicho de mercado
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">
                  Competidor
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Tráfico Estimado
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Keywords Principales
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {competitors.map((competitor) => (
                <tr key={competitor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-900">{competitor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://${competitor.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-900 hover:text-blue-700"
                    >
                      {competitor.url}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {competitor.traffic.toLocaleString()} visitas/mes
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {competitor.topKeywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
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
