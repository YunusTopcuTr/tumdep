
import React, { useState } from 'react';
import { Delegate, VoteStatus, Chamber } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';

interface DelegateManagerProps {
  delegates: Delegate[];
  onUpdate: (id: string, updates: Partial<Delegate>) => void;
  chambers: Chamber[];
}

const DelegateManager: React.FC<DelegateManagerProps> = ({ delegates, onUpdate, chambers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterGroup, setFilterGroup] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const getChamberInfo = (chamberId: string) => {
    return chambers.find(c => c.id === chamberId) || { name: 'Bilinmiyor', city: 'Bilinmiyor' };
  };

  const filteredDelegates = delegates.filter(d => {
    const chamberInfo = getChamberInfo(d.chamberId);
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         chamberInfo.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chamberInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.tendency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || d.status === filterStatus;
    const matchesGroup = filterGroup === 'ALL' || d.currentGroup === filterGroup;
    return matchesSearch && matchesStatus && matchesGroup;
  });

  const handleStartEditTendency = (delegate: Delegate) => {
    setEditingId(delegate.id);
    setEditValue(delegate.tendency);
  };

  const handleSaveTendency = (id: string) => {
    onUpdate(id, { tendency: editValue });
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-lg text-slate-800">Delege Portföyü</h3>
          <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{filteredDelegates.length} Kayıt</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              placeholder="Ara (İsim, Şehir, Eğilim)..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Tüm Durumlar</option>
            {Object.values(VoteStatus).map(status => (
              <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="ALL">Tüm Gruplar</option>
            <option value="f-01">TÜMDEP</option>
            <option value="f-02">Çağdaşlar</option>
            <option value="f-03">Bağımsızlar</option>
            <option value="f-04">Meslekte Birlik</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Delege / Aidiyet</th>
              <th className="px-6 py-4">İl & Oda</th>
              <th className="px-6 py-4">Mevcut Eğilim</th>
              <th className="px-6 py-4">Risk Skoru</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDelegates.map((delegate) => {
              const chamberInfo = getChamberInfo(delegate.chamberId);
              const isEditing = editingId === delegate.id;

              return (
                <tr key={delegate.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-black text-slate-800 uppercase tracking-tighter text-sm">{delegate.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${delegate.currentGroup === 'f-01' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {delegate.currentGroup}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold">Eski: {delegate.previousGroup || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700 text-xs">{chamberInfo.city}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-tighter truncate max-w-[150px]">{chamberInfo.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input 
                          autoFocus
                          className="bg-white border border-indigo-200 rounded px-2 py-1 text-xs font-bold focus:ring-2 focus:ring-indigo-100 outline-none w-32"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTendency(delegate.id)}
                        />
                        <button onClick={() => handleSaveTendency(delegate.id)} className="text-green-600 hover:text-green-700">
                          <i className="fa-solid fa-check-circle"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group/tend">
                        <span className="text-xs font-bold text-slate-600 italic bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                           {delegate.tendency || 'Belirtilmedi'}
                        </span>
                        <button 
                          onClick={() => handleStartEditTendency(delegate)}
                          className="text-slate-300 hover:text-indigo-600 opacity-0 group-hover/tend:opacity-100 transition-opacity"
                        >
                          <i className="fa-solid fa-pen text-[10px]"></i>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${delegate.riskScore > 70 ? 'bg-red-500' : delegate.riskScore > 30 ? 'bg-amber-500' : 'bg-green-500'}`}
                          style={{ width: `${delegate.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500">%{delegate.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border-2 shadow-sm ${STATUS_COLORS[delegate.status]}`}>
                      {STATUS_LABELS[delegate.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onUpdate(delegate.id, { status: VoteStatus.CERTAIN, riskScore: 0, tendency: 'TÜMDEP Sadık' })}
                        className="w-8 h-8 flex items-center justify-center hover:bg-green-50 text-green-600 rounded-xl transition-all border border-transparent hover:border-green-100"
                        title="Kesinleştir"
                      >
                        <i className="fa-solid fa-user-check text-xs"></i>
                      </button>
                      <button 
                        onClick={() => onUpdate(delegate.id, { riskScore: Math.min(delegate.riskScore + 15, 100), status: delegate.riskScore > 50 ? VoteStatus.RISKY : delegate.status })}
                        className="w-8 h-8 flex items-center justify-center hover:bg-orange-50 text-orange-600 rounded-xl transition-all border border-transparent hover:border-orange-100"
                        title="Riski Artır"
                      >
                        <i className="fa-solid fa-triangle-exclamation text-xs"></i>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-indigo-50 text-indigo-500 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                        <i className="fa-solid fa-notes-medical text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DelegateManager;
