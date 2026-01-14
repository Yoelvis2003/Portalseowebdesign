import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  ExternalLink, 
  Plus, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Search,
  ArrowUpDown,
  Eye,
  Award,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import type { TrackedKeyword } from '../App';
import { AddKeywordModal } from './AddKeywordModal';
import { toast } from 'sonner@2.0.3';

interface KeywordTracking extends TrackedKeyword {
  cpc: number;
  competition: 'low' | 'medium' | 'high';
  serpVisibility: number;
  position30d: number;
  position60d: number;
  position90d: number;
  snippets: string[];
  trend: number[]; // Últimos 30 valores para sparkline
}

interface PositionTrackingProps {
  additionalKeywords: TrackedKeyword[];
  onAddKeyword?: (keyword: string, volume: number, url: string) => void;
}

type SortField = 'keyword' | 'currentPosition' | 'change' | 'volume' | 'cpc' | 'serpVisibility';
type SortDirection = 'asc' | 'desc';

// Generar datos de tendencia para sparkline
const generateTrendData = (currentPos: number): number[] => {
  const data: number[] = [];
  let pos = currentPos + Math.floor(Math.random() * 5) - 2;
  
  for (let i = 0; i < 30; i++) {
    pos = Math.max(1, Math.min(30, pos + (Math.random() - 0.5) * 2));
    data.push(Math.round(pos));
  }
  
  return data;
};

const defaultTrackingData: Omit<KeywordTracking, keyof TrackedKeyword>[] = [
  {
    cpc: 2.45,
    competition: 'high',
    serpVisibility: 85,
    position30d: 2,
    position60d: 3,
    position90d: 4,
    snippets: ['Featured Snippet', 'People Also Ask'],
    trend: generateTrendData(1)
  },
  {
    cpc: 1.80,
    competition: 'medium',
    serpVisibility: 65,
    position30d: 3,
    position60d: 4,
    position90d: 5,
    snippets: [],
    trend: generateTrendData(3)
  },
  {
    cpc: 1.20,
    competition: 'high',
    serpVisibility: 78,
    position30d: 1,
    position60d: 2,
    position90d: 3,
    snippets: ['Featured Snippet'],
    trend: generateTrendData(2)
  },
  {
    cpc: 3.10,
    competition: 'high',
    serpVisibility: 45,
    position30d: 8,
    position60d: 12,
    position90d: 15,
    snippets: ['People Also Ask'],
    trend: generateTrendData(5)
  },
  {
    cpc: 1.50,
    competition: 'medium',
    serpVisibility: 38,
    position30d: 5,
    position60d: 6,
    position90d: 8,
    snippets: [],
    trend: generateTrendData(7)
  },
  {
    cpc: 2.90,
    competition: 'high',
    serpVisibility: 52,
    position30d: 6,
    position60d: 7,
    position90d: 9,
    snippets: ['Featured Snippet'],
    trend: generateTrendData(4)
  },
  {
    cpc: 0.95,
    competition: 'low',
    serpVisibility: 32,
    position30d: 7,
    position60d: 8,
    position90d: 10,
    snippets: [],
    trend: generateTrendData(8)
  },
  {
    cpc: 2.20,
    competition: 'medium',
    serpVisibility: 48,
    position30d: 9,
    position60d: 11,
    position90d: 14,
    snippets: ['People Also Ask'],
    trend: generateTrendData(6)
  },
  {
    cpc: 0.75,
    competition: 'low',
    serpVisibility: 18,
    position30d: 11,
    position60d: 12,
    position90d: 13,
    snippets: [],
    trend: generateTrendData(12)
  },
  {
    cpc: 1.35,
    competition: 'medium',
    serpVisibility: 72,
    position30d: 4,
    position60d: 5,
    position90d: 6,
    snippets: ['Featured Snippet'],
    trend: generateTrendData(2)
  }
];

const baseKeywords: TrackedKeyword[] = [
  {
    id: 1,
    keyword: 'universidad ciencias informáticas',
    currentPosition: 1,
    previousPosition: 2,
    change: 1,
    volume: 3200,
    url: 'https://uci.cu/',
    hasCannibalization: false
  },
  {
    id: 2,
    keyword: 'carrera ingeniería software',
    currentPosition: 3,
    previousPosition: 3,
    change: 0,
    volume: 1800,
    url: 'https://uci.cu/cursos/ingenieria-software',
    hasCannibalization: false
  },
  {
    id: 3,
    keyword: 'mejor universidad informática cuba',
    currentPosition: 2,
    previousPosition: 1,
    change: -1,
    volume: 890,
    url: 'https://uci.cu/admision',
    hasCannibalization: false
  },
  {
    id: 4,
    keyword: 'cursos programación',
    currentPosition: 5,
    previousPosition: 8,
    change: 3,
    volume: 2400,
    url: 'https://uci.cu/cursos',
    hasCannibalization: true,
    cannibalizationUrl: 'https://uci.cu/cursos/ingenieria-software'
  },
  {
    id: 5,
    keyword: 'investigación tecnológica',
    currentPosition: 7,
    previousPosition: 5,
    change: -2,
    volume: 1200,
    url: 'https://uci.cu/investigacion',
    hasCannibalization: false
  },
  {
    id: 6,
    keyword: 'admisión universidad',
    currentPosition: 4,
    previousPosition: 6,
    change: 2,
    volume: 2700,
    url: 'https://uci.cu/admision/requisitos',
    hasCannibalization: false
  },
  {
    id: 7,
    keyword: 'inteligencia artificial cuba',
    currentPosition: 8,
    previousPosition: 7,
    change: -1,
    volume: 650,
    url: 'https://uci.cu/cursos/inteligencia-artificial',
    hasCannibalization: false
  },
  {
    id: 8,
    keyword: 'ciencia de datos',
    currentPosition: 6,
    previousPosition: 9,
    change: 3,
    volume: 1950,
    url: 'https://uci.cu/cursos/ciencia-datos',
    hasCannibalization: true,
    cannibalizationUrl: 'https://uci.cu/investigacion/proyectos'
  },
  {
    id: 9,
    keyword: 'eventos tecnológicos',
    currentPosition: 12,
    previousPosition: 11,
    change: -1,
    volume: 580,
    url: 'https://uci.cu/noticias/eventos',
    hasCannibalization: false
  },
  {
    id: 10,
    keyword: 'biblioteca virtual uci',
    currentPosition: 2,
    previousPosition: 4,
    change: 2,
    volume: 450,
    url: 'https://uci.cu/biblioteca',
    hasCannibalization: false
  }
];

// Combinar datos base con datos extendidos
const extendedTrackingData: KeywordTracking[] = baseKeywords.map((base, index) => ({
  ...base,
  ...defaultTrackingData[index]
}));

// Componente Sparkline
function Sparkline({ data, color = '#3b82f6' }: { data: number[]; color?: string }) {
  if (!data || data.length === 0) return <div className="w-20 h-8" />;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 80;
    const y = 30 - ((value - min) / range) * 28;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="80" height="30" className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PositionChange({ change }: { change: number }) {
  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
        <TrendingUp className="w-4 h-4" />
        <span>+{change}</span>
      </div>
    );
  }
  
  if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
        <TrendingDown className="w-4 h-4" />
        <span>{change}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
      <Minus className="w-4 h-4" />
      <span>0</span>
    </div>
  );
}

function PositionBadge({ position }: { position: number }) {
  let colorClass = 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  
  if (position <= 3) {
    colorClass = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  } else if (position <= 10) {
    colorClass = 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
  } else if (position <= 20) {
    colorClass = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full ${colorClass}`}>
      #{position}
    </span>
  );
}

function CompetitionBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { label: 'Baja', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    medium: { label: 'Media', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
    high: { label: 'Alta', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' }
  };

  const { label, color } = config[level];

  return (
    <span className={`px-2 py-1 rounded text-xs ${color}`}>
      {label}
    </span>
  );
}

export function PositionTracking({ additionalKeywords, onAddKeyword }: PositionTrackingProps) {
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '60d' | '90d'>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('currentPosition');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Combinar keywords
  const allTrackingData = extendedTrackingData;
  
  // Filtrar y ordenar
  const filteredData = allTrackingData
    .filter(k => k.keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (sortField === 'keyword') {
        return direction * a.keyword.localeCompare(b.keyword);
      }
      
      return direction * ((a[sortField] as number) - (b[sortField] as number));
    });

  const totalKeywords = allTrackingData.length;
  const topThree = allTrackingData.filter(k => k.currentPosition <= 3).length;
  const topTen = allTrackingData.filter(k => k.currentPosition <= 10).length;
  const improving = allTrackingData.filter(k => k.change > 0).length;
  const declining = allTrackingData.filter(k => k.change < 0).length;
  const cannibalization = allTrackingData.filter(k => k.hasCannibalization).length;
  
  // Calcular posición media
  const avgPosition = allTrackingData.length > 0
    ? (allTrackingData.reduce((sum, k) => sum + k.currentPosition, 0) / allTrackingData.length).toFixed(1)
    : '0';

  // Distribución de posiciones para gráfico de dona
  const positionDistribution = [
    { name: 'Top 3', value: topThree, color: '#10b981' },
    { name: 'Top 10', value: topTen - topThree, color: '#3b82f6' },
    { name: 'Top 20', value: allTrackingData.filter(k => k.currentPosition > 10 && k.currentPosition <= 20).length, color: '#f59e0b' },
    { name: '+20', value: allTrackingData.filter(k => k.currentPosition > 20).length, color: '#6b7280' }
  ].filter(item => item.value > 0);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddKeyword = (keyword: string, volume: number, url: string) => {
    if (onAddKeyword) {
      onAddKeyword(keyword, volume, url);
      toast.success(`Palabra clave "${keyword}" agregada al tracking`);
    }
  };

  const handleExportPDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;

    // Título
    pdf.setFontSize(20);
    pdf.text('Reporte de Tracking de Posiciones', margin, margin + 10);

    // Información
    pdf.setFontSize(12);
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, margin, margin + 20);
    pdf.text(`Total de Keywords: ${totalKeywords}`, margin, margin + 27);
    pdf.text(`Posición Media: ${avgPosition}`, margin, margin + 34);

    let yPos = margin + 44;

    // Métricas
    pdf.setFontSize(14);
    pdf.text('Métricas Generales', margin, yPos);
    yPos += 7;

    pdf.setFontSize(10);
    pdf.text(`• Top 3 Posiciones: ${topThree}`, margin + 5, yPos);
    yPos += 5;
    pdf.text(`• Top 10 Posiciones: ${topTen}`, margin + 5, yPos);
    yPos += 5;
    pdf.text(`• Keywords mejorando: ${improving}`, margin + 5, yPos);
    yPos += 5;
    pdf.text(`• Keywords descendiendo: ${declining}`, margin + 5, yPos);
    yPos += 5;
    pdf.text(`• Canibalizaciones: ${cannibalization}`, margin + 5, yPos);
    yPos += 10;

    // Tabla
    pdf.setFontSize(14);
    pdf.text('Detalle de Keywords', margin, yPos);
    yPos += 7;

    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('Keyword', margin, yPos);
    pdf.text('Pos.', margin + 70, yPos);
    pdf.text('Vol.', margin + 90, yPos);
    pdf.text('CPC', margin + 110, yPos);
    pdf.text('Visib.', margin + 130, yPos);
    yPos += 5;

    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;

    pdf.setFont(undefined, 'normal');
    for (const kw of filteredData) {
      if (yPos > 270) {
        pdf.addPage();
        yPos = margin;
      }

      const kwText = kw.keyword.length > 35 ? kw.keyword.substring(0, 35) + '...' : kw.keyword;
      pdf.text(kwText, margin, yPos);
      pdf.text(`#${kw.currentPosition}`, margin + 70, yPos);
      pdf.text(kw.volume.toString(), margin + 90, yPos);
      pdf.text(`$${kw.cpc}`, margin + 110, yPos);
      pdf.text(`${kw.serpVisibility}%`, margin + 130, yPos);
      yPos += 5;
    }

    pdf.save('tracking-posiciones-reporte.pdf');
    toast.success('Reporte PDF generado exitosamente');
  };

  const handleExportCSV = () => {
    const headers = ['Keyword', 'Posición Actual', 'Cambio', 'Volumen', 'CPC', 'Competencia', 'Visibilidad SERP', 'Pos 30d', 'Pos 60d', 'Pos 90d', 'URL'];
    const rows = filteredData.map(kw => [
      kw.keyword,
      kw.currentPosition,
      kw.change,
      kw.volume,
      kw.cpc,
      kw.competition,
      kw.serpVisibility,
      kw.position30d,
      kw.position60d,
      kw.position90d,
      kw.url
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tracking-posiciones.csv';
    link.click();
    
    toast.success('Archivo CSV descargado exitosamente');
  };

  // Si no hay keywords, mostrar mensaje
  if (allTrackingData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-7xl mx-auto text-center py-20"
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-gray-900 dark:text-white mb-3">
            Comienza a hacer tracking de tus keywords
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Agrega palabras clave para monitorear su posicionamiento en Google y recibir alertas sobre cambios importantes
          </p>
          <button
            onClick={() => setShowAddKeywordModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Primera Keyword</span>
          </button>
        </div>

        <AddKeywordModal 
          isOpen={showAddKeywordModal}
          onClose={() => setShowAddKeywordModal(false)}
          onAdd={handleAddKeyword}
        />
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Tracking de Posiciones</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitoreo automático del posicionamiento de tus palabras clave estratégicas
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            CSV
          </button>
          <button 
            onClick={() => setShowAddKeywordModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Keyword
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Target className="w-4 h-4" />
            <p>Total Keywords</p>
          </div>
          <div className="text-gray-900 dark:text-white">{totalKeywords}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Award className="w-4 h-4" />
            <p>Pos. Media</p>
          </div>
          <div className="text-gray-900 dark:text-white">#{avgPosition}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-2">Top 3</p>
          <div className="text-green-600 dark:text-green-400">{topThree}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-2">Top 10</p>
          <div className="text-blue-600 dark:text-blue-400">{topTen}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <p>Mejorando</p>
          </div>
          <div className="text-green-600 dark:text-green-400">{improving}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <p>Canib.</p>
          </div>
          <div className="text-red-600 dark:text-red-400">{cannibalization}</div>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Distribución de posiciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-gray-900 dark:text-white mb-1">Distribución de Posiciones</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Keywords organizadas por rango de posición
            </p>
          </div>
          
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={positionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {positionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tendencia temporal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-gray-900 dark:text-white mb-1">Evolución Temporal</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Cambios en el ranking promedio
                </p>
              </div>
              <div className="flex gap-2">
                {(['30d', '60d', '90d'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1 rounded text-xs ${
                      selectedPeriod === period 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition-colors`}
                  >
                    {period === '30d' ? '30d' : period === '60d' ? '60d' : '90d'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Evolución de posición promedio en últimos {selectedPeriod}
              </p>
              <div className="mt-4 flex gap-6 justify-center">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Actual</p>
                  <p className="text-gray-900 dark:text-white">#{avgPosition}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedPeriod === '30d' ? '30 días atrás' : selectedPeriod === '60d' ? '60 días atrás' : '90 días atrás'}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    #{selectedPeriod === '30d' ? '5.8' : selectedPeriod === '60d' ? '6.2' : '6.8'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alertas de canibalización */}
      <AnimatePresence>
        {cannibalization > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white mb-2">Alerta de Canibalización Detectada</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Se detectaron {cannibalization} casos donde múltiples URLs compiten por la misma keyword. 
                  Esto divide tu autoridad y afecta el posicionamiento.
                </p>
                <div className="space-y-2">
                  {allTrackingData
                    .filter(k => k.hasCannibalization)
                    .map(keyword => (
                      <div key={keyword.id} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 rounded p-3">
                        <div className="text-gray-900 dark:text-white mb-1">
                          <strong>{keyword.keyword}</strong>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 space-y-1">
                          <div>URL Principal: {keyword.url}</div>
                          <div>URL Competidora: {keyword.cannibalizationUrl}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla de tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-gray-900 dark:text-white mb-1">Tabla de Seguimiento</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Monitoreo detallado de cada keyword
              </p>
            </div>

            {/* Buscador */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('keyword')}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Keyword
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                  Evolución
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('volume')}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Volumen
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('cpc')}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    CPC
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                  Competencia
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('currentPosition')}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Posición
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('serpVisibility')}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Visibilidad
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                  30d / 60d / 90d
                </th>
                <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">
                  URL
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((keyword, idx) => (
                <motion.tr 
                  key={keyword.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                    keyword.hasCannibalization ? 'bg-red-50 dark:bg-red-900/10' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 dark:text-white">{keyword.keyword}</span>
                      {keyword.hasCannibalization && (
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Sparkline 
                      data={keyword.trend} 
                      color={keyword.change >= 0 ? '#10b981' : '#ef4444'} 
                    />
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {keyword.volume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    ${keyword.cpc.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <CompetitionBadge level={keyword.competition} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <PositionBadge position={keyword.currentPosition} />
                      <PositionChange change={keyword.change} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-900 dark:text-white">{keyword.serpVisibility}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">#{keyword.position30d}</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">#{keyword.position60d}</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">#{keyword.position90d}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={keyword.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <span className="max-w-[200px] truncate">{keyword.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron keywords que coincidan con tu búsqueda
            </p>
          </div>
        )}

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>Mostrando {filteredData.length} de {allTrackingData.length} keywords</span>
            <div className="flex gap-3 text-xs">
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
      </motion.div>

      {/* Modal para agregar keyword */}
      <AddKeywordModal 
        isOpen={showAddKeywordModal}
        onClose={() => setShowAddKeywordModal(false)}
        onAdd={handleAddKeyword}
      />
    </div>
  );
}