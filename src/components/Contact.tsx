import { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Github, 
  Linkedin, 
  Instagram, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Sparkles,
  MessageSquare,
  User,
  AlertCircle
} from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { addMessage } from '../firebase/services';

export default function Contact() {
  const { personalInfo } = usePortfolio();
  const { email, phone, location, github, linkedin, instagram } = personalInfo;


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('submitting');
    setErrorMessage('');

    const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!web3FormsKey || web3FormsKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      // Fallback if key not configured yet
      setStatus('error');
      setErrorMessage('Web3Forms Access Key is not configured. Please add VITE_WEB3FORMS_ACCESS_KEY to your env variables.');
      return;
    }

    try {
      // Also save message to Firestore for Admin Messages Panel
      try {
        await addMessage({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || `Portfolio Inquiry from ${formData.name}`,
          message: formData.message
        });
      } catch (fErr) {
        console.warn('Could not save to Firestore inbox:', fErr);
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: web3FormsKey,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || `Portfolio Inquiry from ${formData.name}`,
          message: formData.message,
          from_name: `${formData.name} (Portfolio)`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Failed to dispatch email. Please check your Web3Forms Access Key.');
      }
    } catch (err: any) {
      console.error('Web3Forms error:', err);
      setStatus('error');
      setErrorMessage('Network error occurred. Please try again or use direct mail.');
    }
  };

  const handleMailtoFallback = () => {
    const subjectText = encodeURIComponent(formData.subject || `Inquiry from ${formData.name}`);
    const bodyText = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${email}?subject=${subjectText}&body=${bodyText}`;
  };

  return (
    <section id="contact" className="py-20 bg-neutral-50 dark:bg-neutral-950 text-[#1B2410] dark:text-neutral-100 transition-colors duration-300 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#6C8E12]/5 dark:bg-[#BDF869]/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#6C8E12] dark:text-[#BDF869]">
              06 / Interactive Inquiry
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-[#1B2410] dark:text-white uppercase">
            Let's Build Together
          </h2>
          <div className="w-16 h-1 bg-[#6C8E12] dark:bg-[#BDF869] rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Contact Information & Direct Channels */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Direct Contact Cards */}
            <div className="space-y-3">
              
              {/* Email Card */}
              <div className="group relative flex items-center justify-between p-4 rounded-xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800/90 shadow-sm hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300">
                <a 
                  href={`mailto:${email}`}
                  className="flex items-center space-x-3.5 flex-grow min-w-0"
                >
                  <div className="p-2.5 rounded-lg bg-[#6C8E12]/10 dark:bg-[#BDF869]/10 text-[#6C8E12] dark:text-[#BDF869] group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold">
                      Direct Email
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#1B2410] dark:text-white truncate group-hover:text-[#6C8E12] dark:group-hover:text-[#BDF869] transition-colors">
                      {email}
                    </div>
                  </div>
                </a>

                <button
                  onClick={() => handleCopy(email, 'email')}
                  title="Copy email address"
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-[#6C8E12] dark:hover:text-[#BDF869] transition-colors cursor-pointer shrink-0 ml-2"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Phone Card */}
              <div className="group relative flex items-center justify-between p-4 rounded-xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800/90 shadow-sm hover:border-[#6C8E12] dark:hover:border-[#BDF869] transition-all duration-300">
                <a 
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-center space-x-3.5 flex-grow min-w-0"
                >
                  <div className="p-2.5 rounded-lg bg-[#6C8E12]/10 dark:bg-[#BDF869]/10 text-[#6C8E12] dark:text-[#BDF869] group-hover:scale-110 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold">
                      Phone / WhatsApp
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#1B2410] dark:text-white group-hover:text-[#6C8E12] dark:group-hover:text-[#BDF869] transition-colors">
                      {phone}
                    </div>
                  </div>
                </a>

                <button
                  onClick={() => handleCopy(phone, 'phone')}
                  title="Copy phone number"
                  className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-[#6C8E12] dark:hover:text-[#BDF869] transition-colors cursor-pointer shrink-0 ml-2"
                >
                  {copiedField === 'phone' ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Location Card */}
              <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800/90 shadow-sm">
                <div className="p-2.5 rounded-lg bg-[#6C8E12]/10 dark:bg-[#BDF869]/10 text-[#6C8E12] dark:text-[#BDF869]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold">
                    Base Location
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#1B2410] dark:text-white">
                    {location}
                  </div>
                </div>
              </div>

            </div>

            {/* Social Network Profiles */}
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400 dark:text-neutral-500">
                  Connect On Socials
                </span>
                <Sparkles className="w-3 h-3 text-[#6C8E12] dark:text-[#BDF869]" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869] hover:text-[#6C8E12] dark:hover:text-[#BDF869] text-xs font-mono font-extrabold text-neutral-700 dark:text-neutral-300 transition-all duration-300 cursor-pointer group"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869] hover:text-[#6C8E12] dark:hover:text-[#BDF869] text-xs font-mono font-extrabold text-neutral-700 dark:text-neutral-300 transition-all duration-300 cursor-pointer group"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">GitHub</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>

                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-[#6C8E12] dark:hover:border-[#BDF869] hover:text-[#6C8E12] dark:hover:text-[#BDF869] text-xs font-mono font-extrabold text-neutral-700 dark:text-neutral-300 transition-all duration-300 cursor-pointer group"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Instagram</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/90 dark:border-neutral-800/90 shadow-xl backdrop-blur-md relative overflow-hidden">
              
              <div className="mb-6 space-y-1">
                <h3 className="text-lg sm:text-xl font-sans font-black text-[#1B2410] dark:text-white uppercase tracking-tight">
                  Send a Direct Message
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {status !== 'success' ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">
                          <User className="w-3 h-3 text-[#6C8E12] dark:text-[#BDF869]" />
                          <span>Your Name *</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          disabled={status === 'submitting'}
                          className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-xs sm:text-sm text-[#1B2410] dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#6C8E12] dark:focus:border-[#BDF869] focus:ring-2 focus:ring-[#6C8E12]/20 dark:focus:ring-[#BDF869]/20 disabled:opacity-60 transition-all duration-300"
                        />
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">
                          <Mail className="w-3 h-3 text-[#6C8E12] dark:text-[#BDF869]" />
                          <span>Email Address *</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          disabled={status === 'submitting'}
                          className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-xs sm:text-sm text-[#1B2410] dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#6C8E12] dark:focus:border-[#BDF869] focus:ring-2 focus:ring-[#6C8E12]/20 dark:focus:ring-[#BDF869]/20 disabled:opacity-60 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Subject input */}
                    <div className="space-y-1.5">
                      <label className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">
                        <MessageSquare className="w-3 h-3 text-[#6C8E12] dark:text-[#BDF869]" />
                        <span>Subject / Project Type</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Frontend Role, Project Collaboration, Freelance Work, etc."
                        disabled={status === 'submitting'}
                        className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-xs sm:text-sm text-[#1B2410] dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#6C8E12] dark:focus:border-[#BDF869] focus:ring-2 focus:ring-[#6C8E12]/20 dark:focus:ring-[#BDF869]/20 disabled:opacity-60 transition-all duration-300"
                      />
                    </div>

                    {/* Message input */}
                    <div className="space-y-1.5">
                      <label className="flex items-center space-x-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-bold">
                        <Send className="w-3 h-3 text-[#6C8E12] dark:text-[#BDF869]" />
                        <span>Your Message *</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Hi Dhanish, I came across your portfolio and would like to discuss..."
                        disabled={status === 'submitting'}
                        className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-xs sm:text-sm text-[#1B2410] dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#6C8E12] dark:focus:border-[#BDF869] focus:ring-2 focus:ring-[#6C8E12]/20 dark:focus:ring-[#BDF869]/20 disabled:opacity-60 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Error Notice */}
                    {status === 'error' && (
                      <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl space-y-2 text-left text-xs">
                        <div className="flex items-start space-x-2 text-red-600 dark:text-red-400 font-semibold">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{errorMessage}</span>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={handleMailtoFallback}
                            className="text-[11px] font-mono text-[#6C8E12] dark:text-[#BDF869] underline font-bold cursor-pointer hover:opacity-80"
                          >
                            Open in Email Client instead &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full flex items-center justify-center space-x-2 py-3 bg-[#6C8E12] hover:bg-[#58740E] dark:bg-[#BDF869] dark:hover:bg-[#a8f33e] text-white dark:text-black font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all duration-300 disabled:opacity-60 cursor-pointer"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/50 border-t-white dark:border-black/50 dark:border-t-black rounded-full animate-spin" />
                          <span>Dispatching Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center text-center py-10 space-y-5"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#6C8E12]/10 dark:bg-[#BDF869]/20 border border-[#6C8E12]/30 dark:border-[#BDF869]/30 flex items-center justify-center text-[#6C8E12] dark:text-[#BDF869]">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-sans font-black text-[#1B2410] dark:text-white uppercase tracking-tight">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-sm mx-auto">
                        Thank you for reaching out. Dhanish has received your inquiry and will get back to you shortly.
                      </p>
                    </div>

                    <button
                      onClick={() => setStatus('idle')}
                      className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-[#BDF869] dark:hover:bg-[#a8f33e] text-white dark:text-black rounded-xl text-xs font-mono font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
