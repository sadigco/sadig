import { GoogleGenAI } from "@google/genai";

// Helper to get the AI Client. 
// NOTE: For Veo, we need to regenerate this client after key selection.
export const getAiClient = (apiKey?: string) => {
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    console.warn("API Key is missing in process.env");
  }
  return new GoogleGenAI({ apiKey: key || '' });
};

// --- Image Generation ---
export const generateImage = async (
  prompt: string,
  aspectRatio: string = "1:1"
): Promise<string | null> => {
  try {
    const ai = getAiClient();
    // Using 'gemini-2.5-flash-image' for standard generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    // Parse response for image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

// --- Video Generation (Veo) ---
export const generateVideo = async (
  prompt: string,
  apiKey: string // Veo requires user-selected key
): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Polling loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) return null;

    // Fetch the actual video blob using the key
    const downloadUrl = `${videoUri}&key=${apiKey}`;
    const response = await fetch(downloadUrl);
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};

// --- AI Studio Key Management Helpers ---

export const checkHasSelectedKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const openKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  } else {
    alert("AI Studio Key Selection interface not available in this environment.");
  }
};