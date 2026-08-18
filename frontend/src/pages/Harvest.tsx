import React, { useEffect, useState } from 'react';
import { Wheat, TrendingUp, CheckCircle2, ArrowDownRight, ArrowUpRight, Scale } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { financeService } from '../services/financeService';
import { Harvest as HarvestType } from '../types';
import { formatCurrency } from '../utils/formatters';

export const Harvest: React.FC = () => {
  const [harvests, setHarvests] = useState<HarvestType[]>([]);

  useEffect(() => {
    financeService.getHarvests().then(setHarvests);
  }, []);

  const totalActualTons = harvests.reduce((acc, h) => acc + h.actualYieldTons, 0);
  const totalPredictedTons = harvests.reduce((acc, h) => acc + h.predictedYieldTons, 0);
  const totalRevenue = harvests.reduce((acc, h) => acc + h.revenue, 0);

  const yieldComparisonData = harvests.map((h) => ({
    name: h.cropName.split(' ')[0],
    Predicted: h.predictedYieldTons,
    Actual: h.actualYieldTons,
  }));

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Harvest & Yield Performance"
        subtitle="Crop harvest output, grain quality grading, storage logs, and predicted vs actual yield variance."
        icon={<Wheat className="w-6 h-6" />}
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Actual Yield</span>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{totalActualTons.toFixed(1)} Tons</h3>
          <p className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 inline" /> Harvested across 3 primary sectors
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ML Forecast Model Target</span>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{totalPredictedTons.toFixed(1)} Tons</h3>
          <p className="text-xs text-slate-500 font-semibold mt-2">Variance: -2.3% (High Model Fidelity)</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Harvest Revenue</span>
          <h3 className="text-3xl font-black text-emerald-700 mt-1">{formatCurrency(totalRevenue)}</h3>
          <p className="text-xs text-emerald-700 font-semibold mt-2">100% contracted to accredited buyers</p>
        </div>
      </div>

      {/* Flagship Feature: PREDICTED VS ACTUAL YIELD VISUALIZATION */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-agri-50/30 rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Predicted vs Actual Yield Accuracy</h3>
            <p className="text-xs text-slate-500">Comparison of machine learning predictions vs scale weight output (Metric Tons)</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-agri-100 text-agri-800 rounded-full border border-agri-200">
            ML Model Accuracy: 97.4%
          </span>
        </div>

        {/* Highlighted Variance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {harvests.map((h) => {
            const isPos = h.differencePercent >= 0;
            return (
              <div key={h.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-slate-900">{h.cropName}</span>
                  <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
                    isPos ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {isPos ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {h.differencePercent}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                  <span>Predicted: <strong>{h.predictedYieldTons} Tons</strong></span>
                  <span>Actual: <strong>{h.actualYieldTons} Tons</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yieldComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="Predicted" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Harvest Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Crop Produce</th>
                <th className="py-3.5 px-4">Field Sector</th>
                <th className="py-3.5 px-4">Harvest Date</th>
                <th className="py-3.5 px-4">Yield Quantity</th>
                <th className="py-3.5 px-4">Quality Grade</th>
                <th className="py-3.5 px-4">Storage Location</th>
                <th className="py-3.5 px-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {harvests.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">{h.cropName}</td>
                  <td className="py-4 px-4 font-medium text-slate-700">{h.fieldName}</td>
                  <td className="py-4 px-4 text-slate-600">{h.harvestDate}</td>
                  <td className="py-4 px-4 font-extrabold text-slate-900">{h.actualYieldTons} Tons</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={h.qualityGrade} />
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{h.storageLocation}</td>
                  <td className="py-4 px-4 text-right font-extrabold text-emerald-700">+{formatCurrency(h.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
