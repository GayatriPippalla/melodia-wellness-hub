import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote, Sparkles, Lightbulb, Heart, BookOpen,
  Plus, X, Filter,
} from "lucide-react";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Category = "quotes" | "affirmations" | "stories" | "tips" | "appreciations";

interface Post {
  id: number;
  category: Category;
  title: string;
  content: string;
  author?: string;
}

const categoryMeta: Record<Category, { label: string; icon: typeof Quote; color: string }> = {
  quotes: { label: "Quotes", icon: Quote, color: "bg-sage-light text-sage-dark" },
  affirmations: { label: "Affirmations", icon: Sparkles, color: "bg-sand-light text-sand-dark" },
  stories: { label: "Stories", icon: BookOpen, color: "bg-cream text-foreground" },
  tips: { label: "Tips", icon: Lightbulb, color: "bg-sage-light text-sage-dark" },
  appreciations: { label: "Appreciations", icon: Heart, color: "bg-sand-light text-sand-dark" },
};

const initialPosts: Post[] = [
  { id: 1, category: "quotes", title: "Inner Peace", content: "The body heals with play, the mind heals with laughter, and the spirit heals with joy.", author: "Proverb" },
  { id: 2, category: "quotes", title: "Unplug & Recharge", content: "Almost everything will work again if you unplug it for a few minutes — including you.", author: "Anne Lamott" },
  { id: 3, category: "affirmations", title: "Morning Affirmation", content: "I am worthy of peace, love, and joy. Today I choose to nurture my mind, body, and spirit." },
  { id: 4, category: "affirmations", title: "Self-Worth", content: "I release what no longer serves me and welcome growth with open arms." },
  { id: 5, category: "stories", title: "From Burnout to Balance", content: "After years of chronic stress, Sarah discovered mindfulness meditation. Within six months, she transformed her daily routine and found a new sense of purpose that rippled through every area of her life." },
  { id: 6, category: "tips", title: "5-Minute Breathing", content: "Try box breathing: inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 5 times to reset your nervous system instantly." },
  { id: 7, category: "tips", title: "Digital Detox Hour", content: "Dedicate one hour before bed to screen-free time. Read, journal, or simply sit in stillness — your sleep quality will thank you." },
  { id: 8, category: "appreciations", title: "Gratitude Moment", content: "Take a moment to appreciate the people who show up for you, the roof over your head, and the simple gift of today." },
  { id: 9, category: "quotes", title: "Greatest Wealth", content: "The greatest wealth is health.", author: "Virgil" },
  { id: 10, category: "affirmations", title: "Evening Reflection", content: "I am grateful for today's lessons. I trust the journey and surrender to rest." },
  { id: 11, category: "stories", title: "A Walk That Changed Everything", content: "James started with a 10-minute walk each morning. That small commitment grew into a complete lifestyle transformation — better nutrition, deeper sleep, and a calmer mind." },
  { id: 12, category: "appreciations", title: "Nature's Gift", content: "Pause and notice the sky today. Whether cloudy or clear, it holds infinite beauty — a reminder that there's always something to appreciate." },
];

const categories: Category[] = ["quotes", "affirmations", "stories", "tips", "appreciations"];

const DailyMotivationPage = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");
  const [showAdmin, setShowAdmin] = useState(false);
  const [newPost, setNewPost] = useState({ category: "quotes" as Category, title: "", content: "", author: "" });

  const filtered = activeFilter === "all" ? posts : posts.filter((p) => p.category === activeFilter);

  const handleAdd = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    setPosts((prev) => [
      { ...newPost, id: Date.now(), author: newPost.author || undefined },
      ...prev,
    ]);
    setNewPost({ category: "quotes", title: "", content: "", author: "" });
    setShowAdmin(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-cream">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="font-body text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4">Daily Motivation</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-4">
              Nourish Your Spirit
            </h1>
            <p className="font-body text-muted-foreground max-w-xl mx-auto text-base md:text-lg">
              Curated quotes, affirmations, mindful tips, and uplifting stories to keep you inspired on your wellness journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Admin bar */}
      <div className="sticky top-[73px] z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={16} className="text-muted-foreground" />
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-full font-body text-xs tracking-wide transition-colors ${
                activeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const meta = categoryMeta[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 rounded-full font-body text-xs tracking-wide transition-colors ${
                    activeFilter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
          <Button
            size="sm"
            variant={showAdmin ? "outline" : "default"}
            onClick={() => setShowAdmin(!showAdmin)}
            className="rounded-full text-xs gap-1.5"
          >
            {showAdmin ? <X size={14} /> : <Plus size={14} />}
            {showAdmin ? "Close" : "Add Post"}
          </Button>
        </div>
      </div>

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-sand-light"
          >
            <div className="container mx-auto px-4 md:px-8 py-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">New Post</h3>
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Category</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as Category })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{categoryMeta[c].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Author (optional)</label>
                  <Input
                    value={newPost.author}
                    onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    placeholder="Author name"
                    className="font-body"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Title</label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title"
                    className="font-body"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Content</label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your motivational content…"
                    className="font-body min-h-[100px]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button onClick={handleAdd} className="rounded-full gap-2">
                    <Plus size={14} />
                    Publish Post
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((post, i) => {
              const meta = categoryMeta[post.category];
              const Icon = meta.icon;
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="break-inside-avoid"
                >
                  <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.color}`}>
                        <Icon size={15} />
                      </div>
                      <Badge variant="secondary" className="font-body text-[10px] uppercase tracking-wider">
                        {meta.label}
                      </Badge>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>

                    {post.category === "quotes" ? (
                      <blockquote className="font-display text-base italic text-muted-foreground leading-relaxed border-l-2 border-sage pl-4 mb-3">
                        "{post.content}"
                      </blockquote>
                    ) : (
                      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                        {post.content}
                      </p>
                    )}

                    {post.author && (
                      <p className="font-body text-xs text-sand-dark">— {post.author}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-center font-body text-muted-foreground py-12">
              No posts in this category yet. Use the admin panel to add one!
            </p>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-sage-light">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="font-body text-muted-foreground max-w-lg mx-auto mb-8">
              Book a discovery call and let us create a personalized wellness plan just for you.
            </p>
            <a
              href="/#contact"
              className="inline-flex rounded-full bg-primary px-8 py-3 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
            >
              Book a Discovery Call
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DailyMotivationPage;
