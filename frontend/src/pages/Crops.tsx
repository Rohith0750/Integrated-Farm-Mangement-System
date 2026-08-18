import React, { useEffect, useState } from 'react';
import { Sprout, Plus, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { FormModal } from '../components/common/FormModal';
import { SearchBar } from '../components/common/SearchBar';
import { cropService } from '../services/cropService';
import { Crop, GrowthStage } from '../types';
import { useToast } from '../hooks/useToast';

export const Crops: React.FC = () => {
  const { showToast } = useToast();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [variety, setVariety] = useState('');
  const [fieldName, setFieldName] = useState('Field A - Tomato Plot');
  const [plantingDate, setPlantingDate] = useState('2026-06-01');
  const [expectedHarvest, setExpectedHarvest] = useState('2026-09-01');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative');

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    const data = await cropService.getCrops();
    setCrops(data);
  };

  const handleAddCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await cropService.createCrop({
      name,
      variety,
      fieldName,
      plantingDate,
      expectedHarvest,
      growthStage,
      status: 'Healthy',
      estimatedYieldTons: 35.0,
    });

    showToast('Crop Registered', `Crop record for "${name}" created.`, 'success');
    setIsAddOpen(false);
    setName('');
    loadCrops();
  };

  const lifecycleStages: GrowthStage[] = [
    'Planting',
    'Germination',
    'Vegetative',
    'Flowering',
    'Fruiting',
    'Harvest',
  ];

  const filteredCrops = crops.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.variety.toLowerCase().includes(search.toLowerCase()) ||
      c.fieldName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Crop Inventory & Lifecycle Tracker"
        subtitle="Active harvest cycles, plant variety metrics, and growth stage timelines."
        icon={<Sprout className="w-6 h-6" />}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Register Crop Cycle
          </button>
        }
      />

      {/* Visual Crop Lifecycle Pipeline */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4">
          Standard Crop Phenological Growth Pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {lifecycleStages.map((stage, idx) => (
            <div
              key={stage}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                idx === 3
                  ? 'bg-agri-700 text-white border-agri-800 shadow-sm font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200/80 font-medium'
              }`}
            >
              <span className="text-[10px] font-bold uppercase opacity-75">Stage {idx + 1}</span>
              <span className="text-xs font-extrabold mt-1">{stage}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search crop, variety, or field..." />
      </div>

      {/* Crops Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Crop & Variety</th>
                <th className="py-3.5 px-4">Assigned Field</th>
                <th className="py-3.5 px-4">Planting Date</th>
                <th className="py-3.5 px-4">Growth Stage</th>
                <th className="py-3.5 px-4">Expected Harvest</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCrops.map((crop) => (
                <tr key={crop.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-agri-50 text-agri-700 rounded-lg">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <div>
                        <span>{crop.name}</span>
                        <span className="block text-xs text-slate-400 font-normal">{crop.variety}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{crop.fieldName}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{crop.plantingDate}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-full border border-slate-200">
                      {crop.growthStage}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{crop.expectedHarvest}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={crop.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Crop Modal */}
      <FormModal isOpen={isAddOpen} title="Register New Crop Cycle" onClose={() => setIsAddOpen(false)}>
        <form onSubmit={handleAddCrop} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tomato"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Variety</label>
              <input
                type="text"
                required
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="Roma VF Hybrid"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Field Sector</label>
            <input
              type="text"
              required
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Planting Date</label>
              <input
                type="date"
                required
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expected Harvest Date</label>
              <input
                type="date"
                required
                value={expectedHarvest}
                onChange={(e) => setExpectedHarvest(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Growth Stage</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value as GrowthStage)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            >
              {lifecycleStages.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
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
              Save Crop Record
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
