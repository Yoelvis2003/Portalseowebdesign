import { useState, useMemo, useCallback } from 'react';
import { ArrowUpDown, ExternalLink, Download, ChevronDown, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { Sparkline } from './Sparkline';
import type { KeywordDetail, SortField, SortDirection } from './types';
import { toast } from 'sonner@2.0.3';

interface KeywordTableProps {
  keywords: KeywordDetail[];
}

export function KeywordTable({ keywords }: KeywordTableProps) {
  const [sortField, setSortField] = useState<SortField>('position');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const sortedKeywords = useMemo(() => {
    return [...keywords].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      const aValue = a[sortField] as number | string;
      const bValue = b[sortField] as number | string;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction * aValue.localeCompare(bValue);
      }
      
      return direction * ((aValue as number) - (bValue as number));
    });
  }, [keywords, sortField, sortDirection]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedKeywords(new Set(keywords.map(k => k.keyword)));
    } else {
      setSelectedKeywords(new Set());
    }
  }, [keywords]);

  const handleSelectKeyword = useCallback((keyword: string, checked: boolean) => {
    setSelectedKeywords(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(keyword);
      } else {
        newSet.delete(keyword);
      }
      return newSet;
    });
  }, []);

  const handleExportXLS = useCallback(() => {
    const headers = ['Keyword', 'Posición', 'Volumen', 'Tráfico', 'URL'];
    const rows = sortedKeywords.map(k => [
      k.keyword,
      k.position,
      k.volume,
      k.traffic,
      k.url
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'keywords-export.csv';
    link.click();
    
    toast.success('Archivo exportado exitosamente');
  }, [sortedKeywords]);

  const allSelected = selectedKeywords.size === keywords.length && keywords.length > 0;
  const someSelected = selectedKeywords.size > 0 && selectedKeywords.size < keywords.length;

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-base md:text-lg text-gray-900 dark:text-white">Filtros</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Puedes aplicar los siguientes filtros a la tabla de palabras clave que tienes debajo.
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Volumen
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Incluir
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Excluir
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Filtrar keywords
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Aplicar filtros
          </button>
        </div>
        {selectedKeywords.size > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {selectedKeywords.size} keyword(s) seleccionada(s)
          </p>
        )}
      </div>

      {/* Tabla */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h3 className="text-base md:text-lg text-gray-900 dark:text-white">
          Principales keywords posicionadas para el dominio
        </h3>
        <button 
          onClick={handleExportXLS}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Exportar XLS
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left">
                <input 
                  type="checkbox" 
                  className="rounded"
                  checked={allSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Seleccionar todas las keywords"
                />
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300">
                Evolución
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('keyword')}
                  className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Keyword
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('position')}
                  className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Posición
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('volume')}
                  className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Volumen
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('traffic')}
                  className="flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Tráfico est.
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm text-gray-700 dark:text-gray-300">
                URL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedKeywords.map((keyword, index) => {
              const isSelected = selectedKeywords.has(keyword.keyword);
              return (
                <motion.tr
                  key={keyword.keyword}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 md:px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={isSelected}
                      onChange={(e) => handleSelectKeyword(keyword.keyword, e.target.checked)}
                      aria-label={`Seleccionar ${keyword.keyword}`}
                    />
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <Sparkline 
                      data={keyword.trend} 
                      color={keyword.change >= 0 ? '#10b981' : '#ef4444'} 
                    />
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{keyword.keyword}</div>
                    {keyword.competitorDomain && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Compite con: {keyword.competitorDomain}
                      </div>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs ${
                        keyword.position <= 3
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : keyword.position <= 10
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}
                    >
                      #{keyword.position}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {keyword.volume.toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {keyword.traffic.toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <a
                      href={keyword.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 max-w-[200px] truncate"
                    >
                      {keyword.url}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Mostrando {sortedKeywords.length} keyword(s)
      </div>
    </div>
  );
}
