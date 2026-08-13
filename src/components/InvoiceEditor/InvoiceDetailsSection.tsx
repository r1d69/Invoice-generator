import React from 'react';
import { Invoice, PaymentTermType, InvoiceStatus } from '../../types';
import { calculateDueDate } from '../../utils/calculations';
import { CURRENCY_MAP } from '../../utils/currencies';
import { FileText, RefreshCw, Calendar, Tag, DollarSign, ShieldAlert } from 'lucide-react';

interface Props {
  invoice: Invoice;
  onChange: (updated: Invoice) => void;
  onRegenerateNumber: () => void;
}

export const InvoiceDetailsSection: React.FC<Props> = ({
  invoice,
  onChange,
  onRegenerateNumber,
}) => {
  const handlePaymentTermsChange = (term: PaymentTermType) => {
    const newDueDate = calculateDueDate(invoice.invoiceDate, term, invoice.customTermDays);
    onChange({
      ...invoice,
      paymentTerms: term,
      dueDate: newDueDate,
    });
  };

  const handleInvoiceDateChange = (newDate: string) => {
    const newDueDate = calculateDueDate(newDate, invoice.paymentTerms, invoice.customTermDays);
    onChange({
      ...invoice,
      invoiceDate: newDate,
      dueDate: newDueDate,
    });
  };

  const handleCustomDaysChange = (days: number) => {
    const newDueDate = calculateDueDate(invoice.invoiceDate, 'custom', days);
    onChange({
      ...invoice,
      customTermDays: days,
      dueDate: newDueDate,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800 text-sm">Invoice Details & Terms</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Invoice Number */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-semibold text-slate-700">Invoice Number *</label>
            <button
              type="button"
              onClick={onRegenerateNumber}
              className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium"
              title="Generate new invoice number"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Next Number</span>
            </button>
          </div>
          <input
            type="text"
            value={invoice.invoiceNumber}
            onChange={(e) => onChange({ ...invoice, invoiceNumber: e.target.value })}
            placeholder="e.g. INV-2026-001"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Currency</label>
          <select
            value={invoice.currency}
            onChange={(e) => onChange({ ...invoice, currency: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            {Object.values(CURRENCY_MAP).map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol}) — {curr.name}
              </option>
            ))}
          </select>
        </div>

        {/* Invoice Date */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Invoice Issue Date *</label>
          <input
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) => handleInvoiceDateChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Payment Terms */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Payment Terms</label>
          <select
            value={invoice.paymentTerms}
            onChange={(e) => handlePaymentTermsChange(e.target.value as PaymentTermType)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="receipt">Due on Receipt (0 days)</option>
            <option value="net7">Net 7 (7 days)</option>
            <option value="net15">Net 15 (15 days)</option>
            <option value="net30">Net 30 (30 days)</option>
            <option value="net45">Net 45 (45 days)</option>
            <option value="net60">Net 60 (60 days)</option>
            <option value="custom">Custom Terms</option>
          </select>
        </div>

        {invoice.paymentTerms === 'custom' && (
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Custom Term Days</label>
            <input
              type="number"
              min="0"
              max="365"
              value={invoice.customTermDays || 30}
              onChange={(e) => handleCustomDaysChange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        )}

        {/* Due Date */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Due Date (Auto-calculated / Override) *
          </label>
          <input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => onChange({ ...invoice, dueDate: e.target.value })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
          />
        </div>

        {/* Invoice Status */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Status Flag</label>
          <select
            value={invoice.status}
            onChange={(e) => onChange({ ...invoice, status: e.target.value as InvoiceStatus })}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Viewed">Viewed</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Project Name */}
        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            Project / Engagement Name
          </label>
          <input
            type="text"
            value={invoice.projectName || ''}
            onChange={(e) => onChange({ ...invoice, projectName: e.target.value })}
            placeholder="e.g. High-End 3D Industrial Asset Pipeline"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* PO & Client Ref */}
        <div>
          <label className="block text-slate-600 mb-1">Purchase Order (PO Number)</label>
          <input
            type="text"
            value={invoice.poNumber || ''}
            onChange={(e) => onChange({ ...invoice, poNumber: e.target.value })}
            placeholder="e.g. PO-99482"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Client Reference / Job Code</label>
          <input
            type="text"
            value={invoice.clientRef || ''}
            onChange={(e) => onChange({ ...invoice, clientRef: e.target.value })}
            placeholder="e.g. ABC-2026-Q3"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
