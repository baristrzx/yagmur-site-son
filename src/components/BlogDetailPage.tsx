import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { supabase, type BlogPost, type BlogCategory } from '../lib/supabase';

type PostWithCategory = BlogPost & { blog_categories: BlogCategory | null };

export default function BlogDetailPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<PostWithCategory | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostWithCategory[]>([]);
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

        const { data: related } = await supabase
          .from('blog_posts')
          .select('*, blog_categories(*)')
          .eq('is_published', true)
          .neq('slug', slug)
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(3);
        setRelatedPosts((related as PostWithCategory[]) || []);
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

      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="border-t border-gray-200 pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-navy-800">Diğer Yazılar</h2>
                <p className="text-gray-400 text-sm mt-1">Okumaya devam edin</p>
              </div>
              <a
                href="/#knowledge"
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 text-sm font-semibold transition-colors"
              >
                Tümünü Gör
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {relatedPosts.map((related) => (
                <a
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col"
                >
                  {related.cover_image ? (
                    <div className="relative aspect-video overflow-hidden bg-navy-900">
                      <img
                        src={related.cover_image}
                        alt={related.title_tr}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />
                      {related.blog_categories && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-white/90 backdrop-blur-sm text-navy-800 text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-0.5 rounded-full">
                            {related.blog_categories.name_tr}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-navy-50 flex items-center justify-center">
                      <BookOpen size={28} className="text-navy-200" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    {related.blog_categories && !related.cover_image && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Tag size={10} className="text-gold-500" />
                        <span className="text-gold-600 text-[10px] font-semibold tracking-widest uppercase">
                          {related.blog_categories.name_tr}
                        </span>
                      </div>
                    )}
                    <h3 className="font-serif text-sm font-bold text-navy-800 leading-snug group-hover:text-gold-700 transition-colors line-clamp-2 flex-1">
                      {related.title_tr}
                    </h3>
                    {related.published_at && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] mt-3">
                        <Calendar size={10} />
                        {new Date(related.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1 text-gold-600 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                        Oku
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
