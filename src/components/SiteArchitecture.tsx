import { useState } from 'react';
import { Home, FileText, Link as LinkIcon, ArrowRight } from 'lucide-react';

interface Node {
  id: number;
  url: string;
  pageRank: number;
  distanceFromHome: number;
  internalLinks: number;
  type: 'home' | 'category' | 'page';
  children?: number[];
}

const nodes: Node[] = [
  { id: 1, url: '/', pageRank: 100, distanceFromHome: 0, internalLinks: 45, type: 'home', children: [2, 3, 4, 5] },
  { id: 2, url: '/cursos', pageRank: 85, distanceFromHome: 1, internalLinks: 32, type: 'category', children: [6, 7, 8] },
  { id: 3, url: '/admision', pageRank: 78, distanceFromHome: 1, internalLinks: 28, type: 'category', children: [9, 10] },
  { id: 4, url: '/investigacion', pageRank: 72, distanceFromHome: 1, internalLinks: 24, type: 'category', children: [11, 12] },
  { id: 5, url: '/noticias', pageRank: 68, distanceFromHome: 1, internalLinks: 20, type: 'category', children: [13, 14] },
  { id: 6, url: '/cursos/ingenieria-software', pageRank: 65, distanceFromHome: 2, internalLinks: 18, type: 'page' },
  { id: 7, url: '/cursos/ciencia-datos', pageRank: 58, distanceFromHome: 2, internalLinks: 15, type: 'page' },
  { id: 8, url: '/cursos/inteligencia-artificial', pageRank: 52, distanceFromHome: 2, internalLinks: 12, type: 'page' },
  { id: 9, url: '/admision/requisitos', pageRank: 48, distanceFromHome: 2, internalLinks: 16, type: 'page' },
  { id: 10, url: '/admision/proceso', pageRank: 45, distanceFromHome: 2, internalLinks: 14, type: 'page' },
  { id: 11, url: '/investigacion/proyectos', pageRank: 42, distanceFromHome: 2, internalLinks: 11, type: 'page' },
  { id: 12, url: '/investigacion/publicaciones', pageRank: 38, distanceFromHome: 2, internalLinks: 9, type: 'page' },
  { id: 13, url: '/noticias/eventos', pageRank: 35, distanceFromHome: 2, internalLinks: 8, type: 'page' },
  { id: 14, url: '/noticias/logros', pageRank: 32, distanceFromHome: 2, internalLinks: 7, type: 'page' }
];

function NetworkNode({ node, level }: { node: Node; level: number }) {
  const getNodeColor = () => {
    if (node.type === 'home') return 'bg-blue-900 border-blue-900';
    if (node.type === 'category') return 'bg-blue-700 border-blue-700';
    return 'bg-blue-500 border-blue-500';
  };

  const getNodeIcon = () => {
    if (node.type === 'home') return Home;
    if (node.type === 'category') return FileText;
    return LinkIcon;
  };

  const Icon = getNodeIcon();

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${getNodeColor()} text-white p-4 rounded-lg border-2 shadow-md hover:shadow-lg transition-shadow cursor-pointer min-w-[200px]`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-5 h-5" />
          <span className="truncate">{node.url}</span>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-200">PageRank:</span>
            <span>{node.pageRank}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Distancia:</span>
            <span>{node.distanceFromHome}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteArchitecture() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const nodesByLevel = nodes.reduce((acc, node) => {
    if (!acc[node.distanceFromHome]) {
      acc[node.distanceFromHome] = [];
    }
    acc[node.distanceFromHome].push(node);
    return acc;
  }, {} as Record<number, Node[]>);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Arquitectura Web</h1>
        <p className="text-gray-600">
          Visualiza la estructura de enlazado interno y analiza el flujo de autoridad
        </p>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Total URLs</p>
          <div className="text-gray-900">{nodes.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Profundidad Máxima</p>
          <div className="text-gray-900">2 clics</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">Enlaces Internos</p>
          <div className="text-gray-900">453</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-2">URLs Huérfanas</p>
          <div className="text-red-600">3</div>
        </div>
      </div>

      {/* Gráfico de arquitectura */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-gray-900 mb-6">Mapa de Enlazado Interno</h2>
        
        <div className="overflow-x-auto">
          <div className="min-w-max space-y-8 p-4">
            {Object.entries(nodesByLevel).map(([level, levelNodes]) => (
              <div key={level} className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">
                    Nivel {level}
                  </span>
                  {parseInt(level) > 0 && (
                    <span className="text-gray-500">
                      ({levelNodes.length} páginas)
                    </span>
                  )}
                </div>
                
                <div className="flex gap-6 items-start flex-wrap">
                  {levelNodes.map((node) => (
                    <div key={node.id} className="relative">
                      <NetworkNode node={node} level={parseInt(level)} />
                      
                      {node.children && parseInt(level) < 1 && (
                        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
                          <ArrowRight className="w-5 h-5 text-gray-400 transform rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-gray-700">
            <strong>Recomendación:</strong> La arquitectura del sitio está bien organizada con una profundidad máxima de 2 clics. 
            Considera resolver las 3 URLs huérfanas para mejorar el rastreo.
          </p>
        </div>
      </div>

      {/* Tabla de PageRank interno */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900 mb-1">PageRank Interno</h2>
          <p className="text-gray-600">
            Análisis de autoridad de página basado en el enlazado interno
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">URL</th>
                <th className="px-6 py-3 text-left text-gray-700">PageRank</th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Distancia desde Home
                </th>
                <th className="px-6 py-3 text-left text-gray-700">
                  Enlaces Internos
                </th>
                <th className="px-6 py-3 text-left text-gray-700">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {nodes
                .sort((a, b) => b.pageRank - a.pageRank)
                .map((node) => (
                  <tr key={node.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{node.url}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${node.pageRank}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-900">{node.pageRank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          node.distanceFromHome === 0
                            ? 'bg-green-100 text-green-700'
                            : node.distanceFromHome === 1
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {node.distanceFromHome} clic{node.distanceFromHome !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {node.internalLinks}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                        {node.type === 'home' ? 'Inicio' : node.type === 'category' ? 'Categoría' : 'Página'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
