import { AppSettings, Client, Invoice, ServiceItem } from '../types';
import { calculateInvoice } from './calculations';

export const DEFAULT_BUSINESS_PROFILE = {
  businessName: 'Creative Studio Co.',
  logo: '',
  logoWidth: 160,
  logoAlignment: 'left' as const,
  tagline: 'High-End 3D Visualization, Branding & Digital Production',
  ownerName: 'Alexander Vance',
  email: 'alexander@creativestudio.design',
  phone: '+1 (555) 234-8920',
  website: 'www.creativestudio.design',
  address: '742 Innovation Way, Suite 400',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94107',
  country: 'United States',
  taxId: 'US-EIN-94-3829104',
  vatNumber: 'VAT-US9438291',
  gstNumber: '',
  businessRegNumber: 'CA-REG-2024-8831',
  customTaxNumber: '',
};

export const DEFAULT_PAYMENT_DETAILS = {
  paymentMethod: 'Wire Transfer / ACH / PayPal',
  bankName: 'Silicon Valley Commercial Bank',
  accountName: 'Creative Studio Co. LLC',
  accountNumber: '•••• •••• 8492',
  routingNumber: '121000358',
  swiftBic: 'SVCBUS33',
  iban: 'US33SVCB12100035800008492',
  paypalEmail: 'billing@creativestudio.design',
  paymentLink: 'https://pay.creativestudio.design/invoice',
  mobilePaymentNumber: '',
  instructions: 'Please include the Invoice Number as the reference code for bank transfers.',
};

export const DEFAULT_SETTINGS: AppSettings = {
  appName: 'InvoiceFlow',
  defaultCurrency: 'USD',
  invoicePrefix: 'INV-',
  nextInvoiceNumber: 2,
  numberPadding: 3,
  defaultPaymentTerms: 'net15',
  defaultTaxRate: 15,
  defaultTaxName: 'VAT',
  defaultNotes: 'Thank you for your business! We appreciate the opportunity to collaborate on this creative project.',
  defaultTerms: '1. Payment is due within the terms specified from the invoice date.\n2. Late payments are subject to a 1.5% compounding monthly fee.\n3. All deliverables remain the intellectual property of the studio until full invoice settlement.',
  defaultBrandColor: '#2563EB',
  defaultTemplate: 'modern',
  defaultPaymentDetails: DEFAULT_PAYMENT_DETAILS,
  businessProfile: DEFAULT_BUSINESS_PROFILE,
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Sarah Jenkins',
    company: 'ABC Company',
    email: 'billing@abccompany.com',
    phone: '+1 (415) 890-3411',
    address: '100 Market Street, 12th Floor',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
    taxId: 'US-EIN-88-2947119',
    vatId: '',
    notes: 'Key enterprise account. Net 15 terms.',
    createdAt: '2026-08-01',
  },
  {
    id: 'client-2',
    name: 'Marcus Sterling',
    company: 'Sterling & Co. Interactive',
    email: 'marcus@sterlinginteractive.co.uk',
    phone: '+44 20 7946 0912',
    address: '25 Finsbury Square',
    city: 'London',
    state: 'Greater London',
    postalCode: 'EC2A 1DX',
    country: 'United Kingdom',
    taxId: 'GB-VAT-992-3841-02',
    vatId: 'GB992384102',
    notes: 'Prefers GBP invoices. 3D game asset pipeline.',
    createdAt: '2026-08-05',
  },
  {
    id: 'client-3',
    name: 'Elena Rostova',
    company: 'Lumina Horizon GmbH',
    email: 'accounting@luminahorizon.de',
    phone: '+49 30 5683921',
    address: 'Friedrichstraße 180',
    city: 'Berlin',
    state: 'Berlin',
    postalCode: '10117',
    country: 'Germany',
    taxId: 'DE304918274',
    vatId: 'DE304918274',
    notes: 'Architectural visualization rendering projects.',
    createdAt: '2026-08-10',
  },
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: '3D Product Modeling',
    description: 'High-poly CAD conversion, photorealistic mesh retopology, sub-d topology optimization.',
    defaultPrice: 500,
    unit: 'units',
    defaultTaxRate: 15,
    defaultTaxName: 'VAT',
    defaultDiscount: 10,
    defaultDiscountType: 'percentage',
  },
  {
    id: 'srv-2',
    name: '3D Product Animation',
    description: '30-second 4K exploded mechanical breakdown & cinematic camera flythrough.',
    defaultPrice: 1800,
    unit: 'project',
    defaultTaxRate: 15,
    defaultTaxName: 'VAT',
    defaultDiscount: 0,
    defaultDiscountType: 'percentage',
  },
  {
    id: 'srv-3',
    name: '3D Product Rendering',
    description: 'Ultra-HD Octane/Redshift photorealistic studio lighting passes with transparent alpha.',
    defaultPrice: 350,
    unit: 'renders',
    defaultTaxRate: 15,
    defaultTaxName: 'VAT',
    defaultDiscount: 0,
    defaultDiscountType: 'percentage',
  },
  {
    id: 'srv-4',
    name: '3D Character Modeling & Rigging',
    description: 'Stylized or hyper-realistic character topology complete with facial blendshapes.',
    defaultPrice: 2400,
    unit: 'character',
    defaultTaxRate: 15,
    defaultTaxName: 'VAT',
    defaultDiscount: 5,
    defaultDiscountType: 'percentage',
  },
  {
    id: 'srv-5',
    name: 'Creative Direction & Consultation',
    description: 'Bi-weekly technical art oversight, shader review, and production pipeline advisory.',
    defaultPrice: 175,
    unit: 'hrs',
    defaultTaxRate: 0,
    defaultTaxName: 'Exempt',
    isTaxExempt: true,
    defaultDiscount: 0,
    defaultDiscountType: 'percentage',
  },
];

// Initial Invoices with the required benchmark test case (INV-2026-001)
export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '2026-08-14',
    dueDate: '2026-08-29',
    paymentTerms: 'net15',
    currency: 'USD',
    projectName: 'High-End 3D Industrial Asset Pipeline',
    poNumber: 'PO-99482',
    clientRef: 'ABC-2026-Q3',
    status: 'Partially Paid',
    business: DEFAULT_BUSINESS_PROFILE,
    client: INITIAL_CLIENTS[0],
    items: [
      {
        id: 'item-1',
        serviceId: 'srv-1',
        name: '3D Product Modeling',
        description: 'Complete high-precision surface modeling, procedural texturing & lookdev.',
        quantity: 2,
        unit: 'units',
        unitPrice: 500,
        discount: 10,
        discountType: 'percentage',
        taxRate: 15,
        taxName: 'VAT',
        isTaxExempt: false,
      },
    ],
    taxCalculationMode: 'per_item',
    globalTaxRate: 15,
    globalTaxName: 'VAT',
    globalTaxApplies: 'after_discount',
    globalDiscount: 0,
    globalDiscountType: 'percentage',
    additionalCharges: [
      {
        id: 'charge-1',
        name: 'Expedited Render Cloud Pipeline Fee',
        amount: 50,
        type: 'fixed',
      },
    ],
    amountPaid: 300,
    paymentDetails: DEFAULT_PAYMENT_DETAILS,
    notes: 'Thank you for partnering with Creative Studio Co. We look forward to delivering the animated passes.',
    termsAndConditions: DEFAULT_SETTINGS.defaultTerms,
    latePaymentPolicy: '1.5% interest per month on balances overdue beyond Net 15.',
    refundPolicy: 'Custom digital production assets are non-refundable once source files are handed over.',
    template: 'modern',
    brandColor: '#2563EB',
    fontStyle: 'sans',
    createdAt: '2026-08-14T09:00:00.000Z',
    updatedAt: '2026-08-14T09:00:00.000Z',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    invoiceDate: '2026-08-01',
    dueDate: '2026-08-16',
    paymentTerms: 'net15',
    currency: 'GBP',
    projectName: 'Unreal Engine 5 Real-Time Virtual Set',
    poNumber: 'PO-ST-8812',
    clientRef: 'STR-ENG-01',
    status: 'Paid',
    business: DEFAULT_BUSINESS_PROFILE,
    client: INITIAL_CLIENTS[1],
    items: [
      {
        id: 'item-2-1',
        serviceId: 'srv-2',
        name: '3D Product Animation',
        description: 'Cinematic 60fps lighting flythrough in Unreal Engine Lumen environment.',
        quantity: 1,
        unit: 'project',
        unitPrice: 1800,
        discount: 0,
        discountType: 'percentage',
        taxRate: 20,
        taxName: 'VAT',
        isTaxExempt: false,
      },
      {
        id: 'item-2-2',
        serviceId: 'srv-3',
        name: '3D Product Rendering',
        description: 'Key beauty hero poster renders at 8K resolution for billboard print.',
        quantity: 4,
        unit: 'renders',
        unitPrice: 350,
        discount: 100,
        discountType: 'fixed',
        taxRate: 20,
        taxName: 'VAT',
        isTaxExempt: false,
      },
    ],
    taxCalculationMode: 'per_item',
    globalTaxRate: 20,
    globalTaxName: 'VAT',
    globalTaxApplies: 'after_discount',
    globalDiscount: 0,
    globalDiscountType: 'percentage',
    additionalCharges: [],
    amountPaid: 3720,
    paymentDetails: DEFAULT_PAYMENT_DETAILS,
    notes: 'All Unreal Engine 5 source levels have been synchronized to your Perforce repository.',
    termsAndConditions: DEFAULT_SETTINGS.defaultTerms,
    latePaymentPolicy: '',
    refundPolicy: '',
    template: 'minimal',
    brandColor: '#059669',
    fontStyle: 'sans',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-10T14:30:00.000Z',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    invoiceDate: '2026-07-15',
    dueDate: '2026-07-30',
    paymentTerms: 'net15',
    currency: 'EUR',
    projectName: 'Architectural Luxury Residence Visualization',
    poNumber: 'LH-4029',
    clientRef: 'BER-ARCH-99',
    status: 'Overdue',
    business: DEFAULT_BUSINESS_PROFILE,
    client: INITIAL_CLIENTS[2],
    items: [
      {
        id: 'item-3-1',
        serviceId: 'srv-4',
        name: '3D Character Modeling & Rigging',
        description: 'Custom photoreal digital crowd characters for architectural walkthrough.',
        quantity: 1,
        unit: 'character',
        unitPrice: 2400,
        discount: 5,
        discountType: 'percentage',
        taxRate: 19,
        taxName: 'MwSt',
        isTaxExempt: false,
      },
    ],
    taxCalculationMode: 'per_item',
    globalTaxRate: 19,
    globalTaxName: 'MwSt',
    globalTaxApplies: 'after_discount',
    globalDiscount: 0,
    globalDiscountType: 'percentage',
    additionalCharges: [
      {
        id: 'charge-3-1',
        name: 'Late Storage Archival Fee',
        amount: 80,
        type: 'fixed',
      },
    ],
    amountPaid: 0,
    paymentDetails: DEFAULT_PAYMENT_DETAILS,
    notes: 'Please expedite payment. Final 4K walkthrough animation has been delivered.',
    termsAndConditions: DEFAULT_SETTINGS.defaultTerms,
    latePaymentPolicy: 'Overdue notices have been transmitted.',
    refundPolicy: '',
    template: 'premium',
    brandColor: '#4F46E5',
    fontStyle: 'serif',
    createdAt: '2026-07-15T08:30:00.000Z',
    updatedAt: '2026-07-15T08:30:00.000Z',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-2026-004',
    invoiceDate: '2026-08-13',
    dueDate: '2026-08-28',
    paymentTerms: 'net15',
    currency: 'USD',
    projectName: 'Brand Identity & Visual System Overhaul',
    poNumber: '',
    clientRef: '',
    status: 'Draft',
    business: DEFAULT_BUSINESS_PROFILE,
    client: INITIAL_CLIENTS[0],
    items: [
      {
        id: 'item-4-1',
        serviceId: 'srv-5',
        name: 'Creative Direction & Consultation',
        description: 'Q3 Brand redesign guidelines and design system component library.',
        quantity: 16,
        unit: 'hrs',
        unitPrice: 175,
        discount: 0,
        discountType: 'percentage',
        taxRate: 0,
        taxName: 'Exempt',
        isTaxExempt: true,
      },
    ],
    taxCalculationMode: 'per_item',
    globalTaxRate: 0,
    globalTaxName: 'None',
    globalTaxApplies: 'after_discount',
    globalDiscount: 5,
    globalDiscountType: 'percentage',
    additionalCharges: [],
    amountPaid: 0,
    paymentDetails: DEFAULT_PAYMENT_DETAILS,
    notes: 'Draft proposal under client review.',
    termsAndConditions: DEFAULT_SETTINGS.defaultTerms,
    latePaymentPolicy: '',
    refundPolicy: '',
    template: 'creative',
    brandColor: '#D97706',
    fontStyle: 'outfit',
    createdAt: '2026-08-13T12:00:00.000Z',
    updatedAt: '2026-08-13T12:00:00.000Z',
  }
];

const STORAGE_KEYS = {
  INVOICES: 'invoiceflow_invoices_v1',
  CLIENTS: 'invoiceflow_clients_v1',
  SERVICES: 'invoiceflow_services_v1',
  SETTINGS: 'invoiceflow_settings_v1',
};

export function getStoredInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
      return INITIAL_INVOICES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load invoices from storage:', err);
    return INITIAL_INVOICES;
  }
}

export function saveStoredInvoices(invoices: Invoice[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  } catch (err) {
    console.error('Failed to save invoices to storage:', err);
  }
}

export function getStoredClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
      return INITIAL_CLIENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load clients from storage:', err);
    return INITIAL_CLIENTS;
  }
}

export function saveStoredClients(clients: Client[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  } catch (err) {
    console.error('Failed to save clients to storage:', err);
  }
}

export function getStoredServices(): ServiceItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      return INITIAL_SERVICES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load services from storage:', err);
    return INITIAL_SERVICES;
  }
}

export function saveStoredServices(services: ServiceItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  } catch (err) {
    console.error('Failed to save services to storage:', err);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load settings from storage:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to storage:', err);
  }
}

// Compute client statistics dynamically
export function computeClientStats(clients: Client[], invoices: Invoice[]): Client[] {
  return clients.map((client) => {
    const clientInvoices = invoices.filter(
      (inv) => inv.client.id === client.id || inv.client.name.toLowerCase() === client.name.toLowerCase()
    );

    let totalInvoiced = 0;
    let paidAmount = 0;
    let outstandingAmount = 0;

    for (const inv of clientInvoices) {
      const calc = calculateInvoice(inv);
      if (inv.status !== 'Cancelled' && inv.status !== 'Draft') {
        totalInvoiced += calc.invoiceTotal;
        paidAmount += calc.amountPaid;
        outstandingAmount += calc.balanceDue;
      }
    }

    return {
      ...client,
      totalInvoiced,
      paidAmount,
      outstandingAmount,
    };
  });
}

// Generate the next available unique invoice number
export function generateNextInvoiceNumber(invoices: Invoice[], settings: AppSettings): string {
  const prefix = settings.invoicePrefix || 'INV-';
  const year = new Date().getFullYear();
  const existingNumbers = invoices.map((inv) => inv.invoiceNumber);

  let counter = 1;
  let candidate = `${prefix}${year}-${String(counter).padStart(settings.numberPadding || 3, '0')}`;

  while (existingNumbers.includes(candidate)) {
    counter++;
    candidate = `${prefix}${year}-${String(counter).padStart(settings.numberPadding || 3, '0')}`;
  }

  return candidate;
}

export const loadInvoices = getStoredInvoices;
export const saveInvoices = saveStoredInvoices;
export const loadClients = getStoredClients;
export const saveClients = saveStoredClients;
export const loadServices = getStoredServices;
export const saveServices = saveStoredServices;
export const loadSettings = getStoredSettings;
export const saveSettings = saveStoredSettings;
export const getNextInvoiceNumber = generateNextInvoiceNumber;

export function exportFullDataBackup(): void {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    invoices: getStoredInvoices(),
    clients: getStoredClients(),
    services: getStoredServices(),
    settings: getStoredSettings(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `InvoiceFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFullDataBackup(jsonString: string): {
  invoices: Invoice[];
  clients: Client[];
  services: ServiceItem[];
  settings: AppSettings;
} | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.invoices && parsed.clients && parsed.services) {
      saveStoredInvoices(parsed.invoices);
      saveStoredClients(parsed.clients);
      saveStoredServices(parsed.services);
      if (parsed.settings) {
        saveStoredSettings(parsed.settings);
      }
      return {
        invoices: parsed.invoices,
        clients: parsed.clients,
        services: parsed.services,
        settings: parsed.settings || getStoredSettings(),
      };
    }
    return null;
  } catch (e) {
    console.error('Failed to parse backup data:', e);
    return null;
  }
}

export function resetAllDataToSample(): void {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_INVOICES));
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
}

