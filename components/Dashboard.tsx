import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, Zap, Clock, Star } from 'lucide-react';
import { GeneratedMedia, AppView } from '../types';

const data = [
  { name: 'Mon', gens: 12 },
  { name: 'Tue', gens: 19 },
  { name: 'Wed', gens: 3 },
  { name: 'Thu', gens: 25 },
  { name: 'Fri', gens: 15 },
  { name: 'Sat', gens: 30 },
  { name: 'Sun', gens: 22 },
];

interface DashboardProps {
  recentMedia: GeneratedMedia[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ recentMedia, onNavigate }) => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-float">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-bold text-white mb-2">Welcome back, Creator</h2>
          <p className="text-slate-400">Your creative studio is ready for new masterpieces.</p>
        </div>
        <button 
          onClick={() => onNavigate(AppView.IMAGE_GEN)}
          className="group flex items-center gap-2 px-6 py-3 bg-gold-500 text-royal-950 font-bold rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:bg-gold-400 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
        >
          <Zap className="w-5 h-5" />
          <span>Quick Create</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-royal-900/40 backdrop-blur-sm border border-royal-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <h3 className="text-xl font-serif text-gold-100 mb-6">Generation Activity</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  tick={{ fill: '#94a3b8' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(234, 179, 8, 0.1)' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ca8a04', color: '#fde047' }}
                  itemStyle={{ color: '#fde047' }}
                />
                <Bar dataKey="gens" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? '#ca8a04' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-royal-800 to-royal-900 border border-gold-500/20 rounded-2xl p-6 shadow-lg transform transition hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-royal-950 border border-royal-700">
                <Star className="text-gold-400 w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-gold-500/20 text-gold-300">+12%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">1,284</div>
            <p className="text-sm text-slate-400">Total Images Generated</p>
          </div>

          <div className="bg-gradient-to-br from-royal-800 to-royal-900 border border-gold-500/20 rounded-2xl p-6 shadow-lg transform transition hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-royal-950 border border-royal-700">
                <Clock className="text-blue-400 w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300">Active</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">12.5h</div>
            <p className="text-sm text-slate-400">Studio Time This Week</p>
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-serif text-white">Recent Masterpieces</h3>
          <button 
            onClick={() => onNavigate(AppView.LIBRARY)}
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm font-medium"
          >
            View Library <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentMedia.length > 0 ? (
            recentMedia.slice(0, 4).map((media) => (
              <div key={media.id} className="group relative aspect-square rounded-xl overflow-hidden border border-royal-700 cursor-pointer">
                {media.type === 'video' ? (
                    <video src={media.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" muted loop onMouseOver={e => e.currentTarget.play()} onMouseOut={e => e.currentTarget.pause()} />
                ) : (
                    <img src={media.url} alt={media.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-sm line-clamp-1 font-medium">{media.prompt}</p>
                  <p className="text-gold-400 text-xs uppercase tracking-wider mt-1">{media.type}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 h-32 flex items-center justify-center border border-dashed border-royal-700 rounded-xl bg-royal-900/20">
                <p className="text-slate-500">No creations yet. Start generating!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
