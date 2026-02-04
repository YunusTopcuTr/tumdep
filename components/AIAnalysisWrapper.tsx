
import React, { useState } from 'react';
import { Delegate, Chamber, Faction, ElectionResult, AIAnalysisResult } from '../types';
import { getAIAnalysis } from '../services/geminiService';

interface AIAnalysisProps {
  delegates: Delegate[];
  chambers: Chamber[];
  factions: Faction[];
  history: ElectionResult[];
}

const AIAnalysisWrapper: React.FC<AIAnalysisProps> = ({ delegates, chambers, factions, history }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    const result = await getAIAnalysis(delegates, chambers, factions, history);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Yapay Zekâ Strateji Üssü</h2>
          <p className="text-slate-500 text-sm">Gemini 3 Pro destekli çok boyutlu seçim analizi</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={loading}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-3 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
        >
          {loading ? (
            <><i className="fa-solid fa-circle-notch fa-spin"></i> Hesaplamalar Yapılıyor...</>
          ) : (
            <><i className="fa-solid fa-brain"></i> Kompleks Analiz Başlat</>
          )}
        </button>
      </header>

      {!analysis && !loading && (
        <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
            <i className="fa-solid fa-microchip"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Çok Boyutlu Analiz Hazır</h3>
          <p className="text-slate-500 max-w-lg mx-auto mb-8">
            Oda yapıları, grup geçmişleri ve delege durumlarını birleştirerek "seçim ekosistemi" analizi yapın.
          </p>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="xl:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tighter">Stratejik Projeksiyon</h3>
              <p className="text-slate-700 leading-relaxed text-lg font-medium italic">
                "{analysis.prediction}"
              </p>
              
              {analysis.factionTransitionAnalysis && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2">Grup Geçiş Analizi (Geçiş Olasılığı)</h4>
                  <p className="text-sm text-indigo-900 leading-relaxed">{analysis.factionTransitionAnalysis}</p>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-8 text-center sm:text-left">
                <div className="flex-1 min-w-[150px]">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Ağırlıklı Puan (Wi)</p>
                  <p className="text-4xl font-black text-blue-600">{analysis.weightedTotalVotes.toFixed(1)}</p>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Tahmini Oy (2028)</p>
                  <p className="text-4xl font-black text-green-600">{analysis.estimatedVotes2028}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
                <i className="fa-solid fa-bullseye text-blue-600"></i>
                Oda Bazlı Mikro Büyüme Fırsatları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.microGrowthTargets.map((target, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-black text-slate-800 text-sm">{target.chamber}</span>
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">+{target.potentialGain} Potansiyel</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">{target.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
             <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl h-fit">
              <h3 className="text-lg font-black mb-6 uppercase tracking-tighter flex items-center gap-2">
                <i className="fa-solid fa-code-merge text-blue-400"></i>
                Senaryo Simülasyonları
              </h3>
              <div className="space-y-4">
                {analysis.scenarios.map((s, idx) => (
                  <div key={idx} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <p className="text-xs font-bold text-blue-400 uppercase mb-1 tracking-widest">{s.name}</p>
                    <p className="text-xl font-black mb-2">{s.predictedVotes} Oy</p>
                    <p className="text-[10px] text-slate-400 leading-snug">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sistem Denetim Notu</h4>
               <p className="text-[10px] text-slate-500 italic leading-relaxed">{analysis.algorithmAuditLog}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisWrapper;
