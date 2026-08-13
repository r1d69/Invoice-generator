import React, { useState } from 'react';
import { Invoice } from '../types';
import { calculateInvoice } from '../utils/calculations';
import { formatCurrency } from '../utils/currencies';
import { exportInvoiceToPdf, printInvoice } from '../utils/pdfExport';
import {
  Share2,
  Mail,
  Copy,
  Check,
  Download,
  Printer,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface Props {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsSent: (invoiceId: string) => void;
}

export const SendInvoiceModal: React.FC<Props> = ({
  invoice,
  isOpen,
  onClose,
  onMarkAsSent,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const calculations = calculateInvoice(invoice);

  // Formulate email subject & body
  const emailSubject = `Invoice ${invoice.invoiceNumber} from ${invoice.business.businessName || 'Studio'}`;
  const emailBody = `Hi ${invoice.client.name || 'there'},\n\nPlease find attached invoice ${
    invoice.invoiceNumber
  } for ${formatCurrency(calculations.invoiceTotal, invoice.currency)}.\n\nDue Date: ${
    invoice.dueDate
  }\nAmount Due: ${formatCurrency(calculations.balanceDue, invoice.currency)}\n\nThank you for your business!\n\nBest regards,\n${
    invoice.business.businessName
  }`;

  const mailtoLink = `mailto:${encodeURIComponent(invoice.client.email || '')}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const invoiceSummaryText = `📄 INVOICE: ${invoice.invoiceNumber}\nClient: ${
    invoice.client.company || invoice.client.name
  }\nTotal Amount: ${formatCurrency(calculations.invoiceTotal, invoice.currency)}\nBalance Due: ${formatCurrency(
    calculations.balanceDue,
    invoice.currency
  )}\nDue Date: ${invoice.dueDate}\nStatus: ${calculations.computedStatus}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `?invoice=${invoice.invoiceNumber}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(invoiceSummaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await exportInvoiceToPdf('printable-invoice-page', invoice.invoiceNumber);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Send Invoice {invoice.invoiceNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Overview */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Recipient:</span>
            <span className="font-bold text-slate-900">
              {invoice.client.company || invoice.client.name || 'No client set'} ({invoice.client.email || 'No email'})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Amount:</span>
            <span className="font-bold text-slate-900 font-mono">
              {formatCurrency(calculations.invoiceTotal, invoice.currency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Balance Due:</span>
            <span className="font-bold text-blue-600 font-mono">
              {formatCurrency(calculations.balanceDue, invoice.currency)}
            </span>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-3 text-xs">
          {/* Send via Email */}
          <a
            href={mailtoLink}
            onClick={() => onMarkAsSent(invoice.id)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-blue-600">
                  Open in Default Email Client
                </div>
                <div className="text-[11px] text-slate-500">
                  Pre-fills subject, recipient, and invoice summary
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
          </a>

          {/* Copy Plain Text Summary */}
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900">
                  {copiedSummary ? 'Copied to Clipboard!' : 'Copy Summary for WhatsApp / Slack'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Quick text summary of totals and due date
                </div>
              </div>
            </div>
            {copiedSummary ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Export PDF */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              type="button"
              onClick={() => printInvoice()}
              className="flex items-center justify-center gap-1.5 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print A4 Invoice</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
