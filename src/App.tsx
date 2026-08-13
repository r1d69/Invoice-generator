import React, { useState, useEffect } from 'react';
import {
  AppSettings,
  Client,
  Invoice,
  ServiceItem,
  TemplateStyle,
} from './types';
import {
  loadInvoices,
  saveInvoices,
  loadClients,
  saveClients,
  loadServices,
  saveServices,
  loadSettings,
  saveSettings,
  getNextInvoiceNumber,
  exportFullDataBackup,
  importFullDataBackup,
  resetAllDataToSample,
} from './utils/storage';
import { DashboardView } from './components/DashboardView';
import { InvoicesListView } from './components/InvoicesListView';
import { InvoiceEditor } from './components/InvoiceEditor/InvoiceEditor';
import { ClientsView } from './components/ClientsView';
import { ServicesView } from './components/ServicesView';
import { TemplatesView } from './components/TemplatesView';
import { SettingsView } from './components/SettingsView';
import { SendInvoiceModal } from './components/SendInvoiceModal';
import {
  LayoutDashboard,
  FileSpreadsheet,
  PlusCircle,
  Users,
  Boxes,
  LayoutTemplate,
  Settings as SettingsIcon,
  Menu,
  X,
  Sparkles,
  Receipt,
  Download,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

type NavTab =
  | 'dashboard'
  | 'invoices'
  | 'create_invoice'
  | 'clients'
  | 'services'
  | 'templates'
  | 'settings';

export const App: React.FC = () => {
  // Application State
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [invoices, setInvoicesState] = useState<Invoice[]>(loadInvoices);
  const [clients, setClientsState] = useState<Client[]>(loadClients);
  const [services, setServicesState] = useState<ServiceItem[]>(loadServices);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Active Editing Invoice State
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Modals
  const [sendInvoiceTarget, setSendInvoiceTarget] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'invoice' | 'client' | 'service';
    data: any;
  } | null>(null);

  // Auto-Save Effect
  useEffect(() => {
    saveInvoices(invoices);
  }, [invoices]);

  useEffect(() => {
    saveClients(clients);
  }, [clients]);

  useEffect(() => {
    saveServices(services);
  }, [services]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Invoice Number Generator Helper
  const generateNewInvoice = (
    clientOverride?: Client,
    templateOverride?: TemplateStyle,
    colorOverride?: string
  ): Invoice => {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const nextNumber = getNextInvoiceNumber(invoices, settings);

    return {
      id: 'inv_' + Date.now(),
      invoiceNumber: nextNumber,
      poNumber: '',
      invoiceDate: today,
      dueDate: dueDateStr,
      status: 'Unpaid',
      paymentTerms: settings.defaultPaymentTerms || 'net30',
      currency: settings.defaultCurrency || 'USD',
      template: templateOverride || settings.defaultTemplate || 'modern',
      brandColor: colorOverride || settings.defaultBrandColor || '#2563EB',
      fontStyle: 'sans',
      business: { ...settings.businessProfile },
      client: clientOverride
        ? {
            id: clientOverride.id,
            name: clientOverride.name,
            company: clientOverride.company,
            email: clientOverride.email,
            phone: clientOverride.phone,
            address: clientOverride.address,
            city: clientOverride.city,
            state: clientOverride.state,
            postalCode: clientOverride.postalCode,
            country: clientOverride.country,
            taxId: clientOverride.taxId,
            vatId: clientOverride.vatId,
            notes: clientOverride.notes || '',
            createdAt: clientOverride.createdAt || today,
          }
        : {
            id: 'client_' + Date.now(),
            name: '',
            company: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            taxId: '',
            vatId: '',
            notes: '',
            createdAt: today,
          },
      projectName: '',
      items: [
        {
          id: 'item_1',
          name: '3D Product Modeling',
          description: 'High-detail 3D product CAD modeling, topology optimization, and texturing.',
          quantity: 1,
          unitPrice: 500,
          unit: 'units',
          taxRate: 15,
          taxName: 'VAT',
          isTaxExempt: false,
          discount: 0,
          discountType: 'percentage',
        },
      ],
      globalDiscount: 0,
      globalDiscountType: 'percentage',
      taxCalculationMode: 'per_item',
      globalTaxRate: 15,
      globalTaxName: 'VAT',
      globalTaxApplies: 'after_discount',
      additionalCharges: [],
      amountPaid: 0,
      paymentDetails: { ...settings.defaultPaymentDetails },
      notes: settings.defaultNotes || '',
      termsAndConditions: settings.defaultTerms || '',
      latePaymentPolicy: '',
      refundPolicy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Action Handlers
  const handleStartCreateInvoice = (
    clientOverride?: Client,
    templateOverride?: TemplateStyle,
    colorOverride?: string
  ) => {
    const newInv = generateNewInvoice(clientOverride, templateOverride, colorOverride);
    setEditingInvoice(newInv);
    setCurrentTab('create_invoice');
    setIsMobileMenuOpen(false);
  };

  const handleEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setCurrentTab('create_invoice');
    setIsMobileMenuOpen(false);
  };

  const handleSaveInvoice = (savedInv: Invoice) => {
    setInvoicesState((prev) => {
      const exists = prev.some((i) => i.id === savedInv.id);
      if (exists) {
        return prev.map((i) => (i.id === savedInv.id ? savedInv : i));
      }
      return [savedInv, ...prev];
    });
    setEditingInvoice(savedInv);
  };

  const handleDuplicateInvoice = (inv: Invoice) => {
    const nextNumber = getNextInvoiceNumber(invoices, settings);
    const duplicated: Invoice = {
      ...inv,
      id: 'inv_' + Date.now(),
      invoiceNumber: nextNumber,
      status: 'Draft',
      invoiceDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvoicesState((prev) => [duplicated, ...prev]);
    setEditingInvoice(duplicated);
    setCurrentTab('create_invoice');
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoicesState((prev) =>
      prev.map((i) => {
        if (i.id === invoiceId) {
          return {
            ...i,
            status: 'Paid',
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );
  };

  const handleMarkAsSent = (invoiceId: string) => {
    setInvoicesState((prev) =>
      prev.map((i) => {
        if (i.id === invoiceId && (i.status === 'Draft' || i.status === 'Unpaid')) {
          return {
            ...i,
            status: 'Sent',
            updatedAt: new Date().toISOString(),
          };
        }
        return i;
      })
    );
  };

  const handleSaveClient = (client: Client) => {
    setClientsState((prev) => {
      const exists = prev.some((c) => c.id === client.id);
      if (exists) {
        return prev.map((c) => (c.id === client.id ? client : c));
      }
      return [client, ...prev];
    });
  };

  const handleSaveService = (service: ServiceItem) => {
    setServicesState((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.map((s) => (s.id === service.id ? service : s));
      }
      return [service, ...prev];
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'invoice') {
      setInvoicesState((prev) => prev.filter((i) => i.id !== deleteTarget.data.id));
      if (editingInvoice?.id === deleteTarget.data.id) {
        setEditingInvoice(null);
        setCurrentTab('invoices');
      }
    } else if (deleteTarget.type === 'client') {
      setClientsState((prev) => prev.filter((c) => c.id !== deleteTarget.data.id));
    } else if (deleteTarget.type === 'service') {
      setServicesState((prev) => prev.filter((s) => s.id !== deleteTarget.data.id));
    }

    setDeleteTarget(null);
  };

  // Nav Items Definition
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', label: 'Invoices', icon: FileSpreadsheet },
    { id: 'create_invoice', label: 'Create Invoice', icon: PlusCircle },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'services', label: 'Services', icon: Boxes },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-sm">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white">
              {settings.appName || 'InvoiceFlow'}
            </h1>
            <span className="text-[10px] text-blue-400 font-semibold block leading-none">
              Professional Billing Engine
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full md:h-screen w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out border-r border-slate-800 shrink-0 select-none ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & Brand Header */}
          <div className="p-6 flex items-center justify-between gap-3 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20">
                I
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight leading-none">
                  {settings.appName || 'InvoiceFlow'}
                </h1>
                <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase mt-0.5 block">
                  Editorial Suite
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === 'create_invoice' && !editingInvoice) {
                      handleStartCreateInvoice();
                    } else {
                      setCurrentTab(item.id);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.id === 'invoices' && invoices.length > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {invoices.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User / Workspace Info */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700/80 overflow-hidden flex items-center justify-center text-blue-400 font-bold text-sm">
              <div className="w-full h-full bg-blue-500/10 flex items-center justify-center">
                {settings.businessProfile.businessName
                  ? settings.businessProfile.businessName.substring(0, 2).toUpperCase()
                  : 'CS'}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {settings.businessProfile.businessName || 'Creative Studio'}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Pro Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#F8FAFC]">
        {/* Editorial Top App Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 select-none z-10">
          <div className="flex items-center gap-3 sm:gap-4 text-sm text-slate-500">
            <span className="font-medium text-slate-500 capitalize">
              {currentTab === 'dashboard'
                ? 'Overview'
                : currentTab === 'create_invoice'
                ? 'Invoices'
                : currentTab}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-semibold">
              {currentTab === 'dashboard'
                ? 'Financial Dashboard'
                : currentTab === 'create_invoice'
                ? editingInvoice?.invoiceNumber
                  ? `Edit ${editingInvoice.invoiceNumber}`
                  : 'Create New Invoice'
                : currentTab === 'invoices'
                ? 'Invoice Records'
                : currentTab === 'clients'
                ? 'Client Directory'
                : currentTab === 'services'
                ? 'Service Catalog'
                : currentTab === 'templates'
                ? 'Template Styles'
                : 'System Settings'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentTab !== 'create_invoice' && (
              <button
                type="button"
                onClick={() => handleStartCreateInvoice()}
                className="px-4 sm:px-5 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Invoice</span>
              </button>
            )}
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto">
        {currentTab === 'dashboard' && (
          <DashboardView
            invoices={invoices}
            clients={clients}
            services={services}
            settings={settings}
            onCreateInvoice={() => handleStartCreateInvoice()}
            onEditInvoice={handleEditInvoice}
            onAddClient={() => setCurrentTab('clients')}
            onAddService={() => setCurrentTab('services')}
            onMarkAsPaid={handleMarkAsPaid}
            onDeleteInvoice={(inv) => setDeleteTarget({ type: 'invoice', data: inv })}
            onOpenSendModal={(inv) => setSendInvoiceTarget(inv)}
            onNavigateTab={(tab) => setCurrentTab(tab as NavTab)}
          />
        )}

        {currentTab === 'invoices' && (
          <InvoicesListView
            invoices={invoices}
            onCreateInvoice={() => handleStartCreateInvoice()}
            onEditInvoice={handleEditInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
            onDeleteInvoice={(inv) => setDeleteTarget({ type: 'invoice', data: inv })}
            onMarkAsPaid={handleMarkAsPaid}
            onOpenSendModal={(inv) => setSendInvoiceTarget(inv)}
          />
        )}

        {currentTab === 'create_invoice' && (
          <InvoiceEditor
            initialInvoice={editingInvoice || generateNewInvoice()}
            clientsList={clients}
            servicesCatalog={services}
            settings={settings}
            onSaveInvoice={handleSaveInvoice}
            onSaveClient={handleSaveClient}
            onCancel={() => setCurrentTab('invoices')}
            onRegenerateNumber={() => {
              if (editingInvoice) {
                const nextNum = getNextInvoiceNumber(invoices, settings);
                setEditingInvoice({ ...editingInvoice, invoiceNumber: nextNum });
              }
            }}
            onOpenSendModal={(inv) => setSendInvoiceTarget(inv)}
          />
        )}

        {currentTab === 'clients' && (
          <ClientsView
            clients={clients}
            invoices={invoices}
            defaultCurrency={settings.defaultCurrency}
            onSaveClient={handleSaveClient}
            onDeleteClient={(client) => setDeleteTarget({ type: 'client', data: client })}
            onCreateInvoiceForClient={(client) => handleStartCreateInvoice(client)}
          />
        )}

        {currentTab === 'services' && (
          <ServicesView
            services={services}
            defaultCurrency={settings.defaultCurrency}
            onSaveService={handleSaveService}
            onDeleteService={(srv) => setDeleteTarget({ type: 'service', data: srv })}
          />
        )}

        {currentTab === 'templates' && (
          <TemplatesView
            settings={settings}
            sampleInvoice={invoices[0] || generateNewInvoice()}
            onUpdateDefaultTemplate={(tmpl, color) => {
              setSettingsState((prev) => ({
                ...prev,
                defaultTemplate: tmpl,
                defaultBrandColor: color,
              }));
            }}
            onCreateInvoiceWithTemplate={(tmpl, color) => {
              handleStartCreateInvoice(undefined, tmpl, color);
            }}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            onSaveSettings={(s) => setSettingsState(s)}
            onExportAllData={exportFullDataBackup}
            onImportAllData={(json) => {
              const res = importFullDataBackup(json);
              if (res) {
                setInvoicesState(res.invoices);
                setClientsState(res.clients);
                setServicesState(res.services);
                setSettingsState(res.settings);
                alert('Workspace data restored successfully!');
              } else {
                alert('Invalid backup JSON format.');
              }
            }}
            onResetSampleData={() => {
              if (confirm('Reset workspace to initial sample 3D studio invoices and clients?')) {
                resetAllDataToSample();
                setInvoicesState(loadInvoices());
                setClientsState(loadClients());
                setServicesState(loadServices());
                setSettingsState(loadSettings());
              }
            }}
          />
        )}
        </div>
      </main>

      {/* Send Invoice Modal */}
      {sendInvoiceTarget && (
        <SendInvoiceModal
          invoice={sendInvoiceTarget}
          isOpen={Boolean(sendInvoiceTarget)}
          onClose={() => setSendInvoiceTarget(null)}
          onMarkAsSent={handleMarkAsSent}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                Delete {deleteTarget.type}?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this {deleteTarget.type}? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
