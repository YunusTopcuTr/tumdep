
import React, { useState } from 'react';
import { User, UserRole, AuthScopeType, Chamber, Region } from '../types';

interface UserManagerProps {
  users: User[];
  chambers: Chamber[];
  regions: Region[];
  onUpdateUsers: (users: User[]) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, chambers, regions, onUpdateUsers }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    role: UserRole.MANAGER,
    scopeType: AuthScopeType.CHAMBER,
    isActive: true
  });

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    const user: User = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role || UserRole.MANAGER,
      scopeType: newUser.scopeType || AuthScopeType.CHAMBER,
      scopeId: newUser.scopeId,
      isActive: true
    };
    onUpdateUsers([...users, user]);
    setIsAdding(false);
    setNewUser({
        role: UserRole.MANAGER,
        scopeType: AuthScopeType.CHAMBER,
        isActive: true
    });
  };

  const deleteUser = (id: string) => {
    if(window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz? Tüm yetkileri iptal edilecektir.')) {
        onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  const getScopeLabel = (user: User) => {
    if (user.scopeType === AuthScopeType.GLOBAL) return 'Genel Merkez (Tüm Türkiye)';
    if (user.scopeType === AuthScopeType.REGION) {
      const region = regions.find(r => r.id === user.scopeId);
      return `Bölge Bazlı Yetki: ${region?.name || 'Bilinmiyor'}`;
    }
    if (user.scopeType === AuthScopeType.CHAMBER) {
      const chamber = chambers.find(c => c.id === user.scopeId);
      return `Oda Bazlı Yetki: ${chamber?.name || 'Oda Seçilmedi'}`;
    }
    return 'Tanımsız Kapsam';
  };

  const roleLabels = {
    [UserRole.ADMIN]: 'Yönetici (Full)',
    [UserRole.STRATEGY]: 'Strateji / Analiz',
    [UserRole.MANAGER]: 'Saha / Veri Girişi',
    [UserRole.AUDITOR]: 'Gözlemci / Denetçi'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Yetkilendirme Paneli</h2>
          <p className="text-slate-500 font-medium">Yeni personel tanımlayın ve veri görme yetkilerini kısıtlayın</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
        >
          <i className="fa-solid fa-user-plus mr-2"></i> Yeni Personel Ekle
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ad Soyad</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 outline-none font-bold"
                placeholder="Personel Adı"
                onChange={e => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-Posta (Login)</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 outline-none font-bold"
                placeholder="mail@tumdep.org"
                onChange={e => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fonksiyonel Rol</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 outline-none font-bold"
                onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
              >
                <option value={UserRole.MANAGER}>Saha Yöneticisi</option>
                <option value={UserRole.STRATEGY}>Strateji Uzmanı</option>
                <option value={UserRole.ADMIN}>Admin</option>
                <option value={UserRole.AUDITOR}>Denetçi</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Veri Görme Kapsamı</label>
              <div className="flex gap-2">
                <select 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-xs"
                  onChange={e => setNewUser({...newUser, scopeType: e.target.value as AuthScopeType})}
                >
                  <option value={AuthScopeType.CHAMBER}>Oda Bazlı</option>
                  <option value={AuthScopeType.REGION}>Bölge Bazlı</option>
                  <option value={AuthScopeType.GLOBAL}>Tüm Türkiye</option>
                </select>
                {newUser.scopeType === AuthScopeType.CHAMBER && (
                  <select 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-[10px]"
                    onChange={e => setNewUser({...newUser, scopeId: e.target.value})}
                  >
                    <option value="">Oda Seçin</option>
                    {chambers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
                {newUser.scopeType === AuthScopeType.REGION && (
                  <select 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-3 focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-[10px]"
                    onChange={e => setNewUser({...newUser, scopeId: e.target.value})}
                  >
                    <option value="">Bölge Seçin</option>
                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button onClick={() => setIsAdding(false)} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">Vazgeç</button>
            <button onClick={addUser} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">Yetkiyi Tanımla</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personel Bilgileri</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sistem Rolü</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Veri Görme Sınırı</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Durum</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Yönetim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shadow-sm">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="font-black text-slate-800 uppercase tracking-tighter text-sm">{u.name}</div>
                      <div className="text-xs text-slate-400 font-medium">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                    u.role === UserRole.ADMIN ? 'bg-red-50 text-red-600 border-red-100' :
                    u.role === UserRole.STRATEGY ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {roleLabels[u.role]}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-50 text-slate-400 ${u.scopeType === AuthScopeType.GLOBAL ? 'text-indigo-500' : ''}`}>
                      <i className={`fa-solid ${
                        u.scopeType === AuthScopeType.GLOBAL ? 'fa-globe-asia' :
                        u.scopeType === AuthScopeType.REGION ? 'fa-map-pin' :
                        'fa-building-shield'
                      } text-sm`}></i>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{getScopeLabel(u)}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase">Aktif</span>
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200">
                        <i className="fa-solid fa-user-pen text-xs"></i>
                    </button>
                    <button onClick={() => deleteUser(u.id)} className="w-9 h-9 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-600 transition-all border border-transparent hover:border-red-100">
                        <i className="fa-solid fa-user-minus text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
