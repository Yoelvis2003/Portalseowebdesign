import { Globe, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import type { DomainData, TrafficEvolution } from './types';

interface DomainProfileProps {
  domain: DomainData;
  trafficEvolution: TrafficEvolution[];
}

export function DomainProfile({ domain, trafficEvolution }: DomainProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg md:text-xl text-gray-900 dark:text-white truncate">
          Evolución de: {domain.domain}
        </h2>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="border-l-4 border-blue-600 pl-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Perfil de enlaces</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm text-gray-900 dark:text-white">LB Rank</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl md:text-2xl text-gray-900 dark:text-white">
            {domain.lbRank?.toFixed(2) || '9.47'}
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Dominios: {domain.linkingDomains || 108}
          </p>
        </div>

        <div className="border-l-4 border-green-600 pl-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Búsqueda orgánica</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Keywords</p>
          <div className="text-xl md:text-2xl text-gray-900 dark:text-white">
            {domain.keywords.toLocaleString()}
          </div>
          <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-1">
            {domain.keywordsChange >= 0 ? '+' : ''}{domain.keywordsChange}
          </p>
        </div>

        <div className="border-l-4 border-green-600 pl-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">&nbsp;</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Tráfico</p>
          <div className="text-xl md:text-2xl text-gray-900 dark:text-white">
            {(domain.trafficValue || 15700).toLocaleString()}
          </div>
          <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mt-1">
            {domain.trafficChange >= 0 ? '+' : ''}{domain.trafficChange}%
          </p>
        </div>

        <div className="border-l-4 border-purple-600 pl-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tráfico orgánico acumulado</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Keywords</p>
          <div className="text-xl md:text-2xl text-gray-900 dark:text-white">
            {(domain.keywords + 35000).toLocaleString()}
          </div>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Top 3: 3.39K
          </p>
        </div>
      </div>

      {/* Gráfico de evolución */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={trafficEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  style={{ fontSize: '11px' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
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
                <Bar dataKey="visitas" fill="#10b981" radius={[4, 4, 0, 0]} name="Visitas mensuales" />
                <Line 
                  type="monotone" 
                  dataKey="tendencia" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Tendencia"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
