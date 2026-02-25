import { useState } from 'react';
import {
  Scale, Users, Briefcase, LogOut, Menu, X, ChevronDown, ChevronRight,
  BookOpen, UserCheck, Star, MessageSquare, Settings,
  Shield, Globe, LayoutDashboard, FileText, PenSquare, Home, Info,
  Handshake, Phone, FileLock, Cookie, FileWarning, BarChart2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminView =
  | 'dashboard'
  | 'cms_hero'
  | 'cms_about'
  | 'cms_approach'
  | 'cms_contact'
  | 'blog_list'
  | 'blog_new'
  | 'lawyers'
  | 'testimonials'
  | 'practice_areas'
  | 'messages'
  | 'clients'
  | 'cases'
  | 'legal_kvkk'
  | 'legal_aydinlatma'
  | 'legal_cerez'
  | 'settings';

type NavLeaf = {
  type: 'leaf';
  id: AdminView;
  label: string;
  icon: React.ReactNode;
};

type NavGroup = {
  type: 'group';
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children: NavLeaf[];
};

type NavItem = NavLeaf | NavGroup;

function buildNav(unreadMessages: number): NavItem[] {
  return [
    {
      type: 'leaf',
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      type: 'group',
      id: 'pages',
      label: 'Sayfa Yönetimi',
      icon: <Globe className="w-4 h-4" />,
      children: [
        { type: 'leaf', id: 'cms_hero',     label: 'Hero',      icon: <Home className="w-3.5 h-3.5" /> },
        { type: 'leaf', id: 'cms_about',    label: 'Hakkımda',  icon: <Info className="w-3.5 h-3.5" /> },
        { type: 'leaf', id: 'cms_approach', label: 'Yaklaşım',  icon: <Handshake className="w-3.5 h-3.5" /> },
        { type: 'leaf', id: 'cms_contact',  label: 'İletişim',  icon: <Phone className="w-3.5 h-3.5" /> },
      ],
    },
    {
      type: 'group',
      id: 'blog',
      label: 'Blog Yazıları',
      icon: <BookOpen className="w-4 h-4" />,
      children: [
        { type: 'leaf', id: 'blog_list', label: 'Tüm Yazılar', icon: <FileText className="w-3.5 h-3.5" /> },
        { type: 'leaf', id: 'blog_new',  label: 'Yeni Yazı',   icon: <PenSquare className="w-3.5 h-3.5" /> },
      ],
    },
    {
      type: 'leaf',
      id: 'lawyers',
      label: 'Avukatlar',
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      type: 'leaf',
      id: 'testimonials',
      label: 'Referanslar',
      icon: <Star className="w-4 h-4" />,
    },
    {
      type: 'leaf',
      id: 'practice_areas',
      label: 'Çalışma Alanları',
      icon: <Scale className="w-4 h-4" />,
    },
    {
      type: 'leaf',
      id: 'messages',
      label: 'Mesajlar',
      icon: <MessageSquare className="w-4 h-4" />,
      ...(unreadMessages > 0 ? { badge: unreadMessages } : {}),
    } as NavLeaf & { badge?: number },
    {
      type: 'group',
      id: 'cases_group',
      label: 'Dava Yönetimi',
      icon: <Briefcase className="w-4 h-4" />,
      children: [
        { type: 'leaf', id: 'clients', label: 'Müvekkiller', icon: <Users className="w-3.5 h-3.5" /> },
        { type: 'leaf', id: 'cases',   label: 'Davalar',     icon: <Briefcase className="w-3.5 h-3.5" /> },
      ],
    },
    {
      type: 'group',
      id: 'legal',
      label: 'Yasal Sayfalar',
      icon: <Shield className="w-4 h-4" />,
      children: [
        { type: 'leaf', id: 'legal_kvkk',       label: 'KVKK',             icon: <FileLock className="w-3.5 h-3.5" /> },
        { type: 'leaf', id: 'legal_aydinlatma',  label: 'Aydınlatma Metni', icon: <FileWarning className="w-3.5 h-3.5" /> },
        { type: 'leaf', id: 'legal_cerez',       label: 'Çerez Politikası', icon: <Cookie className="w-3.5 h-3.5" /> },
      ],
    },
    {
      type: 'leaf',
      id: 'settings',
      label: 'Site Ayarları',
      icon: <Settings className="w-4 h-4" />,
    },
  ];
}

function isChildActive(group: NavGroup, view: AdminView) {
  return group.children.some(c => c.id === view);
}

type Props = {
  view: AdminView;
  onViewChange: (view: AdminView) => void;
  children: React.ReactNode;
  unreadMessages?: number;
};

export default function AdminLayout({ view, onViewChange, children, unreadMessages = 0 }: Props) {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = buildNav(unreadMessages);

  const defaultOpen = navItems.reduce<Record<string, boolean>>((acc, item) => {
    if (item.type === 'group' && isChildActive(item, view)) acc[item.id] = true;
    return acc;
  }, {});

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(defaultOpen);

  function toggleGroup(id: string) {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleNav(id: AdminView) {
    onViewChange(id);
    setMobileOpen(false);
  }

  function getViewLabel(v: AdminView) {
    for (const item of navItems) {
      if (item.type === 'leaf' && item.id === v) return item.label;
      if (item.type === 'group') {
        const child = item.children.find(c => c.id === v);
        if (child) return child.label;
      }
    }
    return 'Admin Paneli';
  }

  function SidebarContent() {
    return (
      <div className="w-64 bg-[#0d1b2a] flex flex-col h-full min-h-screen">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/image.png" alt="ANKH Legal" className="h-10 w-auto object-contain" />
            <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Admin</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navItems.map(item => {
            if (item.type === 'leaf') {
              const leaf = item as NavLeaf & { badge?: number };
              const active = view === leaf.id;
              return (
                <button
                  key={leaf.id}
                  onClick={() => handleNav(leaf.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5
                    ${active
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                      : 'text-white/55 hover:text-white/90 hover:bg-white/5'}`}
                >
                  {leaf.icon}
                  <span className="flex-1 text-left">{leaf.label}</span>
                  {leaf.badge && leaf.badge > 0 ? (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {leaf.badge}
                    </span>
                  ) : active ? (
                    <ChevronRight className="w-3 h-3 shrink-0" />
                  ) : null}
                </button>
              );
            }

            const group = item as NavGroup;
            const anyChildActive = isChildActive(group, view);
            const expanded = openGroups[group.id] ?? anyChildActive;

            return (
              <div key={group.id} className="mb-0.5">
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${anyChildActive
                      ? 'text-amber-400'
                      : 'text-white/55 hover:text-white/90 hover:bg-white/5'}`}
                >
                  {group.icon}
                  <span className="flex-1 text-left">{group.label}</span>
                  {group.badge && group.badge > 0 ? (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center mr-1">
                      {group.badge}
                    </span>
                  ) : null}
                  {expanded
                    ? <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </button>

                {expanded && (
                  <div className="ml-3 pl-3 border-l border-white/10 mt-0.5 mb-1 space-y-0.5">
                    {group.children.map(child => {
                      const active = view === child.id;
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleNav(child.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all
                            ${active
                              ? 'bg-amber-500/15 text-amber-400 font-medium border border-amber-500/20'
                              : 'text-white/45 hover:text-white/80 hover:bg-white/5'}`}
                        >
                          {child.icon}
                          <span className="flex-1 text-left">{child.label}</span>
                          {active && <ChevronRight className="w-3 h-3 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold uppercase shrink-0">
              {profile?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-white/35 text-xs truncate">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/45 hover:text-white/80 hover:bg-white/5 transition-colors text-sm"
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
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {mobileOpen && (
        <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
          <div className="relative h-full">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white z-10">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="hidden lg:block shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center gap-4 lg:hidden sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <p className="font-serif text-navy-800 font-semibold text-sm">
            {getViewLabel(view)}
          </p>
          {unreadMessages > 0 && view !== 'messages' && (
            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadMessages}
            </span>
          )}
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
