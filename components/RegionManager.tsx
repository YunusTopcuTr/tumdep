
import React, { useState } from 'react';
import { Region, Chamber } from '../types';

interface RegionManagerProps {
  regions: Region[];
  chambers: Chamber[];
  onUpdateRegions: (regions: Region[]) => void;
  onUpdateChambers: (chambers: Chamber[]) => void;
}

const RegionManager: React.FC<RegionManagerProps> = ({ regions, chambers, onUpdateRegions, onUpdateChambers }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRegion, setNewRegion] = useState<Partial<Region>>({});

  const addRegion = () => {
    if (!newRegion.name) return;
    const region: Region = {
      id: `reg-${Date.now()}`,
      name: newRegion.name,
      description: newRegion.description || '',
    };
    onUpdateRegions([...regions, region]);
    setIsAdding(false);
    setNewRegion({});
  };

  const updateChamberRegion = (chamberId: string, regionId: string | undefined) => {
    onUpdateChambers(chambers.map(c => c.id === chamberId ? { ...c, regionId } : c));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Bölge & Koordinasyon Yönetimi</h2>
          <p className="text-slate-500 font-medium">Odaları stratejik bölgeler altında gruplayın</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
        >
          <i className="fa-solid fa-map-location-dot mr-2"></i> Yeni Bölge Tanımla
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bölge Adı</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 outline-none font-bold"
                placeholder="Örn: Güney Marmara"
                value={newRegion.name || ''}
                onChange={e => setNewRegion({...newRegion, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Açıklama</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 outline-none font-bold"
                placeholder="Bölge stratejik notu..."
                value={newRegion.description || ''}
                onChange={e => setNewRegion({...newRegion, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button onClick={() => setIsAdding(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">İptal</button>
            <button onClick={addRegion} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">Bölgeyi Kaydet</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {regions.map(region => {
          const regionChambers = chambers.filter(c => c.regionId === region.id);
          return (
            <div key={region.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
                    {region.name}
                    <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                        {regionChambers.length} Oda
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{region.description}</p>
                </div>
                <div className="flex gap-2">
                   <button className="w-8 h-8 rounded-lg hover:bg-slate-50 text-slate-300 hover:text-slate-600 transition-all">
                     <i className="fa-solid fa-pen text-xs"></i>
                   </button>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Bağlı Odalar</p>
                {regionChambers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {regionChambers.map(c => (
                      <div key={c.id} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100 text-[10px] font-black uppercase flex items-center gap-2">
                        {c.name}
                        <button onClick={() => updateChamberRegion(c.id, undefined)} className="hover:text-red-500 transition-colors">
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Bu bölgeye atanmış oda bulunmuyor.</p>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Yeni Oda Ekle</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none"
                  value=""
                  onChange={e => e.target.value && updateChamberRegion(e.target.value, region.id)}
                >
                  <option value="">Seçim Yapın...</option>
                  {chambers.filter(c => c.regionId !== region.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.regionId ? '(Aktif Bölgesi Var)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionManager;
