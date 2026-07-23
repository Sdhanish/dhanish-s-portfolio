import { useState, useEffect, FormEvent } from 'react';
import { fetchSkills, createSkill, updateSkill, deletePortfolioItem } from '../../firebase/services';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { SkillItem } from '../../types';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Code2,
  Plus,
  Trash2,
  Edit,
  Loader2,
  X,
  CheckCircle,
  Tag,
  AlertCircle
} from 'lucide-react';

export default function AdminSkills() {
  const { refreshData } = usePortfolio();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Confirm dialog state
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Languages', 'Tools'];

  const [formData, setFormData] = useState<Omit<SkillItem, 'id'>>({
    name: '',
    category: 'Frontend',
    order: 1
  });

  const loadSkillsList = async () => {
    setLoading(true);
    try {
      const list = await fetchSkills();
      setSkills(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkillsList();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: activeCategory !== 'All' ? (activeCategory as any) : 'Frontend',
      order: skills.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: SkillItem) => {
    setEditingSkill(s);
    setFormData({
      name: s.name,
      category: s.category,
      order: s.order ?? 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setSaving(true);
    setErrorNotice(null);
    try {
      if (editingSkill && editingSkill.id) {
        await updateSkill(editingSkill.id, formData);
      } else {
        await createSkill(formData);
      }
      setIsModalOpen(false);
      await loadSkillsList();
    } catch (err) {
      console.error(err);
      setErrorNotice('Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (id?: string) => {
    if (!id) return;
    const skill = skills.find(s => s.id === id);
    setItemToDelete({ id, name: skill?.name || 'this skill' });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { id } = itemToDelete;
    setDeleting(true);
    setErrorNotice(null);

    // Optimistic UI removal
    setSkills(prev => prev.filter(s => s.id !== id));

    try {
      await deletePortfolioItem('skills', id);
      await refreshData();
      const updatedList = await fetchSkills();
      setSkills(updatedList);
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      setErrorNotice(`Error deleting skill: ${err.message || 'Server error'}`);
      await loadSkillsList();
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 space-x-3">
        <Loader2 className="w-6 h-6 text-[#BDF869] animate-spin" />
        <span className="font-mono text-sm">Loading skills list...</span>
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
            <Code2 className="w-6 h-6 text-[#BDF869]" />
            Skills Management ({skills.length})
          </h1>
          <p className="text-xs text-neutral-400">
            Categorize and manage technical skills displayed on your portfolio.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-[#6C8E12]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#6C8E12] text-white shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            {cat} {cat !== 'All' && `(${skills.filter(s => s.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id || skill.name}
            className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div>
              <span className="text-[10px] font-mono text-[#BDF869] block font-bold uppercase tracking-wider">
                {skill.category}
              </span>
              <h4 className="font-display font-extrabold text-white text-sm mt-1">{skill.name}</h4>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-end space-x-1.5">
              <button
                onClick={() => handleOpenEditModal(skill)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                title="Edit Skill"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRequest(skill.id);
                }}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer relative z-10 transition-colors border border-red-500/20"
                title="Delete Skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-lg font-display font-extrabold text-white">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Skill Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. React.js, TypeScript, PostgreSQL"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value as any }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Languages">Languages</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(p => ({ ...p, order: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingSkill ? 'Update Skill' : 'Create Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!itemToDelete}
        title="Delete Skill"
        message={itemToDelete ? `Are you sure you want to delete the skill "${itemToDelete.name}"?` : ''}
        confirmText="Delete Skill"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
