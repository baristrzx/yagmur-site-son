import { useRef, useEffect, useState, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, ArrowRight, Calendar, Tag } from 'lucide-react';
import { supabase, type BlogPost, type BlogCategory } from '../lib/supabase';

type PostWithCategory = BlogPost & { blog_categories: BlogCategory | null };

function KnowledgeCenter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [posts, setPosts] = useState<PostWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('is_published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setPosts((data as PostWithCategory[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="knowledge" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase font-sans">
            Hukuki İçgörü
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-navy-800 leading-tight">
            Bilgi Merkezi
          </h2>
          <div className="mt-3 w-16 h-1 bg-gold-500 rounded-full mx-auto" />
          <p className="mt-6 text-gray-500 max-w-xl mx-auto text-base md:text-[1.02rem] leading-relaxed font-sans">
            Hukuki gelişmeler, içtihat analizleri ve stratejik rehberlik için kapsamlı kaynaklar.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-navy-200 border-t-navy-800 rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
          >
            <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center mb-5">
              <BookOpen size={28} className="text-navy-300" />
            </div>
            <p className="text-navy-700 font-serif text-xl font-semibold">Yakında Burada</p>
            <p className="mt-2 text-gray-400 text-sm max-w-xs text-center leading-relaxed">
              Hukuki makaleler ve içtihat analizleri çok yakında yayınlanacak.
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
                onClick={() => window.location.href = `/blog/${post.slug}`}
                className="group rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white flex flex-col cursor-pointer"
              >
                {post.cover_image && (
                  <div className="relative aspect-square overflow-hidden bg-navy-900">
                    <img
                      src={post.cover_image}
                      alt={post.title_tr}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
                    {post.blog_categories && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-navy-800 text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full">
                          {post.blog_categories.name_tr}
                        </span>
                      </div>
                    )}
                    {i === 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-gold-500 text-navy-900 text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full">
                          Öne Çıkan
                        </span>
                      </div>
                    )}
                    {post.published_at && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/70 text-[10px] font-sans">
                        <Calendar size={10} />
                        {new Date(post.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {post.blog_categories && (
                      <div className="flex items-center gap-1.5">
                        <Tag size={10} className="text-gold-500" />
                        <span className="text-gold-600 text-[10px] font-semibold tracking-widest uppercase font-sans">
                          {post.blog_categories.name_tr}
                        </span>
                      </div>
                    )}
                    {!post.cover_image && i === 0 && (
                      <span className="bg-gold-100 text-gold-700 text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full">
                        Öne Çıkan
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-bold text-navy-800 leading-snug group-hover:text-gold-700 transition-colors duration-200 line-clamp-2 flex-1">
                    {post.title_tr}
                  </h3>
                  {post.excerpt_tr && (
                    <p className="mt-2 text-gray-500 text-xs leading-relaxed line-clamp-2 font-sans">
                      {post.excerpt_tr}
                    </p>
                  )}
                  {post.published_at && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-sans mt-3">
                      <Calendar size={10} />
                      {new Date(post.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-gold-600 text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                      Oku
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(KnowledgeCenter);
