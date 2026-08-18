import React, { useEffect, useState } from 'react';
import { Tractor, Plus, Eye, Trash2, MapPin, Ruler, Layers } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SearchBar } from '../components/common/SearchBar';
import { farmService } from '../services/farmService';
import { Farm } from '../types';
import { useToast } from '../hooks/useToast';

export const Farms: React.FC = () => {
  const { showToast } = useToast();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [totalArea, setTotalArea] = useState('50');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    const data = await farmService.getFarms();
    setFarms(data);
  };

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    await farmService.createFarm({
      name,
      location,
      totalArea: parseFloat(totalArea) || 10,
      description,
    });

    showToast('Farm Registered', `Farm "${name}" added to system.`, 'success');
    setIsAddOpen(false);
    setName('');
    setLocation('');
    setDescription('');
    loadFarms();
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    await farmService.deleteFarm(deleteTargetId);
    showToast('Farm Deleted', 'Farm record removed.', 'info');
    setDeleteTargetId(null);
    loadFarms();
  };

  const filteredFarms = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Farm Estates Management"
        subtitle="Manage primary agricultural properties, acreage, and operational status."
        icon={<Tractor className="w-6 h-6" />}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Farm Estate
          </button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search farm name or location..." />
      </div>

      {/* Farm Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Farm Name</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Total Area</th>
                <th className="py-3.5 px-4">Fields</th>
                <th className="py-3.5 px-4">Active Crops</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredFarms.map((farm) => (
                <tr key={farm.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-agri-50 text-agri-700 rounded-lg">
                        <Tractor className="w-4 h-4" />
                      </div>
                      <div>
                        <span>{farm.name}</span>
                        {farm.description && (
                          <span className="block text-xs text-slate-400 font-normal truncate max-w-xs">
                            {farm.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {farm.location}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    <span className="inline-flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-slate-400" /> {farm.totalArea} ha
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" /> {farm.fieldCount} Sectors
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-agri-700">{farm.activeCrops} Crops</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={farm.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setDeleteTargetId(farm.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Farm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Farm Modal */}
      <FormModal isOpen={isAddOpen} title="Register New Farm Estate" onClose={() => setIsAddOpen(false)}>
        <form onSubmit={handleAddFarm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Farm Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunrise Organic Estate"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-agri-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Sector 4, Central Valley"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-agri-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Area (Hectares)</label>
              <input
                type="number"
                required
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                placeholder="50"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-agri-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Primary crop types, irrigation access, soil characteristics..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-agri-500/30"
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
              Save Farm Record
            </button>
          </div>
        </form>
      </FormModal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Farm Estate"
        message="Are you sure you want to delete this farm estate record? Associated field sectors will need reassignment."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
