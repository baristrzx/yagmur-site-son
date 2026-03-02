import { useEffect, useState } from 'react';
import { MessageSquare, Mail, Phone, Trash2, Check, ChevronDown, ChevronUp, CheckCheck } from 'lucide-react';
import { supabase, type ContactMessage } from '../../lib/supabase';

export default function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  async function load() {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string) {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  }

  async function markAllRead() {
    const unreadIds = messages.filter(m => !m.is_read).map(m => m.id);
    if (!unreadIds.length) return;
    await supabase.from('contact_messages').update({ is_read: true }).in('id', unreadIds);
    setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
  }

  async function deleteMsg(id: string) {
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
  }

  function toggleExpand(id: string) {
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.is_read) markRead(id);
    setExpanded(prev => prev === id ? null : id);
  }

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 sm:mb-6 gap-3">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl text-navy-900">Gelen Mesajlar</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unreadCount > 0 ? <span className="text-red-600 font-medium">{unreadCount} okunmamış mesaj</span> : 'Tüm mesajlar okundu'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 transition-colors whitespace-nowrap"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Tümünü okundu işaretle</span>
              <span className="sm:hidden">Tümünü oku</span>
            </button>
          )}
          <div className="flex gap-1.5">
            {(['all', 'unread', 'read'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors
                  ${filter === f ? 'bg-navy-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-navy-300'}`}
              >
                {f === 'all' ? 'Tümü' : f === 'unread' ? 'Okunmamış' : 'Okunmuş'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Mesaj bulunamadı.</p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filtered.map(msg => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl sm:rounded-2xl border shadow-sm transition-all
                ${!msg.is_read ? 'border-l-4 border-l-navy-500 border-gray-200' : 'border-gray-200'}`}
            >
              <div className="flex items-start gap-3 p-4 sm:p-5 cursor-pointer" onClick={() => toggleExpand(msg.id)}>
                <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${msg.is_read ? 'bg-gray-300' : 'bg-navy-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm font-semibold truncate ${msg.is_read ? 'text-gray-700' : 'text-navy-900'}`}>{msg.full_name}</p>
                    <span className="text-gray-400 text-xs shrink-0 whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  {msg.subject && (
                    <p className="text-gray-600 text-sm truncate mb-1">{msg.subject}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1 truncate max-w-[160px]">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{msg.email}</span>
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 shrink-0" />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  {!msg.is_read && (
                    <button
                      onClick={e => { e.stopPropagation(); markRead(msg.id); }}
                      className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                      title="Okundu işaretle"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expanded === msg.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
              </div>
              {expanded === msg.id && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-gray-50">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-sm text-gray-700 leading-relaxed mt-3 break-words">
                    {msg.message}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
