import { 
  LayoutDashboard, 
  Search, 
  FileCheck, 
  BrainCircuit, 
  BarChart3, 
  Network, 
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import type { View } from '../App';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const menuItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'keywords' as View, label: 'Palabras Clave', icon: Search },
  { id: 'audit' as View, label: 'Auditoría Técnica', icon: FileCheck },
  { id: 'semantic' as View, label: 'Análisis Semántico', icon: BrainCircuit },
  { id: 'gsc' as View, label: 'Search Console', icon: BarChart3 },
  { id: 'architecture' as View, label: 'Arquitectura Web', icon: Network },
  { id: 'tracking' as View, label: 'Tracking Posiciones', icon: TrendingUp },
];

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-blue-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-900" />
          </div>
          <div>
            <div className="text-white">Portal SEO</div>
            <div className="text-blue-300">UCI</div>
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-800 text-white shadow-md' 
                      : 'text-blue-100 hover:bg-blue-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800">
        <p className="text-blue-300">v1.0.0 - UCI 2025</p>
      </div>
    </aside>
  );
}
