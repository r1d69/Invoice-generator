import React from 'react';
import { Invoice, TemplateStyle } from '../../types';
import { Palette, Check, LayoutTemplate, Type } from 'lucide-react';

interface Props {
  invoice: Invoice;
  onChange: (updated: Invoice) => void;
}

const BRAND_PALETTES = [
  { name: 'Royal Blue (Default)', hex: '#2563EB' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Indigo Modern', hex: '#4F46E5' },
  { name: 'Deep Slate', hex: '#0F172A' },
  { name: 'Rose Red', hex: '#E11D48' },
  { name: 'Amber Gold', hex: '#D97706' },
  { name: 'Violet Purple', hex: '#7C3AED' },
  { name: 'Ocean Cyan', hex: '#0891B2' },
];

const TEMPLATE_OPTIONS: { id: TemplateStyle; name: string; desc: string }[] = [
  {
    id: 'modern',
    name: 'Modern Accent',
    desc: 'Contemporary layout with colored table headers and structured badges.',
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    desc: 'Spacious light layout with understated borders and crisp typography.',
  },
  {
    id: 'premium',
    name: 'Premium Studio',
    desc: 'Framed borders with elegant typography and high-contrast styling.',
  },
  {
    id: 'creative',
    name: 'Creative Agency',
    desc: 'Distinctive dark header banner with dynamic geometry and bold accents.',
  },
];

export const DesignBrandingSection: React.FC<Props> = ({ invoice, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <Palette className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800 text-sm">Design, Template & Branding</h3>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Invoice Template Style
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATE_OPTIONS.map((tmpl) => {
            const isSelected = (invoice.template || 'modern') === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => onChange({ ...invoice, template: tmpl.id })}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                    {tmpl.name}
                  </h4>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{tmpl.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Color Picker */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Brand Accent Color
        </label>
        
        <div className="flex flex-wrap gap-2 items-center">
          {BRAND_PALETTES.map((pal) => {
            const isSelected = (invoice.brandColor || '#2563EB').toLowerCase() === pal.hex.toLowerCase();
            return (
              <button
                key={pal.hex}
                type="button"
                onClick={() => onChange({ ...invoice, brandColor: pal.hex })}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                  isSelected ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: pal.hex }}
                title={pal.name}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}

          {/* Custom HEX Input */}
          <div className="flex items-center gap-2 pl-2 text-xs">
            <input
              type="color"
              value={invoice.brandColor || '#2563EB'}
              onChange={(e) => onChange({ ...invoice, brandColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
            />
            <input
              type="text"
              value={invoice.brandColor || '#2563EB'}
              onChange={(e) => onChange({ ...invoice, brandColor: e.target.value })}
              placeholder="#2563EB"
              className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono uppercase text-slate-900 font-bold"
            />
          </div>
        </div>
      </div>

      {/* Typography Style */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Typography Pairing
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { id: 'sans', label: 'Plus Jakarta', sub: 'Modern SaaS' },
            { id: 'serif', label: 'Playfair Serif', sub: 'Editorial & Luxury' },
            { id: 'outfit', label: 'Outfit Display', sub: 'Creative Agency' },
            { id: 'mono', label: 'JetBrains Mono', sub: 'Technical & Dev' },
          ].map((f) => {
            const isSelected = (invoice.fontStyle || 'sans') === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ ...invoice, fontStyle: f.id as any })}
                className={`p-2.5 rounded-lg border text-left transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="font-semibold">{f.label}</div>
                <div className="text-[10px] text-slate-400 font-normal">{f.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
