import { useState, useMemo, useEffect } from 'react';
import { X, Printer, Mail, Phone, MapPin, Globe, Download, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { usePortfolio } from '../contexts/PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { personalInfo, timeline, skills, projects } = usePortfolio();
  const [viewMode, setViewMode] = useState<'formatted' | 'pdf'>('formatted');

  const { name, roles, aboutText, email, phone, location, github, linkedin, resumeUrl } = personalInfo;

  // Create a blob URL if resumeUrl is a base64 data URI so Chrome/browsers don't block iframe/object display
  const pdfBlobUrl = useMemo(() => {
    if (!resumeUrl) return null;
    if (resumeUrl.startsWith('data:application/pdf')) {
      try {
        const base64Parts = resumeUrl.split(',');
        const base64Data = base64Parts[1] || base64Parts[0];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
      } catch (e) {
        console.error('Error creating Blob URL for PDF:', e);
        return resumeUrl;
      }
    }
    return resumeUrl;
  }, [resumeUrl]);

  // Clean up Blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (resumeUrl) {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = `${name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.print();
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, '_blank');
    } else if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md">
      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Controls Bar (Hidden on print) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6C8E12] dark:bg-[#BDF869]" />
            <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
              {name} — Resume
            </span>

            {Boolean(resumeUrl) && (
              <div className="flex bg-neutral-200 dark:bg-neutral-800 p-0.5 rounded-lg text-[10px] font-mono font-bold">
                <button
                  onClick={() => setViewMode('formatted')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === 'formatted'
                      ? 'bg-white dark:bg-neutral-900 text-[#1B2410] dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Formatted View
                </button>
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    viewMode === 'pdf'
                      ? 'bg-white dark:bg-neutral-900 text-[#1B2410] dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Uploaded PDF View
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {Boolean(resumeUrl) && (
              <button
                onClick={handleOpenInNewTab}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                title="Open PDF in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open Tab</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#6C8E12] hover:bg-[#5a770f] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              title="Download Resume File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {viewMode === 'pdf' && Boolean(resumeUrl) ? (
          <div className="w-full h-[75vh] bg-neutral-950 flex flex-col items-center justify-center relative">
            <object
              data={pdfBlobUrl || undefined}
              type="application/pdf"
              className="w-full h-full border-0"
            >
              <div className="flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                <FileText className="w-12 h-12 text-[#BDF869]" />
                <p className="text-sm font-sans font-medium text-neutral-300">
                  Your browser restricts inline PDF previews.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-4 py-2 bg-[#BDF869] text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#a6e054] transition-colors"
                  >
                    Open PDF in New Tab
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </object>
          </div>
        ) : (
          /* Scrollable Printable Area */
          <div className="overflow-y-auto p-8 sm:p-12 text-neutral-800 dark:text-neutral-200 select-text print:overflow-visible print:p-0 print:text-black">
            {/* Print Styles Wrapper */}
            <div className="resume-print-root space-y-10">
              {/* Header / Contact Info */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start pb-8 border-b border-neutral-200 dark:border-neutral-800 gap-6">
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-neutral-900 dark:text-neutral-50 print:text-black">
                    {name}
                  </h1>
                  <p className="text-sm font-mono text-[#6C8E12] dark:text-[#BDF869] font-bold uppercase tracking-widest">
                    {roles.join(' | ')}
                  </p>
                </div>

                {/* Direct links list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                  <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 print:text-neutral-800">
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 print:text-neutral-800">
                    <Phone className="w-4 h-4 text-neutral-400" />
                    <span>{phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 print:text-neutral-800">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 print:text-neutral-800">
                    <Globe className="w-4 h-4 text-neutral-400" />
                    <span className="truncate max-w-[150px]">{github.replace('https://', '')}</span>
                  </div>
                </div>
              </div>

              {/* Profile Summary */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono font-bold text-[#6C8E12] dark:text-[#BDF869] uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                  Professional Summary
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed print:text-neutral-800">
                  {aboutText}
                </p>
              </div>

              {/* Education & Academic Excellence */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-bold text-[#6C8E12] dark:text-[#BDF869] uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                  Education
                </h2>

                <div className="space-y-4">
                  {timeline.filter(t => t.type === 'Education').map((item, idx) => (
                    <div key={`res-edu-${item.id || item.title}-${idx}`} className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                          <span>{item.title}</span>
                          {item.cgpa && (
                            <span className="text-[10px] font-mono font-bold bg-[#6C8E12]/10 dark:bg-[#BDF869]/10 text-[#6C8E12] dark:text-[#BDF869] px-2 py-0.5 rounded-full border border-[#6C8E12]/20 dark:border-[#BDF869]/20">
                              CGPA: {item.cgpa}
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {item.organization} ({item.location})
                        </p>
                      </div>
                      <div className="text-xs font-mono text-neutral-500 font-bold uppercase shrink-0">
                        {item.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Grid */}
              <div className="space-y-3">
                <h2 className="text-xs font-mono font-bold text-[#6C8E12] dark:text-[#BDF869] uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                  Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  <div>
                    <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      Programming Languages &amp; Frontend
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {[
                        ...skills.filter(s => s.category === 'Languages').map(s => s.name),
                        ...skills.filter(s => s.category === 'Frontend').map(s => s.name)
                      ].join(', ')}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2">
                      Backend, Databases &amp; Tools
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {[
                        ...skills.filter(s => s.category === 'Backend').map(s => s.name),
                        ...skills.filter(s => s.category === 'Database').map(s => s.name),
                        ...skills.filter(s => s.category === 'Tools').map(s => s.name)
                      ].join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Work Experience */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-bold text-[#6C8E12] dark:text-[#BDF869] uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                  Professional Experience
                </h2>

                <div className="space-y-4">
                  {timeline.filter(t => t.type === 'Experience').map((exp, idx) => (
                    <div key={`res-exp-${exp.id || exp.title}-${idx}`} className="space-y-1.5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            {exp.title}
                          </h3>
                          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            {exp.organization} — {exp.location}
                          </p>
                        </div>
                        <div className="text-xs font-mono text-neutral-500 font-bold uppercase shrink-0">
                          {exp.period}
                        </div>
                      </div>
                      {exp.highlights && (
                        <ul className="list-disc list-inside space-y-1 pt-1 text-xs text-neutral-600 dark:text-neutral-300">
                          {exp.highlights.map((h, hIdx) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Projects */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-bold text-[#6C8E12] dark:text-[#BDF869] uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                  Projects
                </h2>

                <div className="space-y-4">
                  {projects.map((project, idx) => (
                    <div key={`res-proj-${project.id || project.title}-${idx}`} className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {project.title}
                        </h3>
                        <div className="text-[10px] font-mono text-neutral-500 font-bold uppercase">
                          {project.category}
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed print:text-neutral-800">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="text-[10px] font-mono font-bold text-neutral-500">
                          Technologies: {project.stack?.join(', ')}
                        </span>
                      </div>
                      {(project.github || project.live) && (
                        <div className="flex items-center space-x-3 text-[11px] font-mono text-[#6C8E12] dark:text-[#BDF869] pt-1">
                          {project.github && <span>GitHub: {project.github}</span>}
                          {project.live && <span>Live: {project.live}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Training & Certifications */}
              <div className="space-y-4">
                <h2 className="text-xs font-mono font-bold text-[#6C8E12] dark:text-[#BDF869] uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                  Training and Certification
                </h2>

                <div className="space-y-3">
                  {timeline.filter(t => t.type === 'Training').map((item, idx) => (
                    <div key={`res-trn-${item.id || item.title}-${idx}`} className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {item.title} — {item.organization}
                        </h3>
                        <div className="text-xs font-mono text-neutral-500 font-bold uppercase shrink-0">
                          {item.period}
                        </div>
                      </div>
                      {item.highlights && (
                        <ul className="list-disc list-inside space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                          {item.highlights.map((h, hIdx) => (
                            <li key={hIdx}>{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
