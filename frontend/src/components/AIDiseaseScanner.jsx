import React, { useState } from 'react';
import { 
  ScanLine, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CROP_DISEASE_PRESETS } from '../data/mockMandiData';

export const AIDiseaseScanner = () => {
  const { t } = useLanguage();
  const [selectedPreset, setSelectedPreset] = useState(CROP_DISEASE_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [customImage, setCustomImage] = useState(null);

  const handleSelectPreset = (preset) => {
    setIsScanning(true);
    setCustomImage(null);
    setTimeout(() => {
      setSelectedPreset(preset);
      setIsScanning(false);
    }, 800);
  };

  const handleSimulatedUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const fakeUrl = URL.createObjectURL(file);
      setCustomImage(fakeUrl);
      setTimeout(() => {
        setSelectedPreset({
          id: "custom-" + Date.now(),
          crop: "Uploaded Crop Leaf",
          diseaseName: "Early Stage Leaf Spot (Cercospora)",
          severity: "Mild (Monitor)",
          confidence: "91.8%",
          symptoms: "Small circular brown spots appearing near leaf margins.",
          treatment: "Spray Neem Oil 1500 ppm @ 3ml/L water or Copper Fungicide spray.",
          image: fakeUrl
        });
        setIsScanning(false);
      }, 1200);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Scanner Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-tech flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-[#00FF88]" />
            AI Leaf Disease Diagnostic Scanner
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Upload or select a photo of your infected crop leaf for instant neural-network disease diagnosis & treatment recommendations.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-bold text-gray-400">Sample Leaf Scans:</span>
          {CROP_DISEASE_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedPreset.id === p.id && !customImage
                  ? 'bg-[#00FF88] text-black shadow-[0_0_12px_rgba(0,255,136,0.4)]'
                  : 'bg-gray-900 text-gray-300 border border-gray-800 hover:border-cyan-500/40'
              }`}
            >
              <span>🌱</span>
              <span>{p.crop} - {p.diseaseName.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Upload Dropzone / Photo Display */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/20 flex flex-col justify-between space-y-4 relative overflow-hidden">
          
          <div className="relative h-64 w-full rounded-2xl bg-gray-950 border border-dashed border-gray-800 overflow-hidden flex items-center justify-center group">
            {isScanning ? (
              <div className="flex flex-col items-center space-y-3 text-cyan-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-xs font-mono font-bold animate-pulse">Neural Net Analysing Leaf Features...</span>
              </div>
            ) : (
              <>
                <img 
                  src={customImage || selectedPreset.image} 
                  alt="Infected leaf" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 text-xs font-mono font-bold text-[#00FF88] bg-black/80 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                  Target Lens Active 🔍
                </div>
              </>
            )}
          </div>

          {/* Upload Button */}
          <label className="w-full py-3 rounded-2xl bg-gray-900 border border-cyan-500/40 text-xs font-bold text-cyan-300 hover:bg-cyan-950 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-inner">
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Your Own Crop Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleSimulatedUpload} 
              className="hidden" 
            />
          </label>

        </div>

        {/* AI Diagnostics Report Card */}
        <div className="glass-panel glass-card-glow-cyan rounded-3xl p-6 border border-cyan-500/30 flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#00FF88]" />
                <h3 className="text-lg font-bold text-white font-tech">AI Diagnostic Verdict</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#00FF88] text-black font-mono">
                {selectedPreset.confidence} Confidence
              </span>
            </div>

            {/* Disease Name & Severity */}
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Identified Pathogen / Pest</span>
              <h3 className="text-2xl font-extrabold text-white font-tech mt-1 text-[#00FF88]">
                {selectedPreset.diseaseName}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-400">Severity:</span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-950 text-red-400 border border-red-500/30">
                  {selectedPreset.severity}
                </span>
              </div>
            </div>

            {/* Symptoms */}
            <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-1">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Observed Symptoms</span>
              <p className="text-xs text-gray-200">{selectedPreset.symptoms}</p>
            </div>

            {/* Recommended Treatment Dosage */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
              <span className="text-[10px] text-[#00FF88] uppercase font-bold tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Bio / Chemical Treatment
              </span>
              <p className="text-xs text-white font-semibold">{selectedPreset.treatment}</p>
            </div>

          </div>

          <div className="text-[11px] text-gray-500 italic text-center pt-2">
            Verified by Krishi Vigyan Kendra (KVK) Agricultural Standards
          </div>

        </div>

      </div>

    </div>
  );
};
