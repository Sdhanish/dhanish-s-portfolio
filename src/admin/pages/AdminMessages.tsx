import { useState, useEffect, MouseEvent } from 'react';
import { fetchMessages, markMessageRead, deletePortfolioItem } from '../../firebase/services';
import { MessageItem } from '../../types';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  MessageSquare,
  Search,
  Trash2,
  Mail,
  CheckCircle2,
  Clock,
  Loader2,
  X,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMsg, setSelectedMsg] = useState<MessageItem | null>(null);

  // Confirm dialog state
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const loadMessagesList = async () => {
    setLoading(true);
    try {
      const list = await fetchMessages();
      setMessages(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessagesList();
  }, []);

  const handleToggleRead = async (msg: MessageItem, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await markMessageRead(msg.id, !msg.read);
      setMessages(prev =>
        prev.map(m => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
      if (selectedMsg && selectedMsg.id === msg.id) {
        setSelectedMsg(prev => (prev ? { ...prev, read: !prev.read } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRequest = (id: string, name?: string, e?: MouseEvent | any) => {
    if (e) e.stopPropagation();
    setItemToDelete({ id, name: name ? `from ${name}` : 'this message' });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const { id } = itemToDelete;
    setDeleting(true);
    setErrorNotice(null);

    // Optimistic UI removal
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMsg && selectedMsg.id === id) {
      setSelectedMsg(null);
    }

    try {
      await deletePortfolioItem('messages', id);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(`Notice: ${err.message || 'Error syncing deletion to database'}`);
      await loadMessagesList();
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleOpenMessage = async (msg: MessageItem) => {
    setSelectedMsg(msg);
    if (!msg.read) {
      await handleToggleRead(msg);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'unread' ? !m.read : m.read;

    const term = search.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      (m.subject && m.subject.toLowerCase().includes(term)) ||
      m.message.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-400 space-x-3">
        <Loader2 className="w-6 h-6 text-[#BDF869] animate-spin" />
        <span className="font-mono text-sm">Loading contact messages...</span>
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
            <MessageSquare className="w-6 h-6 text-[#BDF869]" />
            Messages Inbox ({messages.length})
          </h1>
          <p className="text-xs text-neutral-400">
            View, filter, manage, and reply to client inquiries sent via your portfolio contact form.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="px-3.5 py-1.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-mono text-xs font-bold self-start sm:self-auto">
            {unreadCount} Unread Message{unreadCount > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Controls: Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sender, email or text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-[#6C8E12] focus:outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 p-1 rounded-xl bg-neutral-900 border border-neutral-800 w-full md:w-auto">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[#6C8E12] text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 rounded-2xl border border-neutral-800 text-neutral-500 text-xs">
          No contact messages found matching your criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !msg.read
                  ? 'bg-neutral-900 border-[#6C8E12]/50 hover:border-[#6C8E12] shadow-lg shadow-black/40'
                  : 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700 opacity-90'
              }`}
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white truncate">{msg.name}</span>
                  <span className="text-xs font-mono text-neutral-400 truncate">&lt;{msg.email}&gt;</span>
                  {!msg.read && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      New
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-[#BDF869] truncate">
                  {msg.subject || 'Portfolio Inquiry'}
                </p>
                <p className="text-xs text-neutral-300 line-clamp-1">{msg.message}</p>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-neutral-800">
                <div className="text-[11px] font-mono text-neutral-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject || 'Portfolio Inquiry'}`)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-[#6C8E12]/20 hover:bg-[#6C8E12]/40 text-[#BDF869] border border-[#6C8E12]/40 text-xs font-mono flex items-center space-x-1"
                    title="Reply via Email"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={(e) => handleToggleRead(msg, e)}
                    className={`p-2 rounded-xl border text-xs ${
                      msg.read
                        ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                    title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteRequest(msg.id, msg.name, e)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer relative z-10 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Message Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#6C8E12]/20 border border-[#6C8E12]/40 text-[#BDF869] flex items-center justify-center font-black">
                  {selectedMsg.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-white text-base">{selectedMsg.name}</h3>
                  <p className="text-xs font-mono text-neutral-400">{selectedMsg.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Subject</span>
                <p className="text-sm font-mono text-[#BDF869] font-bold mt-0.5">
                  {selectedMsg.subject || 'Portfolio Inquiry'}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Received At
                </span>
                <p className="text-xs font-mono text-neutral-400">
                  {new Date(selectedMsg.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-1">
                  Message Content
                </span>
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMsg.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={(e) => handleDeleteRequest(selectedMsg.id, selectedMsg.name, e)}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono flex items-center space-x-2 border border-red-500/20 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Message</span>
              </button>

              <a
                href={`mailto:${selectedMsg.email}?subject=${encodeURIComponent(`Re: ${selectedMsg.subject || 'Portfolio Inquiry'}`)}`}
                className="px-5 py-2.5 rounded-xl bg-[#6C8E12] hover:bg-[#5a770f] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg shadow-[#6C8E12]/20"
              >
                <Send className="w-4 h-4" />
                <span>Reply via Gmail / Email</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={!!itemToDelete}
        title="Delete Message"
        message={itemToDelete ? `Are you sure you want to permanently delete this message ${itemToDelete.name}?` : ''}
        confirmText="Delete Message"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
