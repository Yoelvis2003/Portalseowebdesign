import { useState, useCallback, useMemo } from 'react';
import { Target, RefreshCw, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { DomainSelector } from './competitor/DomainSelector';
import { DomainProfile } from './competitor/DomainProfile';
import { KeywordTable } from './competitor/KeywordTable';
import { URLTable } from './competitor/URLTable';
import { AddCompetitorForm } from './competitor/AddCompetitorForm';
import type { DomainData, ViewTab, CompetitorSuggestion } from './competitor/types';
import { 
  generateTrafficEvolution, 
  generateURLDistribution, 
  generateKeywordsForDomain,
  generateTrendData 
} from './competitor/utils';

// Dominio principal por defecto
const createDefaultDomain = (): DomainData => ({
  domain: 'www.uci.cu',
  traffic: 228440,
  keywords: 1770,
  trafficChange: 18.70,
  keywordsChange: 389,
  lbRank: 9.47,
  linkingDomains: 108,
  trafficValue: 15700,
  color: '#3b82f6',
  topKeywords: [
    { 
      keyword: 'universidad ciencias informáticas', 
      position: 1, 
      volume: 18100, 
      traffic: 8470, 
      url: '/', 
      change: 2,
      competition: 'high',
      trend: generateTrendData(8470, 30)
    },
    { 
      keyword: 'mejor universidad informática cuba', 
      position: 2, 
      volume: 60500, 
      traffic: 6830, 
      url: '/admision', 
      change: -1,
      competition: 'high',
      trend: generateTrendData(6830, 30)
    },
    { 
      keyword: 'admisión universidad', 
      position: 3, 
      volume: 6600, 
      traffic: 6420, 
      url: '/admision/requisitos', 
      change: 1,
      competition: 'medium',
      trend: generateTrendData(6420, 30)
    },
    { 
      keyword: 'carrera ingeniería software', 
      position: 4, 
      volume: 368000, 
      traffic: 7760, 
      url: '/cursos/ingenieria-software', 
      change: 0,
      competition: 'high',
      competitorDomain: 'www.ispjae.cu',
      trend: generateTrendData(7760, 30)
    },
    { 
      keyword: 'cursos programación', 
      position: 10, 
      volume: 368000, 
      traffic: 6830, 
      url: '/cursos', 
      change: 5,
      competition: 'medium',
      trend: generateTrendData(6830, 30)
    },
    { 
      keyword: 'ciencia de datos', 
      position: 29, 
      volume: 368000, 
      traffic: 7760, 
      url: '/cursos/ciencia-datos', 
      change: -3,
      competition: 'high',
      trend: generateTrendData(7760, 30)
    },
    { 
      keyword: 'inteligencia artificial', 
      position: 35, 
      volume: 368000, 
      traffic: 7710, 
      url: '/investigacion/ia', 
      change: -2,
      competition: 'high',
      trend: generateTrendData(7710, 30)
    },
    { 
      keyword: 'posgrado informática', 
      position: 7, 
      volume: 8500, 
      traffic: 6800, 
      url: '/posgrado', 
      change: 3,
      competition: 'low',
      trend: generateTrendData(6800, 30)
    }
  ],
  urlDistribution: []
});

// Sugerencias de competidores
const competitorSuggestions: CompetitorSuggestion[] = [
  { domain: 'www.cujae.edu.cu', traffic: 122000, keywords: 832, color: '#10b981' },
  { domain: 'www.uh.cu', traffic: 95000, keywords: 748, color: '#f59e0b' },
  { domain: 'www.ispjae.cu', traffic: 85800, keywords: 598, color: '#8b5cf6' },
  { domain: 'www.ecured.cu', traffic: 445000, keywords: 2342, color: '#ec4899' },
  { domain: 'www.infomed.cu', traffic: 338000, keywords: 1867, color: '#06b6d4' }
];

const MAX_COMPETITORS = 4;

export function CompetitorAnalysis() {
  // Estado principal
  const [mainDomain] = useState<DomainData>(() => {
    const domain = createDefaultDomain();
    domain.urlDistribution = generateURLDistribution(domain.domain);
    return domain;
  });
  
  const [competitors, setCompetitors] = useState<DomainData[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<DomainData>(mainDomain);
  const [viewTab, setViewTab] = useState<ViewTab>('keyword');
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoizar lista de dominios usados para optimización
  const usedDomains = useMemo(() => {
    return [mainDomain.domain, ...competitors.map(c => c.domain)].map(d => d.toLowerCase());
  }, [mainDomain.domain, competitors]);

  // Memoizar evolución de tráfico
  const trafficEvolution = useMemo(() => {
    return generateTrafficEvolution(selectedDomain.domain);
  }, [selectedDomain.domain]);

  // Agregar competidor
  const handleAddCompetitor = useCallback((domain: string) => {
    setIsSearching(true);

    // Simular llamada API con delay
    setTimeout(() => {
      const suggestion = competitorSuggestions.find(
        s => s.domain.toLowerCase() === domain.toLowerCase()
      );
      
      const newDomain: DomainData = {
        domain: domain.toLowerCase(),
        traffic: suggestion?.traffic || Math.floor(Math.random() * 200000) + 50000,
        keywords: suggestion?.keywords || Math.floor(Math.random() * 1500) + 500,
        trafficChange: Math.floor(Math.random() * 30) - 10,
        keywordsChange: Math.floor(Math.random() * 200) - 50,
        topKeywords: generateKeywordsForDomain(domain),
        color: suggestion?.color || `#${Math.floor(Math.random()*16777215).toString(16)}`,
        lbRank: Math.floor(Math.random() * 50) + 10,
        linkingDomains: Math.floor(Math.random() * 200) + 50,
        trafficValue: Math.floor(Math.random() * 50000) + 5000,
        urlDistribution: generateURLDistribution(domain)
      };

      setCompetitors(prev => [...prev, newDomain]);
      setSelectedDomain(newDomain);
      setIsSearching(false);
      toast.success(`Competidor "${newDomain.domain}" agregado al análisis`);
    }, 1500);
  }, []);

  // Eliminar competidor
  const handleRemoveCompetitor = useCallback((domain: string) => {
    setCompetitors(prev => prev.filter(c => c.domain !== domain));
    
    if (selectedDomain.domain === domain) {
      setSelectedDomain(mainDomain);
    }
    
    toast.success(`Competidor "${domain}" eliminado`);
  }, [selectedDomain.domain, mainDomain]);

  // Refrescar datos
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    toast.info('Actualizando análisis de competencia...');
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Análisis actualizado correctamente');
    }, 2000);
  }, []);

  // Exportar PDF
  const handleExportPDF = useCallback(async () => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.setFontSize(20);
      pdf.text('Análisis de Competencia SEO', 15, 25);
      pdf.setFontSize(12);
      pdf.text(`Dominio: ${selectedDomain.domain}`, 15, 35);
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 15, 42);
      
      pdf.save('analisis-competencia.pdf');
      toast.success('Reporte PDF generado exitosamente');
    } catch (error) {
      toast.error('Error al generar PDF');
      console.error('PDF generation error:', error);
    }
  }, [selectedDomain.domain]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-2">
            Análisis de Competencia
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Compara el rendimiento SEO de tu sitio con tus principales competidores
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            aria-label="Actualizar análisis"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Exportar a PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Dominio principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-4 md:p-6 mb-6 md:mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">Dominio Principal</p>
            <h2 className="text-lg md:text-xl text-gray-900 dark:text-white truncate">
              {mainDomain.domain}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Formulario agregar competidor */}
      <AddCompetitorForm
        suggestions={competitorSuggestions}
        usedDomains={usedDomains}
        maxCompetitors={MAX_COMPETITORS}
        currentCount={competitors.length}
        onAdd={handleAddCompetitor}
        isSearching={isSearching}
      />

      {/* Selector de dominios */}
      {competitors.length > 0 && (
        <div className="mt-6 md:mt-8">
          <DomainSelector
            mainDomain={mainDomain}
            competitors={competitors}
            selectedDomain={selectedDomain}
            onSelectDomain={setSelectedDomain}
            onRemoveCompetitor={handleRemoveCompetitor}
          />
        </div>
      )}

      {/* Perfil del dominio */}
      <div className="mt-6 md:mt-8">
        <DomainProfile
          domain={selectedDomain}
          trafficEvolution={trafficEvolution}
        />
      </div>

      {/* Tabs y contenido */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 md:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setViewTab('keyword')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                viewTab === 'keyword'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-selected={viewTab === 'keyword'}
              role="tab"
            >
              Tráfico por keyword
            </button>
            <button
              onClick={() => setViewTab('url')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                viewTab === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-selected={viewTab === 'url'}
              role="tab"
            >
              Tráfico por URL
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6" role="tabpanel">
          {viewTab === 'url' && (
            <URLTable urlDistribution={selectedDomain.urlDistribution || []} />
          )}

          {viewTab === 'keyword' && (
            <KeywordTable keywords={selectedDomain.topKeywords} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
