import React, { useState, useMemo } from 'react';
import {
  AppSettings,
  Client,
  Invoice,
  ServiceItem,
} from '../../types';
import { calculateInvoice } from '../../utils/calculations';
import { formatCurrency } from '../../utils/currencies';
import { BusinessSection } from './BusinessSection';
import { ClientSection } from './ClientSection';
import { InvoiceDetailsSection } from './InvoiceDetailsSection';
import { ItemsTableEditor } from './ItemsTableEditor';
import { TotalsAndChargesSection } from './TotalsAndChargesSection';
import { PaymentDetailsSection } from './PaymentDetailsSection';
import { NotesTermsSection } from './NotesTermsSection';
import { DesignBrandingSection } from './DesignBrandingSection';
import { InvoiceA4Preview } from '../InvoicePreview/InvoiceA4Preview';
import confetti from 'canvas-confetti';
import {
  Save,
  Check,
  Eye,
  Edit3,
  ArrowLeft,
  Share2,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Building2,
  UserCheck,
  Calendar,
  Percent,
  CreditCard,
  FileCheck2,
  Palette,
  Download,
  Printer,
  Copy,
} from 'lucide-react';

interface Props {
  initialInvoice: Invoice;
  clientsList: Client[];
  servicesCatalog: ServiceItem[];
  settings: AppSettings;
  onSaveInvoice: (invoice: Invoice) => void;
  onSaveClient: (client: Client) => void;
  onCancel: () => void;
  onRegenerateNumber: () => void;
  onOpenSendModal: (invoice: Invoice) => void;
}

type EditorTab =
  | 'items'
  | 'business'
  | 'client'
  | 'details'
  | 'taxes'
  | 'payment'
  | 'notes'
  | 'design';

export const InvoiceEditor: React.FC<Props> = ({
  initialInvoice,
  clientsList,
  servicesCatalog,
  settings,
  onSaveInvoice,
  onSaveClient,
  onCancel,
  onRegenerateNumber,
  onOpenSendModal,
}) => {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [activeTab, setActiveTab] = useState<EditorTab>('items');
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Real-time calculations
  const calculations = useMemo(() => {
    return calculateInvoice(invoice);
  }, [invoice]);

  const handleInvoiceChange = (updated: Invoice) => {
    setInvoice(updated);
    setSaveStatus('unsaved');
  };

  const handleSave = (statusOverride?: Invoice['status']) => {
    setSaveStatus('saving');
    const toSave: Invoice = {
      ...invoice,
      status: statusOverride || invoice.status || 'Unpaid',
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onSaveInvoice(toSave);
      setSaveStatus('saved');
      // Gentle celebratory feedback
      if (statusOverride === 'Paid' || toSave.status === 'Paid') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }
    }, 250);
  };

  const tabs: { id: EditorTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'items', label: 'Items & Services', icon: FileSpreadsheet },
    { id: 'details', label: 'Invoice Details', icon: Calendar },
    { id: 'client', label: 'Client / Recipient', icon: UserCheck },
    { id: 'business', label: 'Business Profile', icon: Building2 },
    { id: 'taxes', label: 'Taxes & Discounts', icon: Percent },
    { id: 'payment', label: 'Payment Details', icon: CreditCard },
    { id: 'notes', label: 'Notes & Terms', icon: FileCheck2 },
    { id: 'design', label: 'Design & Style', icon: Palette },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-[1920px] mx-auto">
      {/* Top Editor Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
            title="Back to invoices"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                {invoice.invoiceNumber || 'New Invoice'}
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  invoice.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : invoice.status === 'Draft'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {invoice.client.company || invoice.client.name || 'No client specified'} • Total:{' '}
              <strong>{formatCurrency(calculations.invoiceTotal, invoice.currency)}</strong>
            </p>
          </div>
        </div>

        {/* Mobile toggle between Editor and Preview */}
        <div className="flex xl:hidden bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
              mobileView === 'editor' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition ${
              mobileView === 'preview' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Save & Action Buttons */}
        <div className="flex items-center gap-2">
          {saveStatus === 'unsaved' && (
            <span className="text-xs text-amber-600 font-medium hidden md:inline">
              ● Unsaved Changes
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-emerald-600 font-medium hidden md:flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          <button
            type="button"
            onClick={() => onOpenSendModal(invoice)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('Draft')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave(invoice.status === 'Draft' ? 'Unpaid' : invoice.status)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Form Editor */}
        <div
          className={`w-full xl:w-[50%] 2xl:w-[48%] flex flex-col bg-white border-r border-slate-200 overflow-hidden ${
            mobileView === 'preview' ? 'hidden xl:flex' : 'flex'
          }`}
        >
          {/* Editor Tabs Navigation */}
          <div className="flex overflow-x-auto bg-slate-50/80 border-b border-slate-200 px-4 py-2 gap-1.5 shrink-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeTab === 'items' && (
              <ItemsTableEditor
                items={invoice.items}
                currency={invoice.currency}
                calculations={calculations}
                servicesCatalog={servicesCatalog}
                onChange={(items) => handleInvoiceChange({ ...invoice, items })}
              />
            )}

            {activeTab === 'details' && (
              <InvoiceDetailsSection
                invoice={invoice}
                onChange={handleInvoiceChange}
                onRegenerateNumber={onRegenerateNumber}
              />
            )}

            {activeTab === 'client' && (
              <ClientSection
                client={invoice.client}
                clientsList={clientsList}
                onChange={(client) => handleInvoiceChange({ ...invoice, client })}
                onSaveAsNewClient={onSaveClient}
              />
            )}

            {activeTab === 'business' && (
              <BusinessSection
                business={invoice.business}
                onChange={(business) => handleInvoiceChange({ ...invoice, business })}
              />
            )}

            {activeTab === 'taxes' && (
              <TotalsAndChargesSection
                invoice={invoice}
                calculations={calculations}
                onChange={handleInvoiceChange}
              />
            )}

            {activeTab === 'payment' && (
              <PaymentDetailsSection
                paymentDetails={invoice.paymentDetails}
                onChange={(paymentDetails) => handleInvoiceChange({ ...invoice, paymentDetails })}
              />
            )}

            {activeTab === 'notes' && (
              <NotesTermsSection invoice={invoice} onChange={handleInvoiceChange} />
            )}

            {activeTab === 'design' && (
              <DesignBrandingSection invoice={invoice} onChange={handleInvoiceChange} />
            )}
          </div>
        </div>

        {/* Right Column: Real-Time Live Preview */}
        <div
          className={`flex-1 flex-col bg-slate-100 overflow-hidden ${
            mobileView === 'editor' ? 'hidden xl:flex' : 'flex'
          }`}
        >
          <InvoiceA4Preview invoice={invoice} calculations={calculations} />
        </div>
      </div>
    </div>
  );
};
