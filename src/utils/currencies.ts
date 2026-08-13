import { CurrencyConfig } from '../types';

export const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', position: 'before', decimalPlaces: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', position: 'before', decimalPlaces: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', position: 'before', decimalPlaces: 2 },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', position: 'before', decimalPlaces: 2 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', position: 'before', decimalPlaces: 2 },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', position: 'before', decimalPlaces: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', position: 'before', decimalPlaces: 2 },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', position: 'before', decimalPlaces: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', position: 'before', decimalPlaces: 0 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', position: 'before', decimalPlaces: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', position: 'before', decimalPlaces: 2 },
  SGD: { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', position: 'before', decimalPlaces: 2 },
};

export function getCurrencyConfig(code: string): CurrencyConfig {
  return CURRENCY_MAP[code] || {
    code: code || 'USD',
    symbol: code || '$',
    name: code || 'Currency',
    position: 'before',
    decimalPlaces: 2,
  };
}

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const config = getCurrencyConfig(currencyCode);
  const validAmount = isNaN(amount) ? 0 : amount;
  
  const formattedNumber = validAmount.toLocaleString('en-US', {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  });

  if (config.position === 'after') {
    return `${formattedNumber} ${config.symbol}`;
  }
  return `${config.symbol}${formattedNumber}`;
}
