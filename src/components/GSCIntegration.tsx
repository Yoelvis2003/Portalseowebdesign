import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Eye, MousePointer, ExternalLink } from 'lucide-react';

const performanceData = [
  { date: '01 Dic', clics: 1240, impresiones: 45000 },
  { date: '02 Dic', clics: 1380, impresiones: 48000 },
  { date: '03 Dic', clics: 1520, impresiones: 52000 },
  { date: '04 Dic', clics: 1450, impresiones: 50000 },
  { date: '05 Dic', clics: 1680, impresiones: 55000 },
  { date: '06 Dic', clics: 1590, impresiones: 53000 },
  { date: '07 Dic', clics: 1720, impresiones: 58000 },
  { date: '08 Dic', clics: 1850, impresiones: 62000 },
  { date: '09 Dic', clics: 1780, impresiones: 60000 },
  { date: '10 Dic', clics: 1920, impresiones: 65000 }
];

const pageData = [
  {
    id: 1,
    url: '/cursos/ingenieria-software',
    clics: 2345,
    impresiones: 45678,
    ctr: 5.13,
    posicion: 3.2,
    cambio: 'up'
  },
  {
    id: 2,
    url: '/admision/requisitos',
    clics: 1876,
    impresiones: 38945,
    ctr: 4.82,
    posicion: 4.1,
    cambio: 'down'
  },
  {
    id: 3,
    url: '/noticias/evento-tecnologia',
    clics: 1542,
    impresiones: 52341,
    ctr: 2.95,
    posicion: 8.7,
    cambio: 'up'
  },
  {
    id: 4,
    url: '/investigacion/proyectos',
    clics: 987,
    impresiones: 28456,
    ctr: 3.47,
    posicion: 6.3,
    cambio: 'stable'
  },
  {
    id: 5,
    url: '/biblioteca/recursos',
    clics: 756,
    impresiones: 19823,
    ctr: 3.81,
    posicion: 5.8,
    cambio: 'up'
  }
];

const opportunities = [
  {
    id: 1,
    url: '/blog/inteligencia-artificial',
    impresiones: 12450,
    clics: 145,
    ctr: 1.16,
    posicion: 12.3,
    potencial: 'Alto'
  },
  {
    id: 2,
    url: '/recursos/guia-programacion',
    impresiones: 9832,
    clics: 98,
    ctr: 1.00,
    posicion: 15.7,
    potencial: 'Alto'
  },
  {
    id: 3,
    url: '/eventos/hackaton-2025',
    impresiones: 7654,
    clics: 112,
    ctr: 1.46,
    posicion: 11.2,
    potencial: 'Medio'
  }
];

export function GSCIntegration() {
  const totalClics = performanceData[performanceData.length - 1].clics;
  const totalImpresiones = performanceData[performanceData.length - 1].impresiones;
  const ctrPromedio = ((totalClics / totalImpresiones) * 100).toFixed(2);
  const posicionPromedio = 5.8;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Integración Google Search Console</h1>
        <p className="text-gray-600">
          Monitorea el rendimiento de tu sitio en los resultados de búsqueda de Google
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="w-5 h-5 text-blue-600" />
            <p className="text-gray-600">Clics Totales</p>
          </div>
          <div className="text-gray-900 mb-1">{totalClics.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-purple-600" />
            <p className="text-gray-600">Impresiones</p>
          </div>
          <div className="text-gray-900 mb-1">{totalImpresiones.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+8.3%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">CTR Promedio</p>
          <div className="text-gray-900 mb-1">{ctrPromedio}%</div>
          <div className="flex items-center gap-1 text-red-600">
            <TrendingDown className="w-4 h-4" />
            <span>-2.1%</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Posición Media</p>
          <div className="text-gray-900 mb-1">{posicionPromedio}</div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>-1.2 pos</span>
          </div>
        </div>
      </div>

      {/* Gráfico de evolución */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-gray-900 mb-6">Evolución Temporal: Clics vs. Impresiones</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="clics"
              stroke="#1e3a8a"
              strokeWidth={2}
              dot={{ fill: '#1e3a8a' }}
              name="Clics"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="impresiones"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={{ fill: '#7c3aed' }}
              name="Impresiones"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de rendimiento por página */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900 mb-1">Rendimiento por Página</h2>
          <p className="text-gray-600">Top 5 páginas con mejor rendimiento</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">URL</th>
                <th className="px-6 py-3 text-left text-gray-700">Clics</th>
                <th className="px-6 py-3 text-left text-gray-700">Impresiones</th>
                <th className="px-6 py-3 text-left text-gray-700">CTR</th>
                <th className="px-6 py-3 text-left text-gray-700">Posición</th>
                <th className="px-6 py-3 text-left text-gray-700">Tendencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pageData.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <a
                      href={page.url}
                      className="flex items-center gap-1 text-blue-900 hover:text-blue-700"
                    >
                      {page.url}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {page.clics.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {page.impresiones.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{page.ctr}%</td>
                  <td className="px-6 py-4 text-gray-900">{page.posicion}</td>
                  <td className="px-6 py-4">
                    {page.cambio === 'up' && (
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        Subiendo
                      </span>
                    )}
                    {page.cambio === 'down' && (
                      <span className="flex items-center gap-1 text-red-600">
                        <TrendingDown className="w-4 h-4" />
                        Bajando
                      </span>
                    )}
                    {page.cambio === 'stable' && (
                      <span className="text-gray-600">Estable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Oportunidades */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900 mb-1">Oportunidades de Mejora</h2>
          <p className="text-gray-600">
            Páginas con altas impresiones pero bajo CTR - potencial de optimización
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">URL</th>
                <th className="px-6 py-3 text-left text-gray-700">Impresiones</th>
                <th className="px-6 py-3 text-left text-gray-700">Clics</th>
                <th className="px-6 py-3 text-left text-gray-700">CTR</th>
                <th className="px-6 py-3 text-left text-gray-700">Posición</th>
                <th className="px-6 py-3 text-left text-gray-700">Potencial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <a
                      href={opp.url}
                      className="flex items-center gap-1 text-blue-900 hover:text-blue-700"
                    >
                      {opp.url}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {opp.impresiones.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900">{opp.clics}</td>
                  <td className="px-6 py-4 text-red-600">{opp.ctr}%</td>
                  <td className="px-6 py-4 text-gray-900">{opp.posicion}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        opp.potencial === 'Alto'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {opp.potencial}
                    </span>
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
