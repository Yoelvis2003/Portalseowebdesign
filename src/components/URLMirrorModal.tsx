import { X, Link as LinkIcon, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface MirrorURL {
  urlWithSlash: string;
  urlWithoutSlash: string;
  status: string;
  canonicalWithSlash: string;
  canonicalWithoutSlash: string;
}

interface URLMirrorModalProps {
  mirrors: MirrorURL[];
  onClose: () => void;
}

export function URLMirrorModal({ mirrors, onClose }: URLMirrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LinkIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-gray-900">URLs Espejo (Slash Final)</h2>
            </div>
            <p className="text-gray-600">
              Comparativa de URLs con y sin slash final que pueden generar contenido duplicado
            </p>
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
          {/* Alerta informativa */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gray-900 mb-1">¿Por qué es importante?</h3>
              <p className="text-gray-700">
                Las URLs con y sin slash final (/) pueden ser consideradas como páginas diferentes por los motores de búsqueda, 
                lo que puede diluir tu autoridad SEO y generar problemas de contenido duplicado. Es importante elegir una versión 
                preferida y redirigir consistentemente.
              </p>
            </div>
          </div>

          {/* Tabla comparativa */}
          <div className="space-y-6">
            {mirrors.map((mirror, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-purple-50 border-b border-purple-200 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-900">Grupo de URLs Espejo #{index + 1}</h3>
                    <span className={`px-3 py-1 rounded-full ${
                      mirror.status === 'Ambas indexadas' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {mirror.status}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700">Versión</th>
                        <th className="px-6 py-3 text-left text-gray-700">URL</th>
                        <th className="px-6 py-3 text-left text-gray-700">Canonical</th>
                        <th className="px-6 py-3 text-left text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {/* URL con slash */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Con slash
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={mirror.urlWithSlash}
                            className="text-blue-900 hover:text-blue-700 flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {mirror.urlWithSlash}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {mirror.canonicalWithSlash === 'No definida' ? (
                            <span className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              No definida
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              {mirror.canonicalWithSlash}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                            200 OK
                          </span>
                        </td>
                      </tr>

                      {/* URL sin slash */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                            Sin slash
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={mirror.urlWithoutSlash}
                            className="text-blue-900 hover:text-blue-700 flex items-center gap-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {mirror.urlWithoutSlash}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {mirror.canonicalWithoutSlash === 'No definida' ? (
                            <span className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              No definida
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              {mirror.canonicalWithoutSlash}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                            200 OK
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Recomendaciones */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-gray-900 mb-3">Recomendaciones para resolver URLs Espejo</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">1.</span>
                <span>
                  <strong>Elige una versión preferida:</strong> Decide si quieres usar URLs con slash final (/) o sin él, 
                  y mantén esa consistencia en todo el sitio.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">2.</span>
                <span>
                  <strong>Implementa redirecciones 301:</strong> Redirige la versión no preferida a la preferida 
                  (ej: /cursos/programacion → /cursos/programacion/)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">3.</span>
                <span>
                  <strong>Define canonical correctamente:</strong> Asegúrate de que ambas versiones tengan una etiqueta 
                  canonical apuntando a la versión preferida.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">4.</span>
                <span>
                  <strong>Actualiza enlaces internos:</strong> Revisa todos tus enlaces internos para que usen 
                  consistentemente la versión preferida.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">5.</span>
                <span>
                  <strong>Configura Search Console:</strong> Especifica tu versión preferida en Google Search Console 
                  para evitar confusiones.
                </span>
              </li>
            </ul>
          </div>

          {/* Código de ejemplo */}
          <div className="mt-6 p-4 bg-gray-900 text-gray-100 rounded-lg">
            <h3 className="text-white mb-3">Ejemplo de redirección 301 (.htaccess)</h3>
            <pre className="text-sm overflow-x-auto">
              <code>{`# Redirigir versión sin slash a versión con slash
RewriteEngine On
RewriteCond %{REQUEST_URI} !(.*)/$
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ $1/ [L,R=301]`}</code>
            </pre>
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
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Exportar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
