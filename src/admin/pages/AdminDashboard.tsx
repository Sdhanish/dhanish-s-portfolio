import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  fetchProjects,
  fetchSkills,
  fetchServices,
  fetchTimeline,
  fetchMessages
} from '../../firebase/services';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { MessageItem } from '../../types';
import {
  FolderGit2,
  Code2,
  Briefcase,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  UserCheck,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const { refreshData } = usePortfolio();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    services: 0,
    timeline: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [recentMessages, setRecentMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [projList, skillList, servList, timeList, msgList] = await Promise.all([
        fetchProjects(),
        fetchSkills(),
        fetchServices(),
        fetchTimeline(),
        fetchMessages()
      ]);

      setStats({
        projects: projList.length,
        skills: skillList.length,
        services: servList.length,
        timeline: timeList.length,
        messages: msgList.length,
        unreadMessages: msgList.filter(m => !m.read).length
      });

      setRecentMessages(msgList.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 space-x-3">
        <Loader2 className="w-6 h-6 text-[#BDF869] animate-spin" />
        <span className="font-mono text-sm">Loading CMS Dashboard...</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Projects', count: stats.projects, icon: FolderGit2, path: '/admin/projects', color: 'border-blue-500/30 text-blue-400' },
    { label: 'Skills', count: stats.skills, icon: Code2, path: '/admin/skills', color: 'border-emerald-500/30 text-emerald-400' },
    { label: 'Services', count: stats.services, icon: Briefcase, path: '/admin/services', color: 'border-purple-500/30 text-purple-400' },
    { label: 'Timeline Entries', count: stats.timeline, icon: Calendar, path: '/admin/timeline', color: 'border-amber-500/30 text-amber-400' },
    { label: 'Messages', count: stats.messages, unread: stats.unreadMessages, icon: MessageSquare, path: '/admin/messages', color: 'border-rose-500/30 text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-[#6C8E12]/20 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#6C8E12]/20 text-[#BDF869] text-xs font-mono font-bold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Authorized Administrator Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white">
            Welcome back, Dhanish S.
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl">
            Manage your dynamic portfolio content, projects, skills, services, and incoming contact form submissions in real-time.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.path}
              className={`p-5 rounded-2xl bg-neutral-900 border ${card.color} hover:bg-neutral-800/80 transition-all flex flex-col justify-between space-y-4 group`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">{card.label}</span>
                <div className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 group-hover:border-neutral-700">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl md:text-3xl font-display font-extrabold text-white">
                  {card.count}
                </span>
                {card.unread !== undefined && card.unread > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500 text-white">
                    {card.unread} New
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Cards & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Messages Panel */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#BDF869]" />
              <h3 className="font-display font-extrabold text-white text-base">Recent Messages</h3>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-mono text-[#BDF869] hover:underline flex items-center space-x-1"
            >
              <span>View All ({stats.messages})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-8 text-center bg-neutral-950/50 rounded-xl border border-neutral-800/60 text-neutral-500 text-xs">
              No contact form submissions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => navigate('/admin/messages')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    !msg.read
                      ? 'bg-neutral-950 border-[#6C8E12]/50 hover:border-[#6C8E12]'
                      : 'bg-neutral-950/40 border-neutral-800/60 hover:border-neutral-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white truncate">{msg.name}</span>
                      <span className="text-[10px] font-mono text-neutral-500 truncate">({msg.email})</span>
                      {!msg.read && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          Unread
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 truncate font-mono">{msg.subject || 'No Subject'}</p>
                    <p className="text-xs text-neutral-400 line-clamp-1">{msg.message}</p>
                  </div>

                  <div className="text-right text-[10px] font-mono text-neutral-500 shrink-0 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#BDF869]" />
            <h3 className="font-display font-extrabold text-white text-base">Quick Content Actions</h3>
          </div>

          <div className="space-y-3">
            <Link
              to="/admin/personal-info"
              className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#BDF869] transition-colors">
                  Update Personal Information
                </h4>
                <p className="text-[11px] text-neutral-400">Edit intro, about text, socials & resume</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/projects"
              className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#BDF869] transition-colors">
                  Add / Manage Projects
                </h4>
                <p className="text-[11px] text-neutral-400">Create portfolio cards & upload screenshots</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/skills"
              className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#BDF869] transition-colors">
                  Edit Tech Skills
                </h4>
                <p className="text-[11px] text-neutral-400">Manage Frontend, Backend, DB & Tool badges</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/admin/settings"
              className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-800/80 border border-neutral-800 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#BDF869] transition-colors">
                  SEO & Site Settings
                </h4>
                <p className="text-[11px] text-neutral-400">Configure page title, metadata & accent theme</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
