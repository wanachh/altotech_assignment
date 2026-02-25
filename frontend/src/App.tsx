import { useEffect, useState } from 'react';
import { Zap, LayoutDashboard, Bell, Activity } from 'lucide-react';
import StatCard from './components/StatCard';
import MachineCard from './components/MachineCard';
import EnergyComparison from './components/EnergyComparison';
import TimelineSection from './components/TimelineSection';
import { getBuildingSummary, getEnergyCompare, getMachines, getAILogs } from './services/api';

function App() {
  const [data, setData] = useState<any>({
    summary: { total_power_kw: 0, active_machines: 0, total_machines: 0, average_temperature: 0 },
    compare: { manual_period_kwh: 0, ai_period_kwh: 0, savings_percent: 0 },
    machines: [],
    logs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBuildingSummary(), getEnergyCompare(), getMachines(), getAILogs()])
      .then(([sum, comp, mach, logs]) => {
        setData({
          summary: {
            total_power_kw: sum?.data?.total_power_kw ?? 0,
            active_machines: sum?.data?.active_machines ?? 0,
            total_machines: sum?.data?.total_machines ?? 0,
            average_temperature: sum?.data?.average_temperature ?? 0
          },
          compare: {
            manual_period_kwh: comp?.data?.manual_period_kwh ?? 0,
            ai_period_kwh: comp?.data?.ai_period_kwh ?? 0,
            savings_percent: comp?.data?.savings_percent ?? 0
          },
          machines: mach?.data ?? [],
          logs: (logs?.data ?? []).slice(0, 8)
        });
        setLoading(false);
      }).catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HEADER code remains the same... */}

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {!loading && (
          <>
            <section>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-lg font-bold text-slate-800">Performance Metrics</h2>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">LIVE</span>
              </div>

              {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Real-time Load"
                  value={`${data.summary?.total_power_kw ?? 0} kW`}
                  icon="power"
                />
                <StatCard
                  title="Active Machines" // FIXED NAME
                  value={`${data.summary?.active_machines ?? 0} / ${data.summary?.total_machines ?? 0}`}
                  subtext="Operational"
                  icon="machines"
                />
                <StatCard
                  title="Avg Temperature"
                  value={`${data.summary?.average_temperature ?? 0}°C`}
                  icon="temp"
                />
                <StatCard
                  title="AI Efficiency"
                  value={`${data.compare?.savings_percent ?? 0}%`}
                  subtext="Optimized"
                  icon="efficiency"
                />
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                {data.compare && (
                  <EnergyComparison
                    manual_kwh={data.compare.manual_period_kwh}
                    ai_kwh={data.compare.ai_period_kwh}
                    savings_percent={data.compare.savings_percent}
                  />
                )}

                <section>
                  <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" /> Machine Fleet
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {data.machines.map((m: any) => (
                      <MachineCard key={m.id} name={m.name} zone={m.zone} type={m.machine_type} power={m.rated_power_kw} />
                    ))}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-1" style={{ maxHeight: '500px', overflowY: 'auto', marginLeft: '4%' }}>
                <h2 className="text-lg font-bold text-slate-800 mb-6">System Logs</h2>
                <TimelineSection logs={data.logs} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;