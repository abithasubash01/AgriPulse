import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Award, 
  IndianRupee, 
  BookOpen, 
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GOVT_SCHEMES } from '../data/mockMandiData';

export const GovtSchemes = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Schemes Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-3">
        <div>
          <h2 className="text-2xl font-bold text-white font-tech flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#00FF88]" />
            {t('schemes')} & Subsidy Information Portal
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Direct access to official Ministry of Agriculture & Farmers Welfare schemes, Kisan Credit Cards, and crop insurance.
          </p>
        </div>
      </div>

      {/* Schemes Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GOVT_SCHEMES.map((scheme) => (
          <div 
            key={scheme.id}
            className="glass-panel rounded-3xl p-6 border border-gray-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {scheme.tag}
                </span>
                <span className="text-xs text-gray-500 font-mono">Government Verified</span>
              </div>

              <h3 className="text-xl font-extrabold text-white font-tech group-hover:text-[#00FF88] transition-colors">
                {scheme.name}
              </h3>

              {/* Benefit Box */}
              <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Key Financial Benefit</span>
                <p className="text-xs font-bold text-[#00FF88]">{scheme.benefit}</p>
              </div>

              {/* Eligibility */}
              <div className="text-xs text-gray-300 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Eligibility</span>
                <p className="text-gray-300">{scheme.eligibility}</p>
              </div>

            </div>

            <div className="pt-4 border-t border-gray-800/80 flex justify-end">
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/40 transition-all flex items-center gap-1.5"
              >
                <span>Apply / Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
