import { X, Clock, EyeOff, ExternalLink, AlertTriangle } from 'lucide-react';

interface SlowURL {
  url: string;
  loadTime: number;
  fcp: number;
  lcp: number;
  ttfb: number;
}

interface NonIndexedURL {
  url: string;
  reason: string;
  lastCrawl: string;
}

interface URLDetailModalProps {
  title: string;
  description: string;
  urls: SlowURL[] | NonIndexedURL[];
  type: 'slow' | 'nonIndexed';
  onClose: () => void;
}

function isSlowURL(url: any): url is SlowURL {
  return 'loadTime' in url;
}

function isNonIndexedURL(url: any): url is NonIndexedURL {
  return 'reason' in url;
}

export function URLDetailModal({ title, description, urls, type, onClose }: URLDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {type === 'slow' ? (
                <Clock className="w-6 h-6 text-yellow-600" />
              ) : (
                <EyeOff className="w-6 h-6 text-red-600" />
              )}
              <h2 className="text-gray-900">{title}</h2>
            </div>
            <p className="text-gray-600">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === 'slow' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700">URL</th>
                    <th className="px-6 py-3 text-left text-gray-700">Tiempo Total</th>
                    <th className="px-6 py-3 text-left text-gray-700">FCP</th>
                    <th className="px-6 py-3 text-left text-gray-700">LCP</th>
                    <th className="px-6 py-3 text-left text-gray-700">TTFB</th>
                    <th className="px-6 py-3 text-left text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {urls.map((url, index) => {
                    if (!isSlowURL(url)) return null;
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <a
                            href={url.url}
                            className="text-blue-900 hover:text-blue-700 flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url.url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full ${
                            url.loadTime >= 5 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {url.loadTime}s
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{url.fcp}s</td>
                        <td className="px-6 py-4 text-gray-700">{url.lcp}s</td>
                        <td className="px-6 py-4 text-gray-700">{url.ttfb}s</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-gray-700">Requiere optimización</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {type === 'nonIndexed' && (
            <div className="space-y-4">
              {urls.map((url, index) => {
                if (!isNonIndexedURL(url)) return null;
                return (
                  <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <a
                        href={url.url}
                        className="text-gray-900 hover:text-blue-700 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {url.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        No indexada
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <span className="text-gray-600">Razón:</span>
                        <div className="text-gray-900">{url.reason}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Último rastreo:</span>
                        <div className="text-gray-900">{url.lastCrawl}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recomendaciones */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-gray-900 mb-2">Recomendaciones</h3>
            {type === 'slow' ? (
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Optimiza las imágenes y utiliza formatos modernos como WebP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Implementa lazy loading para contenido no crítico</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Minimiza y comprime archivos CSS y JavaScript</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Utiliza un CDN para servir contenido estático</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Revisa tu archivo robots.txt para asegurar que no bloquea URLs importantes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Verifica las metaetiquetas noindex y elimínalas si quieres indexar la página</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Revisa las etiquetas canonical y asegúrate de que apuntan a las URLs correctas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Solicita la indexación manual en Google Search Console si es necesario</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cerrar
            </button>
            <button className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
              Exportar Lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
