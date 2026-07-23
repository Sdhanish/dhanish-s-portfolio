import { useState, useEffect, FormEvent } from 'react';
import { fetchServices, createService, updateService, deletePortfolioItem } from '../../firebase/services';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { ServiceItem } from '../../types';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit,
  Loader2,
  X,
  Layout,
  Smartphone,
  Database,
  Cpu,
  Layers,
  Globe,
  Code,
  AlertCircle,
  FileCode,
  CheckCircle
} from 'lucide-react';

const ICON_OPTIONS = ['Layout', 'Smartphone', 'Database', 'Cpu', 'Layers', 'Globe', 'Code'];

export default function AdminServices() {
  const { refreshData } = usePortfolio();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);

  // JSON Paste & Save modal state
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonSaving, setJsonSaving] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState<string | null>(null);

  // Confirm dialog state
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    description: '',
    iconName: 'Layout',
    tags: []
  });

  const [tagsInput, setTagsInput] = useState('');

  const loadServicesList = async () => {
    setLoading(true);
    try {
      const list = await fetchServices();
      setServices(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicesList();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      iconName: 'Layout',
      tags: [],
      order: services.length + 1
    });
    setTagsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setFormData({
      title: s.title,
      description: s.description,
      iconName: s.iconName || 'Layout',
      tags: s.tags || [],
      order: s.order ?? 1
    });
    setTagsInput(s.tags ? s.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    setSaving(true);
    setErrorNotice(null);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags: parsedTags
      };

      if (editingService && editingService.id) {
        await updateService(editingService.id, payload);
      } else {
        await createService(payload);
      }

      setIsModalOpen(false);
      await loadServicesList();
    } catch (err) {
      console.error(err);
      setErrorNotice('Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (id?: string) => {
    if (!id) return;
    const serv = services.find(s => s.id === id);
    setItemToDelete({ id, title: serv?.title || 'this service' });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { id } = itemToDelete;
    setDeleting(true);
    setErrorNotice(null);

    // Optimistic UI removal
    setServices(prev => prev.filter(s => s.id !== id));

    try {
      await deletePortfolioItem('services', id);
      await refreshData();
      const updatedList = await fetchServices();
      setServices(updatedList);
    } catch (err: any) {
      console.error('Error deleting service:', err);
      setErrorNotice(`Error deleting service: ${err.message || 'Server error'}`);
      await loadServicesList();
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleSaveJson = async () => {
    setJsonError(null);
    setJsonSuccess(null);
    if (!jsonInput.trim()) {
      setJsonError('Please paste valid JSON data before saving.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput.trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (items.length === 0) {
        setJsonError('JSON data is empty.');
        return;
      }

      setJsonSaving(true);
      let count = 0;
      for (const item of items) {
        if (!item || typeof item !== 'object') continue;
        if (!item.title || !item.description) {
          throw new Error('Each service object in JSON must have at least "title" and "description" fields.');
        }
        await createService({
          title: String(item.title),
          description: String(item.description),
          iconName: item.iconName ? String(item.iconName) : 'Layout',
          tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
          order: typeof item.order === 'number' ? item.order : services.length + count + 1
        });
        count++;
      }
      setJsonSuccess(`Successfully added ${count} service(s) from JSON!`);
      setJsonInput('');
      await refreshData();
      await loadServicesList();
      setTimeout(() => {
        setIsJsonModalOpen(false);
        setJsonSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setJsonError(err.message || 'Invalid JSON format');
    } finally {
      setJsonSaving(false);
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-[#BDF869]" />;
      case 'Database': return <Database className="w-5 h-5 text-[#BDF869]" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#BDF869]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#BDF869]" />;
      case 'Globe': return <Globe className="w-5 h-5 text-[#BDF869]" />;
      default: return <Layout className="w-5 h-5 text-[#BDF869]" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 space-x-3">
        <Loader2 className="w-6 h-6 text-[#BDF869] animate-spin" />
        <span className="font-mono text-sm">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Banner */}
      {errorNotice && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorNotice(null)}
            className="p-1 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#BDF869]" />
            Services Offered ({services.length})
          </h1>
          <p className="text-xs text-neutral-400">
            Manage professional service offerings and technical capabilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => {
              setJsonError(null);
              setJsonSuccess(null);
              setIsJsonModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-[#BDF869] border border-neutral-700 text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-[#BDF869]" />
            <span>Add via JSON</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-[#6C8E12]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((serv) => (
          <div
            key={serv.id || serv.title}
            className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 w-fit">
                {renderIcon(serv.iconName)}
              </div>
              <h3 className="font-display font-extrabold text-white text-lg">{serv.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{serv.description}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex flex-wrap gap-1.5">
                {serv.tags?.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 text-neutral-300 border border-neutral-800">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => handleOpenEditModal(serv)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-white"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRequest(serv.id);
                  }}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer relative z-10 transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-lg font-display font-extrabold text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Service Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Icon</label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData(p => ({ ...p, iconName: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, Node, Responsive, UI/UX"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-xs font-mono text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON Import Modal */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h2 className="text-lg font-display font-extrabold text-white flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-[#BDF869]" />
                  Add Services via JSON
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Paste JSON data (a single service object or an array of service objects) and save directly.
                </p>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {jsonError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}

            {jsonSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{jsonSuccess}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-mono text-neutral-400">
                Paste JSON Data:
              </label>
              <textarea
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={`[\n  {\n    "title": "Full-Stack Web Development",\n    "description": "Building modern, scalable web applications with React and Node.js.",\n    "iconName": "Layout",\n    "tags": ["React", "Node.js", "MongoDB", "TypeScript"]\n  }\n]`}
                className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-xs focus:border-[#6C8E12] focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-xs font-mono text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveJson}
                disabled={jsonSaving}
                className="px-5 py-2.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {jsonSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{jsonSaving ? 'Saving JSON...' : 'Save JSON Data'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!itemToDelete}
        title="Delete Service"
        message={itemToDelete ? `Are you sure you want to delete the service "${itemToDelete.title}"?` : ''}
        confirmText="Delete Service"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
