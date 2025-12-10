import { Plus, AlertTriangle, TrendingDown, ExternalLink, Clock } from 'lucide-react';
import type { View } from '../App';

interface DashboardProps {
  onNavigate: (view: View) => void;
  onSelectProject: (project: string) => void;
}

const projects = [
  {
    id: 1,
    name: 'Portal UCI',
    domain: 'www.uci.cu',
    status: 'active',
    lastCrawl: '2025-12-09',
    pages: 1247,
    errors: 23,
    keywords: 156
  },
  {
    id: 2,
    name: 'Biblioteca Virtual',
    domain: 'biblioteca.uci.cu',
    status: 'active',
    lastCrawl: '2025-12-08',
    pages: 892,
    errors: 5,
    keywords: 89
  },
  {
    id: 3,
    name: 'Portal Estudiantil',
    domain: 'estudiantes.uci.cu',
    status: 'warning',
    lastCrawl: '2025-12-07',
    pages: 654,
    errors: 47,
    keywords: 112
  }
];

const alerts = [
  {
    id: 1,
    type: 'error',
    project: 'Portal Estudiantil',
    message: 'Incremento de errores 404 detectado (+15 en las últimas 24h)',
    time: 'Hace 2 horas'
  },
  {
    id: 2,
    type: 'warning',
    project: 'Portal UCI',
    message: 'Caída de tráfico orgánico del 12% esta semana',
    time: 'Hace 5 horas'
  },
  {
    id: 3,
    type: 'info',
    project: 'Biblioteca Virtual',
    message: 'Rastreo completado exitosamente - 892 páginas indexadas',
    time: 'Hace 1 día'
  }
];

export function Dashboard({ onNavigate, onSelectProject }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Dashboard Principal</h1>
          <p className="text-gray-600">
            Gestiona y monitorea tus proyectos de análisis SEO
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Alertas Recientes */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h2 className="text-gray-900">Alertas Recientes</h2>
        </div>
        
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white border-l-4 rounded-lg p-4 shadow-sm ${
                alert.type === 'error'
                  ? 'border-red-500'
                  : alert.type === 'warning'
                  ? 'border-yellow-500'
                  : 'border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900">{alert.project}</span>
                    {alert.type === 'error' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                        Error
                      </span>
                    )}
                    {alert.type === 'warning' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                        Advertencia
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{alert.message}</p>
                  <div className="flex items-center gap-1 text-gray-400 mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proyectos Activos */}
      <div>
        <h2 className="text-gray-900 mb-4">Proyectos Activos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{project.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600">
                    <ExternalLink className="w-4 h-4" />
                    <span>{project.domain}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {project.status === 'active' ? 'Activo' : 'Alerta'}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Páginas</span>
                  <span className="text-gray-900">{project.pages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Errores</span>
                  <span
                    className={
                      project.errors > 20 ? 'text-red-600' : 'text-gray-900'
                    }
                  >
                    {project.errors}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Keywords</span>
                  <span className="text-gray-900">{project.keywords}</span>
                </div>
              </div>

              <div className="text-gray-500 mb-4 border-t border-gray-200 pt-4">
                Último rastreo: {project.lastCrawl}
              </div>

              <button
                onClick={() => {
                  onSelectProject(project.name);
                  onNavigate('audit');
                }}
                className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
