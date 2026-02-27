import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';
import { supabase, type BlogPost, type BlogCategory } from '../lib/supabase';

type PostWithCategory = BlogPost & { blog_categories: BlogCategory | null };

export default function BlogDetailPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<PostWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data as PostWithCategory);

        await supabase.rpc('increment_blog_view_count', { post_id: data.id });
      }

      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-3xl font-bold text-navy-800 mb-4">Yazı Bulunamadı</h1>
          <p className="text-gray-600 mb-8">Aradığınız içerik bulunamadı veya yayından kaldırılmış olabilir.</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 hover:bg-navy-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const readingTime = post.content_tr ? Math.ceil(post.content_tr.split(' ').length / 200) : 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-navy-800 hover:text-gold-600 font-semibold text-sm transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            Geri
          </button>
        </div>
      </div>

      {post.cover_image && (
        <div className="relative h-96 bg-navy-900">
          <img
            src={post.cover_image}
            alt={post.title_tr}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-6 py-12">
        <div className={post.cover_image ? '-mt-40 relative z-10' : ''}>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {post.blog_categories && (
              <div className="flex items-center gap-2 mb-4">
                <Tag size={14} className="text-gold-500" />
                <span className="text-gold-600 text-xs font-semibold tracking-[0.2em] uppercase">
                  {post.blog_categories.name_tr}
                </span>
              </div>
            )}

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-navy-800 leading-tight mb-6">
              {post.title_tr}
            </h1>

            {post.excerpt_tr && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8 border-l-4 border-gold-400 pl-6 italic">
                {post.excerpt_tr}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>
                    {new Date(post.published_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{readingTime} dk okuma</span>
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy-800 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-gold-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-navy-800 prose-ul:text-gray-700 prose-ol:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content_tr || '' }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Etiketler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gold-50 hover:text-gold-700 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
