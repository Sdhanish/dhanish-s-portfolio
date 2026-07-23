import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { fetchSettings, saveSettings, defaultSettings } from '../../firebase/services';
import { SettingsItem } from '../../types';
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Palette,
  Search
} from 'lucide-react';

export default function AdminSettings() {
  const [formData, setFormData] = useState<SettingsItem>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        const config = await fetchSettings();
        if (config) {
          setFormData(config);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await saveSettings(formData);
      setSuccessMsg('Portfolio SEO & site settings updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 space-x-3">
        <Loader2 className="w-6 h-6 text-[#BDF869] animate-spin" />
        <span className="font-mono text-sm">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#BDF869]" />
            Site & SEO Settings
          </h1>
          <p className="text-xs text-neutral-400">
            Configure SEO metadata, search keywords, OpenGraph previews, Google Analytics, theme accents & footer branding.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SEO Configuration */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <h3 className="text-sm font-mono text-[#BDF869] font-bold uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4" />
            SEO & Search Meta Configuration
          </h3>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">Meta Description</label>
            <textarea
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">Keywords (Comma separated)</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
            />
          </div>
        </div>

        {/* Media & Analytics */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <h3 className="text-sm font-mono text-[#BDF869] font-bold uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" />
            OpenGraph, Favicon & Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">OpenGraph Preview Image URL</label>
              <input
                type="text"
                name="openGraphImage"
                value={formData.openGraphImage}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">Favicon Path / URL</label>
              <input
                type="text"
                name="favicon"
                value={formData.favicon}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">Google Analytics Tracking ID (e.g., G-XXXXXXXXXX)</label>
            <input
              type="text"
              name="googleAnalyticsId"
              value={formData.googleAnalyticsId}
              onChange={handleChange}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
            />
          </div>
        </div>

        {/* Branding & Theme */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <h3 className="text-sm font-mono text-[#BDF869] font-bold uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Branding & Footer Text
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">Theme Accent Color Code</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  name="themeAccent"
                  value={formData.themeAccent || '#6C8E12'}
                  onChange={handleChange}
                  className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 cursor-pointer p-1"
                />
                <input
                  type="text"
                  name="themeAccent"
                  value={formData.themeAccent}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">Footer Branding Text</label>
              <input
                type="text"
                name="footerText"
                value={formData.footerText}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-[#6C8E12]/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
