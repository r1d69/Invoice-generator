import React, { useState } from 'react';
import { Invoice, InvoiceCalculations } from '../../types';
import { formatCurrency } from '../../utils/currencies';
import { exportInvoiceToPdf, printInvoice } from '../../utils/pdfExport';
import {
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  FileCheck,
  Building2,
  User,
  CreditCard,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  invoice: Invoice;
  calculations: InvoiceCalculations;
}

export const InvoiceA4Preview: React.FC<Props> = ({ invoice, calculations }) => {
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await exportInvoiceToPdf('printable-invoice-a4', invoice.invoiceNumber || 'INV-FLOW');
    } finally {
      setIsExporting(false);
    }
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(130, Math.max(50, prev + delta)));
  };

  const brandColor = invoice.brandColor || '#2563EB';

  const getFontFamilyClass = () => {
    switch (invoice.fontStyle) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'outfit':
        return "font-['Outfit',sans-serif]";
      case 'sans':
      default:
        return "font-['Plus_Jakarta_Sans',sans-serif]";
    }
  };

  // Render Template-Specific Designs
  const renderTemplateBody = () => {
    const template = invoice.template || 'modern';

    switch (template) {
      case 'minimal':
        return renderMinimalTemplate();
      case 'premium':
        return renderPremiumTemplate();
      case 'creative':
        return renderCreativeTemplate();
      case 'modern':
      default:
        return renderModernTemplate();
    }
  };

  // Helper for Status Badge styling
  const renderStatusBadge = () => {
    const status = calculations.computedStatus || invoice.status || 'Draft';
    let bg = 'bg-slate-100 text-slate-700 border-slate-200';
    if (status === 'Paid') bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    else if (status === 'Partially Paid') bg = 'bg-blue-50 text-blue-700 border-blue-200';
    else if (status === 'Overdue') bg = 'bg-rose-50 text-rose-700 border-rose-200';
    else if (status === 'Sent' || status === 'Viewed') bg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    else if (status === 'Draft') bg = 'bg-amber-50 text-amber-700 border-amber-200';

    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full border ${bg}`}>
        {status}
      </span>
    );
  };

  // =========================================================================
  // 1. MODERN TEMPLATE
  // =========================================================================
  const renderModernTemplate = () => {
    return (
      <div className="p-8 sm:p-12 text-slate-800 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200/80 pb-8">
          <div className="max-w-md">
            {invoice.business.logo ? (
              <div
                className={`mb-4 flex ${
                  invoice.business.logoAlignment === 'center'
                    ? 'justify-center'
                    : invoice.business.logoAlignment === 'right'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <img
                  src={invoice.business.logo}
                  alt="Business Logo"
                  className="object-contain max-h-24"
                  style={{ width: `${invoice.business.logoWidth || 160}px` }}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: brandColor }}>
                {invoice.business.businessName || 'Business Name'}
              </h1>
            )}

            {invoice.business.tagline && (
              <p className="text-xs text-slate-500 font-medium mt-1">{invoice.business.tagline}</p>
            )}

            <div className="mt-3 text-xs text-slate-600 space-y-0.5 leading-relaxed">
              {invoice.business.ownerName && <p className="font-semibold text-slate-700">{invoice.business.ownerName}</p>}
              {invoice.business.address && <p>{invoice.business.address}</p>}
              {(invoice.business.city || invoice.business.state || invoice.business.postalCode) && (
                <p>
                  {[invoice.business.city, invoice.business.state, invoice.business.postalCode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              )}
              {invoice.business.country && <p>{invoice.business.country}</p>}
              {invoice.business.email && <p className="text-slate-500">{invoice.business.email}</p>}
              {invoice.business.phone && <p className="text-slate-500">{invoice.business.phone}</p>}
              {invoice.business.website && <p className="text-slate-500">{invoice.business.website}</p>}
              {invoice.business.taxId && (
                <p className="text-[11px] text-slate-500 mt-1">Tax ID: {invoice.business.taxId}</p>
              )}
              {invoice.business.vatNumber && (
                <p className="text-[11px] text-slate-500">VAT: {invoice.business.vatNumber}</p>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right min-w-[200px] flex flex-col sm:items-end">
            <div className="flex items-center gap-3 sm:justify-end mb-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase" style={{ color: brandColor }}>
                INVOICE
              </h2>
            </div>
            <div className="mb-4">{renderStatusBadge()}</div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs space-y-2 w-full sm:w-auto min-w-[220px]">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Invoice No:</span>
                <span className="font-bold text-slate-900 font-mono">{invoice.invoiceNumber || 'INV-001'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Issue Date:</span>
                <span className="font-semibold text-slate-800">{invoice.invoiceDate}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 font-medium">Due Date:</span>
                <span className="font-semibold text-slate-800">{invoice.dueDate}</span>
              </div>
              {invoice.poNumber && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 font-medium">PO Number:</span>
                  <span className="font-medium text-slate-800">{invoice.poNumber}</span>
                </div>
              )}
              {invoice.clientRef && (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 font-medium">Ref No:</span>
                  <span className="font-medium text-slate-800">{invoice.clientRef}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bill To & Project Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: brandColor }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                BILLED TO / RECIPIENT
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {invoice.client.company || invoice.client.name || 'Client Name'}
            </div>
            {invoice.client.company && invoice.client.name && (
              <p className="text-xs text-slate-600 font-medium mt-0.5">Attn: {invoice.client.name}</p>
            )}
            <div className="text-xs text-slate-600 mt-2 space-y-0.5 leading-relaxed">
              {invoice.client.address && <p>{invoice.client.address}</p>}
              {(invoice.client.city || invoice.client.state || invoice.client.postalCode) && (
                <p>
                  {[invoice.client.city, invoice.client.state, invoice.client.postalCode].filter(Boolean).join(', ')}
                </p>
              )}
              {invoice.client.country && <p>{invoice.client.country}</p>}
              {invoice.client.email && <p className="text-slate-500">{invoice.client.email}</p>}
              {invoice.client.phone && <p className="text-slate-500">{invoice.client.phone}</p>}
              {invoice.client.taxId && <p className="text-[11px] text-slate-500">Tax ID: {invoice.client.taxId}</p>}
              {invoice.client.vatId && <p className="text-[11px] text-slate-500">VAT ID: {invoice.client.vatId}</p>}
            </div>
          </div>

          <div>
            {invoice.projectName && (
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  PROJECT / WORK ORDER
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">{invoice.projectName}</p>
              </div>
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                PAYMENT TERMS
              </span>
              <p className="text-xs font-medium text-slate-700 mt-1 capitalize">
                {invoice.paymentTerms === 'receipt'
                  ? 'Due on Receipt'
                  : invoice.paymentTerms === 'custom'
                  ? `Custom Terms (${invoice.customTermDays || 0} Days)`
                  : invoice.paymentTerms.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr
                className="text-white uppercase font-bold tracking-wider rounded-t-lg"
                style={{ backgroundColor: brandColor }}
              >
                <th className="py-3 px-4 rounded-tl-lg">Description</th>
                <th className="py-3 px-3 text-center">Qty</th>
                <th className="py-3 px-3 text-right">Price</th>
                <th className="py-3 px-3 text-right">Discount</th>
                <th className="py-3 px-3 text-right">Tax</th>
                <th className="py-3 px-4 text-right rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 border-b border-slate-200">
              {invoice.items.map((item, idx) => {
                const lineCalc = calculations.lines[idx] || {
                  subtotal: item.quantity * item.unitPrice,
                  discountAmount: 0,
                  taxableAmount: item.quantity * item.unitPrice,
                  taxAmount: 0,
                  lineTotal: item.quantity * item.unitPrice,
                };

                return (
                  <tr key={item.id || idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <p className="font-bold text-slate-900 text-sm">{item.name || 'Item Name'}</p>
                      {item.description && (
                        <p className="text-slate-500 text-xs mt-0.5 whitespace-pre-line leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-700 font-medium">
                      {item.quantity} {item.unit && <span className="text-slate-400 text-[10px]">{item.unit}</span>}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-700 font-medium">
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-600 font-medium">
                      {item.discount > 0 ? (
                        item.discountType === 'percentage' ? (
                          <span>
                            {item.discount}%{' '}
                            <span className="text-slate-400 text-[10px]">
                              (-{formatCurrency(lineCalc.discountAmount, invoice.currency)})
                            </span>
                          </span>
                        ) : (
                          <span>-{formatCurrency(lineCalc.discountAmount, invoice.currency)}</span>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-600 font-medium">
                      {!item.isTaxExempt && item.taxRate > 0 ? (
                        <span>
                          {item.taxRate}%{' '}
                          <span className="text-slate-400 text-[10px]">
                            (+{formatCurrency(lineCalc.taxAmount, invoice.currency)})
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400">0%</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(lineCalc.lineTotal, invoice.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals & Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-2">
          {/* Payment & Bank info */}
          <div className="w-full sm:max-w-md space-y-4">
            {hasPaymentDetails() && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  <span>Payment Details</span>
                </div>
                {invoice.paymentDetails.paymentMethod && (
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-600">Method: </span>
                    {invoice.paymentDetails.paymentMethod}
                  </p>
                )}
                {invoice.paymentDetails.bankName && (
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-600">Bank Name: </span>
                    {invoice.paymentDetails.bankName}
                  </p>
                )}
                {invoice.paymentDetails.accountName && (
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-600">Account Name: </span>
                    {invoice.paymentDetails.accountName}
                  </p>
                )}
                {invoice.paymentDetails.accountNumber && (
                  <p className="text-slate-700 font-mono">
                    <span className="font-semibold text-slate-600 font-sans">Account No: </span>
                    {invoice.paymentDetails.accountNumber}
                  </p>
                )}
                {invoice.paymentDetails.routingNumber && (
                  <p className="text-slate-700 font-mono">
                    <span className="font-semibold text-slate-600 font-sans">Routing No: </span>
                    {invoice.paymentDetails.routingNumber}
                  </p>
                )}
                {invoice.paymentDetails.swiftBic && (
                  <p className="text-slate-700 font-mono">
                    <span className="font-semibold text-slate-600 font-sans">SWIFT / BIC: </span>
                    {invoice.paymentDetails.swiftBic}
                  </p>
                )}
                {invoice.paymentDetails.iban && (
                  <p className="text-slate-700 font-mono">
                    <span className="font-semibold text-slate-600 font-sans">IBAN: </span>
                    {invoice.paymentDetails.iban}
                  </p>
                )}
                {invoice.paymentDetails.paypalEmail && (
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-600">PayPal: </span>
                    {invoice.paymentDetails.paypalEmail}
                  </p>
                )}
                {invoice.paymentDetails.paymentLink && (
                  <p className="text-slate-700 truncate">
                    <span className="font-semibold text-slate-600">Payment Link: </span>
                    <a
                      href={invoice.paymentDetails.paymentLink}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-blue-600"
                    >
                      {invoice.paymentDetails.paymentLink}
                    </a>
                  </p>
                )}
                {invoice.paymentDetails.instructions && (
                  <p className="text-slate-500 italic pt-1 border-t border-slate-200/60">
                    {invoice.paymentDetails.instructions}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Totals Breakdown */}
          <div className="w-full sm:w-80 text-xs space-y-2.5">
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(calculations.subtotal, invoice.currency)}</span>
            </div>

            {calculations.totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span className="font-medium">Total Discount</span>
                <span className="font-semibold">-{formatCurrency(calculations.totalDiscount, invoice.currency)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Taxable Amount</span>
              <span className="font-semibold text-slate-800">{formatCurrency(calculations.taxableAmount, invoice.currency)}</span>
            </div>

            {calculations.totalTax > 0 && (
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">
                  {invoice.taxCalculationMode === 'global' ? `${invoice.globalTaxName || 'Tax'} (${invoice.globalTaxRate}%)` : 'Total Tax'}
                </span>
                <span className="font-semibold text-slate-900">+{formatCurrency(calculations.totalTax, invoice.currency)}</span>
              </div>
            )}

            {invoice.additionalCharges && invoice.additionalCharges.length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                {invoice.additionalCharges.map((charge) => {
                  const amount = charge.type === 'percentage'
                    ? (calculations.taxableAmount * charge.amount) / 100
                    : charge.amount;
                  return (
                    <div key={charge.id} className="flex justify-between text-slate-600">
                      <span className="font-medium">{charge.name || 'Additional Charge'}</span>
                      <span className="font-semibold text-slate-900">+{formatCurrency(amount, invoice.currency)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total */}
            <div
              className="flex justify-between items-center py-3 px-4 rounded-xl text-white font-bold text-base mt-3 shadow-sm"
              style={{ backgroundColor: brandColor }}
            >
              <span>INVOICE TOTAL</span>
              <span className="text-lg">{formatCurrency(calculations.invoiceTotal, invoice.currency)}</span>
            </div>

            {/* Payment & Balance Due */}
            {calculations.amountPaid > 0 && (
              <div className="space-y-1 pt-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Amount Paid / Deposit</span>
                  <span className="font-semibold text-emerald-600">-{formatCurrency(calculations.amountPaid, invoice.currency)}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-amber-900 font-bold">
                  <span className="uppercase text-[11px] tracking-wide">Balance Due</span>
                  <span className="text-sm font-extrabold">{formatCurrency(calculations.balanceDue, invoice.currency)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.termsAndConditions || invoice.latePaymentPolicy || invoice.refundPolicy) && (
          <div className="pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
            {invoice.notes && (
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Notes & Remarks
                </h4>
                <p className="whitespace-pre-line leading-relaxed text-slate-600">{invoice.notes}</p>
              </div>
            )}

            {invoice.termsAndConditions && (
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Terms & Conditions
                </h4>
                <p className="whitespace-pre-line leading-relaxed text-slate-600">{invoice.termsAndConditions}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2">
          <span>Thank you for your business!</span>
          <span>
            {invoice.business.businessName || 'InvoiceFlow'} • Page 1 of 1
          </span>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 2. MINIMAL TEMPLATE
  // =========================================================================
  const renderMinimalTemplate = () => {
    return (
      <div className="p-8 sm:p-14 text-slate-800 space-y-10 font-sans">
        {/* Minimal Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-8">
          <div>
            {invoice.business.logo ? (
              <img
                src={invoice.business.logo}
                alt="Logo"
                className="max-h-20 object-contain mb-3"
                style={{ width: `${invoice.business.logoWidth || 140}px` }}
              />
            ) : (
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {invoice.business.businessName || 'Business Name'}
              </h1>
            )}
            <div className="text-xs text-slate-500 space-y-0.5 mt-2">
              {invoice.business.address && <p>{invoice.business.address}</p>}
              {invoice.business.email && <p>{invoice.business.email}</p>}
              {invoice.business.taxId && <p>Tax ID: {invoice.business.taxId}</p>}
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-light tracking-wide text-slate-400 uppercase">Invoice</h2>
            <p className="text-sm font-mono font-bold text-slate-900 mt-1">{invoice.invoiceNumber}</p>
            <div className="text-xs text-slate-500 mt-3 space-y-1">
              <p>Issued: <span className="font-semibold text-slate-700">{invoice.invoiceDate}</span></p>
              <p>Due: <span className="font-semibold text-slate-700">{invoice.dueDate}</span></p>
            </div>
            <div className="mt-2">{renderStatusBadge()}</div>
          </div>
        </div>

        {/* Minimal Client Info */}
        <div className="grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Invoiced To
            </span>
            <p className="text-sm font-bold text-slate-900">{invoice.client.company || invoice.client.name}</p>
            {invoice.client.address && <p className="text-slate-600 mt-1">{invoice.client.address}</p>}
            {invoice.client.email && <p className="text-slate-500">{invoice.client.email}</p>}
          </div>

          {invoice.projectName && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Project
              </span>
              <p className="text-sm font-semibold text-slate-900">{invoice.projectName}</p>
            </div>
          )}
        </div>

        {/* Minimal Items Table */}
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-300 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-2.5">Item & Description</th>
              <th className="py-2.5 text-center">Qty</th>
              <th className="py-2.5 text-right">Rate</th>
              <th className="py-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.map((item, idx) => {
              const lineCalc = calculations.lines[idx] || { lineTotal: item.quantity * item.unitPrice };
              return (
                <tr key={item.id || idx}>
                  <td className="py-4 pr-4">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    {item.description && <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>}
                  </td>
                  <td className="py-4 px-2 text-center text-slate-700">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-slate-700">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-4 pl-4 text-right font-bold text-slate-900">
                    {formatCurrency(lineCalc.lineTotal, invoice.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Minimal Totals */}
        <div className="flex justify-between items-start gap-8 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 max-w-xs space-y-1">
            {hasPaymentDetails() && (
              <div>
                <p className="font-semibold text-slate-700">Bank Details:</p>
                <p>{invoice.paymentDetails.bankName} • {invoice.paymentDetails.accountNumber}</p>
                {invoice.paymentDetails.swiftBic && <p>SWIFT: {invoice.paymentDetails.swiftBic}</p>}
              </div>
            )}
          </div>

          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(calculations.subtotal, invoice.currency)}</span>
            </div>
            {calculations.totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatCurrency(calculations.totalDiscount, invoice.currency)}</span>
              </div>
            )}
            {calculations.totalTax > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>+{formatCurrency(calculations.totalTax, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-900">
              <span>Total</span>
              <span>{formatCurrency(calculations.invoiceTotal, invoice.currency)}</span>
            </div>
            {calculations.amountPaid > 0 && (
              <div className="flex justify-between text-amber-800 font-bold pt-1">
                <span>Balance Due</span>
                <span>{formatCurrency(calculations.balanceDue, invoice.currency)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 3. PREMIUM TEMPLATE
  // =========================================================================
  const renderPremiumTemplate = () => {
    return (
      <div className="p-8 sm:p-12 text-slate-900 space-y-8 bg-white border-t-8" style={{ borderColor: brandColor }}>
        {/* Luxury Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b-2 border-slate-900">
          <div>
            {invoice.business.logo ? (
              <img
                src={invoice.business.logo}
                alt="Logo"
                className="max-h-20 object-contain mb-3"
                style={{ width: `${invoice.business.logoWidth || 160}px` }}
              />
            ) : (
              <h1 className="text-3xl font-serif font-black tracking-tight text-slate-950">
                {invoice.business.businessName || 'Business Name'}
              </h1>
            )}
            <p className="text-xs text-slate-500 tracking-widest uppercase font-semibold mt-1">
              {invoice.business.tagline || 'Studio & Design Consultancy'}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-serif italic text-slate-400 block">Statement & Bill of Services</span>
            <span className="text-3xl font-serif font-black tracking-tight text-slate-900 uppercase">
              {invoice.invoiceNumber}
            </span>
            <div className="mt-2">{renderStatusBadge()}</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs py-2 bg-slate-50 p-5 rounded-lg border border-slate-200">
          <div>
            <span className="font-serif italic text-slate-500 block mb-1">From / Provider</span>
            <p className="font-bold text-slate-900">{invoice.business.ownerName || invoice.business.businessName}</p>
            <p className="text-slate-600">{invoice.business.address}</p>
            <p className="text-slate-600">{invoice.business.email}</p>
          </div>
          <div>
            <span className="font-serif italic text-slate-500 block mb-1">To / Client</span>
            <p className="font-bold text-slate-900">{invoice.client.company || invoice.client.name}</p>
            <p className="text-slate-600">{invoice.client.address}</p>
            <p className="text-slate-600">{invoice.client.email}</p>
          </div>
          <div>
            <span className="font-serif italic text-slate-500 block mb-1">Dates & Agreement</span>
            <p className="text-slate-700">Issued: <strong className="text-slate-900">{invoice.invoiceDate}</strong></p>
            <p className="text-slate-700">Due: <strong className="text-slate-900">{invoice.dueDate}</strong></p>
            {invoice.poNumber && <p className="text-slate-700">PO: {invoice.poNumber}</p>}
          </div>
        </div>

        {/* Premium Table */}
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 font-serif font-bold text-slate-900">
              <th className="py-3 px-2">Services & Deliverables</th>
              <th className="py-3 px-2 text-center">Qty</th>
              <th className="py-3 px-2 text-right">Rate</th>
              <th className="py-3 px-2 text-right">Tax / Disc</th>
              <th className="py-3 px-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {invoice.items.map((item, idx) => {
              const lineCalc = calculations.lines[idx] || { lineTotal: item.quantity * item.unitPrice };
              return (
                <tr key={item.id || idx}>
                  <td className="py-4 px-2">
                    <p className="font-bold font-serif text-slate-950 text-sm">{item.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
                  </td>
                  <td className="py-4 px-2 text-center text-slate-800 font-medium">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-slate-800">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-4 px-2 text-right text-slate-500">
                    {item.discount > 0 ? `-${item.discount}% ` : ''}
                    {item.taxRate > 0 ? `+${item.taxRate}%` : ''}
                  </td>
                  <td className="py-4 px-2 text-right font-serif font-bold text-slate-950 text-sm">
                    {formatCurrency(lineCalc.lineTotal, invoice.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Premium Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4">
          <div className="text-xs text-slate-600 max-w-sm">
            {hasPaymentDetails() && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <p className="font-serif font-bold text-slate-900">Settlement Account</p>
                <p>{invoice.paymentDetails.bankName} • IBAN: {invoice.paymentDetails.iban || invoice.paymentDetails.accountNumber}</p>
                {invoice.paymentDetails.swiftBic && <p>SWIFT/BIC: {invoice.paymentDetails.swiftBic}</p>}
              </div>
            )}
          </div>

          <div className="w-full sm:w-80 text-xs space-y-2 font-serif">
            <div className="flex justify-between font-sans text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(calculations.subtotal, invoice.currency)}</span>
            </div>
            {calculations.totalDiscount > 0 && (
              <div className="flex justify-between font-sans text-emerald-700">
                <span>Discount</span>
                <span>-{formatCurrency(calculations.totalDiscount, invoice.currency)}</span>
              </div>
            )}
            {calculations.totalTax > 0 && (
              <div className="flex justify-between font-sans text-slate-600">
                <span>Tax</span>
                <span>+{formatCurrency(calculations.totalTax, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-slate-950 pt-2 border-t-2 border-slate-900">
              <span>Total Due</span>
              <span>{formatCurrency(calculations.invoiceTotal, invoice.currency)}</span>
            </div>
            {calculations.amountPaid > 0 && (
              <div className="flex justify-between text-slate-800 font-sans font-bold pt-1 bg-amber-50 p-2 rounded">
                <span>Balance Due</span>
                <span>{formatCurrency(calculations.balanceDue, invoice.currency)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // 4. CREATIVE TEMPLATE
  // =========================================================================
  const renderCreativeTemplate = () => {
    return (
      <div className="p-8 sm:p-12 text-slate-900 space-y-8 font-['Outfit',sans-serif]">
        {/* Creative Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 bg-slate-950 text-white p-8 rounded-2xl">
          <div>
            {invoice.business.logo ? (
              <img
                src={invoice.business.logo}
                alt="Logo"
                className="max-h-20 object-contain mb-3 invert brightness-200"
                style={{ width: `${invoice.business.logoWidth || 160}px` }}
              />
            ) : (
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                {invoice.business.businessName || 'CREATIVE STUDIO'}
              </h1>
            )}
            <p className="text-xs text-slate-400 font-medium mt-1">{invoice.business.tagline}</p>
          </div>

          <div className="sm:text-right">
            <span
              className="inline-block px-3 py-1 text-xs font-bold uppercase rounded-lg text-white mb-2"
              style={{ backgroundColor: brandColor }}
            >
              INVOICE #{invoice.invoiceNumber}
            </span>
            <p className="text-xs text-slate-400">Due: <strong className="text-white">{invoice.dueDate}</strong></p>
          </div>
        </div>

        {/* Info Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">CLIENT</span>
            <p className="text-base font-bold text-slate-900">{invoice.client.company || invoice.client.name}</p>
            <p className="text-slate-600 mt-1">{invoice.client.email}</p>
            <p className="text-slate-500">{invoice.client.address}</p>
          </div>
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">PROJECT DETAILS</span>
            <p className="text-base font-bold text-slate-900">{invoice.projectName || 'Commercial Creative Services'}</p>
            <p className="text-slate-600 mt-1">Status: {renderStatusBadge()}</p>
          </div>
        </div>

        {/* Creative Table */}
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-slate-900 text-slate-900 font-bold uppercase text-[11px]">
              <th className="py-3">Description</th>
              <th className="py-3 text-center">Qty</th>
              <th className="py-3 text-right">Price</th>
              <th className="py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoice.items.map((item, idx) => {
              const lineCalc = calculations.lines[idx] || { lineTotal: item.quantity * item.unitPrice };
              return (
                <tr key={item.id || idx}>
                  <td className="py-4 pr-4">
                    <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
                  </td>
                  <td className="py-4 text-center font-bold">{item.quantity}</td>
                  <td className="py-4 text-right font-medium">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-4 text-right font-bold text-slate-900 text-sm">
                    {formatCurrency(lineCalc.lineTotal, invoice.currency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4">
          <div className="text-xs text-slate-600 max-w-sm">
            {hasPaymentDetails() && (
              <div className="p-4 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">Direct Payment</p>
                <p>{invoice.paymentDetails.bankName} • {invoice.paymentDetails.accountNumber}</p>
              </div>
            )}
          </div>

          <div className="w-full sm:w-80 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold">{formatCurrency(calculations.subtotal, invoice.currency)}</span>
            </div>
            {calculations.totalTax > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span className="font-bold">+{formatCurrency(calculations.totalTax, invoice.currency)}</span>
              </div>
            )}
            <div
              className="flex justify-between items-center p-4 rounded-xl text-white font-black text-base shadow-sm"
              style={{ backgroundColor: brandColor }}
            >
              <span>TOTAL</span>
              <span className="text-xl">{formatCurrency(calculations.invoiceTotal, invoice.currency)}</span>
            </div>
            {calculations.balanceDue > 0 && (
              <div className="flex justify-between items-center p-3 bg-amber-50 text-amber-900 rounded-lg font-bold">
                <span>BALANCE DUE</span>
                <span>{formatCurrency(calculations.balanceDue, invoice.currency)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const hasPaymentDetails = () => {
    return Boolean(
      invoice.paymentDetails.bankName ||
      invoice.paymentDetails.accountNumber ||
      invoice.paymentDetails.paypalEmail ||
      invoice.paymentDetails.paymentLink ||
      invoice.paymentDetails.iban ||
      invoice.paymentDetails.instructions
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-200/90 rounded-2xl border border-slate-300 overflow-hidden shadow-inner relative">
      {/* Top Preview Toolbar */}
      <div className="no-print bg-[#0F172A] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/90 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200">
            <FileCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Live A4 Preview</span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            {invoice.invoiceNumber || 'INV-2026-001'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs text-slate-300 border border-slate-700">
            <button
              onClick={() => handleZoom(-10)}
              className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px]">{zoom}%</span>
            <button
              onClick={() => handleZoom(10)}
              className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={printInvoice}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition border border-slate-700"
            title="Print Invoice"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/20 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Canvas / Sheet Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start relative custom-scrollbar">
        {/* Floating pill badge */}
        <div className="no-print absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/85 backdrop-blur-sm rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-300/80 shadow-xs z-10 pointer-events-none">
          Live A4 Sheet
        </div>

        <div
          id="printable-invoice-a4"
          className={`a4-sheet-container a4-preview-page bg-white shadow-2xl rounded-sm border border-slate-200/90 transition-transform origin-top mt-5 ${getFontFamilyClass()}`}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {renderTemplateBody()}
        </div>
      </div>
    </div>
  );
};
