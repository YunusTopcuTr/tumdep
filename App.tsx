
import React, { useState, useEffect, useMemo } from 'react';
import { Delegate, UserRole, Chamber, Faction, ElectionResult, AuditLog, ElectionPeriod, User, AuthScopeType, Region } from './types';
import { 
  INITIAL_DELEGATES, 
  INITIAL_CHAMBERS, 
  INITIAL_FACTIONS, 
  INITIAL_HISTORICAL_RESULTS,
  INITIAL_ELECTION_PERIODS,
  INITIAL_USERS,
  INITIAL_REGIONS
} from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DelegateManager from './components/DelegateManager';
import ReportingCenter from './components/ReportingCenter';
import ChamberManager from './components/ChamberManager';
import RegionManager from './components/RegionManager';
import FactionManager from './components/FactionManager';
import UserManager from './components/UserManager';
import AlgorithmInfo from './components/AlgorithmInfo';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [delegates, setDelegates] = useState<Delegate[]>(INITIAL_DELEGATES);
  const [chambers, setChambers] = useState<Chamber[]>(INITIAL_CHAMBERS);
  const [regions, setRegions] = useState<Region[]>(INITIAL_REGIONS);
  const [factions, setFactions] = useState<Faction[]>(INITIAL_FACTIONS);
  const [periods, setPeriods] = useState<ElectionPeriod[]>(INITIAL_ELECTION_PERIODS);
  const [history, setHistory] = useState<ElectionResult[]>(INITIAL_HISTORICAL_RESULTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- KRİTİK VERİ FİLTRELEME KATMANI ---
  const filteredChambers = useMemo(() => {
    if (currentUser.scopeType === AuthScopeType.GLOBAL) return chambers;
    if (currentUser.scopeType === AuthScopeType.REGION) {
      return chambers.filter(c => c.regionId === currentUser.scopeId);
    }
    if (currentUser.scopeType === AuthScopeType.CHAMBER) {
      return chambers.filter(c => c.id === currentUser.scopeId);
    }
    return [];
  }, [currentUser, chambers]);

  const filteredChamberIds = useMemo(() => filteredChambers.map(c => c.id), [filteredChambers]);

  const filteredDelegates = useMemo(() => {
    return delegates.filter(d => filteredChamberIds.includes(d.chamberId));
  }, [delegates, filteredChamberIds]);

  const filteredHistory = useMemo(() => {
    return history.filter(h => filteredChamberIds.includes(h.chamberId));
  }, [history, filteredChamberIds]);

  const handleUpdateDelegate = (id: string, updates: Partial<Delegate>) => {
    setDelegates(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      action: 'DELEGE_GUNCELLEME',
      details: `Kullanıcı (${currentUser.name}) delege ${id} verilerini güncelledi.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white text-center p-8">
        <div className="w-20 h-20 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin mb-8 shadow-2xl"></div>
        <h2 className="text-2xl font-black uppercase tracking-[0.5em]">TÜMDEP 2028</h2>
        <p className="text-slate-500 mt-4 font-bold text-xs uppercase tracking-widest italic">Yetkilendirme Kontrolü Yapılıyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        userRole={currentUser.role} 
      />
      
      <main className="flex-1 ml-72 p-12 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto pb-24">
          
          <div className="mb-10 p-6 bg-white border-2 border-indigo-100 rounded-3xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-lg">
                <i className="fa-solid fa-id-card-clip"></i>
              </div>
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-0.5">Test Ortamı: Kimliğe Bürün</span>
                <p className="text-sm font-bold text-slate-800">Sistemi farklı bir yetki kapsamıyla test edin:</p>
              </div>
            </div>
            <div className="flex gap-2">
              {users.map(u => (
                <button 
                  key={u.id}
                  onClick={() => setCurrentUser(u)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm ${currentUser.id === u.id ? 'bg-indigo-600 text-white scale-105' : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                  {u.name.split(' ')[0]} ({u.scopeType})
                </button>
              ))}
            </div>
          </div>

          {currentView === 'dashboard' && <Dashboard delegates={filteredDelegates} />}
          
          {currentView === 'reporting' && (
            <ReportingCenter 
              delegates={filteredDelegates} 
              chambers={filteredChambers} 
              factions={factions} 
              history={filteredHistory} 
            />
          )}

          {currentView === 'regions' && (
            <RegionManager 
              regions={regions} 
              chambers={chambers} 
              onUpdateRegions={setRegions} 
              onUpdateChambers={setChambers} 
            />
          )}

          {currentView === 'chambers' && (
            <ChamberManager 
              chambers={filteredChambers} 
              regions={regions}
              onUpdateChambers={setChambers}
            />
          )}
          
          {currentView === 'delegates' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <header>
                  <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Delege Yönetimi</h2>
                  <p className="text-slate-500 font-medium italic">Yetki Kapsamı: <span className="text-indigo-600 font-bold">{currentUser.scopeType} {currentUser.scopeId ? `(${currentUser.scopeId})` : ''}</span></p>
               </header>
               <DelegateManager 
                 delegates={filteredDelegates} 
                 onUpdate={handleUpdateDelegate} 
                 chambers={filteredChambers} 
               />
            </div>
          )}
          
          {currentView === 'factions' && (
            <FactionManager 
              factions={factions} 
              history={filteredHistory} 
              chambers={filteredChambers} 
              periods={periods}
              onUpdateFactions={setFactions}
              onUpdatePeriods={setPeriods}
              onUpdateResults={setHistory}
            />
          )}

          {currentView === 'users' && (
            <UserManager 
              users={users} 
              chambers={chambers} 
              regions={regions}
              onUpdateUsers={setUsers} 
            />
          )}

          {currentView === 'algorithm' && <AlgorithmInfo />}
        </div>
      </main>

      <div className="fixed bottom-8 right-8 bg-slate-950 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-10 z-50 border border-slate-800 backdrop-blur-2xl bg-opacity-90 animate-in slide-in-from-right-8 duration-500">
         <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
                <i className="fa-solid fa-user-shield text-indigo-500 text-xs"></i>
                <span className="text-[11px] font-black uppercase tracking-widest text-white">{currentUser.name}</span>
            </div>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.1em]">
                {currentUser.scopeType} {currentUser.scopeId ? `| ${currentUser.scopeId}` : ''}
            </span>
         </div>
         <div className="h-8 w-[1px] bg-slate-800"></div>
         <div className="flex items-center gap-4">
            <div className="text-center">
                <p className="text-[10px] font-black text-indigo-400 leading-none">{filteredDelegates.length}</p>
                <p className="text-[7px] text-slate-500 font-bold uppercase mt-1">Erişilebilir Kayıt</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] font-black text-green-400 leading-none">{auditLogs.length}</p>
                <p className="text-[7px] text-slate-500 font-bold uppercase mt-1">Audit Log</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default App;
