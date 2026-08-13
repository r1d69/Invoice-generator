import React from 'react';
import { AdditionalCharge, DiscountType, Invoice, InvoiceCalculations, TaxCalculationMode } from '../../types';
import { formatCurrency } from '../../utils/currencies';
import { Calculator, Plus, Trash2, ShieldCheck, DollarSign, Percent } from 'lucide-react';

interface Props {
  invoice: Invoice;
  calculations: InvoiceCalculations;
  onChange: (updated: Invoice) => void;
}

export const TotalsAndChargesSection: React.FC<Props> = ({
  invoice,
  calculations,
  onChange,
}) => {
  const handleGlobalDiscountChange = (val: number) => {
    onChange({
      ...invoice,
      globalDiscount: Math.max(0, val),
    });
  };

  const handleGlobalDiscountTypeChange = (type: DiscountType) => {
    onChange({
      ...invoice,
      globalDiscountType: type,
    });
  };

  const handleTaxModeChange = (mode: TaxCalculationMode) => {
    onChange({
      ...invoice,
      taxCalculationMode: mode,
    });
  };

  const handleAddCharge = () => {
    const newCharge: AdditionalCharge = {
      id: 'chg_' + Date.now(),
      name: 'Shipping / Handling',
      amount: 50,
      type: 'fixed',
    };
    onChange({
      ...invoice,
      additionalCharges: [...(invoice.additionalCharges || []), newCharge],
    });
  };

  const handleUpdateCharge = (index: number, field: keyof AdditionalCharge, value: any) => {
    const charges = [...(invoice.additionalCharges || [])];
    charges[index] = {
      ...charges[index],
      [field]: value,
    };
    onChange({
      ...invoice,
      additionalCharges: charges,
    });
  };

  const handleDeleteCharge = (index: number) => {
    const charges = (invoice.additionalCharges || []).filter((_, i) => i !== index);
    onChange({
      ...invoice,
      additionalCharges: charges,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800 text-sm">Discounts, Taxes & Additional Charges</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Global Discount Settings */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Global Invoice Discount
            </span>
            <div className="flex bg-white rounded-lg border border-slate-200 p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleGlobalDiscountTypeChange('percentage')}
                className={`px-2 py-0.5 rounded font-bold transition ${
                  invoice.globalDiscountType === 'percentage' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => handleGlobalDiscountTypeChange('fixed')}
                className={`px-2 py-0.5 rounded font-bold transition ${
                  invoice.globalDiscountType === 'fixed' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Fixed
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="any"
              value={invoice.globalDiscount || 0}
              onChange={(e) => handleGlobalDiscountChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <span className="text-slate-500 font-bold text-xs whitespace-nowrap">
              {invoice.globalDiscountType === 'percentage' ? '% Off Subtotal' : `${invoice.currency} Off`}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Applied at the overall invoice level after individual line item discounts.
          </p>
        </div>

        {/* Tax Engine Configuration */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Tax Configuration
            </span>
            <select
              value={invoice.taxCalculationMode || 'per_item'}
              onChange={(e) => handleTaxModeChange(e.target.value as TaxCalculationMode)}
              className="bg-white border border-slate-200 text-slate-700 font-medium text-[11px] px-2 py-1 rounded-lg"
            >
              <option value="per_item">Per-Item Tax</option>
              <option value="global">Global Invoice Tax</option>
            </select>
          </div>

          {invoice.taxCalculationMode === 'global' ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-semibold">Tax Name</label>
                <input
                  type="text"
                  value={invoice.globalTaxName || 'VAT'}
                  onChange={(e) => onChange({ ...invoice, globalTaxName: e.target.value })}
                  placeholder="VAT / GST / Sales Tax"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-semibold">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={invoice.globalTaxRate || 0}
                  onChange={(e) =>
                    onChange({ ...invoice, globalTaxRate: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-right"
                />
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tax rates and exemption statuses are configured individually on each line item in the items table.
            </p>
          )}
        </div>
      </div>

      {/* Additional Charges (Shipping, Rush, Service fee) */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-xs">
            Additional Charges (Fees, Shipping, Rush)
          </span>
          <button
            type="button"
            onClick={handleAddCharge}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Charge</span>
          </button>
        </div>

        {invoice.additionalCharges && invoice.additionalCharges.length > 0 ? (
          <div className="space-y-2">
            {invoice.additionalCharges.map((charge, idx) => (
              <div key={charge.id || idx} className="flex items-center gap-2 text-xs">
                <input
                  type="text"
                  value={charge.name}
                  onChange={(e) => handleUpdateCharge(idx, 'name', e.target.value)}
                  placeholder="Charge Description (e.g. Shipping Fee, Rush Fee)"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900"
                />

                <select
                  value={charge.type}
                  onChange={(e) => handleUpdateCharge(idx, 'type', e.target.value)}
                  className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium"
                >
                  <option value="fixed">Fixed ({invoice.currency})</option>
                  <option value="percentage">% of Taxable</option>
                </select>

                <input
                  type="number"
                  min="0"
                  step="any"
                  value={charge.amount}
                  onChange={(e) =>
                    handleUpdateCharge(idx, 'amount', Math.max(0, parseFloat(e.target.value) || 0))
                  }
                  className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold text-right"
                />

                <button
                  type="button"
                  onClick={() => handleDeleteCharge(idx)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">
            No additional charges applied. Click "+ Add Charge" to include shipping, delivery, or platform fees.
          </p>
        )}
      </div>

      {/* Amount Paid / Deposit */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
        <label className="block font-bold text-slate-700 uppercase tracking-wider text-xs">
          Deposit / Partial Payment Received ({invoice.currency})
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            step="any"
            value={invoice.amountPaid || 0}
            onChange={(e) =>
              onChange({
                ...invoice,
                amountPaid: Math.max(0, parseFloat(e.target.value) || 0),
              })
            }
            placeholder="0.00"
            className="w-48 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
          />
          <div className="text-xs text-slate-500">
            Remaining balance due will be automatically calculated on the invoice.
          </div>
        </div>
      </div>
    </div>
  );
};
