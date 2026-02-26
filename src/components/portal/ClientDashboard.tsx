import { useEffect, useState } from 'react';
import {
  LogOut, Briefcase, Calendar, ChevronRight, ArrowLeft, Clock,
  FileText, Activity, Download, MessageSquare, User, LayoutDashboard,
  Menu, X, AlertCircle, CheckCircle, Eye, EyeOff, Bell, Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, type Case, type CaseDocument, type CaseNote } from '../../lib/supabase';

type PortalView = 'dashboard' | 'cases' | 'case_detail' | 'profile';

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Karar Verildi':    { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  'Kesinleşti':       { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  'Tamamlandı':       { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  'Duruşma Aşaması':  { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  'İcra Aşaması':     { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
  'Karar Bekleniyor': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
};

function getStageStyle(stage: string) {
  return STAGE_COLORS[stage] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };
}

export default function ClientDashboard() {
  const { profile, signOut } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<PortalView>('dashboard');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase
      .from('cases')
      .select('*')
      .order('last_updated', { ascending: false })
      .then(({ data }) => {
        setCases(data || []);
        setLoading(false);
      });
  }, []);

  function navigate(v: PortalView, c?: Case) {
    if (c) setSelectedCase(c);
    setView(v);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0 });
  }

  const upcomingHearings = cases.filter(c => {
    if (!c.hearing_date) return false;
    const d = new Date(c.hearing_date);
    const now = new Date();
    return d >= now;
  }).sort((a, b) => new Date(a.hearing_date!).getTime() - new Date(b.hearing_date!).getTime());

  const recentCases = [...cases].slice(0, 5);

  const navItems: { id: PortalView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cases',     label: 'Davalarım', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'profile',   label: 'Profilim',  icon: <User className="w-4 h-4" /> },
  ];

  function Sidebar({ mobile }: { mobile?: boolean }) {
    return (
      <div className={`${mobile ? 'w-72' : 'w-60'} bg-[#0d1b2a] flex flex-col h-full`}>
        <div className="p-5 border-b border-white/10">
          <img src="/image.png" alt="ANKH Legal" className="h-10 w-auto object-contain" />
          <p className="text-amber-400/70 text-xs font-medium tracking-widest uppercase mt-2">Müvekkil Portalı</p>
        </div>

        <div className="px-3 py-3 border-b border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-sm font-bold uppercase shrink-0">
              {profile?.full_name?.charAt(0) || 'M'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{profile?.full_name}</p>
              <p className="text-white/35 text-xs truncate">{profile?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {navItems.map(item => {
            const active = view === item.id || (view === 'case_detail' && item.id === 'cases');
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                    : 'text-white/50 hover:text-white/85 hover:bg-white/5'}`}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
      {mobileMenuOpen && (
        <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
          <div className="relative h-full">
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white z-10">
              <X className="w-5 h-5" />
            </button>
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center gap-4 lg:hidden sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu className="w-5 h-5" />
          </button>
          <img src="/image.png" alt="ANKH Legal" className="h-8 w-auto object-contain" />
          <button onClick={signOut} className="ml-auto text-gray-400 hover:text-gray-700">
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          {view === 'dashboard' && (
            <DashboardView
              profile={profile}
              cases={cases}
              loading={loading}
              upcomingHearings={upcomingHearings}
              recentCases={recentCases}
              onOpenCase={c => navigate('case_detail', c)}
              onViewAll={() => navigate('cases')}
            />
          )}
          {view === 'cases' && (
            <CasesView
              cases={cases}
              loading={loading}
              onOpenCase={c => navigate('case_detail', c)}
            />
          )}
          {view === 'case_detail' && selectedCase && (
            <CaseDetailView
              case={selectedCase}
              onBack={() => navigate('cases')}
            />
          )}
          {view === 'profile' && (
            <ProfileView profile={profile} />
          )}
        </main>
      </div>
    </div>
  );
}

type DashboardViewProps = {
  profile: { full_name?: string; email?: string } | null;
  cases: Case[];
  loading: boolean;
  upcomingHearings: Case[];
  recentCases: Case[];
  onOpenCase: (c: Case) => void;
  onViewAll: () => void;
};

function DashboardView({ profile, cases, loading, upcomingHearings, recentCases, onOpenCase, onViewAll }: DashboardViewProps) {
  const activeCases = cases.filter(c => !['Tamamlandı', 'Kesinleşti', 'Karar Verildi'].includes(c.current_stage));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-navy-900">
          Hoş Geldiniz, {profile?.full_name?.split(' ')[0] || 'Müvekkil'}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Dava durumlarınız ve güncel bilgileriniz aşağıda yer almaktadır.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Briefcase className="w-5 h-5 text-navy-600" />}
          label="Toplam Dava"
          value={loading ? '—' : String(cases.length)}
          bg="bg-navy-50"
        />
        <StatCard
          icon={<Activity className="w-5 h-5 text-blue-600" />}
          label="Aktif Dava"
          value={loading ? '—' : String(activeCases.length)}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5 text-amber-600" />}
          label="Yaklaşan Duruşma"
          value={loading ? '—' : String(upcomingHearings.length)}
          bg="bg-amber-50"
        />
      </div>

      {upcomingHearings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-600" />
            <h2 className="font-semibold text-amber-800 text-sm">Yaklaşan Duruşmalar</h2>
          </div>
          <div className="space-y-2">
            {upcomingHearings.slice(0, 3).map(c => (
              <button
                key={c.id}
                onClick={() => onOpenCase(c)}
                className="w-full flex items-center justify-between bg-white border border-amber-100 rounded-xl px-4 py-3 hover:border-amber-300 transition-colors text-left"
              >
                <div>
                  <p className="text-navy-900 text-sm font-medium line-clamp-1">{c.title}</p>
                  <p className="text-amber-600 text-xs mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(c.hearing_date!).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-navy-800 text-sm">Son Güncellemeler</h2>
          <button onClick={onViewAll} className="text-navy-600 hover:text-navy-900 text-xs font-medium transition-colors">
            Tümünü Gör
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="w-6 h-6 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
          </div>
        ) : recentCases.length === 0 ? (
          <div className="p-10 text-center">
            <Briefcase className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Henüz dava bulunmuyor.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentCases.map(c => {
              const style = getStageStyle(c.current_stage);
              return (
                <button key={c.id} onClick={() => onOpenCase(c)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left group">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-navy-900 text-sm font-medium truncate">{c.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-gray-400 text-xs font-mono">{c.case_number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style.bg} ${style.text} ${style.border}`}>
                        {c.current_stage || '—'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-400 text-xs">{new Date(c.last_updated).toLocaleDateString('tr-TR')}</p>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-navy-500 mt-1 ml-auto transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return (
    <div className={`${bg} rounded-2xl p-5 border border-transparent`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-navy-900">{value}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function CasesView({ cases, loading, onOpenCase }: { cases: Case[]; loading: boolean; onOpenCase: (c: Case) => void }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-navy-900">Davalarım</h1>
        <p className="text-gray-500 text-sm mt-1">{loading ? '...' : `${cases.length} dava`}</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-navy-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-navy-300" />
          </div>
          <h3 className="font-serif text-navy-800 text-lg mb-2">Henüz dava yok</h3>
          <p className="text-gray-400 text-sm">Avukatınız dava oluşturduğunda burada görünecek.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {cases.map(c => {
            const style = getStageStyle(c.current_stage);
            return (
              <button key={c.id} onClick={() => onOpenCase(c)}
                className="bg-white rounded-2xl border border-gray-200 p-6 text-left hover:shadow-md hover:border-navy-200 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-mono font-semibold text-navy-600 bg-navy-50 px-2.5 py-1 rounded-md border border-navy-100">
                    {c.case_number}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-navy-600 group-hover:translate-x-0.5 transition-all mt-0.5" />
                </div>
                <h3 className="font-serif text-navy-900 text-base mb-3 line-clamp-2">{c.title}</h3>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                  {c.current_stage || '—'}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-2">
                  {c.hearing_date && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(c.hearing_date).toLocaleDateString('tr-TR')}
                    </div>
                  )}
                  {c.execution_status && c.execution_status !== 'Yok' && c.execution_status !== '' && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      {c.execution_status}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CaseDetailView({ case: c, onBack }: { case: Case; onBack: () => void }) {
  const style = getStageStyle(c.current_stage);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [tab, setTab] = useState<'overview' | 'docs' | 'notes'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [docsRes, notesRes] = await Promise.all([
        supabase.from('case_documents').select('*').eq('case_id', c.id).order('created_at', { ascending: false }),
        supabase.from('case_notes').select('*').eq('case_id', c.id).eq('is_visible_to_client', true).order('created_at', { ascending: false }),
      ]);
      setDocuments(docsRes.data || []);
      setNotes(notesRes.data || []);
      setLoading(false);
    }
    load();
  }, [c.id]);

  function fmt(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-navy-800 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tüm Davalara Dön
      </button>

      <div className="bg-navy-900 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="inline-block text-xs font-mono font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-md mb-3">
              {c.case_number}
            </span>
            <h2 className="font-serif text-2xl text-white leading-snug">{c.title}</h2>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${style.bg} ${style.text} ${style.border}`}>
            <div className={`w-2 h-2 rounded-full ${style.dot}`} />
            {c.current_stage || '—'}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-white/10">
          {c.hearing_date && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Calendar className="w-4 h-4 text-amber-400/70" />
              <span>Duruşma: <span className="text-white/85">{new Date(c.hearing_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span></span>
            </div>
          )}
          {c.execution_status && c.execution_status !== 'Yok' && (
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <FileText className="w-4 h-4 text-amber-400/70" />
              <span>İcra: <span className="text-white/85">{c.execution_status}</span></span>
            </div>
          )}
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Clock className="w-4 h-4 text-amber-400/70" />
            <span>Güncelleme: <span className="text-white/85">{new Date(c.last_updated).toLocaleDateString('tr-TR')}</span></span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { id: 'overview', label: 'Genel Bilgiler', icon: <Activity className="w-4 h-4" /> },
          { id: 'docs',     label: `Dökümanlar${documents.length ? ` (${documents.length})` : ''}`, icon: <FileText className="w-4 h-4" /> },
          { id: 'notes',    label: `Notlar${notes.length ? ` (${notes.length})` : ''}`, icon: <MessageSquare className="w-4 h-4" /> },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${tab === t.id ? 'bg-navy-800 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-navy-200'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
        </div>
      ) : tab === 'overview' ? (
        <OverviewTab case={c} style={style} />
      ) : tab === 'docs' ? (
        <DocsTab documents={documents} fmt={fmt} />
      ) : (
        <NotesTab notes={notes} />
      )}
    </div>
  );
}

function OverviewTab({ case: c, style }: { case: Case; style: ReturnType<typeof getStageStyle> }) {
  const fields = [
    {
      label: 'Güncel Aşama',
      value: c.current_stage || '—',
      icon: <Activity className="w-4 h-4" />,
      highlight: true,
    },
    {
      label: 'İcra Durumu',
      value: c.execution_status || '—',
      icon: <FileText className="w-4 h-4" />,
      highlight: false,
    },
    {
      label: 'Duruşma Tarihi',
      value: c.hearing_date
        ? new Date(c.hearing_date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'Belirtilmemiş',
      icon: <Calendar className="w-4 h-4" />,
      highlight: false,
    },
    {
      label: 'Son Güncelleme',
      value: new Date(c.last_updated).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
      icon: <Clock className="w-4 h-4" />,
      highlight: false,
    },
    {
      label: 'Dava Açılış Tarihi',
      value: new Date(c.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
      icon: <Scale className="w-4 h-4" />,
      highlight: false,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.label} className={`rounded-2xl p-5 border ${f.highlight ? `${style.bg} ${style.border}` : 'bg-white border-gray-100'}`}>
            <div className={`flex items-center gap-2 text-xs uppercase tracking-widest font-semibold mb-2 ${f.highlight ? style.text : 'text-gray-400'}`}>
              {f.icon} {f.label}
            </div>
            <p className={`text-base font-semibold ${f.highlight ? style.text : 'text-navy-900'}`}>{f.value}</p>
          </div>
        ))}
      </div>
      {c.lawyer_notes && (
        <div className="bg-white border border-navy-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-navy-50 rounded-xl flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-navy-600" />
            </div>
            <div>
              <p className="text-navy-800 text-sm font-semibold">Avukat Notu</p>
              <p className="text-gray-400 text-xs">Avukatınızın size iletmek istediği bilgiler</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap pl-10">
            {c.lawyer_notes}
          </p>
        </div>
      )}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-800 text-sm leading-relaxed">
            Davayla ilgili sorularınız için avukatınızla iletişime geçebilirsiniz. Bu bilgiler size özel olup üçüncü kişilerle paylaşılmamaktadır.
          </p>
        </div>
      </div>
    </div>
  );
}

function DocsTab({ documents, fmt }: { documents: CaseDocument[]; fmt: (b: number) => string }) {
  if (documents.length === 0) return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
      <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">Henüz döküman yüklenmemiş.</p>
      <p className="text-gray-300 text-xs mt-1">Avukatınız döküman eklediğinde burada görünecek.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-50">
        {documents.map(doc => (
          <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-navy-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-navy-900 text-sm font-medium truncate">{doc.file_name}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {fmt(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-900 border border-navy-200 hover:border-navy-400 px-3 py-2 rounded-xl transition-colors shrink-0 font-medium">
              <Download className="w-3.5 h-3.5" /> İndir
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotesTab({ notes }: { notes: CaseNote[] }) {
  if (notes.length === 0) return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
      <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">Henüz not eklenmemiş.</p>
      <p className="text-gray-300 text-xs mt-1">Avukatınız not eklediğinde burada görünecek.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {notes.map((note, i) => (
        <div key={note.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-navy-600 text-xs font-bold">{notes.length - i}</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
              <p className="text-gray-400 text-xs mt-3 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {new Date(note.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileView({ profile }: { profile: { full_name?: string; email?: string } | null }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function showMsg(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showMsg('error', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    if (newPassword.length < 6) {
      showMsg('error', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      showMsg('error', 'Şifre güncellenemedi: ' + error.message);
    } else {
      showMsg('success', 'Şifreniz başarıyla güncellendi.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    }
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="font-serif text-2xl text-navy-900">Profilim</h1>
        <p className="text-gray-500 text-sm mt-1">Hesap bilgilerinizi görüntüleyin</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 text-2xl font-bold uppercase">
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-serif text-xl text-navy-900">{profile?.full_name || '—'}</p>
            <p className="text-gray-500 text-sm mt-0.5">Müvekkil</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Ad Soyad</label>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-navy-900 text-sm">
              {profile?.full_name || '—'}
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">E-posta</label>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-navy-900 text-sm">
              {profile?.email || '—'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-serif text-lg text-navy-900 mb-5">Şifre Değiştir</h2>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">Yeni Şifre</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required minLength={6}
                placeholder="En az 6 karakter"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-navy-400 transition-colors"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-widest mb-2">Şifre Tekrar</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required minLength={6}
                placeholder="Şifreyi tekrar girin"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-navy-400 transition-colors"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="pt-1">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
