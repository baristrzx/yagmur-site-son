import { useEffect, useState } from 'react';
import { Plus, Pencil, Calendar, AlertCircle, CheckCircle, Briefcase, Search, FileText, ArrowLeft, Upload, Trash2, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { supabase, type Case, type CaseWithClient, type CaseDocument, type CaseNote } from '../../lib/supabase';
import CaseFormModal from './CaseFormModal';
import { useAuth } from '../../context/AuthContext';

export default function CasesPanel() {
  const [cases, setCases] = useState<CaseWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseWithClient | null>(null);

  async function loadCases() {
    const { data } = await supabase
      .from('cases')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });
    setCases((data as CaseWithClient[]) || []);
    setLoading(false);
  }

  useEffect(() => { loadCases(); }, []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  async function triggerEmailNotification(caseData: CaseWithClient) {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;
      await fetch(`${supabaseUrl}/functions/v1/send-stage-update-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          clientEmail: caseData.profiles.email,
          clientName: caseData.profiles.full_name,
          caseNumber: caseData.case_number,
          currentStage: caseData.current_stage,
        }),
      });
    } catch {
      // Email failure is non-blocking
    }
  }

  async function handleSaved(prevStage?: string) {
    await loadCases();
    setShowModal(false);
    setEditingCase(null);

    if (prevStage !== undefined && editingCase) {
      const { data: updated } = await supabase
        .from('cases')
        .select('*, profiles(full_name, email)')
        .eq('id', editingCase.id)
        .maybeSingle();
      if (updated) {
        await triggerEmailNotification(updated as CaseWithClient);
      }
    }

    showToast('success', editingCase ? 'Dava başarıyla güncellendi.' : 'Dava başarıyla oluşturuldu.');
  }

  const filtered = cases.filter(c =>
    c.case_number.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const stageColor: Record<string, string> = {
    'Karar Verildi': 'bg-green-100 text-green-700',
    'Kesinleşti': 'bg-green-100 text-green-700',
    'Duruşma Aşaması': 'bg-blue-100 text-blue-700',
    'İcra Aşaması': 'bg-orange-100 text-orange-700',
    'Tamamlandı': 'bg-green-100 text-green-700',
  };

  if (selectedCase) {
    return <CaseDetailAdmin caseData={selectedCase} onBack={() => setSelectedCase(null)} />;
  }

  return (
    <div>
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg border text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-navy-900">Dava Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">{cases.length} aktif dava</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Dava veya müvekkil ara..."
              className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 w-56"
            />
          </div>
          <button
            onClick={() => { setEditingCase(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Yeni Dava
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-navy-300 border-t-navy-800 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{search ? 'Aramanızla eşleşen dava bulunamadı.' : 'Henüz dava eklenmemiş.'}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-xs font-mono font-semibold text-navy-600 bg-navy-50 px-2.5 py-1 rounded-md border border-navy-100">
                      {c.case_number}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${stageColor[c.current_stage] || 'bg-gray-100 text-gray-600'}`}>
                      {c.current_stage || '—'}
                    </span>
                  </div>
                  <h3 className="font-serif text-navy-900 text-lg mt-2">{c.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Müvekkil: <span className="text-gray-700 font-medium">{c.profiles?.full_name}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setSelectedCase(c)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-800 border border-gray-200 hover:border-navy-300 px-3 py-1.5 rounded-lg transition-colors">
                    <FileText className="w-3.5 h-3.5" /> Detay
                  </button>
                  <button onClick={() => { setEditingCase(c as Case); setShowModal(true); }}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-800 border border-gray-200 hover:border-navy-300 px-3 py-1.5 rounded-lg transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Düzenle
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Duruşma Tarihi</p>
                  <p className="text-gray-700 text-sm flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {c.hearing_date ? new Date(c.hearing_date).toLocaleDateString('tr-TR') : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">İcra Durumu</p>
                  <p className="text-gray-700 text-sm">{c.execution_status || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Son Güncelleme</p>
                  <p className="text-gray-700 text-sm">{new Date(c.last_updated).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CaseFormModal
          editingCase={editingCase}
          onClose={() => { setShowModal(false); setEditingCase(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

type DetailProps = {
  caseData: CaseWithClient;
  onBack: () => void;
};

function CaseDetailAdmin({ caseData, onBack }: DetailProps) {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [tab, setTab] = useState<'docs' | 'notes'>('docs');
  const [noteText, setNoteText] = useState('');
  const [visibleToClient, setVisibleToClient] = useState(true);
  const [addingNote, setAddingNote] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadDocs() {
    const { data } = await supabase.from('case_documents').select('*').eq('case_id', caseData.id).order('created_at', { ascending: false });
    setDocuments(data || []);
  }
  async function loadNotes() {
    const { data } = await supabase.from('case_notes').select('*').eq('case_id', caseData.id).order('created_at', { ascending: false });
    setNotes(data || []);
  }

  useEffect(() => { loadDocs(); loadNotes(); }, [caseData.id]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);
    const path = `cases/${caseData.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('case-documents').upload(path, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('case-documents').getPublicUrl(path);
      await supabase.from('case_documents').insert({ case_id: caseData.id, uploaded_by: profile.id, file_name: file.name, file_url: urlData.publicUrl, file_size: file.size });
      await loadDocs();
    }
    setUploading(false);
    e.target.value = '';
  }

  async function deleteDoc(doc: CaseDocument) {
    if (!confirm('Dökümanı silmek istediğinizden emin misiniz?')) return;
    const path = doc.file_url.split('/case-documents/')[1];
    if (path) await supabase.storage.from('case-documents').remove([path]);
    await supabase.from('case_documents').delete().eq('id', doc.id);
    setDocuments(prev => prev.filter(d => d.id !== doc.id));
  }

  async function addNote() {
    if (!noteText.trim() || !profile) return;
    setAddingNote(true);
    await supabase.from('case_notes').insert({ case_id: caseData.id, author_id: profile.id, content: noteText.trim(), is_visible_to_client: visibleToClient });
    setNoteText(''); await loadNotes(); setAddingNote(false);
  }

  async function toggleNoteVisibility(note: CaseNote) {
    await supabase.from('case_notes').update({ is_visible_to_client: !note.is_visible_to_client }).eq('id', note.id);
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, is_visible_to_client: !n.is_visible_to_client } : n));
  }

  async function deleteNote(id: string) {
    await supabase.from('case_notes').delete().eq('id', id);
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  function fmt(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-navy-800 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tüm davalara dön
      </button>

      <div className="bg-navy-900 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-mono font-semibold text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-md mb-3 inline-block">{caseData.case_number}</span>
            <h2 className="font-serif text-2xl text-white">{caseData.title}</h2>
            <p className="text-white/50 text-sm mt-1">Müvekkil: {caseData.profiles?.full_name}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Son Aşama</p>
            <p className="text-gold-400 font-semibold">{caseData.current_stage || '—'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {([
          { id: 'docs', label: `Dökümanlar (${documents.length})`, icon: <FileText className="w-4 h-4" /> },
          { id: 'notes', label: `Notlar (${notes.length})`, icon: <MessageSquare className="w-4 h-4" /> },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-navy-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-navy-300'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'docs' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-navy-800">Dava Dökümanları</h3>
            <label className={`flex items-center gap-2 cursor-pointer bg-navy-800 hover:bg-navy-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="w-4 h-4" /> {uploading ? 'Yükleniyor...' : 'Dosya Yükle'}
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
          {documents.length === 0 ? (
            <div className="p-10 text-center">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Henüz döküman yüklenmemiş.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-3.5">
                  <FileText className="w-8 h-8 text-navy-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-navy-900 text-sm font-medium truncate">{doc.file_name}</p>
                    <p className="text-gray-400 text-xs">{fmt(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-navy-500 hover:text-navy-800 border border-gray-200 hover:border-navy-300 rounded-lg transition-colors">
                      <FileText className="w-4 h-4" />
                    </a>
                    <button onClick={() => deleteDoc(doc)} className="p-1.5 text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-navy-800 mb-3">Not Ekle</h3>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3}
              placeholder="Not içeriği..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy-400 resize-none mb-3" />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input type="checkbox" checked={visibleToClient} onChange={e => setVisibleToClient(e.target.checked)} className="w-4 h-4 rounded" />
                Müvekkile görünür
              </label>
              <button onClick={addNote} disabled={addingNote || !noteText.trim()}
                className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                {addingNote ? 'Ekleniyor...' : 'Not Ekle'}
              </button>
            </div>
          </div>

          {notes.map(note => (
            <div key={note.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-gray-700 text-sm leading-relaxed flex-1">{note.content}</p>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => toggleNoteVisibility(note)} className={`p-1.5 rounded-lg border transition-colors ${note.is_visible_to_client ? 'text-green-500 border-green-200 hover:bg-green-50' : 'text-gray-400 border-gray-200 hover:bg-gray-50'}`} title={note.is_visible_to_client ? 'Müvekkile görünür' : 'Sadece admin'}>
                    {note.is_visible_to_client ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="p-1.5 text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${note.is_visible_to_client ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {note.is_visible_to_client ? 'Müvekkile görünür' : 'Sadece admin'}
                </span>
                <span className="text-gray-400 text-xs">{new Date(note.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Henüz not eklenmemiş.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
