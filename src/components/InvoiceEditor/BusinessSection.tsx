import React, { useRef } from 'react';
import { BusinessProfile } from '../../types';
import { Building2, Upload, Image as ImageIcon, Trash2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface Props {
  business: BusinessProfile;
  onChange: (updated: BusinessProfile) => void;
}

export const BusinessSection: React.FC<Props> = ({ business, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof BusinessProfile, value: any) => {
    onChange({
      ...business,
      [field]: value,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      alert('Logo file size must be under 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleFieldChange('logo', event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    handleFieldChange('logo', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800 text-sm">Business & Sender Profile</h3>
      </div>

      {/* Logo Upload & Controls */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Company Logo
        </label>

        {business.logo ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-200">
              <img
                src={business.logo}
                alt="Logo Preview"
                className="max-h-16 object-contain rounded"
                style={{ width: `${business.logoWidth || 140}px` }}
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 text-xs">
                <p className="font-semibold text-slate-800">Logo Uploaded</p>
                <p className="text-slate-500">Scale and align for the invoice header</p>
              </div>
              <button
                type="button"
                onClick={removeLogo}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Remove logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Logo Width & Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Logo Width</span>
                  <span className="font-mono font-bold text-slate-800">{business.logoWidth || 140}px</span>
                </label>
                <input
                  type="range"
                  min="80"
                  max="280"
                  step="5"
                  value={business.logoWidth || 140}
                  onChange={(e) => handleFieldChange('logoWidth', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1">Alignment</label>
                <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('logoAlignment', 'left')}
                    className={`flex-1 py-1 flex justify-center rounded text-xs transition ${
                      business.logoAlignment === 'left' || !business.logoAlignment
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('logoAlignment', 'center')}
                    className={`flex-1 py-1 flex justify-center rounded text-xs transition ${
                      business.logoAlignment === 'center'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('logoAlignment', 'right')}
                    className={`flex-1 py-1 flex justify-center rounded text-xs transition ${
                      business.logoAlignment === 'right'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
              id="business-logo-input"
            />
            <label
              htmlFor="business-logo-input"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/40 rounded-xl cursor-pointer transition text-center group"
            >
              <div className="p-3 bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 rounded-full mb-2 transition">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">Click to upload logo</p>
              <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, or SVG (Max 3MB)</p>
            </label>
          </div>
        )}
      </div>

      {/* Basic Profile Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            Business / Studio Name *
          </label>
          <input
            type="text"
            value={business.businessName}
            onChange={(e) => handleFieldChange('businessName', e.target.value)}
            placeholder="e.g. Creative Studio Co."
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Tagline / Subtitle</label>
          <input
            type="text"
            value={business.tagline}
            onChange={(e) => handleFieldChange('tagline', e.target.value)}
            placeholder="e.g. High-End 3D Visualization & Production"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Owner / Contact Person</label>
          <input
            type="text"
            value={business.ownerName}
            onChange={(e) => handleFieldChange('ownerName', e.target.value)}
            placeholder="e.g. Alexander Vance"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            value={business.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="e.g. billing@creativestudio.design"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={business.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="e.g. +1 (555) 234-8920"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Website</label>
          <input
            type="text"
            value={business.website}
            onChange={(e) => handleFieldChange('website', e.target.value)}
            placeholder="e.g. www.creativestudio.design"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">Street Address</label>
          <input
            type="text"
            value={business.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            placeholder="e.g. 742 Innovation Way, Suite 400"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">City</label>
          <input
            type="text"
            value={business.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            placeholder="e.g. San Francisco"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">State / Province</label>
          <input
            type="text"
            value={business.state}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            placeholder="e.g. CA"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Postal / ZIP Code</label>
          <input
            type="text"
            value={business.postalCode}
            onChange={(e) => handleFieldChange('postalCode', e.target.value)}
            placeholder="e.g. 94107"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Country</label>
          <input
            type="text"
            value={business.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            placeholder="e.g. United States"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tax Numbers */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">
          Tax & Registration Identifiers
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 mb-1">Tax ID / EIN</label>
            <input
              type="text"
              value={business.taxId}
              onChange={(e) => handleFieldChange('taxId', e.target.value)}
              placeholder="e.g. US-EIN-94-3829104"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">VAT Number</label>
            <input
              type="text"
              value={business.vatNumber}
              onChange={(e) => handleFieldChange('vatNumber', e.target.value)}
              placeholder="e.g. VAT-US9438291"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">GST Number</label>
            <input
              type="text"
              value={business.gstNumber}
              onChange={(e) => handleFieldChange('gstNumber', e.target.value)}
              placeholder="Optional GST No."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Business Registration / Reg No.</label>
            <input
              type="text"
              value={business.businessRegNumber}
              onChange={(e) => handleFieldChange('businessRegNumber', e.target.value)}
              placeholder="e.g. CA-REG-2024-8831"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
