
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  colorClass: string;
  subValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, subValue }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-800">{value}</h3>
          {subValue && <p className="text-xs text-slate-400 mt-1 font-medium">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
          <i className={`fa-solid ${icon} ${colorClass.replace('bg-', 'text-')}`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
