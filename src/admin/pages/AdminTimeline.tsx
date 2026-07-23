import { useState, useEffect, FormEvent } from 'react';
import { fetchTimeline, createTimeline, updateTimeline, deletePortfolioItem } from '../../firebase/services';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { TimelineItem } from '../../types';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  Loader2,
  X,
  GraduationCap,
  Briefcase,
  Award,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export default function AdminTimeline() {
  const { refreshData } = usePortfolio();
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Education' | 'Experience' | 'Training'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Confirm dialog state
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<TimelineItem, 'id'>>({
    title: '',
    type: 'Education',
    organization: '',
    location: '',
    period: '',
    cgpa: '',
    certificateUrl: '',
    highlights: [],
    description: '',
    order: 1
  });

  const [highlightsInput, setHighlightsInput] = useState('');

  const loadTimelineList = async () => {
    setLoading(true);
    try {
      const list = await fetchTimeline();
      setItems(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimelineList();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      type: activeFilter !== 'All' ? activeFilter : 'Education',
      organization: '',
      location: '',
      period: '',
      cgpa: '',
      certificateUrl: '',
      highlights: [],
      description: '',
      order: items.length + 1
    });
    setHighlightsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: TimelineItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      organization: item.organization,
      location: item.location,
      period: item.period,
      cgpa: item.cgpa || '',
      certificateUrl: item.certificateUrl || '',
      highlights: item.highlights || [],
      description: item.description || '',
      order: item.order ?? 1
    });
    setHighlightsInput(item.highlights ? item.highlights.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.organization) return;
    setSaving(true);
    setErrorNotice(null);
    try {
      const parsedHighlights = highlightsInput
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        highlights: parsedHighlights
      };

      if (editingItem && editingItem.id) {
        await updateTimeline(editingItem.id, payload);
      } else {
        await createTimeline(payload);
      }

      setIsModalOpen(false);
      await loadTimelineList();
    } catch (err) {
      console.error(err);
      setErrorNotice('Failed to save timeline entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (id?: string) => {
    if (!id) return;
    const item = items.find(i => i.id === id);
    setItemToDelete({ id, title: item?.title || 'this timeline entry' });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { id } = itemToDelete;
    setDeleting(true);
    setErrorNotice(null);

    // Optimistic UI removal
    setItems(prev => prev.filter(i => i.id !== id));

    try {
      await deletePortfolioItem('timeline', id);
      await refreshData();
      const updatedList = await fetchTimeline();
      setItems(updatedList);
    } catch (err: any) {
      console.error('Error deleting timeline item:', err);
      setErrorNotice(`Error deleting entry: ${err.message || 'Server error'}`);
      await loadTimelineList();
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter(i => i.type === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 space-x-3">
        <Loader2 className="w-6 h-6 text-[#BDF869] animate-spin" />
        <span className="font-mono text-sm">Loading education & career timeline...</span>
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
            <Calendar className="w-6 h-6 text-[#BDF869]" />
            Timeline Management ({items.length})
          </h1>
          <p className="text-xs text-neutral-400">
            Manage your Education, Career Experience, and Specialized Training history.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-[#6C8E12]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timeline Entry</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800">
        {['All', 'Education', 'Experience', 'Training'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeFilter === type
                ? 'bg-[#6C8E12] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            {type} {type !== 'All' && `(${items.filter(i => i.type === type).length})`}
          </button>
        ))}
      </div>

      {/* List Cards */}
      <div className="space-y-4">
        {filteredItems.map((item, idx) => (
          <div
            key={`${item.id || item.title}-${idx}`}
            className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-neutral-950 text-[#BDF869] border border-neutral-800">
                  {item.type}
                </span>
                <span className="text-xs font-mono text-neutral-400">{item.period}</span>
                {item.cgpa && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#6C8E12]/20 text-[#BDF869]">
                    CGPA: {item.cgpa}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-display font-extrabold text-white">{item.title}</h3>
              <p className="text-xs font-mono text-neutral-300">
                {item.organization} <span className="text-neutral-500">• {item.location}</span>
              </p>

              {item.highlights && item.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-xs text-neutral-400 pt-2">
                  {item.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
              {item.certificateUrl && (
                <a
                  href={item.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-[#BDF869] flex items-center space-x-1"
                >
                  <span>Cert</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => handleOpenEditModal(item)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-white"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRequest(item.id);
                }}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer relative z-10 transition-colors"
                title="Delete Timeline Entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-lg font-display font-extrabold text-white">
                {editingItem ? 'Edit Timeline Entry' : 'Add New Timeline Entry'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(p => ({ ...p, type: e.target.value as any }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  >
                    <option value="Education">Education</option>
                    <option value="Experience">Experience</option>
                    <option value="Training">Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">Period</label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData(p => ({ ...p, period: e.target.value }))}
                    placeholder="Sept 2023 – May 2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Title / Degree / Role</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Master of Computer Applications"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">Organization / University</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData(p => ({ ...p, organization: e.target.value }))}
                    placeholder="APJ Abdul Kalam Technological University"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                    placeholder="Kerala, India"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">CGPA (Optional)</label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData(p => ({ ...p, cgpa: e.target.value }))}
                    placeholder="9.09"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">Certificate URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.certificateUrl}
                    onChange={(e) => setFormData(p => ({ ...p, certificateUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  Highlights (One point per line)
                </label>
                <textarea
                  rows={4}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Deepened expertise in advanced software engineering&#10;Graduated with outstanding academic record"
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
                  <span>{editingItem ? 'Update Entry' : 'Create Entry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!itemToDelete}
        title="Delete Timeline Entry"
        message={itemToDelete ? `Are you sure you want to delete "${itemToDelete.title}"?` : ''}
        confirmText="Delete Entry"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
