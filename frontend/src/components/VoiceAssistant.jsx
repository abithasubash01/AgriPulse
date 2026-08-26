import React, { useState } from 'react';
import { Volume2, X, Play, Square, Mic, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const VoiceAssistant = () => {
  const { isVoiceOpen, setIsVoiceOpen, mandiPrices } = useApp();
  const { lang, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isVoiceOpen) return null;

  const topMandi = mandiPrices[0] || { market: 'Lasalgaon APMC', commodity: 'Onion', modal_price: 2200 };

  const speechText = lang === 'hi' 
    ? `नमस्कार किसान भाई! आज ${topMandi.market} में ${topMandi.commodity} का औसत भाव ${topMandi.modal_price} रुपये प्रति क्विंटल चल रहा है। मौसम साफ है और फसल बेचने के लिए अनुकूल समय है।`
    : `Namaste Farmer! Today at ${topMandi.market}, the modal price for ${topMandi.commodity} is ${topMandi.modal_price} rupees per quintal. Weather is clear for mandi transport.`;

  const handleToggleSpeak = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    } else {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-purple-500/40 p-6 space-y-5 bg-[#0B0F19]/95 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-6 h-6 text-purple-400 animate-pulse" />
            <h3 className="text-xl font-extrabold text-white font-tech">Kisan Voice Assistance</h3>
          </div>
          <button 
            onClick={() => {
              window.speechSynthesis?.cancel();
              setIsPlaying(false);
              setIsVoiceOpen(false);
            }}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-center space-y-3">
          <span className="text-[10px] text-purple-300 font-extrabold uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Voice Narration Payload
          </span>
          <p className="text-sm font-semibold text-white italic">
            "{speechText}"
          </p>
        </div>

        <button
          onClick={handleToggleSpeak}
          className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
            isPlaying
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:brightness-110'
          }`}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Voice Narration</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Listen Live Audio Narration 🔊</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
