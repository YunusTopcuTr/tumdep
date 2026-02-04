
import React from 'react';

const AlgorithmInfo: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sistem Anayasası ve Hesaplama Algoritması</h2>
        <p className="text-slate-500">Bu sistem, seçim stratejisini matematiksel ve denetlenebilir bir model üzerine kurar.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-calculator text-blue-600"></i>
            Oy Tahmin Formülü (W<sub>i</sub>)
          </h3>
          <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100 font-mono text-center text-xl text-blue-800">
            W<sub>i</sub> = S<sub>i</sub> × T<sub>i</sub> × R<sub>i</sub> × O<sub>i</sub>
          </div>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex gap-4">
              <span className="font-bold text-slate-800 w-12 flex-shrink-0">S<sub>i</sub></span>
              <p><strong>Oy Durumu:</strong> Kesin (1.0), Kararsız (0.55), Riskli (0.25), Olumsuz (0.0)</p>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-slate-800 w-12 flex-shrink-0">T<sub>i</sub></span>
              <p><strong>Temas Katsayısı:</strong> Son temasa göre azalan katsayı (0.40 - 1.00 aralığı)</p>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-slate-800 w-12 flex-shrink-0">R<sub>i</sub></span>
              <p><strong>Risk Faktörü:</strong> 1 - (RiskSkoru / 150). Skoru yüksek olanın oy ağırlığı azalır.</p>
            </div>
            <div className="flex gap-4">
              <span className="font-bold text-slate-800 w-12 flex-shrink-0">O<sub>i</sub></span>
              <p><strong>Oda Etkisi:</strong> TÜMDEP'in o odadaki kurumsal gücüne göre 0.9 - 1.1 çarpanı.</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-shield-halved text-blue-400"></i>
            Veri Saklama ve Güvenlik Politikası
          </h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex gap-3">
              <i className="fa-solid fa-check text-blue-400 mt-1"></i>
              <p><strong>Stateless Mimari:</strong> Hiçbir kritik veri yerel cihazlarda saklanmaz, her oturumda bulut senkronizasyonu zorunludur.</p>
            </li>
            <li className="flex gap-3">
              <i className="fa-solid fa-check text-blue-400 mt-1"></i>
              <p><strong>Hukuki Kalkan:</strong> Sistem kişisel fişleme değil, organizasyonel katılım ve stratejik olasılık hesabı yapar.</p>
            </li>
            <li className="flex gap-3">
              <i className="fa-solid fa-check text-blue-400 mt-1"></i>
              <p><strong>Log Kaydı:</strong> Her türlü veri girişi ve strateji değişikliği "Activity Logs" tablosuna denetlenebilir şekilde işlenir.</p>
            </li>
            <li className="flex gap-3">
              <i className="fa-solid fa-check text-blue-400 mt-1"></i>
              <p><strong>Arşivleme:</strong> Seçimden en geç 6 ay sonra tüm veriler anonimleştirilerek sistem kapatılır.</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl">
        <h3 className="font-bold text-blue-900 mb-2">Stratejik Not</h3>
        <p className="text-blue-700 text-sm">
          "Bu sistem bir manipülasyon aracı değildir. TÜMDEP'in 2028 hedeflerini gerçekleştirmek için kullandığı 
          matematiksel bir organizasyon yönetim platformudur. Tüm tahminler veri temelli ve savunulabilir katsayılar üzerine inşa edilmiştir."
        </p>
      </div>
    </div>
  );
};

export default AlgorithmInfo;
