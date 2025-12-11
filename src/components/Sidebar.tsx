import { 
  Users, 
  Search, 
  FileCheck, 
  BrainCircuit, 
  BarChart3, 
  Network, 
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { View } from '../App';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
}

const menuItems = [
  { id: 'competitor' as View, label: 'Análisis Competencia', icon: Users },
  { id: 'keywords' as View, label: 'Palabras Clave', icon: Search },
  { id: 'audit' as View, label: 'Auditoría Técnica', icon: FileCheck },
  { id: 'semantic' as View, label: 'Análisis Semántico', icon: BrainCircuit },
  { id: 'gsc' as View, label: 'Search Console', icon: BarChart3 },
  { id: 'architecture' as View, label: 'Arquitectura Web', icon: Network },
  { id: 'tracking' as View, label: 'Tracking Posiciones', icon: TrendingUp },
];

export function Sidebar({ currentView, onNavigate, isOpen }: SidebarProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Sidebar */}
          <motion.aside 
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-blue-900 dark:bg-gray-800 text-white flex flex-col shadow-xl transition-colors z-50"
          >
            {/* Logo */}
            <div className="p-6 border-b border-blue-800 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-900 dark:text-white" />
                </div>
                <div>
                  <div className="text-white">Portal SEO</div>
                  <div className="text-blue-300 dark:text-gray-400">UCI</div>
                </div>
              </div>
            </div>

            {/* Menú de navegación */}
            <nav className="flex-1 p-4 overflow-y-auto">
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
                            ? 'bg-blue-800 dark:bg-gray-700 text-white shadow-md' 
                            : 'text-blue-100 dark:text-gray-300 hover:bg-blue-800/50 dark:hover:bg-gray-700/50'
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
            <div className="p-4 border-t border-blue-800 dark:border-gray-700">
              <p className="text-blue-300 dark:text-gray-400">v1.0.0 - UCI 2025</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}