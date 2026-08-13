import React from 'react';
import { Client } from '../../types';
import { UserCheck, Users, PlusCircle, Check } from 'lucide-react';

interface Props {
  client: Client;
  clientsList: Client[];
  onChange: (client: Client) => void;
  onSaveAsNewClient?: (client: Client) => void;
}

export const ClientSection: React.FC<Props> = ({
  client,
  clientsList,
  onChange,
  onSaveAsNewClient,
}) => {
  const handleSelectExistingClient = (clientId: string) => {
    if (!clientId) return;
    const found = clientsList.find((c) => c.id === clientId);
    if (found) {
      onChange({ ...found });
    }
  };

  const handleFieldChange = (field: keyof Client, value: any) => {
    onChange({
      ...client,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm">Client & Recipient Information</h3>
        </div>

        {/* Quick select dropdown */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <select
            value={client.id || ''}
            onChange={(e) => handleSelectExistingClient(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">-- Choose from Client Database --</option>
            {clientsList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company ? `${c.company} (${c.name})` : c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Client / Contact Person *
          </label>
          <input
            type="text"
            value={client.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="e.g. Sarah Jenkins"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
          <input
            type="text"
            value={client.company}
            onChange={(e) => handleFieldChange('company', e.target.value)}
            placeholder="e.g. ABC Company"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Client Email *</label>
          <input
            type="email"
            value={client.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="e.g. billing@abccompany.com"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={client.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="e.g. +1 (415) 890-3411"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Billing Street Address</label>
          <input
            type="text"
            value={client.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            placeholder="e.g. 100 Market Street, 12th Floor"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">City</label>
          <input
            type="text"
            value={client.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            placeholder="e.g. San Francisco"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">State / Province</label>
          <input
            type="text"
            value={client.state}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            placeholder="e.g. CA"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Postal / ZIP Code</label>
          <input
            type="text"
            value={client.postalCode}
            onChange={(e) => handleFieldChange('postalCode', e.target.value)}
            placeholder="e.g. 94105"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Country</label>
          <input
            type="text"
            value={client.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            placeholder="e.g. United States"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">Tax ID / Business ID</label>
          <input
            type="text"
            value={client.taxId}
            onChange={(e) => handleFieldChange('taxId', e.target.value)}
            placeholder="e.g. US-EIN-88-2947119"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-600 mb-1">VAT ID (if applicable)</label>
          <input
            type="text"
            value={client.vatId}
            onChange={(e) => handleFieldChange('vatId', e.target.value)}
            placeholder="e.g. GB992384102"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {onSaveAsNewClient && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onSaveAsNewClient(client)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Save to Client Database</span>
          </button>
        </div>
      )}
    </div>
  );
};
