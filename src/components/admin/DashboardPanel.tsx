import { useEffect, useState } from 'react';
import { Briefcase, Users, MessageSquare, BookOpen, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AdminView } from './AdminLayout';

type Stats = {
  cases: number;
  clients: number;
  unreadMessages: number;
  blogPosts: number;
};

type Props = { onNavigate: (view: AdminView) => void };

export default function DashboardPanel({ onNavigate }: Props) {
  const [stats, setStats] = useState<Stats>({ cases: 0, clients: 0, unreadMessages: 0, blogPosts: 0 });
  const [recentCases, setRecentCases] = useState<{ id: string; case_number: string; title: string; current_stage: string; profiles: { full_name: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [casesRes, clientsRes, msgsRes, postsRes, recentRes] = await Promise.all([
        supabase.from('cases').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('cases').select('id, case_number, title, current_stage, profiles(full_name)').order('created_at', { ascending: false }).limit(5),
      ]);
      setStats({
        cases: casesRes.count || 0,
        clients: clientsRes.count || 0,
        unreadMessages: msgsRes.count || 0,
        blogPosts: postsRes.count || 0,
      });
      setRecentCases((recentRes.data as typeof recentCases) || []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Aktif Dava', value: stats.cases, icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'bg-blue-50 text-blue-600', view: 'cases' as AdminView },
    { label: 'Müvekkil', value: stats.clients, icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'bg-green-50 text-green-600', view: 'clients' as AdminView },
    { label: 'Okunmamış', value: stats.unreadMessages, icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'bg-red-50 text-red-600', view: 'messages' as AdminView },
    { label: 'Blog Yazısı', value: stats.blogPosts, icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'bg-amber-50 text-amber-600', view: 'blog_list' as AdminView },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-xl sm:text-2xl text-navy-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">ANKH Legal yönetim paneline hoş geldiniz</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map(card => (
          <button
            key={card.label}
            onClick={() => onNavigate(card.view)}
            className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-5 text-left hover:shadow-md hover:border-navy-200 transition-all active:scale-95"
          >
            <div className={`inline-flex p-2 sm:p-2.5 rounded-lg sm:rounded-xl ${card.color} mb-2 sm:mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-navy-900 font-serif">{card.value}</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-navy-600" />
            <h2 className="font-serif text-navy-900 text-base sm:text-lg">Son Davalar</h2>
          </div>
          {recentCases.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Henüz dava yok</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentCases.map(c => (
                <div key={c.id} className="flex items-start sm:items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-navy-800 truncate">{c.title}</p>
                    <p className="text-xs text-gray-400 truncate">{c.case_number} · {c.profiles?.full_name}</p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium shrink-0 whitespace-nowrap">
                    {c.current_stage || '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => onNavigate('cases')}
            className="mt-4 text-sm text-navy-600 hover:text-navy-800 flex items-center gap-1 font-medium"
          >
            <TrendingUp className="w-4 h-4" /> Tüm davaları gör
          </button>
        </div>

        <div className="bg-navy-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <h2 className="font-serif text-base sm:text-lg mb-4 text-gold-400">Hızlı Erişim</h2>
          <div className="space-y-2">
            {[
              { label: 'Yeni dava oluştur', view: 'cases' as AdminView },
              { label: 'Müvekkil ekle', view: 'clients' as AdminView },
              { label: 'Blog yazısı yaz', view: 'blog_new' as AdminView },
              { label: 'Mesajları oku', view: 'messages' as AdminView },
              { label: 'Site ayarları', view: 'settings' as AdminView },
            ].map(item => (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className="w-full text-left flex items-center justify-between px-3 sm:px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-colors group"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
