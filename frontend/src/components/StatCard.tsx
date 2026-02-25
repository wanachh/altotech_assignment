import { Zap, Wind, Thermometer, Cpu, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: 'power' | 'machines' | 'temp' | 'efficiency';
}

const iconMap: Record<string, LucideIcon> = {
  power: Zap,
  machines: Wind,
  temp: Thermometer,
  efficiency: Cpu
};

export default function StatCard({ title, value, subtext, icon = 'power' }: StatCardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft hover:shadow-md transition-all duration-300 group min-h-[140px] flex flex-col justify-between overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors break-words">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors flex-shrink-0">
          <Icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>

      {subtext && (
        <div className="mt-4 flex items-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide truncate">
            {subtext}
          </p>
        </div>
      )}
    </div>
  );
}