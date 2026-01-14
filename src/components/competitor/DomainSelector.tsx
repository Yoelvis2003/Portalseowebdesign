import { X } from 'lucide-react';
import { motion } from 'motion/react';
import type { DomainData } from './types';

interface DomainSelectorProps {
  mainDomain: DomainData;
  competitors: DomainData[];
  selectedDomain: DomainData;
  onSelectDomain: (domain: DomainData) => void;
  onRemoveCompetitor: (domain: string) => void;
}

export function DomainSelector({
  mainDomain,
  competitors,
  selectedDomain,
  onSelectDomain,
  onRemoveCompetitor
}: DomainSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6"
    >
      <h2 className="text-gray-900 dark:text-white mb-4">Seleccionar Dominio para Análisis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Dominio principal */}
        <button
          onClick={() => onSelectDomain(mainDomain)}
          className={`p-4 border-2 rounded-lg text-left transition-all ${
            selectedDomain.domain === mainDomain.domain
              ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: mainDomain.color }} 
            />
            <span className="text-sm md:text-base text-gray-900 dark:text-white truncate">
              {mainDomain.domain}
            </span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded whitespace-nowrap">
              Principal
            </span>
          </div>
          <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
            {mainDomain.keywords.toLocaleString()} keywords
          </div>
        </button>

        {/* Competidores */}
        {competitors.map((competitor) => (
          <button
            key={competitor.domain}
            onClick={() => onSelectDomain(competitor)}
            className={`p-4 border-2 rounded-lg text-left transition-all relative ${
              selectedDomain.domain === competitor.domain
                ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveCompetitor(competitor.domain);
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              aria-label={`Eliminar ${competitor.domain}`}
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-2 pr-6">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: competitor.color }} 
              />
              <span className="text-sm md:text-base text-gray-900 dark:text-white truncate">
                {competitor.domain}
              </span>
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              {competitor.keywords.toLocaleString()} keywords
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
