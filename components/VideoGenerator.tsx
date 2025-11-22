import React, { useState, useEffect } from 'react';
import { Film, Loader2, AlertCircle, CheckCircle, Play } from 'lucide-react';
import { generateVideo, checkHasSelectedKey, openKeySelection } from '../services/geminiService';
import { GeneratedMedia } from '../types';

interface VideoGeneratorProps {
  onSave: (media: GeneratedMedia) => void;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onSave }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Initial check
    checkHasSelectedKey().then(setHasKey);
  }, []);

  const handleConnectBilling = async () => {
    try {
      await openKeySelection();
      // According to instructions: assume success and proceed.
      setHasKey(true);
    } catch (e) {
      console.error(e);
      alert("Could not select project.");
    }
  };

  const handleGenerate = async () => {
    if (!hasKey) {
      await handleConnectBilling();
      return;
    }
    
    if (!prompt.trim()) return;
    
    setLoading(true);
    setGeneratedVideoUrl(null);
    setStatusMessage("Initializing Veo Model...");

    try {
      // Need to fetch the key again essentially by knowing it's in process.env
      // BUT Veo instructions say "users must select their own paid API key".
      // The 'process.env.API_KEY' is injected automatically after selection in the AI Studio environment.
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
          // If strictly following instructions, we assume process.env.API_KEY is populated after selection
          // However, to be safe in code structure, we pass it.
          throw new Error("API Key not found after selection.");
      }

      setStatusMessage("Dreaming up frames...");
      const videoUrl = await generateVideo(prompt, apiKey);
      
      if (videoUrl) {
        setGeneratedVideoUrl(videoUrl);
        const newMedia: GeneratedMedia = {
            id: Date.now().toString(),
            type: 'video',
            url: videoUrl,
            prompt: prompt,
            createdAt: Date.now(),
            aspectRatio: '16:9'
        };
        onSave(newMedia);
      } else {
          throw new Error("No video returned");
      }

    } catch (e) {
      console.error(e);
      setStatusMessage("Error generating video. Ensure billing is enabled.");
      // Reset key state if 404 not found (as per prompt instructions for Veo)
      if (e instanceof Error && e.message.includes("Requested entity was not found")) {
          setHasKey(false);
          setStatusMessage("Session expired. Please reconnect billing.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 max-w-5xl mx-auto w-full animate-fade-in">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gold-500/10 rounded-full mb-4 border border-gold-500/30">
          <Film className="w-8 h-8 text-gold-400" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-2">Veo Video Studio</h2>
        <p className="text-slate-400 max-w-lg mx-auto">Create high-definition, AI-generated videos with the power of Google Veo. <br/> <span className="text-gold-500/80 text-xs">Paid GCP Project Required</span></p>
      </div>

      {!hasKey ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 bg-royal-900/30 rounded-2xl border border-royal-700 p-12 backdrop-blur-sm">
           <AlertCircle className="w-16 h-16 text-gold-500 mb-4" />
           <h3 className="text-xl font-bold text-white">Billing Authorization Required</h3>
           <p className="text-slate-400 text-center max-w-md">To access Veo video generation, you must select a Google Cloud Project with billing enabled.</p>
           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-xs text-gold-600 hover:underline mb-4">Read Billing Documentation</a>
           
           <button 
             onClick={handleConnectBilling}
             className="px-8 py-4 bg-gradient-to-r from-gold-500 to-yellow-600 text-royal-950 font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
           >
             Select API Key Project
           </button>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Side */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gold-500 uppercase tracking-wider">Video Prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A futuristic city with flying cars in neon rain, cinematic 4k..."
                        className="w-full h-40 bg-royal-950/50 border border-royal-700 rounded-xl p-4 text-slate-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 focus:outline-none resize-none"
                    />
                </div>
                
                <div className="p-4 bg-royal-900/40 rounded-xl border border-royal-800">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Settings Ready</h4>
                    <div className="text-xs text-slate-400 grid grid-cols-2 gap-2">
                        <div className="bg-royal-950 px-3 py-2 rounded border border-royal-800">Model: Veo-3.1</div>
                        <div className="bg-royal-950 px-3 py-2 rounded border border-royal-800">Res: 720p (Preview)</div>
                        <div className="bg-royal-950 px-3 py-2 rounded border border-royal-800">Ratio: 16:9</div>
                        <div className="bg-royal-950 px-3 py-2 rounded border border-royal-800">Length: ~5s</div>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                        loading || !prompt
                        ? 'bg-royal-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gold-500 to-yellow-600 text-royal-950 hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:scale-[1.02]'
                    }`}
                    >
                    {loading ? <Loader2 className="animate-spin" /> : <Film className="w-5 h-5" />}
                    {loading ? 'Producing Video...' : 'Generate Video'}
                </button>
                
                {loading && (
                    <p className="text-center text-gold-400 text-sm animate-pulse">{statusMessage}</p>
                )}
            </div>

            {/* Output Side */}
            <div className="bg-black/40 rounded-2xl border border-royal-800 flex items-center justify-center relative overflow-hidden min-h-[300px]">
                {generatedVideoUrl ? (
                    <video 
                        src={generatedVideoUrl} 
                        controls 
                        autoPlay 
                        loop 
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <div className="text-center p-6 opacity-30">
                         <Film className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                         <p className="text-slate-500">Video preview will appear here</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
