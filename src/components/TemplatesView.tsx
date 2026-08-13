import React, { useState } from 'react';
import { AppSettings, Invoice, TemplateStyle } from '../types';
import { InvoiceA4Preview } from './InvoicePreview/InvoiceA4Preview';
import { calculateInvoice } from '../utils/calculations';
import { LayoutTemplate, Check, Sparkles, Plus, Palette } from 'lucide-react';

interface Props {
  settings: AppSettings;
  sampleInvoice: Invoice;
  onUpdateDefaultTemplate: (template: TemplateStyle, brandColor: string) => void;
  onCreateInvoiceWithTemplate: (template: TemplateStyle, brandColor: string) => void;
}

const TEMPLATES: {
  id: TemplateStyle;
  name: string;
  badge: string;
  description: string;
  accent: string;
}[] = [
  {
    id: 'modern',
    name: 'Modern Accent',
    badge: 'Popular SaaS',
    description: 'Clean, structured design featuring accent table headers, high readability, and clean status tags.',
    accent: '#2563EB',
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    badge: 'Editorial & Ultra-Clean',
    description: 'Generous white space, fine hairline dividers, and understated luxury typography.',
    accent: '#059669',
  },
  {
    id: 'premium',
    name: 'Premium Studio',
    badge: 'High-End Luxury',
    description: 'Top colored accent stripe, serif typography accents, and framed summary sections.',
    accent: '#4F46E5',
  },
  {
    id: 'creative',
    name: 'Creative Agency',
    badge: 'Bold Studio',
    description: 'Contemporary dark header banner with dynamic geometry and bold typography.',
    accent: '#D97706',
  },
];

export const TemplatesView: React.FC<Props> = ({
  settings,
  sampleInvoice,
  onUpdateDefaultTemplate,
  onCreateInvoiceWithTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>(
    settings.defaultTemplate || 'modern'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    settings.defaultBrandColor || '#2563EB'
  );

  // Preview invoice copy with active template and color
  const previewInvoice: Invoice = {
    ...sampleInvoice,
    template: selectedTemplate,
    brandColor: selectedColor,
  };

  const calculations = calculateInvoice(previewInvoice);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Invoice Templates & Themes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose from 4 professionally engineered A4 layout systems without altering your invoice data or calculations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onUpdateDefaultTemplate(selectedTemplate, selectedColor)}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs"
          >
            Set as Default Template
          </button>
          <button
            type="button"
            onClick={() => onCreateInvoiceWithTemplate(selectedTemplate, selectedColor)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Use Template for New Invoice</span>
          </button>
        </div>
      </div>

      {/* Template Card Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => {
                setSelectedTemplate(tmpl.id);
                setSelectedColor(tmpl.accent);
              }}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {tmpl.badge}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{tmpl.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{tmpl.description}</p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600">
                <span>{isSelected ? 'Currently Selected' : 'Click to Preview'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Preview Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 text-base">
            Live Preview: {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
          </h3>
          <span className="text-xs text-slate-500">
            Real A4 render test with sample studio data
          </span>
        </div>

        <div className="h-[750px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          <InvoiceA4Preview invoice={previewInvoice} calculations={calculations} />
        </div>
      </div>
    </div>
  );
};
