import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  FileText,
  Zap
} from 'lucide-react';

const statusData = [
  { name: '200 OK', value: 1124, color: '#10b981' },
  { name: '301 Redirecciones', value: 78, color: '#3b82f6' },
  { name: '404 Errores', value: 23, color: '#ef4444' },
  { name: '500 Servidor', value: 12, color: '#dc2626' }
];

interface Issue {
  id: number;
  url: string;
  description: string;
}

const issues = {
  noTitle: [
    { id: 1, url: '/blog/articulo-sin-titulo', description: 'Página sin etiqueta <title>' },
    { id: 2, url: '/recursos/guia-2023', description: 'Título vacío detectado' },
    { id: 3, url: '/eventos/conferencia', description: 'Falta etiqueta title en HEAD' }
  ],
  duplicateH1: [
    { id: 4, url: '/cursos/programacion', description: 'H1 duplicado con /cursos/desarrollo' },
    { id: 5, url: '/noticias/anuncio-1', description: 'Mismo H1 que /noticias/anuncio-2' }
  ],
  noMetaDescription: [
    { id: 6, url: '/investigacion/proyectos', description: 'Sin meta description' },
    { id: 7, url: '/biblioteca/catalogo', description: 'Meta description vacía' },
    { id: 8, url: '/contacto/direccion', description: 'Falta meta description' }
  ],
  mixedContent: [
    { id: 9, url: '/galeria/fotos-2024', description: 'Imágenes HTTP en página HTTPS' },
    { id: 10, url: '/recursos/documentos', description: 'Scripts externos en HTTP' }
  ]
};

function IssueSection({ 
  title, 
  count, 
  issues, 
  icon: Icon 
}: { 
  title: string; 
  count: number; 
  issues: Issue[]; 
  icon: React.ElementType;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
  const totalPages = statusData.reduce((sum, item) => sum + item.value, 0);
  const errorPages = statusData.find(item => item.name === '404 Errores')?.value || 0;
  const speedScore = 78;

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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Re-rastrear
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <Download className="w-4 h-4" />
            Informe PDF
          </button>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Total Páginas</p>
          <div className="text-gray-900">{totalPages}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Errores Críticos</p>
          <div className="text-red-600">{errorPages}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Redirecciones</p>
          <div className="text-blue-600">
            {statusData.find(item => item.name === '301 Redirecciones')?.value || 0}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <p className="text-gray-600">Velocidad</p>
          </div>
          <div className={`${speedScore >= 70 ? 'text-green-600' : speedScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {speedScore}/100
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Gráfica de estados */}
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

        {/* Velocidad de carga */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Rendimiento de Velocidad</h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Puntuación General</span>
              <span className="text-gray-900">{speedScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  speedScore >= 70
                    ? 'bg-green-500'
                    : speedScore >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${speedScore}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">First Contentful Paint</span>
                <span className="text-green-600">1.2s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Largest Contentful Paint</span>
                <span className="text-yellow-600">2.8s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Time to Interactive</span>
                <span className="text-green-600">2.1s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Cumulative Layout Shift</span>
                <span className="text-red-600">0.18</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de problemas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Problemas Detectados</h2>
        
        <div className="space-y-4">
          <IssueSection
            title="URLs sin Title"
            count={issues.noTitle.length}
            issues={issues.noTitle}
            icon={FileText}
          />
          <IssueSection
            title="H1 Duplicados"
            count={issues.duplicateH1.length}
            issues={issues.duplicateH1}
            icon={AlertCircle}
          />
          <IssueSection
            title="Meta Descriptions Vacías"
            count={issues.noMetaDescription.length}
            issues={issues.noMetaDescription}
            icon={FileText}
          />
          <IssueSection
            title="Contenido Mixto (HTTP/HTTPS)"
            count={issues.mixedContent.length}
            issues={issues.mixedContent}
            icon={AlertCircle}
          />
        </div>
      </div>
    </div>
  );
}
