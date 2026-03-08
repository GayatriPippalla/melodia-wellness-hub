import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut, Leaf, Target, Sparkles, CalendarHeart,
  MessageCircle, Heart, Sun, Moon, Droplets,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const UserDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [motivationPost, setMotivationPost] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/login"); return; }

      const { data } = await supabase.from("profiles").select("*").single();
      if (!data || data.status !== "approved") {
        await supabase.auth.signOut();
        navigate("/login");
        return;
      }

      setProfile(data);

      // Fetch a random motivation post
      const { data: posts } = await supabase
        .from("motivation_posts")
        .select("*")
        .limit(50);
      if (posts && posts.length > 0) {
        setMotivationPost(posts[Math.floor(Math.random() * posts.length)]);
      }

      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: Sun };
    if (hour < 18) return { text: "Good Afternoon", icon: Droplets };
    return { text: "Good Evening", icon: Moon };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Leaf size={32} className="text-primary mx-auto mb-3 animate-pulse" />
          <p className="font-body text-muted-foreground">Preparing your sanctuary…</p>
        </motion.div>
      </div>
    );
  }

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;
  const firstName = profile.full_name?.split(" ")[0] || "Friend";

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />

      {/* Hero welcome */}
      <section className="pt-28 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sage-light/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sand-light/20 blur-[100px] -z-10" />

        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)} className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mb-4">
                <GreetingIcon size={14} className="text-primary" />
                <span className="font-body text-xs uppercase tracking-[0.2em] text-accent-foreground">
                  {greeting.text}
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
                Welcome to <span className="italic gradient-text">Melodia Wellness</span>
              </h1>
              <p className="font-body text-base text-muted-foreground mt-2">
                {firstName}, your wellness journey continues here.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full gap-2 text-xs shrink-0 mt-2">
              <LogOut size={14} /> Logout
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Dashboard content */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">

          {/* Row 1: Wellness Plan + Daily Motivation */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* My Wellness Plan */}
            <motion.div {...fadeUp(0.1)} className="glass-card rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-sage-light/15 blur-[30px]" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
                  <Heart size={20} className="text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">My Wellness Plan</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl bg-muted/50 p-4">
                  <p className="font-body text-xs text-muted-foreground mb-1">Current Focus</p>
                  <p className="font-body text-sm text-foreground font-medium">
                    {profile.stress_level >= 7 ? "Stress Reduction & Calm" :
                     profile.stress_level >= 4 ? "Balance & Harmony" : "Growth & Vitality"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted/50 p-4 text-center">
                    <p className="font-display text-2xl font-semibold text-primary">{profile.stress_level}</p>
                    <p className="font-body text-[10px] text-muted-foreground mt-1">Stress Level</p>
                  </div>
                  <div className="rounded-2xl bg-muted/50 p-4 text-center">
                    <p className="font-display text-2xl font-semibold text-primary">
                      {10 - profile.stress_level}
                    </p>
                    <p className="font-body text-[10px] text-muted-foreground mt-1">Calm Score</p>
                  </div>
                </div>
                <div>
                  <p className="font-body text-xs text-muted-foreground mb-2">Wellness Progress</p>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(20, (10 - profile.stress_level) * 10)}%` }}
                      transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Daily Motivation */}
            <motion.div {...fadeUp(0.2)} className="glass-card rounded-3xl p-7 relative overflow-hidden flex flex-col">
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-sand-light/20 blur-[30px]" />
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
                  <Sparkles size={20} className="text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">Daily Motivation</h2>
              </div>
              {motivationPost ? (
                <div className="flex-1 flex flex-col justify-center">
                  <blockquote className="font-display text-lg md:text-xl italic text-foreground/90 leading-relaxed mb-4">
                    "{motivationPost.content}"
                  </blockquote>
                  {motivationPost.author && (
                    <p className="font-body text-xs text-muted-foreground">— {motivationPost.author}</p>
                  )}
                  <span className="inline-block mt-3 rounded-full bg-muted px-3 py-1 font-body text-[10px] uppercase tracking-wider text-muted-foreground w-fit">
                    {motivationPost.category}
                  </span>
                </div>
              ) : (
                <p className="font-body text-sm text-muted-foreground flex-1 flex items-center">
                  Your daily inspiration is being prepared…
                </p>
              )}
            </motion.div>
          </div>

          {/* Row 2: My Goals + Book Coaching */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* My Goals */}
            <motion.div {...fadeUp(0.3)} className="glass-card rounded-3xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
                  <Target size={20} className="text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">My Goals</h2>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
                  <p className="font-body text-xs text-muted-foreground mb-1">Primary Wellness Goal</p>
                  <p className="font-body text-sm text-foreground leading-relaxed">
                    {profile.wellness_goal}
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Mind", desc: "Mental clarity & focus", progress: 65 },
                    { label: "Body", desc: "Physical wellness", progress: 45 },
                    { label: "Spirit", desc: "Inner peace & balance", progress: 55 },
                  ].map((goal, i) => (
                    <div key={goal.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="font-body text-xs font-medium text-foreground">{goal.label}</p>
                          <p className="font-body text-[10px] text-muted-foreground">{goal.desc}</p>
                        </div>
                        <span className="font-body text-xs text-primary font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full bg-primary/70 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Book Coaching Session */}
            <motion.div {...fadeUp(0.4)} className="glass-card rounded-3xl p-7 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
                  <CalendarHeart size={20} className="text-primary" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">Book Coaching Session</h2>
              </div>
              <div className="flex-1 space-y-4">
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Schedule a personalized 1-on-1 session with your wellness coach. Together, we'll
                  create a path to your best self.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Discovery Call", time: "30 min", desc: "Free introductory session" },
                    { label: "Coaching Session", time: "60 min", desc: "Deep-dive wellness coaching" },
                    { label: "Meditation Guide", time: "45 min", desc: "Guided meditation practice" },
                    { label: "Wellness Review", time: "30 min", desc: "Monthly progress check-in" },
                  ].map((session) => (
                    <button
                      key={session.label}
                      onClick={() => toast(`${session.label} — Coming soon! We'll notify you when booking opens.`)}
                      className="rounded-2xl border border-border/50 bg-background/50 p-3 text-left hover:border-primary/30 hover:shadow-soft transition-all duration-300 group"
                    >
                      <p className="font-body text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                        {session.label}
                      </p>
                      <p className="font-body text-[10px] text-muted-foreground">{session.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Row 3: Messages from Coach */}
          <motion.div {...fadeUp(0.5)} className="glass-card rounded-3xl p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center">
                <MessageCircle size={20} className="text-primary" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">Messages from Coach</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Leaf size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body text-xs font-medium text-foreground">Melodia Wellness Coach</p>
                      <span className="font-body text-[10px] text-muted-foreground">Today</span>
                    </div>
                    <p className="font-body text-sm text-foreground/80 leading-relaxed">
                      Welcome to Melodia Wellness, {firstName}! 🌿 I'm so glad you're here. Your wellness journey
                      is unique, and I'm honored to walk alongside you. Take a moment today to breathe deeply
                      and set an intention for the week ahead. Remember — every small step counts.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/50 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <Leaf size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-body text-xs font-medium text-foreground">Melodia Wellness Coach</p>
                      <span className="font-body text-[10px] text-muted-foreground">Getting started</span>
                    </div>
                    <p className="font-body text-sm text-foreground/80 leading-relaxed">
                      Based on your wellness assessment, I've personalized some recommendations for you.
                      Check your Wellness Plan to see your current focus area and track your progress
                      across mind, body, and spirit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UserDashboard;
