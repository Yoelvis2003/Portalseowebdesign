import { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  Link as LinkIcon, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Download, 
  Search,
  ArrowUpDown,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface URLNode {
  id: number;
  url: string;
  pageRank: number;
  pageRankPercent: number;
  clicksFromHome: number;
  internalLinks: number;
  status: 'active' | 'error' | 'redirect' | 'warning';
  type: 'home' | 'category' | 'page';
  children?: number[];
  x?: number;
  y?: number;
}

type SortField = 'url' | 'pageRank' | 'pageRankPercent' | 'clicksFromHome' | 'status';
type SortDirection = 'asc' | 'desc';

// Mock data generator para simular rastreo
const generateMockData = (): URLNode[] => {
  const baseNodes: Omit<URLNode, 'pageRankPercent'>[] = [
    { id: 1, url: 'https://uci.cu/', pageRank: 100, clicksFromHome: 0, internalLinks: 45, type: 'home', status: 'active', children: [2, 3, 4, 5] },
    { id: 2, url: 'https://uci.cu/cursos', pageRank: 85, clicksFromHome: 1, internalLinks: 32, type: 'category', status: 'active', children: [6, 7, 8] },
    { id: 3, url: 'https://uci.cu/admision', pageRank: 78, clicksFromHome: 1, internalLinks: 28, type: 'category', status: 'active', children: [9, 10] },
    { id: 4, url: 'https://uci.cu/investigacion', pageRank: 72, clicksFromHome: 1, internalLinks: 24, type: 'category', status: 'active', children: [11, 12] },
    { id: 5, url: 'https://uci.cu/noticias', pageRank: 68, clicksFromHome: 1, internalLinks: 20, type: 'category', status: 'active', children: [13, 14] },
    { id: 6, url: 'https://uci.cu/cursos/ingenieria-software', pageRank: 65, clicksFromHome: 2, internalLinks: 18, type: 'page', status: 'active' },
    { id: 7, url: 'https://uci.cu/cursos/ciencia-datos', pageRank: 58, clicksFromHome: 2, internalLinks: 15, type: 'page', status: 'active' },
    { id: 8, url: 'https://uci.cu/cursos/inteligencia-artificial', pageRank: 52, clicksFromHome: 2, internalLinks: 12, type: 'page', status: 'redirect' },
    { id: 9, url: 'https://uci.cu/admision/requisitos', pageRank: 48, clicksFromHome: 2, internalLinks: 16, type: 'page', status: 'active' },
    { id: 10, url: 'https://uci.cu/admision/proceso', pageRank: 45, clicksFromHome: 2, internalLinks: 14, type: 'page', status: 'active' },
    { id: 11, url: 'https://uci.cu/investigacion/proyectos', pageRank: 42, clicksFromHome: 2, internalLinks: 11, type: 'page', status: 'warning' },
    { id: 12, url: 'https://uci.cu/investigacion/publicaciones', pageRank: 38, clicksFromHome: 2, internalLinks: 9, type: 'page', status: 'active' },
    { id: 13, url: 'https://uci.cu/noticias/eventos', pageRank: 35, clicksFromHome: 2, internalLinks: 8, type: 'page', status: 'active' },
    { id: 14, url: 'https://uci.cu/noticias/logros', pageRank: 32, clicksFromHome: 2, internalLinks: 7, type: 'page', status: 'error' },
    { id: 15, url: 'https://uci.cu/contacto', pageRank: 55, clicksFromHome: 1, internalLinks: 22, type: 'category', status: 'active', children: [16] },
    { id: 16, url: 'https://uci.cu/contacto/formulario', pageRank: 28, clicksFromHome: 2, internalLinks: 5, type: 'page', status: 'active' }
  ];

  // Calcular PageRank total
  const totalPageRank = baseNodes.reduce((sum, node) => sum + node.pageRank, 0);

  // Agregar pageRankPercent
  return baseNodes.map(node => ({
    ...node,
    pageRankPercent: (node.pageRank / totalPageRank) * 100
  }));
};

// Componente de diagrama interactivo con SVG
function InteractiveDiagram({ nodes, onNodeClick }: { nodes: URLNode[]; onNodeClick: (node: URLNode) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [nodePositions, setNodePositions] = useState<Map<number, { x: number; y: number }>>(new Map());
  const animationRef = useRef<number>();

  // Inicializar posiciones de nodos con simulación de fuerzas
  useEffect(() => {
    if (nodes.length === 0) return;

    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    // Crear conexiones
    const links: Array<{ source: number; target: number }> = [];
    nodes.forEach(node => {
      if (node.children) {
        node.children.forEach(childId => {
          links.push({ source: node.id, target: childId });
        });
      }
    });

    // Inicializar posiciones aleatorias
    const positions = new Map<number, { x: number; y: number; vx: number; vy: number }>();
    nodes.forEach(node => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 200;
      positions.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0
      });
    });

    // Parámetros de la simulación
    const alpha = 0.3; // Velocidad de enfriamiento
    let currentAlpha = 1.0;
    const iterations = 300;
    let iteration = 0;

    // Simulación de fuerzas
    const simulate = () => {
      if (iteration >= iterations) {
        setNodePositions(new Map(Array.from(positions.entries()).map(([id, pos]) => [id, { x: pos.x, y: pos.y }])));
        return;
      }

      iteration++;
      currentAlpha *= alpha;

      // Fuerza de repulsión entre nodos
      nodes.forEach((nodeA) => {
        nodes.forEach((nodeB) => {
          if (nodeA.id === nodeB.id) return;

          const posA = positions.get(nodeA.id)!;
          const posB = positions.get(nodeB.id)!;

          const dx = posB.x - posA.x;
          const dy = posB.y - posA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          const repulsion = 2000 / (distance * distance);
          const fx = (dx / distance) * repulsion * currentAlpha;
          const fy = (dy / distance) * repulsion * currentAlpha;

          posA.vx -= fx;
          posA.vy -= fy;
          posB.vx += fx;
          posB.vy += fy;
        });
      });

      // Fuerza de atracción en los enlaces
      links.forEach(link => {
        const posSource = positions.get(link.source);
        const posTarget = positions.get(link.target);
        if (!posSource || !posTarget) return;

        const dx = posTarget.x - posSource.x;
        const dy = posTarget.y - posSource.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const attraction = distance * 0.01;
        const fx = (dx / distance) * attraction * currentAlpha;
        const fy = (dy / distance) * attraction * currentAlpha;

        posSource.vx += fx;
        posSource.vy += fy;
        posTarget.vx -= fx;
        posTarget.vy -= fy;
      });

      // Fuerza hacia el centro
      nodes.forEach(node => {
        const pos = positions.get(node.id)!;
        const dx = centerX - pos.x;
        const dy = centerY - pos.y;
        pos.vx += dx * 0.001 * currentAlpha;
        pos.vy += dy * 0.001 * currentAlpha;
      });

      // Aplicar velocidades
      nodes.forEach(node => {
        const pos = positions.get(node.id)!;
        pos.x += pos.vx;
        pos.y += pos.vy;
        pos.vx *= 0.9; // Fricción
        pos.vy *= 0.9;
      });

      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes]);

  // Crear conexiones entre nodos
  const connections: Array<{ from: URLNode; to: URLNode; fromPos: { x: number; y: number }; toPos: { x: number; y: number } }> = [];
  nodes.forEach(node => {
    if (node.children) {
      node.children.forEach(childId => {
        const childNode = nodes.find(n => n.id === childId);
        const fromPos = nodePositions.get(node.id);
        const toPos = nodePositions.get(childId);
        if (childNode && fromPos && toPos) {
          connections.push({ from: node, to: childNode, fromPos, toPos });
        }
      });
    }
  });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.3, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(3, prev * 1.2));
  const handleZoomOut = () => setZoom(prev => Math.max(0.3, prev / 1.2));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Función para obtener el tamaño del nodo según su PageRank
  const getNodeSize = (node: URLNode) => {
    if (node.type === 'home') return 40;
    if (node.type === 'category') return 28;
    return Math.max(15, node.pageRank / 5);
  };

  // Función para obtener el color del nodo
  const getNodeColor = (node: URLNode) => {
    // Colores basados en la profundidad/clics desde home
    switch (node.clicksFromHome) {
      case 0: return '#10b981'; // Verde (home)
      case 1: return '#3b82f6'; // Azul
      case 2: return '#8b5cf6'; // Púrpura
      default: return '#6366f1'; // Índigo
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'error': return '#ef4444';
      case 'redirect': return '#f59e0b';
      case 'warning': return '#eab308';
      default: return '#6b7280';
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Controles de zoom */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-move"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Conexiones/Enlaces */}
          {connections.map((conn, idx) => (
            <line
              key={`conn-${idx}`}
              x1={conn.fromPos.x}
              y1={conn.fromPos.y}
              x2={conn.toPos.x}
              y2={conn.toPos.y}
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              className="dark:stroke-gray-600"
            />
          ))}

          {/* Nodos */}
          {nodes.map((node) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;

            const size = getNodeSize(node);
            const isSelected = selectedNodeId === node.id;
            const nodeColor = getNodeColor(node);
            
            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  onNodeClick(node);
                }}
                className="cursor-pointer"
              >
                {/* Anillo de selección */}
                {isSelected && (
                  <circle
                    r={size + 6}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                )}

                {/* Sombra del nodo */}
                <circle
                  r={size}
                  fill="black"
                  opacity="0.1"
                  transform="translate(2, 2)"
                />

                {/* Nodo principal */}
                <circle
                  r={size}
                  fill={nodeColor}
                  className="transition-all hover:brightness-110"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />

                {/* Círculo interior para más profundidad */}
                <circle
                  r={size * 0.6}
                  fill="white"
                  opacity="0.2"
                />

                {/* Indicador de estado (punto pequeño) */}
                <circle
                  cx={size * 0.6}
                  cy={-size * 0.6}
                  r="4"
                  fill={getStatusColor(node.status)}
                  stroke="white"
                  strokeWidth="1.5"
                />

                {/* Icono o letra en nodos grandes */}
                {size > 20 && (
                  <text
                    textAnchor="middle"
                    dy=".35em"
                    fill="white"
                    fontSize={size > 30 ? "14" : "10"}
                    fontWeight="600"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {node.type === 'home' ? '🏠' : node.pageRank}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="space-y-2">
          <p className="text-gray-900 dark:text-white mb-2">Leyenda:</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-gray-600 dark:text-gray-400">Nivel 0 (Home)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-gray-600 dark:text-gray-400">Nivel 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
            <span className="text-gray-600 dark:text-gray-400">Nivel 2+</span>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-600 dark:text-gray-400">
          🖱️ Arrastra para mover • 🔍 Rueda del mouse para zoom • 🖱️ Clic en nodo para detalles
        </p>
      </div>
    </div>
  );
}

export function SiteArchitecture() {
  const [nodes, setNodes] = useState<URLNode[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('pageRank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedNode, setSelectedNode] = useState<URLNode | null>(null);
  const [showDiagram, setShowDiagram] = useState(true);

  // Simular rastreo
  const handleStartScan = async () => {
    setIsScanning(true);
    setHasScanned(false);
    
    // Simular tiempo de rastreo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockData = generateMockData();
    setNodes(mockData);
    setIsScanning(false);
    setHasScanned(true);
  };

  // Manejar re-rastreo
  const handleRescan = async () => {
    await handleStartScan();
  };

  // Exportar a PDF
  const handleExportPDF = async () => {
    // Importar jsPDF y html2canvas dinámicamente
    const jsPDF = (await import('jspdf')).default;
    const html2canvas = (await import('html2canvas')).default;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    // Título
    pdf.setFontSize(20);
    pdf.text('Reporte de Arquitectura Web', margin, margin + 10);

    // Información del proyecto
    pdf.setFontSize(12);
    pdf.text('Proyecto: Portal UCI', margin, margin + 20);
    pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, margin, margin + 27);
    pdf.text(`Total de URLs: ${nodes.length}`, margin, margin + 34);

    let yPos = margin + 44;

    // Resumen de métricas
    pdf.setFontSize(14);
    pdf.text('Resumen de Métricas', margin, yPos);
    yPos += 7;

    pdf.setFontSize(10);
    const maxDepth = Math.max(...nodes.map(n => n.clicksFromHome));
    const totalLinks = nodes.reduce((sum, n) => sum + n.internalLinks, 0);
    const activeUrls = nodes.filter(n => n.status === 'active').length;
    const errorUrls = nodes.filter(n => n.status === 'error').length;

    pdf.text(`• Profundidad máxima: ${maxDepth} clics`, margin + 5, yPos);
    yPos += 5;
    pdf.text(`• Enlaces internos totales: ${totalLinks}`, margin + 5, yPos);
    yPos += 5;
    pdf.text(`• URLs activas: ${activeUrls}`, margin + 5, yPos);
    yPos += 5;
    pdf.text(`• URLs con errores: ${errorUrls}`, margin + 5, yPos);
    yPos += 10;

    // Tabla de URLs
    pdf.setFontSize(14);
    pdf.text('Detalle de URLs', margin, yPos);
    yPos += 7;

    // Encabezados de tabla
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.text('URL', margin, yPos);
    pdf.text('PR', margin + 80, yPos);
    pdf.text('Clics', margin + 100, yPos);
    pdf.text('Estado', margin + 120, yPos);
    yPos += 5;

    // Línea separadora
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 3;

    // Datos de la tabla
    pdf.setFont(undefined, 'normal');
    const sortedNodes = [...nodes].sort((a, b) => b.pageRank - a.pageRank);

    for (const node of sortedNodes) {
      if (yPos > pageHeight - 20) {
        pdf.addPage();
        yPos = margin;
      }

      const urlText = node.url.length > 45 ? node.url.substring(0, 45) + '...' : node.url;
      pdf.text(urlText, margin, yPos);
      pdf.text(node.pageRank.toString(), margin + 80, yPos);
      pdf.text(node.clicksFromHome.toString(), margin + 100, yPos);
      pdf.text(node.status, margin + 120, yPos);
      yPos += 5;
    }

    // Guardar PDF
    pdf.save('arquitectura-web-reporte.pdf');
  };

  // Filtrar y ordenar nodos
  const filteredAndSortedNodes = nodes
    .filter(node => 
      node.url.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (sortField === 'url') {
        return direction * a.url.localeCompare(b.url);
      }
      if (sortField === 'status') {
        return direction * a.status.localeCompare(b.status);
      }
      return direction * ((a[sortField] as number) - (b[sortField] as number));
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case 'redirect': return <ArrowRight className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'error': return 'Error';
      case 'redirect': return 'Redirección';
      case 'warning': return 'Advertencia';
      default: return status;
    }
  };

  // Métricas calculadas
  const maxDepth = nodes.length > 0 ? Math.max(...nodes.map(n => n.clicksFromHome)) : 0;
  const totalLinks = nodes.reduce((sum, n) => sum + n.internalLinks, 0);
  const errorCount = nodes.filter(n => n.status === 'error').length;
  const warningCount = nodes.filter(n => n.status === 'warning' || n.status === 'redirect').length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white mb-2">Arquitectura Web</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualiza la estructura de enlazado interno y analiza el flujo de autoridad
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3">
          {!hasScanned ? (
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Rastreando...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Iniciar Rastreo</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={handleRescan}
                disabled={isScanning}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>Re-rastrear</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Descargar Reporte</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Estado de carga */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
              <div className="flex-1">
                <h3 className="text-gray-900 dark:text-white mb-1">Rastreando sitio web...</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Analizando enlaces internos y calculando métricas de autoridad
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Métricas generales */}
      {hasScanned && nodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Total URLs</p>
            <div className="text-gray-900 dark:text-white">{nodes.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Profundidad Máxima</p>
            <div className="text-gray-900 dark:text-white">{maxDepth} {maxDepth === 1 ? 'clic' : 'clics'}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-2">Enlaces Internos</p>
            <div className="text-gray-900 dark:text-white">{totalLinks}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-2">URLs con Problemas</p>
            <div className="text-red-600 dark:text-red-400">{errorCount + warningCount}</div>
          </div>
        </motion.div>
      )}

      {/* Diagrama interactivo */}
      {hasScanned && nodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900 dark:text-white mb-1">Diagrama Interactivo</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Visualización de la estructura de enlaces y jerarquía del sitio
              </p>
            </div>
            <button
              onClick={() => setShowDiagram(!showDiagram)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {showDiagram ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          <AnimatePresence>
            {showDiagram && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <InteractiveDiagram nodes={nodes} onNodeClick={setSelectedNode} />
                
                {selectedNode && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                  >
                    <h3 className="text-gray-900 dark:text-white mb-3">Detalles del Nodo</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">URL</p>
                        <p className="text-gray-900 dark:text-white break-all">{selectedNode.url}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">PageRank</p>
                        <p className="text-gray-900 dark:text-white">{selectedNode.pageRank} ({selectedNode.pageRankPercent.toFixed(2)}%)</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Clics desde Home</p>
                        <p className="text-gray-900 dark:text-white">{selectedNode.clicksFromHome}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Estado</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedNode.status)}
                          <p className="text-gray-900 dark:text-white">{getStatusText(selectedNode.status)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Tabla de resultados */}
      {hasScanned && nodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-gray-900 dark:text-white mb-1">Detalle de URLs</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Todas las URLs rastreadas con sus métricas de PageRank
                </p>
              </div>

              {/* Buscador */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar URL..."
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
                      onClick={() => handleSort('url')}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      URL
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('pageRank')}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      PageRank
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('pageRankPercent')}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      PageRank %
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('clicksFromHome')}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Clics desde Home
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Estado
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedNodes.map((node, idx) => (
                  <motion.tr
                    key={node.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {node.type === 'home' && <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {node.type === 'category' && <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {node.type === 'page' && <LinkIcon className="w-4 h-4 text-gray-400" />}
                        <span className="text-gray-900 dark:text-white">{node.url}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
                            style={{ width: `${node.pageRank}%` }}
                          />
                        </div>
                        <span className="text-gray-900 dark:text-white">{node.pageRank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 dark:text-white">
                        {node.pageRankPercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          node.clicksFromHome === 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : node.clicksFromHome === 1
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}
                      >
                        {node.clicksFromHome} {node.clicksFromHome === 1 ? 'clic' : 'clics'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(node.status)}
                        <span className="text-gray-900 dark:text-white capitalize">
                          {getStatusText(node.status)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedNodes.length === 0 && (
            <div className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron URLs que coincidan con tu búsqueda
              </p>
            </div>
          )}
        </motion.div>
      )}

      {/* Estado inicial - Sin rastreo */}
      {!hasScanned && !isScanning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Network className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-gray-900 dark:text-white mb-3">
              Comienza el análisis de arquitectura
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Inicia el rastreo para visualizar la estructura de enlaces internos, calcular el PageRank y detectar problemas de arquitectura web
            </p>
            <button
              onClick={handleStartScan}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Play className="w-5 h-5" />
              <span>Iniciar Rastreo</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}