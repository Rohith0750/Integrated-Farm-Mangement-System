import React, { useEffect, useState } from 'react';
import { FlaskConical, Plus, Activity, Droplets, Thermometer, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PageHeader } from '../components/common/PageHeader';
import { FormModal } from '../components/common/FormModal';
import { SearchBar } from '../components/common/SearchBar';
import { soilService } from '../services/soilService';
import { SoilRecord } from '../types';
import { useToast } from '../hooks/useToast';

export const Soil: React.FC = () => {
  const { showToast } = useToast();
  const [soilRecords, setSoilRecords] = useState<SoilRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [fieldName, setFieldName] = useState('Field A - Tomato Plot');
  const [nitrogen, setNitrogen] = useState('42');
  const [phosphorus, setPhosphorus] = useState('38');
  const [potassium, setPotassium] = useState('55');
  const [pH, setPH] = useState('6.5');
  const [moisture, setMoisture] = useState('28');
  const [organicMatter, setOrganicMatter] = useState('3.4');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSoilRecords();
  }, []);

  const loadSoilRecords = async () => {
    const data = await soilService.getSoilRecords();
    setSoilRecords(data);
  };

  const handleAddSoilRecord = async (e: React.FormEvent) => {
    e.preventDefault();

    await soilService.addSoilRecord({
      fieldName,
      nitrogen: parseFloat(nitrogen) || 40,
      phosphorus: parseFloat(phosphorus) || 35,
      potassium: parseFloat(potassium) || 45,
      pH: parseFloat(pH) || 6.5,
      moisture: parseFloat(moisture) || 25,
      organicMatter: parseFloat(organicMatter) || 3.0,
      notes,
    });

    showToast('Soil Telemetry Saved', 'Soil test sample added to historical ledger.', 'success');
    setIsAddOpen(false);
    loadSoilRecords();
  };

  const latestRecord = soilRecords[0] || {
    nitrogen: 42,
    phosphorus: 38,
    potassium: 55,
    pH: 6.5,
    moisture: 28,
    organicMatter: 3.4,
    healthScore: 84,
  };

  const npkChartData = soilRecords.map((r) => ({
    name: r.fieldName.split('-')[0].trim(),
    Nitrogen: r.nitrogen,
    Phosphorus: r.phosphorus,
    Potassium: r.potassium,
  }));

  const filteredRecords = soilRecords.filter(
    (s) =>
      s.fieldName.toLowerCase().includes(search.toLowerCase()) ||
      (s.notes && s.notes.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Soil Telemetry & NPK Chemistry"
        subtitle="Soil fertility indices, macronutrient balance, pH levels, and historical testing ledger."
        icon={<FlaskConical className="w-6 h-6" />}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Soil Record
          </button>
        }
      />

      {/* Soil Health Score & Telemetry Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Soil Health Score Banner */}
        <div className="bg-gradient-to-br from-agri-900 via-agri-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-agri-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-agri-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-agri-200">Composite Soil Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">{latestRecord.healthScore}</span>
              <span className="text-lg font-bold text-agri-300">/ 100</span>
            </div>
            <p className="text-xs text-agri-100 mt-2">
              Overall soil chemical & biological health evaluated as <strong className="text-white">Optimal</strong>.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-agri-700/60 text-[11px] text-agri-300">
            Field A - Tomato Plot (Tested Aug 15, 2026)
          </div>
        </div>

        {/* NPK Values Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Nitrogen (N)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{latestRecord.nitrogen} <span className="text-xs text-slate-400 font-semibold">mg/kg</span></span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Good</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(latestRecord.nitrogen / 60) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Phosphorus (P)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{latestRecord.phosphorus} <span className="text-xs text-slate-400 font-semibold">mg/kg</span></span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Moderate</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(latestRecord.phosphorus / 50) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Potassium (K)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{latestRecord.potassium} <span className="text-xs text-slate-400 font-semibold">mg/kg</span></span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">High</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${(latestRecord.potassium / 70) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Soil pH</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{latestRecord.pH}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Neutral</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Optimal range: 6.0 – 7.2</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Volumetric Moisture</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{latestRecord.moisture}%</span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">Adequate</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Capillary field capacity</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Organic Matter</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{latestRecord.organicMatter}%</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Rich</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Humus & microbial content</p>
          </div>
        </div>
      </div>

      {/* NPK Bar Chart Visualization */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Field Sector NPK Distribution Comparison</h3>
        <p className="text-xs text-slate-500 mb-4">Nitrogen, Phosphorus, and Potassium levels across active fields (mg/kg)</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={npkChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="Nitrogen" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Phosphorus" fill="#eab308" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Potassium" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search & History Table */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search field soil test history..." />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Field Sector</th>
                <th className="py-3.5 px-4">Test Date</th>
                <th className="py-3.5 px-4">N (Nitrogen)</th>
                <th className="py-3.5 px-4">P (Phosphorus)</th>
                <th className="py-3.5 px-4">K (Potassium)</th>
                <th className="py-3.5 px-4">pH Level</th>
                <th className="py-3.5 px-4">Moisture</th>
                <th className="py-3.5 px-4">Organic Matter</th>
                <th className="py-3.5 px-4">Health Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">{r.fieldName}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{r.date}</td>
                  <td className="py-4 px-4 font-bold text-emerald-700">{r.nitrogen} mg/kg</td>
                  <td className="py-4 px-4 font-bold text-amber-700">{r.phosphorus} mg/kg</td>
                  <td className="py-4 px-4 font-bold text-sky-700">{r.potassium} mg/kg</td>
                  <td className="py-4 px-4 font-semibold text-slate-800">{r.pH}</td>
                  <td className="py-4 px-4 text-slate-600">{r.moisture}%</td>
                  <td className="py-4 px-4 text-slate-600">{r.organicMatter}%</td>
                  <td className="py-4 px-4">
                    <span className="font-extrabold text-agri-700 bg-agri-50 px-2.5 py-1 rounded-full text-xs border border-agri-200">
                      {r.healthScore}/100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Soil Record Modal */}
      <FormModal isOpen={isAddOpen} title="Add Soil Laboratory Record" onClose={() => setIsAddOpen(false)}>
        <form onSubmit={handleAddSoilRecord} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field Sector</label>
            <input
              type="text"
              required
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nitrogen (N)</label>
              <input
                type="number"
                required
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phosphorus (P)</label>
              <input
                type="number"
                required
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Potassium (K)</label>
              <input
                type="number"
                required
                value={potassium}
                onChange={(e) => setPotassium(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">pH Level</label>
              <input
                type="number"
                step="0.1"
                required
                value={pH}
                onChange={(e) => setPH(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Moisture (%)</label>
              <input
                type="number"
                required
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Organic Matter (%)</label>
              <input
                type="number"
                step="0.1"
                required
                value={organicMatter}
                onChange={(e) => setOrganicMatter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes / Observations</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Lab sample details or fertigation notes..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-agri-700 hover:bg-agri-800 rounded-xl shadow-xs"
            >
              Save Soil Record
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
