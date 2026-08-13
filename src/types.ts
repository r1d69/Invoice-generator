export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'BDT' | 'AED' | 'SAR' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'CHF' | 'SGD' | 'CUSTOM';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  position: 'before' | 'after';
  decimalPlaces: number;
}

export type PaymentTermType = 'receipt' | 'net7' | 'net15' | 'net30' | 'net45' | 'net60' | 'custom';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Viewed' | 'Unpaid' | 'Partially Paid' | 'Paid' | 'Overdue' | 'Cancelled';

export type TemplateStyle = 'minimal' | 'modern' | 'premium' | 'creative';

export type DiscountType = 'percentage' | 'fixed';

export type TaxApplication = 'before_discount' | 'after_discount';

export type TaxCalculationMode = 'per_item' | 'global';

export interface BusinessProfile {
  businessName: string;
  logo: string; // base64 or URL
  logoWidth: number; // in pixels (e.g. 140)
  logoAlignment: 'left' | 'center' | 'right';
  tagline: string;
  ownerName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  // Tax information
  taxId: string;
  vatNumber: string;
  gstNumber: string;
  businessRegNumber: string;
  customTaxNumber: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId: string;
  vatId: string;
  notes: string;
  createdAt: string;
  totalInvoiced?: number;
  paidAmount?: number;
  outstandingAmount?: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
  unit: string; // e.g. "hrs", "pcs", "days", "project", "units"
  defaultTaxRate: number;
  defaultTaxName: string;
  isTaxExempt?: boolean;
  defaultDiscount: number;
  defaultDiscountType: DiscountType;
}

export interface InvoiceItem {
  id: string;
  serviceId?: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: DiscountType;
  taxRate: number;
  taxName: string;
  isTaxExempt?: boolean;
}

export interface AdditionalCharge {
  id: string;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
}

export interface PaymentDetails {
  paymentMethod: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftBic: string;
  iban: string;
  paypalEmail: string;
  paymentLink: string;
  mobilePaymentNumber: string;
  instructions: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  paymentTerms: PaymentTermType;
  customTermDays?: number;
  currency: string;
  projectName?: string;
  poNumber?: string;
  clientRef?: string;
  status: InvoiceStatus;
  
  business: BusinessProfile;
  client: Client;
  
  items: InvoiceItem[];
  
  // Tax & Discount System
  taxCalculationMode: TaxCalculationMode;
  globalTaxRate: number;
  globalTaxName: string;
  globalTaxApplies: TaxApplication;
  globalDiscount: number;
  globalDiscountType: DiscountType;
  
  // Additional Charges
  additionalCharges: AdditionalCharge[];
  
  // Payments
  amountPaid: number;
  
  // Bank & Payment Details
  paymentDetails: PaymentDetails;
  
  // Notes and Policies
  notes: string;
  termsAndConditions: string;
  latePaymentPolicy: string;
  refundPolicy: string;
  
  // Design & Branding
  template: TemplateStyle;
  brandColor: string;
  secondaryColor?: string;
  fontStyle: 'sans' | 'serif' | 'mono' | 'outfit';
  
  createdAt: string;
  updatedAt: string;
}

export interface LineCalculationResult {
  id: string;
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  lineTotal: number;
}

export interface InvoiceCalculations {
  lines: LineCalculationResult[];
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalTax: number;
  totalAdditionalCharges: number;
  invoiceTotal: number;
  amountPaid: number;
  balanceDue: number;
  isOverdue: boolean;
  computedStatus: InvoiceStatus;
}

export interface AppSettings {
  appName: string;
  defaultCurrency: string;
  invoicePrefix: string;
  nextInvoiceNumber: number;
  numberPadding: number;
  defaultPaymentTerms: PaymentTermType;
  defaultTaxRate: number;
  defaultTaxName: string;
  defaultNotes: string;
  defaultTerms: string;
  defaultBrandColor: string;
  defaultTemplate: TemplateStyle;
  defaultPaymentDetails: PaymentDetails;
  businessProfile: BusinessProfile;
}
