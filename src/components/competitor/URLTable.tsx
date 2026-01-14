import { ExternalLink } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Sparkline } from './Sparkline';
import type { URLDistribution } from './types';

interface URLTableProps {
  urlDistribution: URLDistribution[];
}

export function URLTable({ urlDistribution }: URLTableProps) {
  if (!urlDistribution || urlDistribution.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No hay datos de distribución de URLs disponibles</p>
      </div>
    );
  }

  return (
    <div>
      {/* Gráfico de dona */}
      <div className="mb-8">
        <h3 className="text-base md:text-lg text-gray-900 dark:text-white mb-4">
          URLs y su distribución del tráfico y palabras clave
        </h3>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={urlDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => {
                    const displayName = name || 'URL';
                    return `${displayName}: ${percentage.toFixed(1)}%`;
                  }}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="traffic"
                >
                  {urlDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value.toLocaleString() + ' visitas', 'Tráfico']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-2">
            {urlDistribution.slice(0, 8).map((url, index) => (
              <div key={index} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: url.color }}
                />
                <span className="text-xs md:text-sm text-gray-900 dark:text-white truncate flex-1">
                  {url.name || url.url}
                </span>
                <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {url.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de URLs */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Evolución
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300">
                URL
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Tráfico
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Top Keyword
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Volumen
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Keywords rankeadas
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {urlDistribution.map((url, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 md:px-6 py-4">
                  <Sparkline data={url.trend} color={url.color} />
                </td>
                <td className="px-4 md:px-6 py-4">
                  <a 
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 max-w-[250px] truncate"
                  >
                    {url.url}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {url.traffic.toLocaleString()}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {url.topKeyword}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {url.topKeywordVolume.toLocaleString()}
                </td>
                <td className="px-4 md:px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {url.keywords}
                </td>
                <td className="px-4 md:px-6 py-4">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs md:text-sm">
                    Ver más
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
