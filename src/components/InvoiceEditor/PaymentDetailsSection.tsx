import React from 'react';
import { PaymentDetails } from '../../types';
import { CreditCard, Landmark, Globe, Mail, Link as LinkIcon, Info } from 'lucide-react';

interface Props {
  paymentDetails: PaymentDetails;
  onChange: (updated: PaymentDetails) => void;
}

export const PaymentDetailsSection: React.FC<Props> = ({ paymentDetails, onChange }) => {
  const handleFieldChange = (field: keyof PaymentDetails, value: string) => {
    onChange({
      ...paymentDetails,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800 text-sm">Payment Details & Bank Instructions</h3>
      </div>

      <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/60 flex items-start gap-2.5 text-xs text-blue-800">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          Fill only the payment methods you wish to display to the client. Any blank fields will automatically be hidden from the final invoice.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            Payment Method / Channel
          </label>
          <input
            type="text"
            value={paymentDetails.paymentMethod}
            onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
            placeholder="e.g. Bank Wire Transfer / ACH / PayPal / Stripe"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
          <input
            type="text"
            value={paymentDetails.bankName}
            onChange={(e) => handleFieldChange('bankName', e.target.value)}
            placeholder="e.g. Silicon Valley Commercial Bank"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Account Holder Name</label>
          <input
            type="text"
            value={paymentDetails.accountName}
            onChange={(e) => handleFieldChange('accountName', e.target.value)}
            placeholder="e.g. Creative Studio Co. LLC"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Account Number</label>
          <input
            type="text"
            value={paymentDetails.accountNumber}
            onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
            placeholder="e.g. 10928374619"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Routing Number / Sort Code</label>
          <input
            type="text"
            value={paymentDetails.routingNumber}
            onChange={(e) => handleFieldChange('routingNumber', e.target.value)}
            placeholder="e.g. 121000358"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">SWIFT / BIC Code</label>
          <input
            type="text"
            value={paymentDetails.swiftBic}
            onChange={(e) => handleFieldChange('swiftBic', e.target.value)}
            placeholder="e.g. SVCBUS33"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">IBAN (International)</label>
          <input
            type="text"
            value={paymentDetails.iban}
            onChange={(e) => handleFieldChange('iban', e.target.value)}
            placeholder="e.g. US33SVCB12100035800008492"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">PayPal Email</label>
          <input
            type="email"
            value={paymentDetails.paypalEmail}
            onChange={(e) => handleFieldChange('paypalEmail', e.target.value)}
            placeholder="e.g. billing@creativestudio.design"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Direct Payment URL / Link</label>
          <input
            type="text"
            value={paymentDetails.paymentLink}
            onChange={(e) => handleFieldChange('paymentLink', e.target.value)}
            placeholder="e.g. https://buy.stripe.com/..."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            Payment Notes & Reference Instructions
          </label>
          <textarea
            rows={2}
            value={paymentDetails.instructions}
            onChange={(e) => handleFieldChange('instructions', e.target.value)}
            placeholder="e.g. Please include Invoice Number INV-2026-001 as the wire transfer reference."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
