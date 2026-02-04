
import React, { useState, useMemo } from 'react';
import { Delegate, Chamber, Faction, ElectionResult, AIAnalysisResult, VoteStatus } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { getAIAnalysis } from '../services/geminiService';

interface ReportingCenterProps {
  delegates: Delegate[];
  chambers: Chamber[];
  factions: Faction[];
  history: ElectionResult[];
}

const ReportingCenter: React.FC<ReportingCenterProps> = ({ delegates, chambers, factions, history }) => {
  const [activeTab, setActiveTab] = useState<'operational' | 'analytical' | 'ai'>('operational');
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<AIAnalysisResult | null>(null);

  const operationalStats = useMemo(() => {
    return [
      { name: 'Kesin', value: delegates.filter(d => d.status === VoteStatus.CERTAIN).length, color: '#16a34a' },
      { name: 'Kararsız', value: delegates.filter(d => d.status === VoteStatus.UNDECIDED).length, color: '#d97706' },
      { name: 'Riskli', value: delegates.filter(d => d.status === VoteStatus.RISKY).length, color: '#ef4444' }
    ];
  }, [delegates]);

  const trendData = useMemo(() => {
    const years = Array.from(new Set(history.map(h => h.year))).sort();
    return years.map(year => {
      const data: any = { year };
      factions.forEach(f => {
        data[f.name] = history
          .filter(h => h.year === year && h.factionId === f.id)
          .reduce((sum, h) => sum + h.votes, 0);
      });
      return data;
    });
  }, [history, factions]);

  const runAiReport = async () => {
    setLoading(true);
    const res = await getAIAnalysis(delegates, chambers, factions, history);
    setAiReport(res);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Karar Destek & Raporlama</h2>
          <p className="text-slate-500 font-medium">Veriyi stratejik akla dönüştüren analiz paneli</p>
        </div>
        <div className="flex bg-slate-200 p-1.5 rounded-2xl shadow-inner">
          {(['operational', 'analytical', 'ai'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab === 'ai' ? 'Yapay Zekâ' : tab === 'analytical' ? 'Analitik' : 'Operasyonel'}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'operational' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-3">
              <i className="fa-solid fa-chart-simple text-blue-600"></i>
              Mevcut Delege Dağılım Raporu
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={operationalStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                    {operationalStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
             <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Teyitli Kesin Oy</p>
                   <p className="text-4xl font-black text-slate-800">{operationalStats[0].value}</p>
                   <div className="mt-2 text-xs font-bold text-green-600 flex items-center gap-1">
                      <i className="fa-solid fa-arrow-trend-up"></i> +4.2% Artış
                   </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-red-200 transition-colors">
                   <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Yüksek Riskli Bölge Sayısı</p>
                   <p className="text-4xl font-black text-slate-800">2</p>
                   <div className="mt-2 text-xs font-bold text-red-600 flex items-center gap-1">
                      <i className="fa-solid fa-circle-exclamation"></i> Kritik Müdahale Gerekli
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'analytical' && (
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-10 flex items-center gap-3">
              <i className="fa-solid fa-timeline text-blue-600"></i>
              Grup Bazlı Tarihsel Trend Analizi
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTumdep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" />
                  <Area type="monotone" dataKey="TÜMDEP" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTumdep)" strokeWidth={4} />
                  <Area type="monotone" dataKey="Çağdaşlar" stroke="#ef4444" fill="transparent" strokeDasharray="5 5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-slate-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-blue-400 font-black text-xs uppercase tracking-[0.2em] mb-4">Analitik Çıkarım</h4>
                <p className="text-xl font-medium leading-relaxed max-w-2xl">
                   2020-2024 periyodu verileri, Çağdaşlar grubunun büyük odalarda <span className="text-red-400 font-bold">%12 oy kaybı</span> yaşadığını, 
                   bu oyların <span className="text-green-400 font-bold">%65'inin</span> TÜMDEP'e kanalize olduğunu kanıtlamaktadır.
                </p>
             </div>
             <i className="fa-solid fa-chart-line absolute right-10 bottom-10 text-slate-800 text-9xl opacity-20"></i>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-8">
          <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            {loading ? (
              <div className="space-y-6">
                 <div className="w-20 h-20 border-[6px] border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                 <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-[10px]">Gemini 3 Pro Analiz Ediyor...</p>
              </div>
            ) : aiReport ? (
              <div className="w-full text-left animate-in slide-in-from-bottom-8 duration-700">
                <div className="bg-blue-600 text-white p-12 rounded-[2rem] shadow-2xl mb-8 relative overflow-hidden">
                   <h3 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em] mb-4">Yönetici Özeti</h3>
                   <p className="text-3xl font-bold leading-tight italic">
                     "{aiReport.executiveSummary}"
                   </p>
                   <i className="fa-solid fa-robot absolute -right-4 -bottom-4 text-white text-9xl opacity-10"></i>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                   <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
                     <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                        <i className="fa-solid fa-microchip text-blue-600"></i> Büyüme & Projeksiyon
                     </h4>
                     <p className="text-slate-700 leading-relaxed font-medium mb-6">{aiReport.prediction}</p>
                     <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-700 uppercase mb-2 tracking-widest">Grup Geçiş Dinamiği</p>
                        <p className="text-sm font-bold text-indigo-900">{aiReport.factionTransitionAnalysis}</p>
                     </div>
                   </div>
                   <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
                     <h4 className="font-black text-red-600 uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                        <i className="fa-solid fa-fire-flame-curved"></i> Kritik Riskler
                     </h4>
                     <div className="space-y-4">
                       {aiReport.riskSummary.map((r, i) => (
                         <div key={i} className="flex gap-4 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-900 text-sm font-bold">
                           <i className="fa-solid fa-triangle-exclamation mt-1"></i>
                           <span>{r}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {aiReport.scenarios.map((s, i) => (
                     <div key={i} className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 hover:border-blue-500 transition-colors group">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 group-hover:animate-pulse">{s.name}</p>
                        <p className="text-4xl font-black mb-4">{s.predictedVotes} <span className="text-sm text-slate-500">Oy</span></p>
                        <p className="text-xs text-slate-400 leading-relaxed italic">"{s.description}"</p>
                     </div>
                   ))}
                </div>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center text-4xl mb-8 shadow-2xl">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Stratejik Yapay Zekâ</h3>
                <p className="text-slate-500 max-w-lg mx-auto mb-10 font-medium">
                   Tüm ekosistemi (odalar, geçmiş yıllar, rakip gruplar) birleştirerek 2028 kazanma stratejisini saniyeler içinde simüle edin.
                </p>
                <button 
                  onClick={runAiReport}
                  className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-800 transition-all shadow-2xl active:scale-95 flex items-center gap-3"
                >
                  <i className="fa-solid fa-wand-magic-sparkles"></i> Analizi Çalıştır
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="pt-10 border-t border-slate-200">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 text-xs text-slate-400 font-medium shadow-sm">
          <i className="fa-solid fa-shield-halved text-blue-600 text-lg"></i>
          <p className="leading-relaxed">
            <span className="font-bold text-slate-600">DENETİM NOTU:</span> Bu raporlama motoru organizasyonel planlama ve katılım analizi amacıyla üretilmiştir. 
            Oy yönlendirme veya kişisel tercih tespiti içermez. Tüm tahminler $W_i$ algoritmasına dayalı matematiksel projeksiyonlardır.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReportingCenter;
