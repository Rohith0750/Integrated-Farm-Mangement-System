import React, { useState } from 'react';
import { Users, Plus, Phone, Mail, Clock, Briefcase } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { FormModal } from '../components/common/FormModal';
import { SearchBar } from '../components/common/SearchBar';
import { Worker, WorkerStatus } from '../types';
import { useToast } from '../hooks/useToast';

export const MOCK_WORKERS: Worker[] = [
  {
    id: 'wrk-01',
    name: 'Samuel Oak',
    role: 'Field Operator & Sprayer',
    assignedField: 'Field A - Tomato Plot',
    currentTask: 'Fungicide preventive leaf spray application',
    hoursLogged: 38.5,
    status: 'Working',
    phone: '+1 (555) 234-5678',
    email: 'samuel.o@farm.agri',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'wrk-02',
    name: 'Elena Rostova',
    role: 'Irrigation Specialist',
    assignedField: 'Field C - Sweet Corn',
    currentTask: 'Drip line pressure check & manifold repair',
    hoursLogged: 42.0,
    status: 'Working',
    phone: '+1 (555) 876-5432',
    email: 'elena.r@farm.agri',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'wrk-03',
    name: 'David Vance',
    role: 'Tractor Driver',
    assignedField: 'Field B - Potato Sector',
    currentTask: 'Soil tilling & ridging preparation',
    hoursLogged: 24.0,
    status: 'Available',
    phone: '+1 (555) 345-6789',
    email: 'david.v@farm.agri',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'wrk-04',
    name: 'Maria Garcia',
    role: 'Harvest Supervisor',
    assignedField: 'Field D - Wheat Belt',
    currentTask: 'Quality grading & silo moisture checks',
    hoursLogged: 0,
    status: 'On Leave',
    phone: '+1 (555) 987-6543',
    email: 'maria.g@farm.agri',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  },
];

export const Workers: React.FC = () => {
  const { showToast } = useToast();
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Field Technician');
  const [assignedField, setAssignedField] = useState('Field A - Tomato Plot');
  const [currentTask, setCurrentTask] = useState('Routine inspection & soil sampling');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [email, setEmail] = useState('tech@farm.agri');

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newWorker: Worker = {
      id: `wrk-${Date.now()}`,
      name,
      role,
      assignedField,
      currentTask,
      hoursLogged: 0,
      status: 'Available',
      phone,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };

    setWorkers([newWorker, ...workers]);
    showToast('Worker Onboarded', `Personnel record for "${name}" registered.`, 'success');
    setIsAddOpen(false);
    setName('');
  };

  const filteredWorkers = workers.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.role.toLowerCase().includes(search.toLowerCase()) ||
      w.currentTask.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Workforce & Task Assignments"
        subtitle="Manage field personnel, labor hours, task scheduling, and operational availability."
        icon={<Users className="w-6 h-6" />}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Worker / Assign Task
          </button>
        }
      />

      <div className="flex items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search worker name, role, or task..." />
      </div>

      {/* Grid of Worker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredWorkers.map((worker) => (
          <div
            key={worker.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={worker.avatar}
                  alt={worker.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-agri-500/30 shrink-0"
                />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{worker.name}</h3>
                  <span className="text-xs font-semibold text-agri-700">{worker.role}</span>
                </div>
              </div>
              <StatusBadge status={worker.status} />
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs mb-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" /> Assigned Field:
                </span>
                <strong className="text-slate-800">{worker.assignedField}</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Current Task:</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 block">
                  {worker.currentTask}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {worker.phone}</span>
              </div>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-agri-600" /> {worker.hoursLogged} hrs logged
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Worker Modal */}
      <FormModal isOpen={isAddOpen} title="Register Worker / Assign Task" onClose={() => setIsAddOpen(false)}>
        <form onSubmit={handleAddWorker} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samuel Oak"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Title</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Field</label>
              <input
                type="text"
                required
                value={assignedField}
                onChange={(e) => setAssignedField(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Task Description</label>
            <textarea
              rows={2}
              required
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              Save Worker Profile
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
