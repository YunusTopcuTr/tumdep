
import React, { useState } from 'react';
import { Chamber, Region } from '../types';

interface ChamberManagerProps {
  chambers: Chamber[];
  regions: Region[];
  onUpdateChambers: (chambers: Chamber[]) => void;
}

const ChamberManager: React.FC<ChamberManagerProps> = ({ chambers, regions, onUpdateChambers }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Chamber>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const startEdit = (chamber: Chamber) => {
    setEditingId(chamber.id);
    setEditForm(chamber);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    const updated = chambers.map(c => c.id === editingId ? { ...c, ...editForm } as Chamber : c);
    onUpdateChambers(updated);
    setEditingId(null);
  };

  const addNewChamber = () => {
    const newChamber: Chamber = {
      id: `ch-${Date.now()}`,
      name: 'Yeni SMMM Odası',
      city: 'Şehir',
      totalMembers: 0,
      totalDelegates: 0,
      votedDelegatesCount: 0
    };
    onUpdateChambers([...chambers, newChamber]);
    startEdit(newChamber);
  };

  const deleteChamber = (id: string) => {
    if (window.confirm('Bu odayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      onUpdateChambers(chambers.filter(c => c.id !== id));
    }
  };

  const filteredChambers = chambers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">SMMM Odaları Veritabanı</h2>
          <p className="text-slate-500 font-medium italic">Türkiye Genelindeki Tüm Odalar, Üye Sayıları ve 2025 Üst Kurul Delegeleri</p>
        </div>
        <button 
          onClick={addNewChamber}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
        >
          <i className="fa-solid fa-plus mr-2"></i> Yeni Oda Kaydı
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-96">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                    type="text" 
                    placeholder="Oda adı veya şehir ile filtrele..." 
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-100 outline-none font-bold shadow-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Toplam Oda</p>
                    <p className="text-xl font-black text-slate-800">{filteredChambers.length}</p>
                </div>
                <div className="w-[1px] h-8 bg-slate-200"></div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Toplam Üst Kurul Delege</p>
                    <p className="text-xl font-black text-indigo-600">
                        {filteredChambers.reduce((acc, c) => acc + c.totalDelegates, 0)}
                    </p>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-6">Resmi Oda Ünvanı</th>
                <th className="px-8 py-6">Lokasyon</th>
                <th className="px-8 py-6">Stratejik Bölge</th>
                <th className="px-8 py-6 text-center">Üye Sayısı</th>
                <th className="px-8 py-6 text-center">2025 Delege Projeksiyonu</th>
                <th className="px-8 py-6 text-right">Yönetim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChambers.map((chamber) => (
                <tr key={chamber.id} className={`hover:bg-slate-50/50 transition-colors group ${editingId === chamber.id ? 'bg-indigo-50/50' : ''}`}>
                  <td className="px-8 py-5">
                    {editingId === chamber.id ? (
                      <input 
                        className="w-full bg-white border-2 border-indigo-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                        value={editForm.name || ''}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                           {chamber.city.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="font-black text-slate-800 uppercase tracking-tighter text-sm">{chamber.name}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {editingId === chamber.id ? (
                      <input 
                        className="w-full bg-white border-2 border-indigo-200 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                        value={editForm.city || ''}
                        onChange={e => setEditForm({...editForm, city: e.target.value})}
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                        <i className="fa-solid fa-location-dot text-slate-300"></i>
                        {chamber.city}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    {editingId === chamber.id ? (
                      <select 
                        className="w-full bg-white border-2 border-indigo-200 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                        value={editForm.regionId || ''}
                        onChange={e => setEditForm({...editForm, regionId: e.target.value})}
                      >
                        <option value="">Bölge Atanmadı</option>
                        {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {regions.find(r => r.id === chamber.regionId)?.name || 'Genel Saha'}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    {editingId === chamber.id ? (
                      <input 
                        type="number"
                        className="w-24 bg-white border-2 border-indigo-200 rounded-xl px-4 py-2 text-sm font-bold text-center outline-none"
                        value={editForm.totalMembers || 0}
                        onChange={e => setEditForm({...editForm, totalMembers: parseInt(e.target.value) || 0})}
                      />
                    ) : (
                      <span className="font-bold text-slate-700 text-sm">{chamber.totalMembers.toLocaleString('tr-TR')}</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    {editingId === chamber.id ? (
                      <input 
                        type="number"
                        className="w-20 bg-white border-2 border-indigo-200 rounded-xl px-4 py-2 text-sm font-bold text-center outline-none"
                        value={editForm.totalDelegates || 0}
                        onChange={e => setEditForm({...editForm, totalDelegates: parseInt(e.target.value) || 0})}
                      />
                    ) : (
                      <div className="inline-flex items-center gap-2">
                         <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-black shadow-lg shadow-slate-200">{chamber.totalDelegates}</span>
                         <span className="text-[10px] text-slate-400 font-bold uppercase">Delege</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === chamber.id ? (
                        <>
                          <button onClick={saveEdit} className="w-10 h-10 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg shadow-green-100">
                            <i className="fa-solid fa-save"></i>
                          </button>
                          <button onClick={cancelEdit} className="w-10 h-10 rounded-xl bg-slate-200 text-slate-500 hover:bg-slate-300 transition-all">
                            <i className="fa-solid fa-times"></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(chamber)} className="w-10 h-10 rounded-xl hover:bg-indigo-50 text-slate-300 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                            <i className="fa-solid fa-edit text-xs"></i>
                          </button>
                          <button onClick={() => deleteChamber(chamber.id)} className="w-10 h-10 rounded-xl hover:bg-red-50 text-slate-200 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                            <i className="fa-solid fa-trash-alt text-xs"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center text-5xl text-indigo-400 shadow-inner border border-white/10">
                  <i className="fa-solid fa-database"></i>
              </div>
              <div className="flex-1 text-center md:text-left">
                  <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Resmi Veri Mutabakatı</h4>
                  <p className="text-base text-indigo-200/80 leading-relaxed font-medium">
                      Oda listeleri ve üye sayıları TÜRMOB resmi web sitesi (www.turmob.org.tr) temel alınarak oluşturulmuştur. 
                      2025 Genel Kurulu öncesi delege sayıları üye başı delege oranları projeksiyonu ile <span className="text-white font-black underline decoration-indigo-500 underline-offset-4">tahmini</span> olarak hesaplanmaktadır.
                      Lütfen resmi duyurulardan sonra verileri güncelleyiniz.
                  </p>
              </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};

export default ChamberManager;
