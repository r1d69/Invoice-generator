import React from 'react';
import { Invoice, Client, ServiceItem, AppSettings } from '../types';
import { calculateInvoice } from '../utils/calculations';
import { formatCurrency } from '../utils/currencies';
import { exportInvoiceToPdf } from '../utils/pdfExport';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileEdit,
  Plus,
  ArrowUpRight,
  UserPlus,
  PackagePlus,
  Eye,
  Edit,
  Download,
  Trash2,
  Share2,
  TrendingUp,
  CreditCard,
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface Props {
  invoices: Invoice[];
  clients: Client[];
  services: ServiceItem[];
  settings: AppSettings;
  onCreateInvoice: () => void;
  onEditInvoice: (invoice: Invoice) => void;
  onAddClient: () => void;
  onAddService: () => void;
  onMarkAsPaid: (invoiceId: string) => void;
  onDeleteInvoice: (invoice: Invoice) => void;
  onOpenSendModal: (invoice: Invoice) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  invoices,
  clients,
  services,
  settings,
  onCreateInvoice,
  onEditInvoice,
  onAddClient,
  onAddService,
  onMarkAsPaid,
  onDeleteInvoice,
  onOpenSendModal,
  onNavigateTab,
}) => {
  // Aggregate Metrics
  let totalRevenue = 0;
  let paidRevenue = 0;
  let unpaidRevenue = 0;
  let overdueRevenue = 0;

  let totalCount = 0;
  let paidCount = 0;
  let unpaidCount = 0;
  let overdueCount = 0;
  let draftCount = 0;

  invoices.forEach((inv) => {
    const calc = calculateInvoice(inv);
    if (inv.status === 'Cancelled') return;

    totalCount++;
    if (inv.status === 'Draft') {
      draftCount++;
      return;
    }

    totalRevenue += calc.invoiceTotal;
    paidRevenue += calc.amountPaid;

    if (calc.balanceDue > 0.01) {
      if (calc.isOverdue) {
        overdueRevenue += calc.balanceDue;
        overdueCount++;
      } else {
        unpaidRevenue += calc.balanceDue;
        unpaidCount++;
      }
    }

    if (calc.computedStatus === 'Paid' || inv.status === 'Paid') {
      paidCount++;
    }
  });

  const currency = settings.defaultCurrency || 'USD';

  // Recent 6 invoices sorted by date desc
  const recentInvoices = [...invoices].sort(
    (a, b) => new Date(b.invoiceDate || b.createdAt).getTime() - new Date(a.invoiceDate || a.createdAt).getTime()
  ).slice(0, 6);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time overview of invoices, client billing, payments, and cash flow.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onAddClient}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-slate-500" />
            <span>Add Client</span>
          </button>

          <button
            type="button"
            onClick={onAddService}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <PackagePlus className="w-4 h-4 text-slate-500" />
            <span>Add Service</span>
          </button>

          <button
            type="button"
            onClick={onCreateInvoice}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              TOTAL REVENUE
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatCurrency(totalRevenue, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <span>{totalCount} invoices total</span>
            </div>
          </div>
        </div>

        {/* Paid */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              PAID
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 tracking-tight font-mono">
              {formatCurrency(paidRevenue, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <span>{paidCount} paid settled</span>
            </div>
          </div>
        </div>

        {/* Unpaid */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              UNPAID
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {formatCurrency(unpaidRevenue, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <span>{unpaidCount} awaiting payment</span>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              OVERDUE
            </span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-600 tracking-tight font-mono">
              {formatCurrency(overdueRevenue, currency)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-600 font-medium">
              <span>{overdueCount} past due date</span>
            </div>
          </div>
        </div>

        {/* Draft */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              DRAFT
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {draftCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 font-medium">
              <span>in-progress drafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary Row: Verification Benchmark Callout */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span className="text-xs font-bold tracking-wider text-blue-200 uppercase">
              Pro Studio Invoice Engine
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            High Precision Tax & Discount Automation Ready
          </h3>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Multi-currency calculation engine with line-item discounts, custom VAT/GST rates, partial payment tracking, and high-DPI A4 PDF exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCreateInvoice}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-blue-50 rounded-xl text-xs font-bold transition shadow-sm"
          >
            Create New Invoice
          </button>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">Recent Invoices</h2>
            <p className="text-xs text-slate-500">
              Showing the latest invoices generated in your workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('invoices')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>View All Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No invoices yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first professional invoice with our real-time A4 editor.
            </p>
            <button
              type="button"
              onClick={onCreateInvoice}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
            >
              Create your first invoice
            </button>
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
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((inv) => {
                  const calc = calculateInvoice(inv);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-4 px-6 font-mono font-bold text-blue-600">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">
                          {inv.client.company || inv.client.name || 'Untitled Client'}
                        </p>
                        {inv.client.company && (
                          <p className="text-[11px] text-slate-400">{inv.client.name}</p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-600">{inv.invoiceDate}</td>
                      <td className="py-4 px-4 text-slate-600">{inv.dueDate}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                        {formatCurrency(calc.invoiceTotal, inv.currency)}
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
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                            title="Edit Invoice"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenSendModal(inv)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                            title="Send Invoice"
                          >
                            <Share2 className="w-3.5 h-3.5" />
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
