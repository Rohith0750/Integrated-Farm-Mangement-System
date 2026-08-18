import React, { useEffect, useState } from 'react';
import { Map, Plus, MapPin, FlaskConical, Sprout, Ruler, Layers } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapCard, MapMarker } from '../components/common/MapCard';
import { FormModal } from '../components/common/FormModal';
import { SearchBar } from '../components/common/SearchBar';
import { farmService } from '../services/farmService';
import { Field } from '../types';
import { useToast } from '../hooks/useToast';

export const Fields: React.FC = () => {
  const { showToast } = useToast();
  const [fields, setFields] = useState<Field[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('Green Valley Main Estate');
  const [area, setArea] = useState('15');
  const [soilType, setSoilType] = useState('Loamy Clay');
  const [currentCrop, setCurrentCrop] = useState('Tomato');
  const [lat, setLat] = useState('12.9716');
  const [lng, setLng] = useState('77.5946');

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    const data = await farmService.getFields();
    setFields(data);
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await farmService.createField({
      name,
      farmName,
      area: parseFloat(area) || 10,
      soilType,
      currentCrop,
      lat: parseFloat(lat) || 12.9716,
      lng: parseFloat(lng) || 77.5946,
      status: 'Active',
    });

    showToast('Field Sector Created', `Field "${name}" registered with GIS coordinates.`, 'success');
    setIsAddOpen(false);
    setName('');
    loadFields();
  };

  const filteredFields = fields.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.currentCrop.toLowerCase().includes(search.toLowerCase()) ||
      f.soilType.toLowerCase().includes(search.toLowerCase())
  );

  const mapMarkers: MapMarker[] = filteredFields.map((f) => ({
    id: f.id,
    name: f.name,
    lat: f.lat,
    lng: f.lng,
    info: `${f.area} ha • ${f.soilType} • Crop: ${f.currentCrop}`,
  }));

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Field Sector GIS Mapping"
        subtitle="Individual plot telemetry, soil type classifications, and current crop allocations."
        icon={<Map className="w-6 h-6" />}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Field Sector
          </button>
        }
      />

      {/* Geospatial Map Display */}
      <MapCard markers={mapMarkers} height="h-80" title="Live Geospatial Field Boundaries & GPS Pins" />

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search field sector, crop, or soil type..." />
      </div>

      {/* Grid of Field Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.map((field) => (
          <div
            key={field.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-agri-700">{field.farmName}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{field.name}</h3>
              </div>
              <StatusBadge status={field.status} />
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5" /> Sector Area:
                </span>
                <strong className="text-slate-800">{field.area} Hectares</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5" /> Soil Texture:
                </span>
                <strong className="text-slate-800">{field.soilType}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5" /> Active Crop:
                </span>
                <strong className="text-agri-700 font-bold">{field.currentCrop}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Lat: {field.lat}, Lng: {field.lng}
              </span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Soil Health: {field.soilHealthScore}/100
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Field Modal */}
      <FormModal isOpen={isAddOpen} title="Register Field Sector" onClose={() => setIsAddOpen(false)}>
        <form onSubmit={handleAddField} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field Sector Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Field F - Organic Legume Block"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Farm Estate</label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Area (Hectares)</label>
              <input
                type="number"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Soil Type</label>
              <input
                type="text"
                required
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Crop</label>
              <input
                type="text"
                required
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Latitude</label>
              <input
                type="text"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Longitude</label>
              <input
                type="text"
                required
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
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
              Save Field Sector
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
