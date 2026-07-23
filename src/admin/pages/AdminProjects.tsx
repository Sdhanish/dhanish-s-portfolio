import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { fetchProjects, createProject, updateProject, deletePortfolioItem, uploadMediaFile } from '../../firebase/services';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { ProjectItem } from '../../types';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  FolderGit2,
  Plus,
  Edit,
  Trash2,
  Upload,
  ExternalLink,
  Github,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Eye,
  EyeOff,
  FileCode
} from 'lucide-react';

export default function AdminProjects() {
  const { refreshData } = usePortfolio();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

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

  const emptyForm: Omit<ProjectItem, 'id'> = {
    title: '',
    category: 'Full Stack MERN',
    description: '',
    stack: [],
    github: '',
    live: '',
    image: '',
    featured: true,
    status: 'published',
    order: 1
  };

  const [formData, setFormData] = useState<Omit<ProjectItem, 'id'>>(emptyForm);
  const [stackInput, setStackInput] = useState('');

  const loadProjectsList = async () => {
    setLoading(true);
    try {
      const list = await fetchProjects();
      setProjects(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsList();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      ...emptyForm,
      order: projects.length + 1
    });
    setStackInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      category: proj.category,
      description: proj.description,
      stack: proj.stack || [],
      github: proj.github || '',
      live: proj.live || '',
      image: proj.image || '',
      featured: proj.featured ?? true,
      status: proj.status || 'published',
      order: proj.order ?? 1
    });
    setStackInput(proj.stack ? proj.stack.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    setErrorNotice(null);
    try {
      const url = await uploadMediaFile('projects', file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err?.message || 'Failed to upload image');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorNotice(null);
    try {
      const parsedStack = stackInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        stack: parsedStack
      };

      if (editingProject && editingProject.id) {
        await updateProject(editingProject.id, payload);
      } else {
        await createProject(payload);
      }

      setIsModalOpen(false);
      await refreshData();
      await loadProjectsList();
    } catch (err) {
      console.error(err);
      setErrorNotice('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (id?: string) => {
    if (!id) return;
    const proj = projects.find(p => p.id === id);
    setItemToDelete({ id, title: proj?.title || 'this project' });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { id } = itemToDelete;
    setDeleting(true);
    setErrorNotice(null);

    // Optimistically update React state
    setProjects(prev => prev.filter(p => p.id !== id));

    try {
      await deletePortfolioItem('projects', id);
      await refreshData();
      const updatedList = await fetchProjects();
      setProjects(updatedList);
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setErrorNotice(`Error deleting project: ${err.message || 'Server error'}`);
      await loadProjectsList();
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
          throw new Error('Each project object in JSON must have at least "title" and "description" fields.');
        }
        await createProject({
          title: String(item.title),
          category: item.category ? String(item.category) : 'Full Stack MERN',
          description: String(item.description),
          stack: Array.isArray(item.stack) ? item.stack.map(String) : [],
          github: item.github ? String(item.github) : '',
          live: item.live ? String(item.live) : '',
          image: item.image ? String(item.image) : '',
          featured: item.featured ?? true,
          status: item.status === 'draft' ? 'draft' : 'published',
          order: typeof item.order === 'number' ? item.order : projects.length + count + 1
        });
        count++;
      }
      setJsonSuccess(`Successfully added ${count} project(s) from JSON!`);
      setJsonInput('');
      await refreshData();
      await loadProjectsList();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 space-x-3">
        <Loader2 className="w-6 h-6 text-[#BDF869] animate-spin" />
        <span className="font-mono text-sm">Loading portfolio projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Notice Banner if any */}
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
            <FolderGit2 className="w-6 h-6 text-[#BDF869]" />
            Projects Management ({projects.length})
          </h1>
          <p className="text-xs text-neutral-400">
            Create, edit, reorder, or publish/draft portfolio projects with images and tech stacks.
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
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, idx) => (
          <div
            key={`${proj.id || proj.title}-${idx}`}
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 flex flex-col justify-between group hover:border-neutral-700 transition-all"
          >
            <div className="space-y-3">
              {/* Image Thumbnail */}
              <div className="relative aspect-video rounded-xl bg-neutral-950 overflow-hidden border border-neutral-800">
                <img
                  src={proj.image || 'https://picsum.photos/seed/placeholder/800/600'}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-neutral-950/80 text-white border border-neutral-700 backdrop-blur-md">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="p-1 rounded-md bg-[#6C8E12] text-white" title="Featured">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold backdrop-blur-md border ${
                      proj.status === 'published'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {proj.status || 'published'}
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <div>
                <h3 className="font-display font-extrabold text-white text-lg">{proj.title}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Stack Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.stack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-950 text-neutral-300 border border-neutral-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-neutral-400">
                {proj.github && (
                  <a href={proj.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {proj.live && (
                  <a href={proj.live} target="_blank" rel="noopener noreferrer" className="hover:text-[#BDF869]">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEditModal(proj)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRequest(proj.id);
                  }}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer border border-red-500/20 relative z-10"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Drawer for Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-display font-extrabold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                    placeholder="Full Stack MERN, Next.js, etc."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>
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
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  Tech Stack (Comma separated tags)
                </label>
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  placeholder="React, Node, MongoDB, Stripe, TypeScript"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData(p => ({ ...p, github: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">Live Demo URL</label>
                  <input
                    type="text"
                    value={formData.live}
                    onChange={(e) => setFormData(p => ({ ...p, live: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
                  />
                </div>
              </div>

              {/* Project Image URL / Link */}
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  Project Image / Screenshot Link
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData(p => ({ ...p, image: e.target.value }))}
                    placeholder="Paste image URL (e.g. https://... or /src/assets/images/project1.png)"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none font-mono"
                  />
                  {Boolean(formData.image) && (
                    <img
                      src={formData.image || undefined}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl border border-neutral-800"
                    />
                  )}
                </div>
              </div>

              {/* Toggles & Order */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#6C8E12]"
                  />
                  <label htmlFor="featured" className="text-xs font-mono text-neutral-300">
                    Featured Item
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(p => ({ ...p, order: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  />
                </div>
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
                  className="px-5 py-2.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
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
                  Add Projects via JSON
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Paste JSON data (a single project object or an array of project objects) and save directly.
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
                placeholder={`[\n  {\n    "title": "SmartFin AI",\n    "category": "Full Stack MERN",\n    "description": "AI-powered financial management platform with live stock charts and portfolio tracking.",\n    "stack": ["React", "Node.js", "Express", "MongoDB", "TailwindCSS"],\n    "github": "https://github.com/...",\n    "live": "https://...",\n    "image": "https://...",\n    "featured": true,\n    "status": "published"\n  }\n]`}
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={!!itemToDelete}
        title="Delete Project"
        message={itemToDelete ? `Are you sure you want to delete "${itemToDelete.title}"? This action cannot be undone.` : ''}
        confirmText="Delete Project"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
