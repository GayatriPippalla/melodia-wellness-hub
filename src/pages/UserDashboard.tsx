import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  LogOut, Leaf, Target, Sparkles, CalendarHeart,
  MessageCircle, Heart, Sun, Moon, Droplets, X, Phone, CheckCircle, Clock, ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, limit, getDocs, orderBy, onSnapshot, where, updateDoc } from "firebase/firestore";
import { toast } from "@/components/ui/sonner";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import DarkVeil from "@/components/DarkVeil";
import ChatBox from "@/components/ChatBox";
import { DiscoveryInbox } from "@/components/discovery/DiscoveryInbox";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const UserDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [motivationPost, setMotivationPost] = useState<any>(null);
  const [discoveryRequests, setDiscoveryRequests] = useState<any[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await signOut(auth);
        navigate("/login");
        return;
      }

      const profileData = userDoc.data();
      if (profileData?.status !== "approved") {
        await signOut(auth);
        navigate("/login");
        return;
      }

      setProfile(profileData);
      setLoading(false); 

      // Fetch a random motivation post
      try {
        const qPosts = query(collection(db, "motivation_posts"), limit(50));
        const querySnapshot = await getDocs(qPosts);
        const posts: any[] = [];
        querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
        if (posts.length > 0) {
          setMotivationPost(posts[Math.floor(Math.random() * posts.length)]);
        }
      } catch (err) {
        console.error("Error fetching motivation posts:", err);
      }
    });

    // Fallback: if auth state doesn't resolve in 5 seconds, stop loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribeAuth();
      clearTimeout(timer);
    };
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: Sun };
    if (hour < 18) return { text: "Good Afternoon", icon: Droplets };
    return { text: "Good Evening", icon: Moon };
  };

  const renderLinkedText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80 break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const formatPreferredTime = (time: string) => {
    if (!time) return "";
    if (time.includes("T") && time.includes("-")) {
      try {
        const date = new Date(time);
        return date.toLocaleString([], { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch (e) {
        return time;
      }
    }
    return time;
  };

  const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
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
  const firstName = profile?.fullName?.split(" ")[0] || "Friend";

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />
      <div className="relative z-10 h-full">
        {/* Hero welcome */}
        <section className="pt-28 pb-6 px-4 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl">
            <motion.div {...fadeUp(0)} className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 mb-4 border border-accent/20">
                  <GreetingIcon size={14} className="text-primary" />
                  <span className="font-body text-xs uppercase tracking-[0.2em] text-foreground/70">{greeting.text}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-light leading-tight text-foreground">
                  Welcome to <span className="italic gradient-text">Melodia Wellness</span>
                </h1>
                <p className="font-body text-base mt-2 text-muted-foreground">{firstName}, your wellness journey continues here.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full gap-2 text-xs">
                <LogOut size={14} /> Logout
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Dashboard content */}
        <section className="pb-24 px-4 overflow-visible">
          <div className="container mx-auto max-w-4xl space-y-6">
            
            {/* Notification Alert Banner */}
            {showBanner && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-primary animate-pulse" />
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">You have a reply from your coach!</p>
                  </div>
                </div>
                <button onClick={() => setShowBanner(false)} className="p-1 hover:bg-black/5 rounded-full transition-colors text-foreground">
                  <X size={16} />
                </button>
              </motion.div>
            )}

            {/* Discovery Messaging System (Gmail Style) */}
            <motion.div {...fadeUp(0.05)} className="space-y-4">
              <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <MessageCircle size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Coaching & Messages</h2>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-widest">Discovery Call Threads</p>
                </div>
              </div>
              <DiscoveryInbox 
                currentUserId={auth.currentUser?.uid || ""} 
                userName={profile?.fullName || ""} 
              />
            </motion.div>

            {/* Grid for Plan & Motivation */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div {...fadeUp(0.1)} className="glass-card rounded-3xl p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-accent/20 flex items-center justify-center"><Heart size={20} className="text-primary" /></div>
                  <h2 className="font-display text-xl font-semibold text-foreground">Wellness Plan</h2>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl bg-muted/30 p-4 border border-border/20">
                    <p className="font-body text-[10px] text-muted-foreground mb-1 uppercase tracking-widest">Core Goal</p>
                    <p className="font-body text-sm text-foreground font-medium">{profile?.wellnessGoal || "Balance & Vitality"}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.2)} className="glass-card rounded-3xl p-7 flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-accent/20 flex items-center justify-center"><Sparkles size={20} className="text-primary" /></div>
                  <h2 className="font-display text-xl font-semibold text-foreground">Daily Spark</h2>
                </div>
                {motivationPost ? (
                  <div className="flex flex-col h-full justify-center">
                    <blockquote className="font-display text-lg italic text-foreground/90 leading-relaxed mb-4">
                      "{motivationPost.content}"
                    </blockquote>
                    <p className="font-body text-xs text-muted-foreground">— {motivationPost.author || "Melodia Inspiration"}</p>
                  </div>
                ) : (
                  <p className="font-body text-sm text-muted-foreground italic">Finding your inspiration for today...</p>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <ChatBox userId={auth.currentUser?.uid || ""} userName={profile?.fullName || ""} />
    </div>
  );
};

export default UserDashboard;
