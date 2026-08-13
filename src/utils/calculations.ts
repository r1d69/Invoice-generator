import { Invoice, InvoiceCalculations, LineCalculationResult, PaymentTermType } from '../types';

export function calculateDueDate(invoiceDateStr: string, terms: PaymentTermType, customDays: number = 30): string {
  if (!invoiceDateStr) {
    invoiceDateStr = new Date().toISOString().split('T')[0];
  }
  
  const date = new Date(invoiceDateStr);
  if (isNaN(date.getTime())) {
    return invoiceDateStr;
  }

  let daysToAdd = 0;
  switch (terms) {
    case 'receipt':
      daysToAdd = 0;
      break;
    case 'net7':
      daysToAdd = 7;
      break;
    case 'net15':
      daysToAdd = 15;
      break;
    case 'net30':
      daysToAdd = 30;
      break;
    case 'net45':
      daysToAdd = 45;
      break;
    case 'net60':
      daysToAdd = 60;
      break;
    case 'custom':
      daysToAdd = Math.max(0, customDays || 0);
      break;
  }

  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + daysToAdd);
  return dueDate.toISOString().split('T')[0];
}

export function calculateInvoice(invoice: Partial<Invoice>): InvoiceCalculations {
  const items = invoice.items || [];
  const taxMode = invoice.taxCalculationMode || 'per_item';
  const globalTaxRate = Number(invoice.globalTaxRate) || 0;
  const globalDiscount = Number(invoice.globalDiscount) || 0;
  const globalDiscountType = invoice.globalDiscountType || 'percentage';
  const additionalCharges = invoice.additionalCharges || [];
  const amountPaid = Math.max(0, Number(invoice.amountPaid) || 0);

  let rawSubtotal = 0;
  let totalLineDiscount = 0;
  let totalLineTax = 0;

  const lines: LineCalculationResult[] = items.map((item) => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    const lineSubtotal = qty * unitPrice;

    // Line discount
    let discountAmount = 0;
    const discountVal = Math.max(0, Number(item.discount) || 0);
    if (item.discountType === 'percentage') {
      discountAmount = (lineSubtotal * Math.min(100, discountVal)) / 100;
    } else {
      discountAmount = Math.min(lineSubtotal, discountVal);
    }

    const taxableAmount = Math.max(0, lineSubtotal - discountAmount);

    // Line tax
    let taxAmount = 0;
    if (!item.isTaxExempt && taxMode === 'per_item') {
      const taxRate = Math.max(0, Number(item.taxRate) || 0);
      taxAmount = (taxableAmount * taxRate) / 100;
    }

    const lineTotal = taxableAmount + taxAmount;

    rawSubtotal += lineSubtotal;
    totalLineDiscount += discountAmount;
    totalLineTax += taxAmount;

    return {
      id: item.id,
      subtotal: lineSubtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      lineTotal,
    };
  });

  const subtotal = rawSubtotal;

  // Calculate Global Discount
  let globalDiscountAmount = 0;
  const remainingAfterLineDiscounts = Math.max(0, subtotal - totalLineDiscount);

  if (globalDiscount > 0) {
    if (globalDiscountType === 'percentage') {
      globalDiscountAmount = (remainingAfterLineDiscounts * Math.min(100, globalDiscount)) / 100;
    } else {
      globalDiscountAmount = Math.min(remainingAfterLineDiscounts, globalDiscount);
    }
  }

  const totalDiscount = totalLineDiscount + globalDiscountAmount;
  const taxableAmount = Math.max(0, subtotal - totalDiscount);

  // Calculate Total Tax
  let totalTax = 0;
  if (taxMode === 'per_item') {
    totalTax = totalLineTax;
  } else {
    // Global tax
    totalTax = (taxableAmount * globalTaxRate) / 100;
  }

  // Additional Charges
  let totalAdditionalCharges = 0;
  for (const charge of additionalCharges) {
    const chargeVal = Math.max(0, Number(charge.amount) || 0);
    if (charge.type === 'percentage') {
      totalAdditionalCharges += (taxableAmount * chargeVal) / 100;
    } else {
      totalAdditionalCharges += chargeVal;
    }
  }

  const invoiceTotal = Math.max(0, taxableAmount + totalTax + totalAdditionalCharges);
  const balanceDue = Math.max(0, invoiceTotal - amountPaid);

  // Overdue check based on local YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const dueDateStr = invoice.dueDate || todayStr;
  const isPastDue = dueDateStr < todayStr;
  const isOverdue = isPastDue && balanceDue > 0.01 && invoice.status !== 'Draft' && invoice.status !== 'Cancelled';

  // Compute status
  let computedStatus = invoice.status || 'Draft';
  if (invoice.status !== 'Draft' && invoice.status !== 'Cancelled') {
    if (balanceDue <= 0.001 && invoiceTotal > 0) {
      computedStatus = 'Paid';
    } else if (amountPaid > 0 && balanceDue > 0.001) {
      computedStatus = isOverdue ? 'Overdue' : 'Partially Paid';
    } else if (isOverdue) {
      computedStatus = 'Overdue';
    } else if (invoice.status === 'Sent' || invoice.status === 'Viewed' || invoice.status === 'Unpaid') {
      computedStatus = invoice.status;
    } else {
      computedStatus = 'Unpaid';
    }
  }

  return {
    lines,
    subtotal,
    totalDiscount,
    taxableAmount,
    totalTax,
    totalAdditionalCharges,
    invoiceTotal,
    amountPaid,
    balanceDue,
    isOverdue,
    computedStatus,
  };
}
