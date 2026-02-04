
import React from 'react';
import { Delegate, VoteStatus } from '../types';
import { TARGET_VOTES, STATUS_COLORS, STATUS_LABELS } from '../constants';
import StatCard from './StatCard';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

interface DashboardProps {
  delegates: Delegate[];
}

const Dashboard: React.FC<DashboardProps> = ({ delegates }) => {
  const certainCount = delegates.filter(d => d.status === VoteStatus.CERTAIN).length;
  
  const calculateWeightedVote = (d: Delegate) => {
    let s = 0;
    if (d.status === VoteStatus.CERTAIN) s = 1.0;
    else if (d.status === VoteStatus.UNDECIDED) s = 0.55;
    else if (d.status === VoteStatus.RISKY) s = 0.25;

    const lastContact = new Date(d.lastContactDate);
    const diffDays = Math.floor((new Date().getTime() - lastContact.getTime()) / (1000 * 3600 * 24));
    let t = diffDays <= 30 ? 1.0 : diffDays <= 60 ? 0.85 : 0.65;

    return s * t * (1 - (d.riskScore / 150));
  };

  const weightedTotal = delegates.reduce((acc, d) => acc + calculateWeightedVote(d), 0);
  const progress = (weightedTotal / TARGET_VOTES) * 100;

  const pieData = [
    { name: 'Kesin', value: certainCount, color: '#16a34a' },
    { name: 'Kararsız', value: delegates.filter(d => d.status === VoteStatus.UNDECIDED).length, color: '#d97706' },
    { name: 'Riskli', value: delegates.filter(d => d.status === VoteStatus.RISKY).length, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Karar Merkezi</h2>
          <p className="text-slate-500 font-medium italic">Matematiksel Projeksiyon & Büyüme Takibi</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-slate-700 px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            <i className="fa-solid fa-file-export mr-2"></i> Raporu İndir
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ağırlıklı Oy ($W_i$)" value={weightedTotal.toFixed(1)} icon="fa-calculator" colorClass="bg-indigo-600" subValue="Matematiksel Tahmin" />
        <StatCard title="Kesinleşenler" value={certainCount} icon="fa-user-check" colorClass="bg-green-600" subValue="Teyitli Delegeler" />
        <StatCard title="Risk Skoru (Ort)" value="32/100" icon="fa-gauge-high" colorClass="bg-red-600" subValue="Saha Güven Endeksi" />
        <StatCard title="Kritik Odalar" value="4" icon="fa-building-circle-check" colorClass="bg-blue-600" subValue="Müdahale Bekleyen" />
      </div>

      <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-3">
              Kazanma Eşiği İlerlemesi
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-widest">Hedef: 450+</span>
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xl">
              Saha verilerine göre <span className="font-bold text-slate-900">450 delege eşiğine</span> olan uzaklık ağırlıklı katsayılarla hesaplanmaktadır. 
              Mevcut büyüme hızıyla hedef tarihe <span className="text-green-600 font-bold">12 gün önce</span> ulaşılmaktadır.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                <span className="text-indigo-600">İlerleme: %{progress.toFixed(1)}</span>
                <span className="text-slate-400">{weightedTotal.toFixed(0)} / {TARGET_VOTES}</span>
              </div>
              <div className="w-full bg-slate-100 h-6 rounded-2xl overflow-hidden p-1.5 border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 h-full rounded-xl transition-all duration-1000 shadow-lg relative"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  <div className="absolute top-0 right-0 w-3 h-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center lg:border-l border-slate-100 lg:pl-12">
            <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-100 w-full group-hover:bg-indigo-50/50 transition-colors">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Kalan Net Delege</p>
              <p className="text-6xl font-black text-slate-800 tracking-tighter">{Math.max(TARGET_VOTES - certainCount, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <h4 className="font-black text-slate-700 mb-8 uppercase tracking-widest text-xs">Potansiyel Dağılımı</h4>
           <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 bg-slate-900 text-white p-10 rounded-3xl shadow-xl flex flex-col justify-center">
           <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-6">Sistem Mesajı</h4>
           <div className="space-y-6">
              <div className="flex gap-4 items-start">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-bolt-lightning text-yellow-400"></i>
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    "Kararsız delege oranımız İstanbul bölgesinde <span className="text-white font-bold">%18 azaldı</span>. Bu oyların büyük kısmı 'Kesin' durumuna geçti."
                 </p>
              </div>
              <div className="flex gap-4 items-start">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-shield-halved text-blue-400"></i>
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    "2024 tarihsel trendlerine göre <span className="text-white font-bold">Meslekte Birlik</span> grubundan oy kayması ihtimali %22'ye yükseldi."
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
