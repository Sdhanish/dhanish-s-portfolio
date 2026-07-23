import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchMessages } from '../../firebase/services';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  Code2,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadUnreadCount = async () => {
    try {
      const msgs = await fetchMessages();
      const unread = msgs.filter(m => !m.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Personal Info', path: '/admin/personal-info', icon: User },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Skills', path: '/admin/skills', icon: Code2 },
    { label: 'Timeline', path: '/admin/timeline', icon: Calendar },
    { label: 'Messages', path: '/admin/messages', icon: MessageSquare, badge: unreadCount },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row font-sans selection:bg-[#BDF869] selection:text-neutral-950">
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#6C8E12]/20 border border-[#6C8E12]/40 text-[#BDF869] flex items-center justify-center font-black">
                D
              </div>
              <div>
                <h1 className="font-display font-extrabold text-sm tracking-wide text-white uppercase flex items-center gap-1.5">
                  DHANISH S <span className="text-xs px-1.5 py-0.5 rounded bg-[#6C8E12]/20 text-[#BDF869]">CMS</span>
                </h1>
                <p className="text-[11px] font-mono text-neutral-400">Admin Control Center</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => {
                    const isItemActive = isActive || (item.path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/dashboard'));
                    return `flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isItemActive
                        ? 'bg-[#6C8E12] text-white shadow-lg shadow-[#6C8E12]/20 font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`;
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer in Sidebar */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              {Boolean(currentUser?.photoURL) ? (
                <img
                  src={currentUser?.photoURL || undefined}
                  alt="Admin"
                  className="w-7 h-7 rounded-full object-cover border border-[#BDF869]/50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-[#BDF869]">
                  A
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser?.displayName || 'Dhanish S.'}</p>
                <p className="text-[10px] font-mono text-[#BDF869] truncate">Admin Verified</p>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-[#BDF869] shrink-0" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors border border-red-500/20 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs font-mono text-[#BDF869] uppercase tracking-wider">CMS Control Panel</p>
              <h2 className="text-lg font-display font-extrabold text-white">
                {navItems.find(i => location.pathname.startsWith(i.path))?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 hover:text-white transition-colors flex items-center space-x-2 border border-neutral-700/60"
            >
              <span>View Live Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#BDF869]" />
            </a>
          </div>
        </header>

        {/* Dynamic Page Component */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
