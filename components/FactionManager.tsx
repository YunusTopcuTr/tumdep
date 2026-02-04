
import React, { useState } from 'react';
import { Faction, ElectionResult, Chamber, ElectionPeriod } from '../types';

interface FactionManagerProps {
  factions: Faction[];
  history: ElectionResult[];
  chambers: Chamber[];
  periods: ElectionPeriod[];
  onUpdateFactions: (factions: Faction[]) => void;
  onUpdatePeriods: (periods: ElectionPeriod[]) => void;
  onUpdateResults: (results: ElectionResult[]) => void;
}

const FactionManager: React.FC<FactionManagerProps> = ({ 
  factions, 
  history, 
  chambers, 
  periods,
  onUpdateFactions,
  onUpdatePeriods,
  onUpdateResults
}) => {
  const [activeSection, setActiveSection] = useState<'factions' | 'periods' | 'data-entry'>('factions');
  const [selectedPeriodId, setSelectedPeriodId] = useState(periods.find(p => p.isActive)?.id || periods[0]?.id);

  // Faction Handlers
  const addFaction = () => {
    const newFaction: Faction = {
      id: `f-${Date.now()}`,
      name: 'Yeni Grup',
      description: 'Açıklama giriniz...',
      color: '#cbd5e1'
    };
    onUpdateFactions([...factions, newFaction]);
  };

  // Period Handlers
  const addPeriod = () => {
    const newPeriod: ElectionPeriod = {
      id: `ep-${Date.now()}`,
      year: new Date().getFullYear(),
      label: `${new Date().getFullYear()} Seçimleri`,
      isActive: false,
      totalDelegates: 450
    };
    onUpdatePeriods([...periods, newPeriod]);
  };

  const setPeriodActive = (id: string) => {
    onUpdatePeriods(periods.map(p => ({ ...p, isActive: p.id === id })));
  };

  // Vote Entry Handlers
  const handleVoteChange = (chamberId: string, factionId: string, votes: number) => {
    const existingIndex = history.findIndex(h => h.periodId === selectedPeriodId && h.chamberId === chamberId && h.factionId === factionId);
    let newHistory = [...history];
    // Fix: Ensure the year property is always present
    const currentPeriod = periods.find(p => p.id === selectedPeriodId);
    const year = currentPeriod ? currentPeriod.year : new Date().getFullYear();

    if (existingIndex > -1) {
      newHistory[existingIndex] = { ...newHistory[existingIndex], votes, year };
    } else {
      newHistory.push({
        id: `res-${Date.now()}`,
        periodId: selectedPeriodId,
        year,
        chamberId,
        factionId,
        votes
      });
    }
    onUpdateResults(newHistory);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Ekosistem Yönetimi</h2>
          <p className="text-slate-500 font-medium">Gruplar, dönemler ve tarihsel veri girişi</p>
        </div>
        <div className="flex bg-slate-200 p-1.5 rounded-2xl shadow-inner">
          <button 
            onClick={() => setActiveSection('factions')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'factions' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Gruplar
          </button>
          <button 
            onClick={() => setActiveSection('periods')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'periods' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Dönemler
          </button>
          <button 
            onClick={() => setActiveSection('data-entry')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'data-entry' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Veri Girişi
          </button>
        </div>
      </header>

      {/* FACTIONS SECTION */}
      {activeSection === 'factions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Seçime Girecek Gruplar</h3>
            <button onClick={addFaction} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">+ Yeni Grup Ekle</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factions.map(f => (
              <div key={f.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg" style={{ backgroundColor: f.color }}>
                    {f.name[0]}
                  </div>
                  <div>
                    <input 
                      className="font-black text-slate-800 uppercase tracking-tighter bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-100 rounded px-1" 
                      value={f.name} 
                      onChange={(e) => onUpdateFactions(factions.map(fx => fx.id === f.id ? { ...fx, name: e.target.value } : fx))}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="color" 
                        value={f.color} 
                        onChange={(e) => onUpdateFactions(factions.map(fx => fx.id === f.id ? { ...fx, color: e.target.value } : fx))}
                        className="w-4 h-4 rounded-full overflow-hidden border-none p-0 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Grup Rengi</span>
                    </div>
                  </div>
                </div>
                <textarea 
                  className="w-full text-xs text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 focus:outline-none h-20"
                  value={f.description}
                  onChange={(e) => onUpdateFactions(factions.map(fx => fx.id === f.id ? { ...fx, description: e.target.value } : fx))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PERIODS SECTION */}
      {activeSection === 'periods' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Seçim Dönemleri</h3>
            <button onClick={addPeriod} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">+ Yeni Dönem Aç</button>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dönem Etiketi</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Yıl</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Delege Sayısı</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Durum</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.map(p => (
                  <tr key={p.id} className={p.isActive ? 'bg-blue-50/30' : ''}>
                    <td className="px-8 py-5">
                      <input 
                        className="font-bold text-slate-800 bg-transparent focus:outline-none" 
                        value={p.label} 
                        onChange={(e) => onUpdatePeriods(periods.map(px => px.id === p.id ? { ...px, label: e.target.value } : px))}
                      />
                    </td>
                    <td className="px-8 py-5 text-center">
                      <input 
                        type="number"
                        className="w-16 font-bold text-slate-800 bg-transparent text-center focus:outline-none" 
                        value={p.year} 
                        onChange={(e) => onUpdatePeriods(periods.map(px => px.id === p.id ? { ...px, year: parseInt(e.target.value) } : px))}
                      />
                    </td>
                    <td className="px-8 py-5 text-center font-bold text-slate-800">{p.totalDelegates}</td>
                    <td className="px-8 py-5 text-center">
                      {p.isActive ? (
                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Aktif Seçim</span>
                      ) : (
                        <span className="text-slate-300 text-[10px] font-black uppercase">Arşiv</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {!p.isActive && (
                        <button 
                          onClick={() => setPeriodActive(p.id)}
                          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                          Aktif Yap
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DATA ENTRY SECTION */}
      {activeSection === 'data-entry' && (
        <div className="space-y-6">
          <header className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Sonuç Giriş Matrisi</h3>
            <select 
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
            >
              {periods.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </header>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Oda (Birim)</th>
                    {factions.map(f => (
                      <th key={f.id} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }}></div>
                          {f.name}
                        </div>
                      </th>
                    ))}
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Kayıtlı Oy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chambers.map(c => {
                    const totalEntered = factions.reduce((sum, f) => {
                      const res = history.find(h => h.periodId === selectedPeriodId && h.chamberId === c.id && h.factionId === f.id);
                      return sum + (res ? res.votes : 0);
                    }, 0);

                    return (
                      <tr key={c.id}>
                        <td className="px-8 py-5 font-black text-slate-800 text-sm uppercase">{c.name}</td>
                        {factions.map(f => {
                          const result = history.find(h => h.periodId === selectedPeriodId && h.chamberId === c.id && h.factionId === f.id);
                          return (
                            <td key={f.id} className="px-8 py-5">
                              <input 
                                type="number"
                                className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 text-center text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                value={result ? result.votes : 0}
                                onChange={(e) => handleVoteChange(c.id, f.id, parseInt(e.target.value) || 0)}
                              />
                            </td>
                          );
                        })}
                        <td className="px-8 py-5 text-right">
                          <span className={`text-xs font-black ${totalEntered > c.totalDelegates ? 'text-red-600' : 'text-slate-400'}`}>
                            {totalEntered} / {c.totalDelegates}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-slate-50 flex items-center gap-4 border-t border-slate-100">
              <i className="fa-solid fa-circle-info text-blue-600"></i>
              <p className="text-xs text-slate-500 italic">
                Bu matrise girdiğiniz veriler AI Analiz motoru tarafından tarihsel trend hesaplamalarında baz alınacaktır. 
                Lütfen resmi sonuçlarla uyumlu olduğundan emin olun.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FactionManager;
