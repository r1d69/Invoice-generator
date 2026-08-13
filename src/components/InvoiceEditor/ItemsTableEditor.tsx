import React, { useState } from 'react';
import { InvoiceItem, ServiceItem, DiscountType, InvoiceCalculations } from '../../types';
import { formatCurrency } from '../../utils/currencies';
import {
  ListPlus,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  BookOpen,
  Percent,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  items: InvoiceItem[];
  currency: string;
  calculations: InvoiceCalculations;
  servicesCatalog: ServiceItem[];
  onChange: (items: InvoiceItem[]) => void;
}

export const ItemsTableEditor: React.FC<Props> = ({
  items,
  currency,
  calculations,
  servicesCatalog,
  onChange,
}) => {
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      name: '',
      description: '',
      quantity: 1,
      unit: 'hrs',
      unitPrice: 100,
      discount: 0,
      discountType: 'percentage',
      taxRate: 15,
      taxName: 'VAT',
      isTaxExempt: false,
    };
    onChange([...items, newItem]);
  };

  const handleAddFromCatalog = (service: ServiceItem) => {
    const newItem: InvoiceItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      serviceId: service.id,
      name: service.name,
      description: service.description,
      quantity: 1,
      unit: service.unit || 'units',
      unitPrice: service.defaultPrice || 100,
      discount: service.defaultDiscount || 0,
      discountType: service.defaultDiscountType || 'percentage',
      taxRate: service.isTaxExempt ? 0 : service.defaultTaxRate || 15,
      taxName: service.defaultTaxName || 'VAT',
      isTaxExempt: service.isTaxExempt || false,
    };
    onChange([...items, newItem]);
    setShowCatalogModal(false);
  };

  const handleDuplicateItem = (index: number) => {
    const target = items[index];
    const duplicate: InvoiceItem = {
      ...target,
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
    };
    const updated = [...items];
    updated.splice(index + 1, 0, duplicate);
    onChange(updated);
  };

  const handleDeleteItem = (index: number) => {
    if (items.length <= 1) {
      // Clear line rather than remove last line
      onChange([
        {
          id: 'item_' + Date.now(),
          name: '',
          description: '',
          quantity: 1,
          unit: 'units',
          unitPrice: 0,
          discount: 0,
          discountType: 'percentage',
          taxRate: 0,
          taxName: 'VAT',
          isTaxExempt: false,
        },
      ]);
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) {
      return;
    }
    const updated = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm">Line Items & Services</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Service Catalog ({servicesCatalog.length})</span>
          </button>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const lineCalc = calculations.lines[idx] || {
            subtotal: item.quantity * item.unitPrice,
            discountAmount: 0,
            taxAmount: 0,
            lineTotal: item.quantity * item.unitPrice,
          };

          return (
            <div
              key={item.id || idx}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 transition-all hover:border-slate-300"
            >
              {/* Header row with line number & actions */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Item #{idx + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 'down')}
                    disabled={idx === items.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200 transition"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateItem(idx)}
                    className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200 transition"
                    title="Duplicate item"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 transition"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title and Description */}
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                    placeholder="Service / Product Name (e.g. 3D Product Modeling)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Description / Deliverable breakdown (supports multiple lines)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              {/* Numbers Grid: Qty, Unit, Unit Price, Discount, Tax, Line Total */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs pt-1">
                {/* Quantity */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Qty</label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, 'quantity', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Unit</label>
                  <input
                    type="text"
                    value={item.unit}
                    onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                    placeholder="hrs/units"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Price ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(idx, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Discount */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-slate-600">Discount</label>
                    <button
                      type="button"
                      onClick={() =>
                        handleItemChange(
                          idx,
                          'discountType',
                          item.discountType === 'percentage' ? 'fixed' : 'percentage'
                        )
                      }
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                    >
                      {item.discountType === 'percentage' ? '%' : currency}
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.discount || 0}
                    onChange={(e) =>
                      handleItemChange(idx, 'discount', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Tax Rate */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-slate-600">Tax (%)</label>
                    <button
                      type="button"
                      onClick={() => handleItemChange(idx, 'isTaxExempt', !item.isTaxExempt)}
                      className={`text-[10px] font-bold ${
                        item.isTaxExempt ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    >
                      {item.isTaxExempt ? 'Exempt' : 'Taxable'}
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    disabled={item.isTaxExempt}
                    value={item.isTaxExempt ? 0 : item.taxRate || 0}
                    onChange={(e) =>
                      handleItemChange(idx, 'taxRate', Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-right disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {/* Total */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 text-right">
                    Line Total
                  </label>
                  <div className="px-2 py-1.5 bg-slate-200/70 rounded-lg font-bold text-slate-900 text-right text-xs">
                    {formatCurrency(lineCalc.lineTotal, currency)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Select from Service Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {servicesCatalog.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No services configured in catalog yet.
                </div>
              ) : (
                servicesCatalog.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleAddFromCatalog(service)}
                    className="p-3.5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs group-hover:text-blue-700">
                        {service.name}
                      </h4>
                      <p className="text-slate-500 text-[11px] mt-0.5 max-w-xs truncate">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>Unit: {service.unit}</span>
                        <span>•</span>
                        <span>Tax: {service.isTaxExempt ? 'Exempt' : `${service.defaultTaxRate}%`}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">
                        {formatCurrency(service.defaultPrice, currency)}
                      </p>
                      <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">
                        + Add to Invoice
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
