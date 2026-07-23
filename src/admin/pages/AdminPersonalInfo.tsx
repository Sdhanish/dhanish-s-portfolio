import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPersonalInfo, savePersonalInfo, uploadMediaFile } from '../../firebase/services';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { PersonalInfo } from '../../types';
import { portfolioData } from '../../data';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  User,
  Save,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';

export default function AdminPersonalInfo() {
  const navigate = useNavigate();
  const { refreshData } = usePortfolio();
  const [formData, setFormData] = useState<PersonalInfo>(portfolioData.personalInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingHeroLight, setUploadingHeroLight] = useState(false);
  const [uploadingHeroDark, setUploadingHeroDark] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [rolesText, setRolesText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Delete Image Confirmation State
  const [imageToDelete, setImageToDelete] = useState<{ type: 'avatar' | 'heroLight' | 'heroDark'; title: string } | null>(null);
  const [deletingImage, setDeletingImage] = useState(false);

  useEffect(() => {
    const loadInfo = async () => {
      setLoading(true);
      try {
        const info = await fetchPersonalInfo();
        if (info) {
          setFormData(info);
          setRolesText(info.roles ? info.roles.join(', ') : '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInfo();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const url = await uploadMediaFile('avatars', file);
      const updated = { ...formData, avatar: url };
      setFormData(updated);
      await savePersonalInfo(updated);
      await refreshData();
      setSuccessMsg('Profile avatar uploaded and saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Avatar upload failed: ${err.message || err}`);
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleResumeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const url = await uploadMediaFile('resumes', file);
      const updated = { ...formData, resumeUrl: url };
      setFormData(updated);
      await savePersonalInfo(updated);
      await refreshData();
      setSuccessMsg('Resume PDF uploaded and saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Resume upload failed: ${err.message || err}`);
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleHeroUpload = async (type: 'light' | 'dark', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === 'light') setUploadingHeroLight(true);
    else setUploadingHeroDark(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const url = await uploadMediaFile('hero', file);
      const updated = {
        ...formData,
        [type === 'light' ? 'heroImageLight' : 'heroImageDark']: url
      };
      setFormData(updated);
      await savePersonalInfo(updated);
      await refreshData();
      setSuccessMsg(`${type === 'light' ? 'Light' : 'Dark'} mode hero background uploaded and saved!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Hero image upload failed: ${err.message || err}`);
    } finally {
      if (type === 'light') setUploadingHeroLight(false);
      else setUploadingHeroDark(false);
      e.target.value = '';
    }
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const url = await uploadMediaFile('logos', file);
      const updated = {
        ...formData,
        logo: url,
        logoLight: url,
        logoDark: url
      };
      setFormData(updated);
      await savePersonalInfo(updated);
      await refreshData();
      setSuccessMsg('Website brand logo uploaded and saved successfully across all themes!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Logo upload failed: ${err.message || err}`);
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleDeleteImageRequest = (type: 'avatar' | 'heroLight' | 'heroDark') => {
    let title = 'Profile Avatar';
    if (type === 'heroLight') title = 'Light Mode Hero Background Image';
    if (type === 'heroDark') title = 'Dark Mode Hero Background Image';
    setImageToDelete({ type, title });
  };

  const handleConfirmDeleteImage = async () => {
    if (!imageToDelete) return;
    const { type } = imageToDelete;
    setDeletingImage(true);
    setErrorMsg('');
    try {
      const updated = { ...formData };
      if (type === 'avatar') updated.avatar = '';
      if (type === 'heroLight') updated.heroImageLight = '';
      if (type === 'heroDark') updated.heroImageDark = '';

      setFormData(updated);
      await savePersonalInfo(updated);
      await refreshData();
      setSuccessMsg(`${imageToDelete.title} removed successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Failed to delete image: ${err.message || err}`);
    } finally {
      setDeletingImage(false);
      setImageToDelete(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const parsedRoles = rolesText
        .split(',')
        .map(r => r.trim())
        .filter(Boolean);

      const updated = {
        ...formData,
        roles: parsedRoles.length > 0 ? parsedRoles : formData.roles
      };

      await savePersonalInfo(updated);
      await refreshData();
      setFormData(updated);
      setSuccessMsg('Personal information updated successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 space-x-3">
        <Loader2 className="w-6 h-6 text-[#BDF869] animate-spin" />
        <span className="font-mono text-sm">Loading personal information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white flex items-center gap-2">
            <User className="w-6 h-6 text-[#BDF869]" />
            Personal Information
          </h1>
          <p className="text-xs text-neutral-400">
            Edit your core portfolio details, intro statement, social links, avatar, and resume PDF.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Avatar & Resume Link Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          {/* Avatar URL / Path */}
          <div className="space-y-4">
            <label className="block text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
              Profile Avatar Image Link
            </label>
            <div className="flex items-start space-x-4">
              {Boolean(formData.avatar) ? (
                <img
                  src={formData.avatar || undefined}
                  alt="Avatar Preview"
                  className="w-20 h-20 shrink-0 rounded-2xl object-cover border-2 border-[#6C8E12]/50 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 shrink-0 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="space-y-2 flex-1 min-w-0">
                <input
                  type="text"
                  value={formData.avatar || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="Paste URL or path (e.g. https://... or /src/assets/images/avatar.jpg)"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#BDF869] font-mono"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-neutral-500 font-mono">Image URL or public asset path</p>
                  {Boolean(formData.avatar) && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: '' }))}
                      className="text-[10px] font-mono text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Resume PDF URL */}
          <div className="space-y-4 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6">
            <label className="block text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
              Resume PDF Link / Drive URL
            </label>
            <div className="space-y-3">
              {formData.resumeUrl ? (
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0 text-xs text-neutral-300">
                    <FileText className="w-4 h-4 text-[#BDF869] shrink-0" />
                    <span className="truncate font-mono">Resume PDF Link Active</span>
                  </div>
                  <a
                    href={formData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-[#BDF869] underline hover:opacity-80 shrink-0"
                  >
                    View PDF
                  </a>
                </div>
              ) : (
                <p className="text-xs text-neutral-500">No PDF link configured.</p>
              )}

              <input
                type="text"
                value={formData.resumeUrl || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
                placeholder="Paste PDF URL (e.g. Google Drive link or hosted PDF)"
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#BDF869] font-mono"
              />
              <p className="text-[10px] text-neutral-500 font-mono">Google Drive, Cloud storage, or hosted PDF URL</p>
            </div>
          </div>
        </div>

        {/* Hero Section Background Images Row */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div>
            <h3 className="text-sm font-mono text-[#BDF869] font-bold uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#BDF869]" />
              Hero Section Background Images
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Paste direct image URLs or asset paths for the Hero section background in Light and Dark modes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Light Mode Hero Image */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sun className="w-4 h-4" />
                  Light Theme Hero Image
                </span>
                {formData.heroImageLight && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, heroImageLight: '' }))}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Clear Light Hero Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center group">
                {formData.heroImageLight ? (
                  <>
                    <img
                      src={formData.heroImageLight}
                      alt="Light Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] font-mono text-white bg-black/60 px-2.5 py-1 rounded-md">
                        Light Mode Preview
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-neutral-500">
                    <Sun className="w-6 h-6 mb-1 text-neutral-600" />
                    <span className="text-[10px] font-mono">No Light Theme Image Link</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  Paste Light Theme Image Link:
                </label>
                <input
                  type="text"
                  value={formData.heroImageLight || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroImageLight: e.target.value }))}
                  placeholder="Paste URL (e.g. https://... or public image link)"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#BDF869] font-mono"
                />
              </div>
            </div>

            {/* Dark Mode Hero Image */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Moon className="w-4 h-4" />
                  Dark Theme Hero Image
                </span>
                {formData.heroImageDark && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, heroImageDark: '' }))}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Clear Dark Hero Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center group">
                {formData.heroImageDark ? (
                  <>
                    <img
                      src={formData.heroImageDark}
                      alt="Dark Hero Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] font-mono text-white bg-black/60 px-2.5 py-1 rounded-md">
                        Dark Mode Preview
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-neutral-500">
                    <Moon className="w-6 h-6 mb-1 text-neutral-600" />
                    <span className="text-[10px] font-mono">No Dark Theme Image Link</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  Paste Dark Theme Image Link:
                </label>
                <input
                  type="text"
                  value={formData.heroImageDark || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, heroImageDark: e.target.value }))}
                  placeholder="Paste URL (e.g. https://... or public image link)"
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#BDF869] font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Unified Brand Logo Section */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div>
            <h3 className="text-sm font-mono text-[#BDF869] font-bold uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#BDF869]" />
              Website Brand Logo (Unified Light & Dark Theme)
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Configure a single brand logo used across the entire website (Navbar, Loading Screen, and Footer) in both Light and Dark modes. The website loads the local asset instantly on initial render and updates seamlessly if a database URL is provided.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-center gap-6">
            {/* Logo Live Preview Badge */}
            <div className="relative shrink-0 w-24 h-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-2 shadow-inner group">
              {(formData.logo || formData.logoLight || formData.logoDark) ? (
                <img
                  src={formData.logo || formData.logoLight || formData.logoDark}
                  alt="Brand Logo Preview"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="font-display font-extrabold text-2xl text-[#BDF869]">
                  DS
                </span>
              )}
            </div>

            {/* Inputs & Upload Actions */}
            <div className="flex-1 w-full space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
                  Logo URL or Asset Path:
                </label>
                <input
                  type="text"
                  value={formData.logo || formData.logoLight || formData.logoDark || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      logo: val,
                      logoLight: val,
                      logoDark: val
                    }));
                  }}
                  placeholder="Paste URL or path (e.g. https://... or /src/assets/images/main-logo.png)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#BDF869] font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="inline-flex items-center px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono hover:border-[#BDF869] hover:text-[#BDF869] cursor-pointer transition-colors shadow-sm">
                  {uploadingLogo ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin text-[#BDF869]" />
                      Uploading Logo...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 mr-2 text-[#BDF869]" />
                      Upload New Logo Image
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>

                {(formData.logo || formData.logoLight || formData.logoDark) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        logo: '',
                        logoLight: '',
                        logoDark: ''
                      }));
                    }}
                    className="text-xs font-mono text-red-400 hover:text-red-300 hover:underline flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Database Logo (Use Local Asset Default)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <h3 className="text-sm font-mono text-[#BDF869] font-bold uppercase tracking-wider">
            General Identity & Headline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">
                Animated Roles (Comma separated)
              </label>
              <input
                type="text"
                value={rolesText}
                onChange={(e) => setRolesText(e.target.value)}
                placeholder="Frontend Developer, React Developer, MERN Stack Developer"
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">Hero Short Introduction</label>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">Detailed About Text</label>
            <textarea
              name="aboutText"
              value={formData.aboutText}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
            />
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <h3 className="text-sm font-mono text-[#BDF869] font-bold uppercase tracking-wider">
            Location, Contact & Social Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">GitHub Profile URL</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">LinkedIn Profile URL</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">Instagram Profile URL</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-[#6C8E12] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex flex-col items-end space-y-4 pt-4">
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
            <span>{saving ? 'Saving Changes...' : 'Save Personal Info'}</span>
          </button>

          {successMsg && (
            <div className="w-full p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </form>

      {/* Confirm Dialog for Image Deletions */}
      <ConfirmDialog
        open={!!imageToDelete}
        title={`Delete ${imageToDelete?.title || 'Image'}`}
        message={imageToDelete ? `Are you sure you want to remove the ${imageToDelete.title}?` : ''}
        confirmText="Remove Image"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingImage}
        onConfirm={handleConfirmDeleteImage}
        onCancel={() => setImageToDelete(null)}
      />
    </div>
  );
}
