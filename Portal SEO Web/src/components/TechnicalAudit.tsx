import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  FileText,
  Zap,
  Search,
  Clock,
  Shield,
  Link as LinkIcon,
  Eye,
  EyeOff
} from 'lucide-react';
import { URLDetailModal } from './URLDetailModal';
import { URLMirrorModal } from './URLMirrorModal';

const statusDataMock = [
  { name: '200 OK', value: 1124, color: '#10b981', code: '200' },
  { name: '301 Redirecciones', value: 78, color: '#3b82f6', code: '300' },
  { name: '404 Errores', value: 23, color: '#ef4444', code: '400' },
  { name: '500 Servidor', value: 12, color: '#dc2626', code: '500' }
];

const duplicatesDataMock = [
  { type: 'Title Duplicado', count: 15 },
  { type: 'H1 Duplicado', count: 8 },
  { type: 'Meta Description Duplicada', count: 12 }
];

const slowURLsMock = [
  { url: '/cursos/ingenieria-software', loadTime: 4.2, fcp: 2.1, lcp: 4.2, ttfb: 1.8 },
  { url: '/biblioteca/recursos', loadTime: 5.8, fcp: 2.8, lcp: 5.8, ttfb: 2.3 },
  { url: '/investigacion/proyectos', loadTime: 3.9, fcp: 1.9, lcp: 3.9, ttfb: 1.5 },
  { url: '/galeria/eventos-2024', loadTime: 6.2, fcp: 3.1, lcp: 6.2, ttfb: 2.7 },
  { url: '/noticias/archivo', loadTime: 4.5, fcp: 2.3, lcp: 4.5, ttfb: 1.9 }
];

const nonIndexedURLsMock = [
  { url: '/admin/dashboard', reason: 'Bloqueado por robots.txt', lastCrawl: '2025-12-08' },
  { url: '/test/beta', reason: 'Metaetiqueta noindex', lastCrawl: '2025-12-09' },
  { url: '/privado/documentos', reason: 'Bloqueado por robots.txt', lastCrawl: '2025-12-07' },
  { url: '/old/version', reason: 'Canonical a otra URL', lastCrawl: '2025-12-10' },
  { url: '/draft/articulo', reason: 'Metaetiqueta noindex', lastCrawl: '2025-12-09' }
];

const mirrorURLsMock = [
  { 
    urlWithSlash: '/cursos/programacion/', 
    urlWithoutSlash: '/cursos/programacion',
    status: 'Ambas indexadas',
    canonicalWithSlash: 'No definida',
    canonicalWithoutSlash: 'No definida'
  },
  { 
    urlWithSlash: '/biblioteca/recursos/', 
    urlWithoutSlash: '/biblioteca/recursos',
    status: 'Ambas indexadas',
    canonicalWithSlash: '/biblioteca/recursos/',
    canonicalWithoutSlash: 'No definida'
  },
  { 
    urlWithSlash: '/noticias/eventos/', 
    urlWithoutSlash: '/noticias/eventos',
    status: 'Ambas indexadas',
    canonicalWithSlash: 'No definida',
    canonicalWithoutSlash: 'No definida'
  }
];

interface Issue {
  id: number;
  url: string;
  description: string;
}

const issuesMock = {
  noTitle: [
    { id: 1, url: '/blog/articulo-sin-titulo', description: 'Página sin etiqueta <title>' },
    { id: 2, url: '/recursos/guia-2023', description: 'Título vacío detectado' },
    { id: 3, url: '/eventos/conferencia', description: 'Falta etiqueta title en HEAD' }
  ],
  noH1: [
    { id: 4, url: '/cursos/desarrollo', description: 'Página sin etiqueta H1' },
    { id: 5, url: '/proyectos/investigacion', description: 'H1 no encontrado' }
  ],
  duplicateH1: [
    { id: 6, url: '/cursos/programacion', description: 'H1 duplicado con /cursos/desarrollo' },
    { id: 7, url: '/noticias/anuncio-1', description: 'Mismo H1 que /noticias/anuncio-2' }
  ],
  noMetaDescription: [
    { id: 8, url: '/investigacion/proyectos', description: 'Sin meta description' },
    { id: 9, url: '/biblioteca/catalogo', description: 'Meta description vacía' },
    { id: 10, url: '/contacto/direccion', description: 'Falta meta description' }
  ],
  mixedContent: [
    { id: 11, url: '/galeria/fotos-2024', description: 'Imágenes HTTP en página HTTPS' },
    { id: 12, url: '/recursos/documentos', description: 'Scripts externos en HTTP' }
  ]
};

const httpHttpsDataMock = {
  https: 1198,
  http: 39,
  redirections: 78,
  mixedContent: 2
};

function IssueSection({ 
  title, 
  count, 
  issues, 
  icon: Icon,
  isEmpty 
}: { 
  title: string; 
  count: number; 
  issues: Issue[]; 
  icon: React.ElementType;
  isEmpty: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (isEmpty) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500">{title}</span>
            <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full">
              --
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-red-600" />
          <span className="text-gray-900">{title}</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
            {count}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 bg-white">
          <div className="space-y-3">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="text-gray-900 mb-1">{issue.url}</div>
                <p className="text-gray-600">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TechnicalAudit() {
  const [isCrawled, setIsCrawled] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [showSlowURLs, setShowSlowURLs] = useState(false);
  const [showNonIndexedURLs, setShowNonIndexedURLs] = useState(false);
  const [showMirrorURLs, setShowMirrorURLs] = useState(false);

  // Estados de datos
  const [statusData, setStatusData] = useState(statusDataMock);
  const [duplicatesData, setDuplicatesData] = useState(duplicatesDataMock);
  const [issues, setIssues] = useState(issuesMock);
  const [slowURLs, setSlowURLs] = useState(slowURLsMock);
  const [nonIndexedURLs, setNonIndexedURLs] = useState(nonIndexedURLsMock);
  const [mirrorURLs, setMirrorURLs] = useState(mirrorURLsMock);
  const [httpHttpsData, setHttpHttpsData] = useState(httpHttpsDataMock);

  const handleCrawl = () => {
    setIsCrawling(true);
    
    // Simular proceso de rastreo
    setTimeout(() => {
      setIsCrawling(false);
      setIsCrawled(true);
    }, 3000);
  };

  const totalPages = isCrawled ? statusData.reduce((sum, item) => sum + item.value, 0) : 0;
  const errorPages = isCrawled ? (statusData.find(item => item.code === '400')?.value || 0) : 0;
  const redirections = isCrawled ? (statusData.find(item => item.code === '300')?.value || 0) : 0;
  const speedScore = isCrawled ? 78 : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Auditoría Técnica SEO</h1>
          <p className="text-gray-600">
            Análisis completo del estado técnico de tu sitio web
          </p>
        </div>
        <div className="flex gap-3">
          {!isCrawled && !isCrawling && (
            <button 
              onClick={handleCrawl}
              className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Search className="w-5 h-5" />
              Rastrear proyecto
            </button>
          )}
          
          {isCrawled && !isCrawling && (
            <>
              <button 
                onClick={handleCrawl}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Re-rastrear proyecto
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                <Download className="w-4 h-4" />
                Informe PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Estado de carga */}
      {isCrawling && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-gray-900 mb-2">Rastreando proyecto...</h3>
            <p className="text-gray-600 text-center max-w-md">
              Estamos analizando todas las URLs de tu sitio web. Este proceso puede tardar unos minutos.
            </p>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!isCrawled && !isCrawling && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Inicia el rastreo de tu proyecto</h3>
            <p className="text-gray-600 max-w-md mb-6">
              Para comenzar la auditoría técnica, haz clic en el botón "Rastrear proyecto". 
              Analizaremos todas las URLs, códigos de estado, elementos SEO, velocidad y más.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-4 bg-gray-50 rounded-lg">
                <FileText className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-600">Elementos SEO</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Zap className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-600">Velocidad</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-600">Seguridad</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <LinkIcon className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-gray-600">URLs Espejo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido cuando está rastreado */}
      {isCrawled && !isCrawling && (
        <>
          {/* Métricas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-2">Total URLs Rastreadas</p>
              <div className="text-gray-900">{totalPages}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-2">Errores 404</p>
              <div className="text-red-600">{errorPages}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 mb-2">Redirecciones</p>
              <div className="text-blue-600">{redirections}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <p className="text-gray-600">Velocidad Promedio</p>
              </div>
              <div className={`${speedScore >= 70 ? 'text-green-600' : speedScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {speedScore}/100
              </div>
            </div>
          </div>

          {/* Resumen de rastreo con clickeables */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-gray-900 mb-4">Resumen del Rastreo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setShowSlowURLs(true)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-600">URLs Lentas</span>
                </div>
                <div className="text-yellow-600 cursor-pointer hover:underline">
                  {slowURLs.length}
                </div>
              </button>

              <button
                onClick={() => setShowNonIndexedURLs(true)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="w-5 h-5 text-red-600" />
                  <span className="text-gray-600">URLs No Indexadas</span>
                </div>
                <div className="text-red-600 cursor-pointer hover:underline">
                  {nonIndexedURLs.length}
                </div>
              </button>

              <button
                onClick={() => setShowMirrorURLs(true)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-600">URLs Espejo</span>
                </div>
                <div className="text-purple-600 cursor-pointer hover:underline">
                  {mirrorURLs.length}
                </div>
              </button>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600">URLs HTTPS</span>
                </div>
                <div className="text-green-600">
                  {httpHttpsData.https}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gráfica de estados HTTP */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Estados de Respuesta HTTP</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfica de URLs duplicadas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">URLs con Elementos Duplicados</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={duplicatesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-gray-700">
                  <strong>Nota:</strong> Los elementos duplicados pueden confundir a los motores de búsqueda 
                  y diluir tu autoridad SEO.
                </p>
              </div>
            </div>
          </div>

          {/* Estado de seguridad HTTP/HTTPS */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-gray-900 mb-6">Estado de Seguridad HTTP / HTTPS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">URLs HTTPS</span>
                </div>
                <div className="text-green-600">{httpHttpsData.https}</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700">URLs HTTP</span>
                </div>
                <div className="text-red-600">{httpHttpsData.http}</div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Redirecciones HTTP→HTTPS</span>
                </div>
                <div className="text-blue-600">{httpHttpsData.redirections}</div>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-700">Contenido Mixto</span>
                </div>
                <div className="text-yellow-600">{httpHttpsData.mixedContent}</div>
              </div>
            </div>
          </div>

          {/* URLs sin elementos SEO básicos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-gray-900 mb-6">URLs sin Elementos SEO Básicos</h2>
            
            <div className="space-y-4">
              <IssueSection
                title="URLs sin Title"
                count={issues.noTitle.length}
                issues={issues.noTitle}
                icon={FileText}
                isEmpty={false}
              />
              <IssueSection
                title="URLs sin H1"
                count={issues.noH1.length}
                issues={issues.noH1}
                icon={FileText}
                isEmpty={false}
              />
              <IssueSection
                title="URLs sin Meta Description"
                count={issues.noMetaDescription.length}
                issues={issues.noMetaDescription}
                icon={FileText}
                isEmpty={false}
              />
            </div>
          </div>

          {/* Otros problemas detectados */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Otros Problemas Detectados</h2>
            
            <div className="space-y-4">
              <IssueSection
                title="H1 Duplicados"
                count={issues.duplicateH1.length}
                issues={issues.duplicateH1}
                icon={AlertCircle}
                isEmpty={false}
              />
              <IssueSection
                title="Contenido Mixto (HTTP/HTTPS)"
                count={issues.mixedContent.length}
                issues={issues.mixedContent}
                icon={AlertCircle}
                isEmpty={false}
              />
            </div>
          </div>
        </>
      )}

      {/* Modales */}
      {showSlowURLs && (
        <URLDetailModal
          title="URLs Lentas"
          description="URLs que tardan más de 3 segundos en cargar"
          urls={slowURLs}
          type="slow"
          onClose={() => setShowSlowURLs(false)}
        />
      )}

      {showNonIndexedURLs && (
        <URLDetailModal
          title="URLs No Indexadas"
          description="URLs bloqueadas o excluidas del índice de búsqueda"
          urls={nonIndexedURLs}
          type="nonIndexed"
          onClose={() => setShowNonIndexedURLs(false)}
        />
      )}

      {showMirrorURLs && (
        <URLMirrorModal
          mirrors={mirrorURLs}
          onClose={() => setShowMirrorURLs(false)}
        />
      )}
    </div>
  );
}
