import React, { useState, useMemo } from 'react';
import { Invoice } from '../types';
import { calculateInvoice } from '../utils/calculations';
import { formatCurrency } from '../utils/currencies';
import { exportInvoiceToPdf, printInvoice } from '../utils/pdfExport';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Edit,
  Trash2,
  Copy,
  Download,
  Printer,
  CheckCircle2,
  Share2,
  DollarSign,
  AlertCircle,
  Clock,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  invoices: Invoice[];
  onCreateInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDuplicateInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoice: Invoice) => void;
  onMarkAsPaid: (invoiceId: string) => void;
  onOpenSendModal: (invoice: Invoice) => void;
}

type SortOption = 'newest' | 'oldest' | 'amount_high' | 'amount_low' | 'due_date';

export const InvoicesListView: React.FC<Props> = ({
  invoices,
  onCreateInvoice,
  onEditInvoice,
  onDuplicateInvoice,
  onDeleteInvoice,
  onMarkAsPaid,
  onOpenSendModal,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Filter and Sort
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter((inv) => {
        const calc = calculateInvoice(inv);
        const matchesQuery =
          (inv.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (inv.client.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (inv.client.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (inv.projectName || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesQuery) return false;

        if (statusFilter === 'all') return true;
        if (statusFilter === 'overdue') return calc.isOverdue;
        if (statusFilter === 'paid') return calc.computedStatus === 'Paid';
        if (statusFilter === 'unpaid') return calc.computedStatus === 'Unpaid' || calc.computedStatus === 'Sent' || calc.computedStatus === 'Viewed';
        if (statusFilter === 'partially_paid') return calc.computedStatus === 'Partially Paid';
        if (statusFilter === 'draft') return inv.status === 'Draft';

        return inv.status.toLowerCase() === statusFilter.toLowerCase();
      })
      .sort((a, b) => {
        const calcA = calculateInvoice(a);
        const calcB = calculateInvoice(b);

        if (sortBy === 'newest') {
          return new Date(b.invoiceDate || b.createdAt).getTime() - new Date(a.invoiceDate || a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.invoiceDate || a.createdAt).getTime() - new Date(b.invoiceDate || b.createdAt).getTime();
        }
        if (sortBy === 'amount_high') {
          return calcB.invoiceTotal - calcA.invoiceTotal;
        }
        if (sortBy === 'amount_low') {
          return calcA.invoiceTotal - calcB.invoiceTotal;
        }
        if (sortBy === 'due_date') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });
  }, [invoices, searchQuery, statusFilter, sortBy]);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Invoices
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, filter, export, and track all billing statements.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateInvoice}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, client name, company, or project..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses ({invoices.length})</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent font-medium text-slate-700 focus:outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount_high">Sort: Highest Amount</option>
              <option value="amount_low">Sort: Lowest Amount</option>
              <option value="due_date">Sort: Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No matching invoices</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Get started by creating your very first professional invoice.'}
            </p>
            {searchQuery || statusFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                onClick={onCreateInvoice}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
              >
                Create Invoice
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Invoice #</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-right">Balance Due</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const calc = calculateInvoice(inv);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600">
                        <button
                          type="button"
                          onClick={() => onEditInvoice(inv)}
                          className="hover:underline text-left"
                        >
                          {inv.invoiceNumber}
                        </button>
                        {inv.projectName && (
                          <p className="text-[11px] text-slate-400 font-sans font-normal truncate max-w-[140px]">
                            {inv.projectName}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">
                          {inv.client.company || inv.client.name || 'Untitled'}
                        </p>
                        {inv.client.company && (
                          <p className="text-[11px] text-slate-400">{inv.client.name}</p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-600">{inv.invoiceDate}</td>
                      <td className="py-4 px-4 text-slate-600">
                        <span className={calc.isOverdue ? 'text-rose-600 font-bold' : ''}>
                          {inv.dueDate}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                        {formatCurrency(calc.invoiceTotal, inv.currency)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-600">
                        {calc.balanceDue > 0 ? (
                          <span className="font-semibold text-slate-800">
                            {formatCurrency(calc.balanceDue, inv.currency)}
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium">Paid in full</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                            calc.computedStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : calc.computedStatus === 'Partially Paid'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : calc.computedStatus === 'Overdue'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : calc.computedStatus === 'Draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {calc.computedStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEditInvoice(inv)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                            title="Edit / Open Invoice"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenSendModal(inv)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                            title="Share & Send"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {calc.balanceDue > 0 && inv.status !== 'Paid' && (
                            <button
                              type="button"
                              onClick={() => onMarkAsPaid(inv.id)}
                              className="p-1.5 text-slate-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                              title="Mark as Paid"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDuplicateInvoice(inv)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteInvoice(inv)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
