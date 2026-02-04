
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Yönetim Paneli', icon: 'fa-gauge' },
    { id: 'reporting', label: 'Analiz & Raporlar', icon: 'fa-file-invoice-pie' },
    { id: 'regions', label: 'Bölge Yönetimi', icon: 'fa-map-location-dot' },
    { id: 'chambers', label: 'Odalar & Birimler', icon: 'fa-building-columns' },
    { id: 'delegates', label: 'Delege Portföyü', icon: 'fa-users-gear' },
    { id: 'factions', label: 'Gruplar & Tarihçe', icon: 'fa-layer-group' },
    { id: 'users', label: 'Yetki Yönetimi', icon: 'fa-user-lock' },
    { id: 'algorithm', label: 'Sistem Anayasası', icon: 'fa-scroll' },
  ];

  const roleLabels = {
    [UserRole.ADMIN]: 'Sistem Yöneticisi',
    [UserRole.STRATEGY]: 'Strateji Uzmanı',
    [UserRole.MANAGER]: 'Saha Yöneticisi',
    [UserRole.AUDITOR]: 'Sistem Denetçisi'
  };

  return (
    <div className="w-72 bg-slate-950 h-screen text-slate-400 fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      <div className="p-8 flex items-center gap-4 border-b border-slate-900/50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="font-black text-white text-2xl tracking-tighter">T</span>
        </div>
        <div>
          <h1 className="text-lg font-black text-white leading-tight uppercase tracking-tighter">TÜMDEP</h1>
          <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.2em]">Seçim Sistemi</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-8 px-5 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg w-6 ${currentView === item.id ? 'text-white' : 'text-slate-600 group-hover:text-white'}`}></i>
            <span className={`text-[11px] font-black uppercase tracking-widest ${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-slate-900/50">
        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <i className="fa-solid fa-user-shield text-indigo-400"></i>
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{roleLabels[userRole]}</p>
            <p className="text-[9px] text-slate-600 uppercase font-bold">Güvenli Oturum</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
