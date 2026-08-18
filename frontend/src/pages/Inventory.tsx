import React, { useEffect, useState } from 'react';
import { Boxes, Plus, AlertTriangle, Trash2, PackageCheck, ShoppingCart } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { FormModal } from '../components/common/FormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { SearchBar } from '../components/common/SearchBar';
import { inventoryService } from '../services/inventoryService';
import { InventoryItem, InventoryCategory } from '../types';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatters';

export const Inventory: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('Fertilizers');
  const [quantity, setQuantity] = useState('20');
  const [unit, setUnit] = useState('bags (50kg)');
  const [reorderLevel, setReorderLevel] = useState('15');
  const [supplier, setSupplier] = useState('AgriCorp Supplies Ltd.');
  const [pricePerUnit, setPricePerUnit] = useState('30');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const data = await inventoryService.getInventory();
    setItems(data);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await inventoryService.addItem({
      name,
      category,
      quantity: parseFloat(quantity) || 0,
      unit,
      reorderLevel: parseFloat(reorderLevel) || 5,
      supplier,
      pricePerUnit: parseFloat(pricePerUnit) || 10,
    });

    showToast('Stock Recorded', `Item "${name}" added to inventory catalog.`, 'success');
    setIsAddOpen(false);
    setName('');
    loadInventory();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await inventoryService.deleteItem(deleteId);
    showToast('Item Removed', 'Inventory item removed.', 'info');
    setDeleteId(null);
    loadInventory();
  };

  const lowStockItems = items.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock');

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories: string[] = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Tools', 'Equipment'];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Farm Resource & Supply Inventory"
        subtitle="Catalog agricultural inputs, monitor stock thresholds, and track supplier reorders."
        icon={<Boxes className="w-6 h-6" />}
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Inventory Item
          </button>
        }
      />

      {/* Low Stock Warning Cards Banner */}
      {lowStockItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Critical Stock Reorder Alerts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start justify-between shadow-2xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-amber-900 font-semibold mt-0.5">
                      {item.quantity} {item.unit} remaining
                    </p>
                    <span className="text-[11px] text-slate-500">Reorder Level: {item.reorderLevel} {item.unit}</span>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search item or supplier..." />
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Item Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Quantity</th>
                <th className="py-3.5 px-4">Reorder Level</th>
                <th className="py-3.5 px-4">Price / Unit</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-4 px-4 font-medium text-slate-600">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs">{item.category}</span>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-slate-800">
                    {item.quantity} <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-semibold">{item.reorderLevel} {item.unit}</td>
                  <td className="py-4 px-4 font-semibold text-slate-900">{formatCurrency(item.pricePerUnit)}</td>
                  <td className="py-4 px-4 text-slate-600 font-medium">{item.supplier}</td>
                  <td className="py-4 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
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

      {/* Add Item Modal */}
      <FormModal isOpen={isAddOpen} title="Catalog New Inventory Item" onClose={() => setIsAddOpen(false)}>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Potassium Sulfate (0-0-50)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              >
                {categories.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Unit Type</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="bags / kg / liters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock Qty</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reorder Level</label>
              <input
                type="number"
                required
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Supplier Company</label>
            <input
              type="text"
              required
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
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
              Save Item
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Inventory Item"
        message="Are you sure you want to delete this inventory stock record?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
