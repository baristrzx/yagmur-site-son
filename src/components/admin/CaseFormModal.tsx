import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase, type Case, type Profile } from '../../lib/supabase';

type Props = {
  editingCase?: Case | null;
  onClose: () => void;
  onSaved: (prevStage?: string) => void;
};

const STAGES = [
  'Dava Açıldı',
  'Dilekçe Aşaması',
  'Delil Toplama',
  'Duruşma Aşaması',
  'Karar Bekleniyor',
  'Karar Verildi',
  'İstinaf Aşaması',
  'Temyiz Aşaması',
  'Kesinleşti',
  'İcra Aşaması',
];

const EXECUTION_STATUSES = [
  'Başlamadı',
  'İcra Takibi Başlatıldı',
  'İtiraz Aşamasında',
  'Haciz Uygulandı',
  'Tamamlandı',
  'Durduruldu',
];

export default function CaseFormModal({ editingCase, onClose, onSaved }: Props) {
  const [clients, setClients] = useState<Profile[]>([]);
  const [formData, setFormData] = useState({
    client_id: editingCase?.client_id || '',
    case_number: editingCase?.case_number || '',
    title: editingCase?.title || '',
    hearing_date: editingCase?.hearing_date || '',
    current_stage: editingCase?.current_stage || '',
    execution_status: editingCase?.execution_status || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').eq('role', 'client').order('full_name')
      .then(({ data }) => setClients(data || []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingCase) {
        const prevStage = editingCase.current_stage;
        const { error } = await supabase.from('cases').update({
          client_id: formData.client_id,
          title: formData.title,
          hearing_date: formData.hearing_date || null,
          current_stage: formData.current_stage,
          execution_status: formData.execution_status,
        }).eq('id', editingCase.id);
        if (error) throw error;
        onSaved(formData.current_stage !== prevStage ? prevStage : undefined);
      } else {
        const { error } = await supabase.from('cases').insert({
          client_id: formData.client_id,
          case_number: formData.case_number,
          title: formData.title,
          hearing_date: formData.hearing_date || null,
          current_stage: formData.current_stage,
          execution_status: formData.execution_status,
        });
        if (error) throw error;
        onSaved();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-serif text-xl text-navy-900">
            {editingCase ? 'Davayı Düzenle' : 'Yeni Dava Oluştur'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Müvekkil</label>
            <select
              value={formData.client_id}
              onChange={e => setFormData(p => ({ ...p, client_id: e.target.value }))}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors bg-white"
            >
              <option value="">Müvekkil seçin...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
              ))}
            </select>
          </div>

          {!editingCase && (
            <div>
              <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Dava Numarası</label>
              <input
                type="text"
                value={formData.case_number}
                onChange={e => setFormData(p => ({ ...p, case_number: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
                placeholder="2024-001"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Dava Başlığı</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
              placeholder="Dava konusu ve özeti"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Duruşma Tarihi</label>
            <input
              type="date"
              value={formData.hearing_date}
              onChange={e => setFormData(p => ({ ...p, hearing_date: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">Son Aşama</label>
            <select
              value={formData.current_stage}
              onChange={e => setFormData(p => ({ ...p, current_stage: e.target.value }))}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors bg-white"
            >
              <option value="">Aşama seçin...</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 text-xs uppercase tracking-widest mb-2">İcra Durumu</label>
            <select
              value={formData.execution_status}
              onChange={e => setFormData(p => ({ ...p, execution_status: e.target.value }))}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-200 transition-colors bg-white"
            >
              <option value="">Durum seçin...</option>
              {EXECUTION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              İptal
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {submitting ? 'Kaydediliyor...' : editingCase ? 'Güncelle' : 'Dava Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
