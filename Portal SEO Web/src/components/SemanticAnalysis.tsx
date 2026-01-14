import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Minus, TrendingUp, ExternalLink, Search, Download, Bookmark, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface RelatedTerm {
  term: string;
  type: '1 palabra' | '2 palabras' | '3 palabras';
  frequency: number;
  competitors: number;
}

interface CompetitorURL {
  position: number;
  url: string;
  title: string;
  h1: string[];
  h2: string[];
  h3: string[];
  wordCount: number;
  keywordDensity: number;
}

interface KeywordRecommendation {
  word: string;
  currentFrequency: number;
  recommendedFrequency: number;
  action: 'add' | 'increase' | 'decrease';
  competitors: number;
  priority: 'Alta' | 'Media' | 'Baja';
}

interface SemanticAnalysisProps {
  onAddToTracking?: (keyword: string, volume: number) => boolean;
}

const mockTop10Data: CompetitorURL[] = [
  {
    position: 1,
    url: 'https://www.universidad-top.edu/programas/ingenieria-software',
    title: 'Ingeniería de Software - Universidad Tecnológica',
    h1: ['Ingeniería de Software'],
    h2: ['¿Por qué estudiar Ingeniería de Software?', 'Plan de Estudios', 'Perfil Profesional', 'Oportunidades Laborales'],
    h3: ['Desarrollo de Software', 'Gestión de Proyectos', 'Arquitectura de Sistemas', 'Metodologías Ágiles'],
    wordCount: 2450,
    keywordDensity: 2.8
  },
  {
    position: 2,
    url: 'https://www.educacion-superior.cu/carreras/software',
    title: 'Carrera Ingeniería Software - Formación Profesional',
    h1: ['Carrera de Ingeniería de Software'],
    h2: ['Descripción de la Carrera', 'Requisitos de Ingreso', 'Competencias a Desarrollar', 'Campo Laboral'],
    h3: ['Programación Avanzada', 'Base de Datos', 'Inteligencia Artificial', 'Desarrollo Web'],
    wordCount: 2180,
    keywordDensity: 2.5
  },
  {
    position: 3,
    url: 'https://www.portal-estudiantil.edu/guia/ingenieria-software',
    title: 'Guía Completa: Ingeniería de Software 2025',
    h1: ['Guía Completa de Ingeniería de Software'],
    h2: ['Introducción', 'Áreas de Especialización', 'Duración y Modalidades', 'Mejores Universidades'],
    h3: ['Frontend Development', 'Backend Development', 'DevOps', 'Testing y QA'],
    wordCount: 3200,
    keywordDensity: 3.1
  },
  {
    position: 4,
    url: 'https://www.guia-universidades.com/carreras/software-engineering',
    title: 'Estudiar Ingeniería de Software: Todo lo que necesitas saber',
    h1: ['Ingeniería de Software: La Carrera del Futuro'],
    h2: ['¿Qué es la Ingeniería de Software?', 'Habilidades Requeridas', 'Salidas Profesionales', 'Testimonios'],
    h3: ['Pensamiento Lógico', 'Resolución de Problemas', 'Trabajo en Equipo', 'Aprendizaje Continuo'],
    wordCount: 2890,
    keywordDensity: 2.9
  },
  {
    position: 5,
    url: 'https://www.tech-education.net/programas/software',
    title: 'Programa de Ingeniería de Software - Tech Education',
    h1: ['Programa Académico de Ingeniería de Software'],
    h2: ['Objetivos del Programa', 'Metodología de Enseñanza', 'Certificaciones', 'Convenios Internacionales'],
    h3: ['Algoritmos y Estructuras', 'Sistemas Operativos', 'Redes y Comunicaciones', 'Seguridad Informática'],
    wordCount: 2650,
    keywordDensity: 2.7
  }
];

const mockRelatedTerms: RelatedTerm[] = [
  { term: 'ingeniería', type: '1 palabra', frequency: 156, competitors: 10 },
  { term: 'software', type: '1 palabra', frequency: 189, competitors: 10 },
  { term: 'desarrollo', type: '1 palabra', frequency: 134, competitors: 9 },
  { term: 'programación', type: '1 palabra', frequency: 98, competitors: 8 },
  { term: 'ingeniería software', type: '2 palabras', frequency: 145, competitors: 10 },
  { term: 'desarrollo software', type: '2 palabras', frequency: 87, competitors: 9 },
  { term: 'carrera ingeniería', type: '2 palabras', frequency: 76, competitors: 8 },
  { term: 'plan estudios', type: '2 palabras', frequency: 65, competitors: 7 },
  { term: 'ingeniería software universidad', type: '3 palabras', frequency: 52, competitors: 8 },
  { term: 'carrera ingeniería software', type: '3 palabras', frequency: 48, competitors: 7 },
  { term: 'estudiar ingeniería software', type: '3 palabras', frequency: 41, competitors: 6 }
];

const mockRecommendations: KeywordRecommendation[] = [
  { word: 'desarrollo software', currentFrequency: 12, recommendedFrequency: 28, action: 'increase', competitors: 9, priority: 'Alta' },
  { word: 'metodologías ágiles', currentFrequency: 0, recommendedFrequency: 15, action: 'add', competitors: 8, priority: 'Alta' },
  { word: 'inteligencia artificial', currentFrequency: 0, recommendedFrequency: 12, action: 'add', competitors: 7, priority: 'Alta' },
  { word: 'plan estudios', currentFrequency: 3, recommendedFrequency: 18, action: 'increase', competitors: 7, priority: 'Media' },
  { word: 'desarrollo web', currentFrequency: 0, recommendedFrequency: 10, action: 'add', competitors: 6, priority: 'Media' },
  { word: 'base datos', currentFrequency: 2, recommendedFrequency: 14, action: 'increase', competitors: 8, priority: 'Media' },
  { word: 'mejor universidad', currentFrequency: 28, recommendedFrequency: 8, action: 'decrease', competitors: 3, priority: 'Alta' },
  { word: 'clic aquí', currentFrequency: 35, recommendedFrequency: 2, action: 'decrease', competitors: 1, priority: 'Alta' },
  { word: 'gratis ahora', currentFrequency: 22, recommendedFrequency: 5, action: 'decrease', competitors: 2, priority: 'Media' }
];

export function SemanticAnalysis({ onAddToTracking }: SemanticAnalysisProps) {
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [trackedKeywords, setTrackedKeywords] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successKeyword, setSuccessKeyword] = useState('');
  const [expandedCompetitor, setExpandedCompetitor] = useState<number | null>(null);

  // Filtrar recomendaciones por acción
  const toAdd = mockRecommendations.filter(r => r.action === 'add');
  const toIncrease = mockRecommendations.filter(r => r.action === 'increase');
  const toDecrease = mockRecommendations.filter(r => r.action === 'decrease');

  // Calcular prominencia promedio
  const avgProminence = mockTop10Data.reduce((sum, item) => sum + item.keywordDensity, 0) / mockTop10Data.length;
  const yourProminence = 1.8; // Prominencia de tu URL

  const prominenceData = [
    { url: 'Tu URL', score: Math.round(yourProminence * 10), isYours: true },
    ...mockTop10Data.slice(0, 5).map(item => ({
      url: `Top ${item.position}`,
      score: Math.round(item.keywordDensity * 10),
      isYours: false
    })),
    { url: 'Promedio Top 10', score: Math.round(avgProminence * 10), isYours: false }
  ];

  const handleAnalyze = () => {
    if (!keyword.trim() || !url.trim()) {
      alert('Por favor completa ambos campos');
      return;
    }

    setIsAnalyzing(true);

    // Simular análisis
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 3000);
  };

  const handleAddToTracking = (word: string) => {
    if (onAddToTracking) {
      const success = onAddToTracking(word, 1500); // Volumen mock
      if (success) {
        setTrackedKeywords(prev => [...prev, word]);
        setSuccessKeyword(word);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        alert('Esta palabra clave ya está en seguimiento');
      }
    } else {
      // Fallback si no hay función de tracking
      setTrackedKeywords(prev => [...prev, word]);
      setSuccessKeyword(word);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleDownloadPDF = () => {
    alert('Generando PDF con el análisis completo...');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Análisis Semántico y Competencia</h1>
        <p className="text-gray-600">
          Optimiza tu contenido basándote en el análisis de tus principales competidores
        </p>
      </div>

      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800">
              Palabra clave "{successKeyword}" agregada al seguimiento de posiciones
            </span>
          </div>
        </div>
      )}

      {/* Inputs iniciales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-gray-900 mb-4">Configurar Análisis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="keyword-input" className="block text-gray-700 mb-2">
              Palabra Clave a Posicionar
            </label>
            <input
              id="keyword-input"
              type="text"
              placeholder="Ej: ingeniería de software"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="url-input" className="block text-gray-700 mb-2">
              URL a Posicionar
            </label>
            <input
              id="url-input"
              type="url"
              placeholder="https://www.tusitio.com/pagina"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5" />
            {isAnalyzing ? 'Analizando...' : 'Iniciar Análisis'}
          </button>

          {isAnalyzed && (
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Descargar análisis completo (PDF)
            </button>
          )}
        </div>
      </div>

      {/* Estado de carga */}
      {isAnalyzing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-gray-900 mb-2">Analizando contenido semántico...</h3>
            <p className="text-gray-600 text-center max-w-md">
              Estamos analizando el Top 10 de resultados, extrayendo términos relacionados, 
              calculando densidades y generando recomendaciones.
            </p>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!isAnalyzed && !isAnalyzing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Configura tu análisis semántico</h3>
            <p className="text-gray-600 max-w-md mb-6">
              Ingresa una palabra clave y URL para analizar la competencia del Top 10, 
              obtener recomendaciones de términos y optimizar tu contenido.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 bg-gray-50 rounded-lg">
                <Plus className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-600">Términos a añadir</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-600">Prominencia</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Minus className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-600">Términos a reducir</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <ExternalLink className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-600">Análisis Top 10</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resultados del análisis */}
      {isAnalyzed && !isAnalyzing && (
        <>
          {/* Resumen del análisis */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-gray-900 mb-3">Resumen del Análisis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 mb-1">Palabra Clave Analizada</p>
                <div className="text-gray-900">{keyword}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 mb-1">URL Objetivo</p>
                <div className="text-gray-900 truncate">{url}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-600 mb-1">URLs Analizadas</p>
                <div className="text-gray-900">{mockTop10Data.length} del Top 10</div>
              </div>
            </div>
          </div>

          {/* Términos relacionados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-gray-900 mb-4">Términos Relacionados Detectados</h2>
            <p className="text-gray-600 mb-6">
              Combinaciones de 1, 2 y 3 palabras encontradas en el Top 10
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-gray-900 mb-3">1 Palabra</h3>
                <div className="space-y-2">
                  {mockRelatedTerms.filter(t => t.type === '1 palabra').map((term, idx) => (
                    <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{term.term}</span>
                        <span className="text-blue-600">{term.frequency}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {term.competitors}/10 competidores
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-3">2 Palabras</h3>
                <div className="space-y-2">
                  {mockRelatedTerms.filter(t => t.type === '2 palabras').map((term, idx) => (
                    <div key={idx} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{term.term}</span>
                        <span className="text-purple-600">{term.frequency}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {term.competitors}/10 competidores
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-3">3 Palabras</h3>
                <div className="space-y-2">
                  {mockRelatedTerms.filter(t => t.type === '3 palabras').map((term, idx) => (
                    <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{term.term}</span>
                        <span className="text-green-600">{term.frequency}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {term.competitors}/10 competidores
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de prominencia semántica */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-gray-900 mb-6">Prominencia Semántica Comparativa</h2>
            <p className="text-gray-600 mb-6">
              Densidad de palabra clave en tu URL vs. el Top 10 (Promedio: {avgProminence.toFixed(2)}%)
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
                <strong>Análisis:</strong> Tu contenido tiene una densidad de {yourProminence}%, 
                mientras que el promedio del Top 10 es {avgProminence.toFixed(2)}%. 
                {yourProminence < avgProminence 
                  ? ` Considera aumentar la presencia de la palabra clave en ${((avgProminence - yourProminence) / avgProminence * 100).toFixed(0)}%.`
                  : ' Tu densidad está por encima del promedio, mantén el equilibrio para evitar sobre-optimización.'}
              </p>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Palabras a añadir */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-green-600" />
                <h2 className="text-gray-900">Palabras a Añadir</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Términos ausentes en tu contenido
              </p>

              <div className="space-y-3">
                {toAdd.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-green-200 bg-green-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-gray-900 flex-1">{item.word}</span>
                      <span className={`px-2 py-1 rounded text-sm ml-2 ${
                        item.priority === 'Alta' 
                          ? 'bg-red-600 text-white' 
                          : item.priority === 'Media'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Usar ~{item.recommendedFrequency} veces • {item.competitors}/10 competidores
                    </p>
                    <button
                      onClick={() => handleAddToTracking(item.word)}
                      disabled={trackedKeywords.includes(item.word)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                        trackedKeywords.includes(item.word)
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Bookmark className="w-3 h-3" />
                      {trackedKeywords.includes(item.word) ? 'En seguimiento' : 'Añadir a seguimiento'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Palabras a aumentar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">Palabras a Aumentar</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Términos con baja frecuencia
              </p>

              <div className="space-y-3">
                {toIncrease.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-blue-200 bg-blue-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-gray-900 flex-1">{item.word}</span>
                      <span className={`px-2 py-1 rounded text-sm ml-2 ${
                        item.priority === 'Alta' 
                          ? 'bg-red-600 text-white' 
                          : item.priority === 'Media'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Actual: {item.currentFrequency} → Recomendado: {item.recommendedFrequency}
                    </p>
                    <button
                      onClick={() => handleAddToTracking(item.word)}
                      disabled={trackedKeywords.includes(item.word)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                        trackedKeywords.includes(item.word)
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Bookmark className="w-3 h-3" />
                      {trackedKeywords.includes(item.word) ? 'En seguimiento' : 'Añadir a seguimiento'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Palabras a reducir */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Minus className="w-5 h-5 text-red-600" />
                <h2 className="text-gray-900">Palabras a Reducir</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Términos sobre-optimizados
              </p>

              <div className="space-y-3">
                {toDecrease.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-red-200 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-gray-900 flex-1">{item.word}</span>
                      <span className={`px-2 py-1 rounded text-sm ml-2 ${
                        item.priority === 'Alta' 
                          ? 'bg-red-600 text-white' 
                          : item.priority === 'Media'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        Riesgo {item.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Actual: {item.currentFrequency} → Reducir a: {item.recommendedFrequency}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Estructura de títulos del Top 10 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-4">Estructura de Títulos del Top 10</h2>
            <p className="text-gray-600 mb-6">
              Analiza cómo estructuran sus contenidos los principales competidores
            </p>

            <div className="space-y-4">
              {mockTop10Data.map((competitor) => (
                <div key={competitor.position} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedCompetitor(
                      expandedCompetitor === competitor.position ? null : competitor.position
                    )}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center">
                        {competitor.position}
                      </span>
                      <div className="text-left">
                        <div className="text-gray-900">{competitor.title}</div>
                        <a 
                          href={competitor.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {competitor.url}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">
                        {competitor.wordCount} palabras • {competitor.keywordDensity}% densidad
                      </span>
                      {expandedCompetitor === competitor.position ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {expandedCompetitor === competitor.position && (
                    <div className="p-6 bg-white border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                            H1
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                              {competitor.h1.length}
                            </span>
                          </h3>
                          <ul className="space-y-2">
                            {competitor.h1.map((h, idx) => (
                              <li key={idx} className="text-gray-700 p-2 bg-blue-50 rounded">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                            H2
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                              {competitor.h2.length}
                            </span>
                          </h3>
                          <ul className="space-y-2">
                            {competitor.h2.map((h, idx) => (
                              <li key={idx} className="text-gray-700 p-2 bg-purple-50 rounded">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                            H3
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                              {competitor.h3.length}
                            </span>
                          </h3>
                          <ul className="space-y-2">
                            {competitor.h3.map((h, idx) => (
                              <li key={idx} className="text-gray-700 p-2 bg-green-50 rounded">
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
