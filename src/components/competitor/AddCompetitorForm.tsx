import { useState, useCallback } from 'react';
import { Search, Plus, Loader2, Users } from 'lucide-react';
import { motion } from 'motion/react';
import type { CompetitorSuggestion } from './types';
import { isValidDomain, sanitizeInput } from './utils';

interface AddCompetitorFormProps {
  suggestions: CompetitorSuggestion[];
  usedDomains: string[];
  maxCompetitors: number;
  currentCount: number;
  onAdd: (domain: string) => void;
  isSearching: boolean;
}

export function AddCompetitorForm({
  suggestions,
  usedDomains,
  maxCompetitors,
  currentCount,
  onAdd,
  isSearching
}: AddCompetitorFormProps) {
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = useCallback((value: string) => {
    setSearchInput(value);
    setError('');
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    const sanitized = sanitizeInput(searchInput);
    
    if (!sanitized) {
      setError('Por favor ingresa un dominio');
      return;
    }

    if (!isValidDomain(sanitized)) {
      setError('Formato de dominio inválido (ejemplo: www.ejemplo.cu)');
      return;
    }

    if (usedDomains.includes(sanitized.toLowerCase())) {
      setError('Este dominio ya está en el análisis');
      return;
    }

    if (currentCount >= maxCompetitors) {
      setError(`Máximo ${maxCompetitors} competidores permitidos`);
      return;
    }

    onAdd(sanitized);
    setSearchInput('');
    setError('');
  }, [searchInput, usedDomains, currentCount, maxCompetitors, onAdd]);

  const handleSuggestionClick = useCallback((domain: string) => {
    setSearchInput(domain);
    setError('');
  }, []);

  const availableSuggestions = suggestions.filter(
    s => !usedDomains.includes(s.domain.toLowerCase())
  );

  const isDisabled = isSearching || currentCount >= maxCompetitors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-base md:text-lg text-gray-900 dark:text-white">
          Agregar Competidor para Análisis Detallado
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Ejemplo: www.ejemplo.cu"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled}
              aria-label="Dominio del competidor"
              aria-invalid={!!error}
              aria-describedby={error ? "domain-error" : undefined}
            />
          </div>
          {error && (
            <p id="domain-error" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isDisabled || !searchInput.trim()}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[140px]"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="hidden sm:inline">Analizando...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Analizar</span>
            </>
          )}
        </button>
      </form>
      
      {currentCount < maxCompetitors && availableSuggestions.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Dominios sugeridos:</p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion.domain}
                onClick={() => handleSuggestionClick(suggestion.domain)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs md:text-sm"
                type="button"
              >
                {suggestion.domain}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentCount >= maxCompetitors && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Has alcanzado el límite de {maxCompetitors} competidores
        </p>
      )}
    </motion.div>
  );
}
