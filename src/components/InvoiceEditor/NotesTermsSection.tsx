import React from 'react';
import { Invoice } from '../../types';
import { FileCheck2, Scale, AlertCircle } from 'lucide-react';

interface Props {
  invoice: Invoice;
  onChange: (updated: Invoice) => void;
}

export const NotesTermsSection: React.FC<Props> = ({ invoice, onChange }) => {
  const handleFieldChange = (field: keyof Invoice, value: string) => {
    onChange({
      ...invoice,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <FileCheck2 className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800 text-sm">Notes, Terms & Conditions</h3>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Client Note / Remarks (Optional)
          </label>
          <textarea
            rows={3}
            value={invoice.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="e.g. Thank you for your business! We appreciate the opportunity to collaborate."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Terms & Conditions (Optional)
          </label>
          <textarea
            rows={3}
            value={invoice.termsAndConditions}
            onChange={(e) => handleFieldChange('termsAndConditions', e.target.value)}
            placeholder="1. Payment is due within agreed terms.\n2. Work files delivered upon settlement."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Late Payment Policy (Optional)
          </label>
          <input
            type="text"
            value={invoice.latePaymentPolicy}
            onChange={(e) => handleFieldChange('latePaymentPolicy', e.target.value)}
            placeholder="e.g. 1.5% compounding fee on overdue balances."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Refund & Cancellation Policy (Optional)
          </label>
          <input
            type="text"
            value={invoice.refundPolicy}
            onChange={(e) => handleFieldChange('refundPolicy', e.target.value)}
            placeholder="e.g. Completed digital deliverables are non-refundable."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
