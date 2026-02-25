import { Clock, type LucideIcon } from 'lucide-react';

interface TimelineLog {
  timestamp: string;
  machine_name: string;
  action_type: string;
  reason: string;
}

interface TimelineSectionProps {
  logs: TimelineLog[];
}

export default function TimelineSection({ logs }: TimelineSectionProps) {
  return (
    <aside className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-50 rounded-lg">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">AI Activity</h2>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-100 before:to-transparent">
        {logs.length > 0 ? (
          logs.map((log, idx) => {
            const isActionOn = log.action_type.includes('ON');
            return (
              <div key={idx} className="relative pl-10 group">
                {/* Status Dot */}
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${
                  isActionOn ? 'bg-emerald-500' : 'bg-slate-300'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>

                <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <time className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      isActionOn ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {log.action_type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">{log.machine_name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{log.reason}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400 italic">Waiting for AI decisions...</p>
          </div>
        )}
      </div>
    </aside>
  );
}