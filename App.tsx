import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import Library from './components/Library';
import { AppView, GeneratedMedia } from './types';
import { Bell, Search, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [library, setLibrary] = useState<GeneratedMedia[]>([]);

  const handleSaveMedia = (media: GeneratedMedia) => {
    setLibrary(prev => [media, ...prev]);
  };

  const handleDeleteMedia = (id: string) => {
      setLibrary(prev => prev.filter(item => item.id !== id));
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard recentMedia={library} onNavigate={setCurrentView} />;
      case AppView.IMAGE_GEN:
        return <ImageGenerator onSave={handleSaveMedia} />;
      case AppView.VIDEO_GEN:
        return <VideoGenerator onSave={handleSaveMedia} />;
      case AppView.LIBRARY:
        return <Library items={library} onDelete={handleDeleteMedia} />;
      case AppView.SETTINGS:
        return <div className="p-10 text-center text-slate-400">Settings Module - Coming Soon</div>;
      default:
        return <Dashboard recentMedia={library} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-royal-950 text-slate-200 font-sans overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-royal-800/20 blur-[100px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold-600/5 blur-[100px]"></div>
      </div>

      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      <main className="flex-1 flex flex-col relative z-10">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-royal-800/50 bg-royal-950/80 backdrop-blur-sm flex items-center justify-between px-8">
            <div className="flex items-center text-slate-400 text-sm">
                <span className="text-gold-500 font-medium mr-2">SADIG AI</span> / <span className="ml-2 capitalize">{currentView.toLowerCase().replace('_', ' ')}</span>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <Search className="w-5 h-5 text-slate-400 group-hover:text-gold-400 transition-colors cursor-pointer" />
                </div>
                <div className="relative group">
                    <Bell className="w-5 h-5 text-slate-400 group-hover:text-gold-400 transition-colors cursor-pointer" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 border border-gold-300 flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 text-royal-950" />
                </div>
            </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;