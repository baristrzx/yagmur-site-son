import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase, type LegalPage as LegalPageType } from '../lib/supabase';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LegalPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<LegalPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPage(data);
      }

      setLoading(false);
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <h1 className="font-serif text-3xl font-bold text-navy-800 mb-4">Sayfa Bulunamadı</h1>
            <p className="text-gray-600 mb-8">Aradığınız sayfa bulunamadı veya yayından kaldırılmış olabilir.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <ArrowLeft size={18} />
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-900 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold text-sm transition-colors duration-200 mb-8"
          >
            <ArrowLeft size={18} />
            Ana Sayfaya Dön
          </button>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            {page.title_tr}
          </h1>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-gold-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-navy-800 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: page.content_tr || '' }}
          />

          {page.updated_at && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Son güncelleme:{' '}
                {new Date(page.updated_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}
