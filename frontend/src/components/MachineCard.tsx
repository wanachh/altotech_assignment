import { MapPin, Activity } from 'lucide-react';

interface MachineCardProps {
  name: string;
  zone: string;
  type: string;
  power: number;
}

export default function MachineCard({ name, zone, type, power }: MachineCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-soft hover:shadow-lg transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-slate-800 text-base">{name}</h4>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded mt-1 inline-block">
            {type}
          </span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
          <Activity className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-50 pt-4">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <p className="text-slate-400 text-[9px] uppercase font-bold tracking-tighter">Location</p>
          </div>
          <p className="font-bold text-slate-700 text-xs">{zone}</p>
        </div>
        <div>
          <p className="text-slate-400 text-[9px] uppercase font-bold tracking-tighter mb-1">Rating</p>
          <p className="font-bold text-slate-700 text-xs">{power} kW</p>
        </div>
      </div>
    </div>
  );
}