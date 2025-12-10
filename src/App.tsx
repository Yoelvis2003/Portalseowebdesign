import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
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
  | 'dashboard' 
  | 'keywords' 
  | 'audit' 
  | 'semantic' 
  | 'gsc' 
  | 'architecture' 
  | 'tracking';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentProject, setCurrentProject] = useState<string>('Portal UCI');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentProject={currentProject} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'dashboard' && (
            <Dashboard onNavigate={setCurrentView} onSelectProject={setCurrentProject} />
          )}
          {currentView === 'keywords' && <KeywordResearch />}
          {currentView === 'audit' && <TechnicalAudit />}
          {currentView === 'semantic' && <SemanticAnalysis />}
          {currentView === 'gsc' && <GSCIntegration />}
          {currentView === 'architecture' && <SiteArchitecture />}
          {currentView === 'tracking' && <PositionTracking />}
        </main>
      </div>
    </div>
  );
}

export default App;
