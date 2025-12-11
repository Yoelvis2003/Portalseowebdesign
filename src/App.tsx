import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';
import { Login } from './components/Login';
import { CompetitorAnalysis } from './components/CompetitorAnalysis';
import { KeywordResearch } from './components/KeywordResearch';
import { TechnicalAudit } from './components/TechnicalAudit';
import { SemanticAnalysis } from './components/SemanticAnalysis';
import { GSCIntegration } from './components/GSCIntegration';
import { SiteArchitecture } from './components/SiteArchitecture';
import { PositionTracking } from './components/PositionTracking';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export type View = 
  | 'login' 
  | 'competitor' 
  | 'keywords' 
  | 'audit' 
  | 'semantic' 
  | 'gsc' 
  | 'architecture' 
  | 'tracking';

export interface TrackedKeyword {
  id: number;
  keyword: string;
  currentPosition: number;
  previousPosition: number;
  change: number;
  volume: number;
  url: string;
  hasCannibalization: boolean;
  cannibalizationUrl?: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentProject, setCurrentProject] = useState<string>('Portal UCI');
  const [trackedKeywords, setTrackedKeywords] = useState<TrackedKeyword[]>([]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('competitor');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleAddToTracking = (keyword: string, volume: number) => {
    // Verificar si ya existe
    const exists = trackedKeywords.some(k => k.keyword.toLowerCase() === keyword.toLowerCase());
    if (exists) {
      return false;
    }

    const newKeyword: TrackedKeyword = {
      id: Date.now(),
      keyword: keyword,
      currentPosition: Math.floor(Math.random() * 20) + 1, // Posición aleatoria para demo
      previousPosition: Math.floor(Math.random() * 20) + 1,
      change: 0,
      volume: volume,
      url: '/',
      hasCannibalization: false
    };

    // Calcular cambio
    newKeyword.change = newKeyword.previousPosition - newKeyword.currentPosition;

    setTrackedKeywords(prev => [...prev, newKeyword]);
    return true;
  };

  const handleAddKeywordToTracking = (keyword: string, volume: number, url: string) => {
    // Verificar si ya existe
    const exists = trackedKeywords.some(k => k.keyword.toLowerCase() === keyword.toLowerCase());
    if (exists) {
      toast.error('Esta palabra clave ya está en tracking');
      return;
    }

    const newKeyword: TrackedKeyword = {
      id: Date.now(),
      keyword: keyword,
      currentPosition: Math.floor(Math.random() * 20) + 1,
      previousPosition: Math.floor(Math.random() * 20) + 1,
      change: 0,
      volume: volume,
      url: url,
      hasCannibalization: false
    };

    newKeyword.change = newKeyword.previousPosition - newKeyword.currentPosition;

    setTrackedKeywords(prev => [...prev, newKeyword]);
    toast.success(`Palabra clave "${keyword}" agregada exitosamente`);
  };

  const handleCreateProject = (name: string, domain: string, keywords: string) => {
    console.log('Creando proyecto:', { name, domain, keywords });
    setCurrentProject(name);
    toast.success(`Proyecto "${name}" creado exitosamente`);
    toast.info('Iniciando rastreo automático del sitio...');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <>
      <Toaster />
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            currentProject={currentProject} 
            onLogout={handleLogout}
            onCreateProject={handleCreateProject}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {currentView === 'competitor' && <CompetitorAnalysis />}
            {currentView === 'keywords' && (
              <KeywordResearch 
                onAddToTracking={handleAddToTracking}
                onNavigateToTracking={() => setCurrentView('tracking')}
              />
            )}
            {currentView === 'audit' && <TechnicalAudit />}
            {currentView === 'semantic' && (
              <SemanticAnalysis 
                onAddToTracking={handleAddToTracking}
              />
            )}
            {currentView === 'gsc' && <GSCIntegration />}
            {currentView === 'architecture' && <SiteArchitecture />}
            {currentView === 'tracking' && (
              <PositionTracking 
                additionalKeywords={trackedKeywords}
                onAddKeyword={handleAddKeywordToTracking}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;