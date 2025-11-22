import React from 'react';
import { GeneratedMedia } from '../types';
import { Download, Trash2, Play } from 'lucide-react';

interface LibraryProps {
  items: GeneratedMedia[];
  onDelete: (id: string) => void;
}

const Library: React.FC<LibraryProps> = ({ items, onDelete }) => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-3xl font-serif font-bold text-white mb-8">Your Library</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group bg-royal-900/50 border border-royal-700 rounded-xl overflow-hidden hover:border-gold-500/50 transition-all hover:shadow-lg hover:shadow-gold-500/10">
            <div className="aspect-square relative bg-royal-950">
              {item.type === 'video' ? (
                <>
                    <video src={item.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <Play className="w-5 h-5 text-white ml-1" />
                        </div>
                    </div>
                </>
              ) : (
                <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <a href={item.url} download={`sadig-ai-${item.id}`} className="p-3 rounded-full bg-white/10 hover:bg-gold-500 text-white hover:text-royal-950 transition-colors">
                    <Download className="w-5 h-5" />
                </a>
                <button onClick={() => onDelete(item.id)} className="p-3 rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors">
                    <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${item.type === 'video' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                        {item.type}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-300 line-clamp-2 font-light">{item.prompt}</p>
            </div>
          </div>
        ))}
        
        {items.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
                <p className="text-lg">Library is empty.</p>
                <p className="text-sm">Start creating to populate your collection.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Library;