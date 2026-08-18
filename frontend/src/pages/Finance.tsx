import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Wallet, PieChart as PieIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { FormModal } from '../components/common/FormModal';
import { financeService } from '../services/financeService';
import { Expense, Income, ExpenseCategory } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useToast } from '../hooks/useToast';

export const Finance: React.FC = () => {
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'income'>('overview');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  // Expense Form
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('Fertilizer');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('500');

  // Income Form
  const [incCrop, setIncCrop] = useState('Tomato (Roma)');
  const [incBuyer, setIncBuyer] = useState('FreshHarvest Wholesalers');
  const [incAmount, setIncAmount] = useState('5000');
  const [incTons, setIncTons] = useState('6.0');

  useEffect(() => {
    loadFinancials();
  }, []);

  const loadFinancials = async () => {
    const [eData, iData] = await Promise.all([
      financeService.getExpenses(),
      financeService.getIncome(),
    ]);
    setExpenses(eData);
    setIncomes(iData);
  };

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalRevenue = incomes.reduce((acc, i) => acc + i.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await financeService.addExpense({
      category: expCategory,
      description: expDesc || 'Operational cost',
      amount: parseFloat(expAmount) || 100,
      paymentMethod: 'Bank Transfer',
    });
    showToast('Expense Recorded', `Expense of ${formatCurrency(parseFloat(expAmount))} logged.`, 'info');
    setIsAddExpenseOpen(false);
    loadFinancials();
  };

  const handleAddIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    await financeService.addIncome({
      cropName: incCrop,
      buyer: incBuyer,
      amount: parseFloat(incAmount) || 1000,
      quantityTons: parseFloat(incTons) || 1,
    });
    showToast('Revenue Logged', `Income of ${formatCurrency(parseFloat(incAmount))} recorded.`, 'success');
    setIsAddIncomeOpen(false);
    loadFinancials();
  };

  const expenseCategoryData = [
    { name: 'Fertilizer', value: 1450, color: '#16a34a' },
    { name: 'Labour', value: 2200, color: '#eab308' },
    { name: 'Fuel', value: 580, color: '#3b82f6' },
    { name: 'Seeds', value: 890, color: '#8b5cf6' },
    { name: 'Pesticides', value: 340, color: '#f43f5e' },
  ];

  const financialOverviewChart = [
    { month: 'May', revenue: 22000, expense: 11000, profit: 11000 },
    { month: 'Jun', revenue: 29000, expense: 12500, profit: 16500 },
    { month: 'Jul', revenue: 34000, expense: 14000, profit: 20000 },
    { month: 'Aug', revenue: 46500, expense: 18400, profit: 28100 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Financial Ledger & ROI Tracker"
        subtitle="Operational expenses, crop sales revenue, and net profitability metrics."
        icon={<DollarSign className="w-6 h-6" />}
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Log Expense
            </button>
            <button
              onClick={() => setIsAddIncomeOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Record Crop Sale
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<ArrowUpRight className="w-6 h-6 text-emerald-600" />}
          change={18.4}
          accentColor="emerald"
        />
        <StatCard
          title="Total Operating Expenses"
          value={formatCurrency(totalExpenses)}
          icon={<ArrowDownRight className="w-6 h-6 text-rose-600" />}
          subtitle="Input & labor costs"
          accentColor="amber"
        />
        <StatCard
          title="Net Farm Profit"
          value={formatCurrency(netProfit)}
          icon={<Wallet className="w-6 h-6 text-agri-600" />}
          change={24.2}
          accentColor="green"
        />
      </div>

      {/* Tab Selectors */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-agri-700 text-agri-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Financial Analytics
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'expenses'
              ? 'border-agri-700 text-agri-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Expenses Ledger ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'income'
              ? 'border-agri-700 text-agri-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Income & Crop Sales ({incomes.length})
        </button>
      </div>

      {/* Overview Analytics View */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Monthly Revenue vs Operating Cost</h3>
            <p className="text-xs text-slate-500 mb-4">Cash flow analysis ($ USD)</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialOverviewChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#15803d" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Expense Breakdown by Category</h3>
              <p className="text-xs text-slate-500 mb-4">Input cost distribution</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
              {expenseCategoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <strong className="text-slate-900">{formatCurrency(item.value)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expenses Ledger Table */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Field Sector</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-700">{formatDate(exp.date)}</td>
                  <td className="py-4 px-4 font-bold text-rose-700">
                    <span className="px-2.5 py-1 bg-rose-50 rounded-full text-xs">{exp.category}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-900 font-medium">{exp.description}</td>
                  <td className="py-4 px-4 text-slate-600">{exp.fieldName || 'General Farm'}</td>
                  <td className="py-4 px-4 text-slate-500">{exp.paymentMethod}</td>
                  <td className="py-4 px-4 text-right font-extrabold text-rose-700">-{formatCurrency(exp.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Income Ledger Table */}
      {activeTab === 'income' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Crop Produce</th>
                <th className="py-3.5 px-4">Buyer / Wholesaler</th>
                <th className="py-3.5 px-4">Volume Sold</th>
                <th className="py-3.5 px-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {incomes.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-800">{inc.invoiceNumber}</td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{formatDate(inc.date)}</td>
                  <td className="py-4 px-4 font-bold text-agri-800">{inc.cropName}</td>
                  <td className="py-4 px-4 text-slate-900 font-medium">{inc.buyer}</td>
                  <td className="py-4 px-4 font-semibold text-slate-700">{inc.quantityTons} Tons</td>
                  <td className="py-4 px-4 text-right font-extrabold text-emerald-700">+{formatCurrency(inc.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Expense Modal */}
      <FormModal isOpen={isAddExpenseOpen} title="Log Operational Expense" onClose={() => setIsAddExpenseOpen(false)}>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expense Category</label>
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            >
              <option value="Fertilizer">Fertilizer</option>
              <option value="Seeds">Seeds</option>
              <option value="Labour">Labour</option>
              <option value="Fuel">Fuel</option>
              <option value="Equipment">Equipment</option>
              <option value="Pesticides">Pesticides</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <input
              type="text"
              required
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              placeholder="e.g. Tractor diesel refill"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount ($ USD)</label>
            <input
              type="number"
              required
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddExpenseOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
            >
              Log Expense
            </button>
          </div>
        </form>
      </FormModal>

      {/* Add Income Modal */}
      <FormModal isOpen={isAddIncomeOpen} title="Record Crop Harvest Sale" onClose={() => setIsAddIncomeOpen(false)}>
        <form onSubmit={handleAddIncome} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Crop Produce</label>
              <input
                type="text"
                required
                value={incCrop}
                onChange={(e) => setIncCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Buyer Name</label>
              <input
                type="text"
                required
                value={incBuyer}
                onChange={(e) => setIncBuyer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Revenue ($)</label>
              <input
                type="number"
                required
                value={incAmount}
                onChange={(e) => setIncAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Volume Sold (Tons)</label>
              <input
                type="number"
                required
                value={incTons}
                onChange={(e) => setIncTons(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddIncomeOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-agri-700 hover:bg-agri-800 rounded-xl shadow-xs"
            >
              Record Income
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};
