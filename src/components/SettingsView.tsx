import React, { useState, useRef } from 'react';
import { AppSettings, TemplateStyle } from '../types';
import { CURRENCY_MAP } from '../utils/currencies';
import {
  Settings as SettingsIcon,
  Save,
  Building2,
  FileText,
  DollarSign,
  CreditCard,
  Palette,
  FileCheck,
  Download,
  Upload,
  RotateCcw,
  Check,
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onExportAllData: () => void;
  onImportAllData: (jsonData: string) => void;
  onResetSampleData: () => void;
}

export const SettingsView: React.FC<Props> = ({
  settings,
  onSaveSettings,
  onExportAllData,
  onImportAllData,
  onResetSampleData,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [showSavedNotification, setShowSavedNotification] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof AppSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBusinessChange = (field: keyof AppSettings['businessProfile'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      businessProfile: {
        ...prev.businessProfile,
        [field]: value,
      },
    }));
  };

  const handlePaymentDetailsChange = (
    field: keyof AppSettings['defaultPaymentDetails'],
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      defaultPaymentDetails: {
        ...prev.defaultPaymentDetails,
        [field]: value,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImportAllData(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Software Settings & Defaults
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure your studio defaults, invoice sequence rules, currencies, and global backup settings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {showSavedNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Application Brand / Name */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Application Brand</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Application Name (Easily Changeable)
              </label>
              <input
                type="text"
                value={formData.appName}
                onChange={(e) => handleFieldChange('appName', e.target.value)}
                placeholder="InvoiceFlow"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Currency</label>
              <select
                value={formData.defaultCurrency}
                onChange={(e) => handleFieldChange('defaultCurrency', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {Object.values(CURRENCY_MAP).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Invoice Numbering & Sequence */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Invoice Sequence & Numbering</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => handleFieldChange('invoicePrefix', e.target.value)}
                placeholder="INV-"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Number Digit Padding</label>
              <input
                type="number"
                min="1"
                max="6"
                value={formData.numberPadding}
                onChange={(e) => handleFieldChange('numberPadding', parseInt(e.target.value) || 3)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Payment Term</label>
              <select
                value={formData.defaultPaymentTerms}
                onChange={(e) => handleFieldChange('defaultPaymentTerms', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
              >
                <option value="receipt">Due on Receipt (0 days)</option>
                <option value="net7">Net 7</option>
                <option value="net15">Net 15</option>
                <option value="net30">Net 30</option>
                <option value="net45">Net 45</option>
                <option value="net60">Net 60</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Profile Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Default Business Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Business / Studio Name</label>
              <input
                type="text"
                value={formData.businessProfile.businessName}
                onChange={(e) => handleBusinessChange('businessName', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.businessProfile.tagline}
                onChange={(e) => handleBusinessChange('tagline', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.businessProfile.email}
                onChange={(e) => handleBusinessChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.businessProfile.phone}
                onChange={(e) => handleBusinessChange('phone', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.businessProfile.address}
                onChange={(e) => handleBusinessChange('address', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Default Notes & Terms */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Default Notes & Terms</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Notes</label>
              <textarea
                rows={2}
                value={formData.defaultNotes}
                onChange={(e) => handleFieldChange('defaultNotes', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Terms & Conditions</label>
              <textarea
                rows={3}
                value={formData.defaultTerms}
                onChange={(e) => handleFieldChange('defaultTerms', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Backup & System Reset */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Download className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm">Data Backup & Restore</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExportAllData}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Backup (JSON)</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <Upload className="w-4 h-4" />
              <span>Import Backup</span>
            </button>

            <button
              type="button"
              onClick={onResetSampleData}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition ml-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
