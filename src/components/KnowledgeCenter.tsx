import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, ArrowRight, Calendar, Tag } from 'lucide-react';
import { supabase, type BlogPost, type BlogCategory } from '../lib/supabase';

type PostWithCategory = BlogPost & { blog_categories: BlogCategory | null };

export default function KnowledgeCenter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [posts, setPosts] = useState<PostWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*, blog_categories(*)')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setPosts((data as PostWithCategory[]) || []);
        setLoading(false);
      });
  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section id="knowledge" className="py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase font-sans">
            Hukuki İçgörü
          </span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl font-bold text-navy-800 leading-tight">
            Bilgi Merkezi
          </h2>
          <div className="mt-3 w-16 h-1 bg-gold-500 rounded-full mx-auto" />
          <p className="mt-6 text-gray-500 max-w-xl mx-auto text-[1.02rem] leading-relaxed font-sans">
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
          <div className="space-y-8">
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="group grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="relative overflow-hidden bg-navy-900 min-h-[280px] lg:min-h-[360px]">
                  {featuredPost.cover_image ? (
                    <img
                      src={featuredPost.cover_image}
                      alt={featuredPost.title_tr}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-950" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-900/40 to-navy-900/10" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-gold-500 text-navy-900 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                      Öne Çıkan
                    </span>
                  </div>
                </div>

                <div className="p-8 lg:p-10 bg-white flex flex-col justify-center">
                  {featuredPost.blog_categories && (
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={12} className="text-gold-500" />
                      <span className="text-gold-600 text-xs font-semibold tracking-widest uppercase">
                        {featuredPost.blog_categories.name_tr}
                      </span>
                    </div>
                  )}
                  <h3 className="font-serif text-2xl lg:text-3xl font-bold text-navy-800 leading-tight group-hover:text-gold-700 transition-colors duration-200">
                    {featuredPost.title_tr}
                  </h3>
                  {featuredPost.excerpt_tr && (
                    <p className="mt-4 text-gray-500 leading-relaxed text-sm line-clamp-3 font-sans">
                      {featuredPost.excerpt_tr}
                    </p>
                  )}
                  <div className="mt-6 flex items-center justify-between">
                    {featuredPost.published_at && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs font-sans">
                        <Calendar size={13} />
                        {new Date(featuredPost.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-navy-700 hover:text-gold-600 text-sm font-semibold transition-colors duration-200 ml-auto cursor-pointer group/link">
                      Devamını Oku
                      <ArrowRight size={15} className="group-hover/link:translate-x-1 transition-transform duration-200" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {otherPosts.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                    className="group rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400 bg-white flex flex-col cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden bg-navy-900">
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={post.title_tr}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
                          <BookOpen size={32} className="text-white/20" />
                        </div>
                      )}
                      {post.blog_categories && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 text-navy-800 text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full">
                            {post.blog_categories.name_tr}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-serif text-lg font-bold text-navy-800 leading-snug group-hover:text-gold-700 transition-colors duration-200 line-clamp-2">
                        {post.title_tr}
                      </h3>
                      {post.excerpt_tr && (
                        <p className="mt-3 text-gray-500 text-sm leading-relaxed line-clamp-2 font-sans flex-1">
                          {post.excerpt_tr}
                        </p>
                      )}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                        {post.published_at && (
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-sans">
                            <Calendar size={11} />
                            {new Date(post.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                        <span className="inline-flex items-center gap-1 text-gold-600 text-xs font-semibold ml-auto group-hover:gap-2 transition-all duration-200">
                          Oku
                          <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

