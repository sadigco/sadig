import React, { useState } from 'react';
import { Wand2, Download, Share2, Maximize2, Loader2, ImageIcon } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { GeneratedMedia } from '../types';

interface ImageGeneratorProps {
  onSave: (media: GeneratedMedia) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setGeneratedImage(null);

    try {
      const base64Image = await generateImage(prompt, aspectRatio);
      if (base64Image) {
        setGeneratedImage(base64Image);
        const newMedia: GeneratedMedia = {
          id: Date.now().toString(),
          type: 'image',
          url: base64Image,
          prompt: prompt,
          createdAt: Date.now(),
          aspectRatio
        };
        onSave(newMedia);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      {/* Control Panel */}
      <div className="w-full lg:w-96 bg-royal-900/30 backdrop-blur-md border-r border-royal-800/50 p-6 flex flex-col gap-6 overflow-y-auto z-10">
        <div>
          <h2 className="text-2xl font-serif text-gold-100 mb-1">Image Studio</h2>
          <p className="text-sm text-slate-400">Transform text into visual reality.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vision in detail..."
            className="w-full h-32 bg-royal-950/50 border border-royal-700 rounded-xl p-4 text-slate-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 focus:outline-none resize-none placeholder:text-slate-600 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {['1:1', '16:9', '4:3', '3:4', '9:16'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                  aspectRatio === ratio
                    ? 'bg-gold-500 text-royal-950 border-gold-500'
                    : 'bg-transparent border-royal-700 text-slate-400 hover:border-gold-500/50 hover:text-gold-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gold-500 uppercase tracking-widest">Style Preset</label>
          <div className="flex flex-wrap gap-2">
             {['Cinematic', 'Photorealistic', 'Anime', 'Oil Painting', 'Cyberpunk'].map((style) => (
               <button 
                  key={style}
                  onClick={() => setPrompt(prev => prev + `, ${style} style`)}
                  className="px-3 py-1 rounded-full bg-royal-800 border border-royal-700 text-xs text-slate-300 hover:border-gold-500 hover:text-gold-300 transition-colors"
               >
                 {style}
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1"></div>

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
            loading || !prompt
              ? 'bg-royal-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-gold-500 to-yellow-600 text-royal-950 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:scale-[1.02]'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="w-5 h-5" />}
          {loading ? 'Dreaming...' : 'Generate'}
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-8 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-opacity-5 relative">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-royal-900/20 to-royal-950/90 pointer-events-none"></div>
        
        {generatedImage ? (
          <div className="relative group max-w-3xl w-full animate-in fade-in zoom-in duration-500">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-600 to-amber-300 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-royal-950 rounded-xl overflow-hidden border border-royal-700 shadow-2xl">
              <img src={generatedImage} alt="Generated" className="w-full h-auto object-contain max-h-[80vh]" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center">
                <p className="text-white text-sm line-clamp-1 max-w-[60%]">{prompt}</p>
                <div className="flex gap-2">
                   <button className="p-2 rounded-full bg-white/10 hover:bg-gold-500 hover:text-royal-950 transition-colors text-white">
                     <Download className="w-4 h-4" />
                   </button>
                   <button className="p-2 rounded-full bg-white/10 hover:bg-gold-500 hover:text-royal-950 transition-colors text-white">
                     <Share2 className="w-4 h-4" />
                   </button>
                   <button className="p-2 rounded-full bg-white/10 hover:bg-gold-500 hover:text-royal-950 transition-colors text-white">
                     <Maximize2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 opacity-40">
            <div className="w-24 h-24 rounded-full bg-royal-800 mx-auto flex items-center justify-center border border-royal-700">
              <ImageIcon className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-400 font-light text-lg">Your canvas awaits.<br />Enter a prompt to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
