
import React, { useState } from 'react';
import { Delegate, AIAnalysisResult, Chamber, Faction, ElectionResult } from '../types';
import { getAIAnalysis } from '../services/geminiService';

interface AIAnalysisProps {
  delegates: Delegate[];
  chambers: Chamber[];
  factions: Faction[];
  history: ElectionResult[];
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ delegates, chambers, factions, history }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    // Fixed: getAIAnalysis now receives all 4 required arguments as defined in geminiService.ts
    const result = await getAIAnalysis(delegates, chambers, factions, history);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Yapay Zekâ Strateji Üssü</h2>
          <p className="text-slate-500 text-sm">Gemini 3 Pro destekli tahminleme ve risk yönetimi</p>
        </div>
        <button 
          onClick={runAnalysis}
          disabled={loading}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-3 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
        >
          {loading ? (
            <><i className="fa-solid fa-circle-notch fa-spin"></i> Analiz Hazırlanıyor...</>
          ) : (
            <><i className="fa-solid fa-brain"></i> Yeni Strateji Üret</>
          )}
        </button>
      </header>

      {!analysis && !loading && (
        <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
            <i className="fa-solid fa-bolt-lightning"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Stratejik Akıl Hazır</h3>
          <p className="text-slate-500 max-w-lg mx-auto mb-8">
            Veri havuzunuzu analiz ederek 2028 oda seçimleri için kazanma projeksiyonu ve mikro büyüme hedefleri oluşturun.
          </p>
          <button 
            onClick={runAnalysis}
            className="text-blue-600 font-bold hover:underline"
          >
            Sanal Danışmanı Başlat
          </button>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Main Executive Summary */}
          <div className="xl:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <i className="fa-solid fa-quote-right text-6xl text-slate-400"></i>
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tighter">Yönetici Özeti</h3>
              <p className="text-slate-700 leading-relaxed text-lg font-medium italic">
                "{analysis.prediction}"
              </p>
              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-8">
                <div className="flex-1 min-w-[150px]">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Ağırlıklı Oy (W<sub>i</sub>)</p>
                  <p className="text-4xl font-black text-blue-600">{analysis.weightedTotalVotes.toFixed(1)} <span className="text-sm font-bold text-slate-400">Puan</span></p>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Projeksiyon (2028)</p>
                  <p className="text-4xl font-black text-green-600">{analysis.estimatedVotes2028}</p>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Kazanma Olasılığı</p>
                  <p className="text-4xl font-black text-indigo-600">%72</p>
                </div>
              </div>
            </div>

            {/* Audit Log / Justification */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Denetim Notu (Hesaplama Metodu)</h4>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                {analysis.algorithmAuditLog}
              </p>
            </div>

            {/* Micro Growth Targets */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
                <i className="fa-solid fa-crosshairs text-blue-600"></i>
                Mikro Büyüme Hedefleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.microGrowthTargets.map((target, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-black text-slate-800 text-sm">{target.chamber}</span>
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">+{target.potentialGain} Oy</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">{target.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {analysis.scenarios.map((scenario, idx) => (
                 <div key={idx} className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest">Senaryo Analizi</p>
                      <h4 className="text-xl font-bold mb-4">{scenario.name}</h4>
                      <p className="text-sm text-slate-400 mb-6 leading-relaxed italic">"{scenario.description}"</p>
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-800 p-3 rounded-2xl flex-1 text-center border border-slate-700">
                          <p className="text-[10px] text-slate-500 uppercase mb-1">Tahmini Sonuç</p>
                          <p className="text-2xl font-black">{scenario.predictedVotes} Oy</p>
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Side Alerts & Suggestions */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100 shadow-sm h-fit">
              <h3 className="text-lg font-black text-red-800 mb-6 uppercase tracking-tighter flex items-center gap-2">
                <i className="fa-solid fa-fire text-red-600"></i>
                Yüksek Riskli Bölgeler
              </h3>
              <div className="space-y-6">
                {analysis.riskSummary.map((r, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0 animate-pulse"></div>
                    <p className="text-sm font-semibold text-red-900 leading-snug">{r}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 bg-white text-red-700 py-3 rounded-2xl border-2 border-red-200 font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 shadow-sm">
                Kriz Masasını Aç
              </button>
            </div>

            <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
              <h3 className="text-lg font-black mb-6 uppercase tracking-tighter flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-yellow-300"></i>
                Günün Hamlesi
              </h3>
              <p className="text-sm leading-relaxed mb-8 font-medium">
                {analysis.strategicSuggestions[0] || "Veri girişi arttıkça stratejik hamleler burada görünecektir."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
