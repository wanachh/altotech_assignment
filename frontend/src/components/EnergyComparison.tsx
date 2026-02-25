import { TrendingDown, CheckCircle, Zap } from 'lucide-react';

interface EnergyComparisonProps {
  manual_kwh: number;
  ai_kwh: number;
  savings_percent: number;
}

export default function EnergyComparison({ manual_kwh, ai_kwh }: EnergyComparisonProps) {
  const improvement = Math.round(((manual_kwh - ai_kwh) / manual_kwh) * 100) || 0;

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-50 rounded-xl">
          <TrendingDown className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Energy Consumption Analysis</h2>
          <p className="text-sm text-slate-500">Manual vs AI Performance (7-day period)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">Manual Control</p>
          <p className="text-4xl font-bold text-slate-700">
            {manual_kwh.toFixed(1)} <span className="text-lg font-medium text-slate-400">kWh</span>
          </p>
        </div>

        <div className="p-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold text-indigo-100 uppercase">AI Optimized</p>
              <CheckCircle className="w-5 h-5 text-indigo-200" />
            </div>
            <p className="text-4xl font-bold">
              {ai_kwh.toFixed(1)} <span className="text-lg font-medium text-indigo-200">kWh</span>
            </p>
          </div>
          <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-700">Total Efficiency Gained</p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-emerald-600">{isNaN(improvement) ? 0 : improvement}%</span>
          {/* show if improvement is positive */}
          {improvement > 0 && (
            <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Reduced</span>
          )}
        </div>
      </div>
    </section>
  );
}