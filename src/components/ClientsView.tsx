import React, { useState, useMemo } from 'react';
import { Client, Invoice } from '../types';
import { computeClientStats } from '../utils/storage';
import { formatCurrency } from '../utils/currencies';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  FilePlus,
  Mail,
  Phone,
  MapPin,
  Building,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

interface Props {
  clients: Client[];
  invoices: Invoice[];
  defaultCurrency: string;
  onSaveClient: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onCreateInvoiceForClient: (client: Client) => void;
}

export const ClientsView: React.FC<Props> = ({
  clients,
  invoices,
  defaultCurrency,
  onSaveClient,
  onDeleteClient,
  onCreateInvoiceForClient,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Compute live client metrics
  const clientsWithStats = useMemo(() => {
    return computeClientStats(clients, invoices);
  }, [clients, invoices]);

  const filteredClients = useMemo(() => {
    return clientsWithStats.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
      );
    });
  }, [clientsWithStats, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingClient({
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
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient({ ...client });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !editingClient.name.trim()) return;

    onSaveClient(editingClient);
    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Client Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your accounts, contact records, billing addresses, and payment histories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, company, email, or country..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Clients Cards / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No clients found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'No clients matched your search criteria.'
                : 'Start building your database by adding your first client.'}
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition"
            >
              Add Client
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Client / Company</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-right">Invoiced</th>
                  <th className="py-3.5 px-4 text-right">Paid</th>
                  <th className="py-3.5 px-4 text-right">Outstanding</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 text-sm">
                        {client.company || client.name}
                      </p>
                      {client.company && (
                        <p className="text-[11px] text-slate-500">Attn: {client.name}</p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-0.5 text-slate-600">
                        {client.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{client.email}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Phone className="w-3 h-3" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      {[client.city, client.country].filter(Boolean).join(', ') || '—'}
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(client.totalInvoiced || 0, defaultCurrency)}
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-semibold text-emerald-600">
                      {formatCurrency(client.paidAmount || 0, defaultCurrency)}
                    </td>

                    <td className="py-4 px-4 text-right font-mono">
                      {(client.outstandingAmount || 0) > 0 ? (
                        <span className="font-bold text-rose-600">
                          {formatCurrency(client.outstandingAmount || 0, defaultCurrency)}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Settled</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onCreateInvoiceForClient(client)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition text-[11px]"
                          title="Create invoice for this client"
                        >
                          <FilePlus className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(client)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                          title="Edit Client"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteClient(client)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Delete Client"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingClient.name ? 'Edit Client Record' : 'Add New Client'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingClient.name}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, name: e.target.value })
                    }
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editingClient.company}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, company: e.target.value })
                    }
                    placeholder="e.g. ABC Company"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editingClient.email}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, email: e.target.value })
                    }
                    placeholder="e.g. billing@abccompany.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingClient.phone}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, phone: e.target.value })
                    }
                    placeholder="e.g. +1 (415) 890-3411"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Billing Address</label>
                  <input
                    type="text"
                    value={editingClient.address}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, address: e.target.value })
                    }
                    placeholder="e.g. 100 Market Street, 12th Floor"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingClient.city}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, city: e.target.value })
                    }
                    placeholder="e.g. San Francisco"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={editingClient.state}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, state: e.target.value })
                    }
                    placeholder="e.g. CA"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Postal / ZIP Code</label>
                  <input
                    type="text"
                    value={editingClient.postalCode}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, postalCode: e.target.value })
                    }
                    placeholder="e.g. 94105"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={editingClient.country}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, country: e.target.value })
                    }
                    placeholder="e.g. United States"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tax ID / EIN</label>
                  <input
                    type="text"
                    value={editingClient.taxId}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, taxId: e.target.value })
                    }
                    placeholder="e.g. US-EIN-88-2947119"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">VAT ID</label>
                  <input
                    type="text"
                    value={editingClient.vatId}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, vatId: e.target.value })
                    }
                    placeholder="e.g. GB992384102"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Notes / Terms</label>
                  <textarea
                    rows={2}
                    value={editingClient.notes}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, notes: e.target.value })
                    }
                    placeholder="Internal account notes, payment preferences, or contract clauses"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-sm"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
