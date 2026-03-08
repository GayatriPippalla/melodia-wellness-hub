import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote, Sparkles, Lightbulb, Heart, BookOpen,
  Filter,
} from "lucide-react";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type Category = "quotes" | "affirmations" | "stories" | "tips" | "appreciations";

interface Post {
  id: string;
  category: Category;
  title: string;
  content: string;
  author?: string | null;
}

const categoryMeta: Record<Category, { label: string; icon: typeof Quote; color: string }> = {
  quotes: { label: "Quotes", icon: Quote, color: "bg-sage-light text-sage-dark" },
  affirmations: { label: "Affirmations", icon: Sparkles, color: "bg-sand-light text-sand-dark" },
  stories: { label: "Stories", icon: BookOpen, color: "bg-cream text-foreground" },
  tips: { label: "Tips", icon: Lightbulb, color: "bg-sage-light text-sage-dark" },
  appreciations: { label: "Appreciations", icon: Heart, color: "bg-sand-light text-sand-dark" },
};

const categories: Category[] = ["quotes", "affirmations", "stories", "tips", "appreciations"];

const DailyMotivationPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("motivation_posts").select("*").order("created_at", { ascending: false });
      setPosts((data as Post[]) || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filtered = activeFilter === "all" ? posts : posts.filter((p) => p.category === activeFilter);

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
        </div>
      </div>

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
