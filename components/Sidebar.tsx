import React from 'react';
import { LayoutDashboard, Image as ImageIcon, Video, Library, Settings, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.IMAGE_GEN, label: 'Image Gen', icon: ImageIcon },
    { id: AppView.VIDEO_GEN, label: 'Video Gen', icon: Video },
    { id: AppView.LIBRARY, label: 'Library', icon: Library },
    { id: AppView.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-royal-950 border-r border-royal-800/50 flex flex-col shadow-2xl z-20 relative">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)]">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gold-text tracking-wide">
          SADIG AI
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-royal-800 to-royal-900 border border-gold-500/30 shadow-[0_0_15px_rgba(202,138,4,0.1)]'
                  : 'hover:bg-royal-900/50 hover:pl-5'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-gold-200'
                }`}
              />
              <span
                className={`font-medium tracking-wide ${
                  isActive ? 'text-gold-100' : 'text-slate-400 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-royal-800/30">
        <div className="p-4 rounded-xl bg-gradient-to-br from-royal-800/50 to-royal-900/50 border border-gold-500/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-gold-200/80">System Online</span>
          </div>
          <div className="w-full bg-royal-950 rounded-full h-1.5 mt-2">
            <div className="bg-gold-500 h-1.5 rounded-full w-3/4 shadow-[0_0_10px_rgba(202,138,4,0.5)]"></div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-right">75% Credits Used</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;