import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

// ── Static blog data ──────────────────────────────────────────────────────────
const BLOGS = [
  {
    id: 1,
    title: 'How to Write a CV That Gets Noticed by International Employers',
    excerpt:
      'Tailoring your CV for the global job market can be daunting. Learn the key sections, formatting tips, and how to highlight transferable skills effectively.',
    tag: 'Jobs',
    date: 'Feb 28, 2026',
    readTime: '5 min read',
    author: 'Sheltra Editorial',
  },
  {
    id: 2,
    title: 'Understanding Your Labor Rights as a Refugee in Kenya',
    excerpt:
      "Kenya's legal framework offers certain protections for refugee workers. This guide explains your rights, the work permit process, and where to seek help.",
    tag: 'Rights',
    date: 'Feb 20, 2026',
    readTime: '8 min read',
    author: 'Legal Aid Partner',
  },
  {
    id: 3,
    title: '5 Free Online Courses to Boost Your Tech Skills in 2026',
    excerpt:
      'From Python to UX design, these free platforms can help you build in-demand digital skills—even with limited internet access.',
    tag: 'Training',
    date: 'Feb 14, 2026',
    readTime: '4 min read',
    author: 'Sheltra Learning Team',
  },
  {
    id: 4,
    title: "From Displacement to Developer: Amara's Story",
    excerpt:
      "Amara arrived in Nairobi with little more than her laptop and determination. Two years later, she leads a product team at a fintech startup. Here's her journey.",
    tag: 'Stories',
    date: 'Feb 8, 2026',
    readTime: '6 min read',
    author: 'Community Story',
  },
  {
    id: 5,
    title: 'Networking Without Borders: Building Professional Connections Remotely',
    excerpt:
      'Long-distance networking is a skill in itself. Discover how to create genuine connections on LinkedIn, in virtual events, and through diaspora networks.',
    tag: 'Jobs',
    date: 'Jan 30, 2026',
    readTime: '5 min read',
    author: 'Sheltra Editorial',
  },
  {
    id: 6,
    title: 'Language Learning Apps Compared: Which Works Best for Job Seekers?',
    excerpt:
      "We tested Duolingo, Babbel, and three other apps for professional language acquisition. Here's an honest comparison for job-ready learners.",
    tag: 'Training',
    date: 'Jan 22, 2026',
    readTime: '7 min read',
    author: 'Sheltra Learning Team',
  },
  {
    id: 7,
    title: 'Decoding UNHCR Documentation: What Each Paper Means for Your Employment',
    excerpt:
      'Refugee documentation can feel overwhelming. This plain-language guide explains how your UNHCR papers affect your employment eligibility region by region.',
    tag: 'Rights',
    date: 'Jan 15, 2026',
    readTime: '9 min read',
    author: 'Legal Aid Partner',
  },
  {
    id: 8,
    title: 'Building a Portfolio with No Money: Free Tools Every Refugee Creator Should Know',
    excerpt:
      "You don't need expensive software to show your work. From GitHub Pages to Canva, these free tools let your talent speak for itself.",
    tag: 'Jobs',
    date: 'Jan 9, 2026',
    readTime: '5 min read',
    author: 'Sheltra Editorial',
  },
];

const CATEGORIES = ['All', 'Jobs', 'Training', 'Rights', 'Stories'];

const TAG_BADGE_VARIANT = {
  Jobs: 'primary',
  Training: 'accent',
  Rights: 'warning',
  Stories: 'success',
};

// ── BlogCard ──────────────────────────────────────────────────────────────────
function BlogCard({ post }) {
  return (
    <article className="fancy-card p-6 flex flex-col gap-4 hover-lift group transition-all duration-200">
      {/* Meta */}
      <div className="flex items-center gap-3">
        <Badge variant={TAG_BADGE_VARIANT[post.tag] || 'default'}>{post.tag}</Badge>
        <span className="text-xs text-slate-500">{post.date}</span>
        <span className="text-xs text-slate-600">·</span>
        <span className="text-xs text-slate-500">{post.readTime}</span>
      </div>

      {/* Title */}
      <h2 className="text-base font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors duration-200 leading-snug">
        {post.title}
      </h2>

      {/* Excerpt */}
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/6">
        <span className="text-xs text-slate-500">{post.author}</span>
        <button
          className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
          aria-label={`Read ${post.title}`}
        >
          Read more
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
}

// ── Blogs page ────────────────────────────────────────────────────────────────
export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? BLOGS
      : BLOGS.filter((b) => b.tag === activeCategory);

  return (
    <div className="space-y-8 motion-safe-fade-in">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
          Resources &amp; Stories
        </h1>
        <p className="text-slate-400 mt-2 text-base max-w-xl">
          Guides, rights information, skill-building articles, and inspiring stories from the Sheltra community.
        </p>
      </div>

      {/* Category filter pills */}
      <nav aria-label="Blog category filters">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={
                activeCategory === cat
                  ? 'px-4 py-1.5 rounded-full text-sm font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'
                  : 'px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'
              }
            >
              {cat}
              {cat !== 'All' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({BLOGS.filter((b) => b.tag === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Results count */}
      <p className="text-sm text-slate-500">
        Showing{' '}
        <span className="text-slate-300 font-medium">{filtered.length}</span>{' '}
        {filtered.length === 1 ? 'article' : 'articles'}
        {activeCategory !== 'All' && (
          <>
            {' '}in{' '}
            <span className="text-slate-300 font-medium">{activeCategory}</span>
          </>
        )}
      </p>

      {/* Blog grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">No articles in this category yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Newsletter CTA */}
      <Card className="border border-cyan-500/15 bg-cyan-500/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-100">Stay in the loop</h3>
            <p className="text-sm text-slate-400 mt-0.5">
              New guides and stories are added every week. Check back soon.
            </p>
          </div>
          <div className="shrink-0 px-4 py-2 rounded-lg bg-cyan-500/12 text-cyan-400 text-sm font-medium border border-cyan-500/20">
            New articles weekly
          </div>
        </div>
      </Card>
    </div>
  );
}
