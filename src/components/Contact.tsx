import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        const normalizedEmail = user.email.toLowerCase().trim();
        try {
          const docRef = doc(db, "newsletter_subscribers", normalizedEmail);
          const snap = await getDoc(docRef);
          
          if (snap.exists()) {
            const d = snap.data();
            const isActive = d.status === "active" || d.subscribed === true;
            setIsSubscribed(isActive);
            setEmail(normalizedEmail);
          } else {
            setIsSubscribed(false);
            setEmail(normalizedEmail);
          }
        } catch (err) {
          console.error("Error loading subscription status:", err);
        }
      } else {
        setIsSubscribed(false);
        setEmail("");
      }
    });

    return () => unsub();
  }, []);

  const handleUnsubscribe = async () => {
    const targetEmail = (auth.currentUser?.email || email || "").toLowerCase().trim();
    if (!targetEmail) {
      toast.error("Could not find your subscription email.");
      return;
    }

    setIsProcessing(true);
    try {
      // Use email as unique Doc ID
      await setDoc(doc(db, "newsletter_subscribers", targetEmail), {
        status: "inactive",
        unsubscribedAt: serverTimestamp(),
        email: targetEmail
      }, { merge: true });

      // Cleanup legacy duplicates
      const q = query(collection(db, "newsletter_subscribers"), where("email", "==", targetEmail));
      const snap = await getDocs(q);
      const updates = snap.docs
        .filter(d => d.id !== targetEmail)
        .map(d => updateDoc(doc(db, "newsletter_subscribers", d.id), { status: "inactive" }));
      await Promise.all(updates);

      setIsSubscribed(false);
      toast.success("You have unsubscribed from our newsletter.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update preferences. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.toLowerCase().trim();
    if (!targetEmail) return;

    setIsProcessing(true);
    try {
      // Enforce single document per email
      await setDoc(doc(db, "newsletter_subscribers", targetEmail), {
        email: targetEmail,
        status: "active",
        subscribedAt: serverTimestamp(),
      }, { merge: true });

      // Clean up legacy duplicates
      const q = query(collection(db, "newsletter_subscribers"), where("email", "==", targetEmail));
      const snap = await getDocs(q);
      const updates = snap.docs
        .filter(d => d.id !== targetEmail)
        .map(d => updateDoc(doc(db, "newsletter_subscribers", d.id), { status: "inactive" }));
      await Promise.all(updates);

      setIsSubscribed(true);
      setEmail("");
      toast.success("Welcome to the Melodia community! ✨");
    } catch (err) {
      console.error(err);
      toast.error("Cloud Error: Failed to subscribe. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! I'll get back to you within 24 hours.");
  };

  return (
    <section id="contact" className="py-24 md:py-36 bg-background relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-sage-light/15 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-sand-light/30 blur-[80px] -z-10" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16">          {/* Replaced form with Chat Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mb-5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-body text-xs uppercase tracking-[0.2em] text-accent-foreground">Live Support</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
              Instant <span className="italic gradient-text">connection</span>
            </h2>
            <p className="font-body text-muted-foreground mb-8 text-lg">
              We've upgraded our communication! For the fastest response, use the live chat bubble at the bottom of your screen to talk with our wellness coach directly.
            </p>
            <div className="p-6 rounded-3xl bg-sage-light/30 border border-primary/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                <MessageCircle size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground">Real-Time Coaching</p>
                <p className="font-body text-sm text-muted-foreground">Available for all members on their dashboard</p>
              </div>
            </div>
          </motion.div>

          {/* Info + Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="space-y-5 mb-12">
                {[
                  { icon: Mail, text: "geetha.melodiawellness@gmail.com" },
                  { icon: Phone, text: "+1 (555) 234-5678" },
                  { icon: MapPin, text: "4654, Berrien Springs, MI USA — Virtual & In-Person" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <span className="font-body text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="font-display text-2xl text-foreground mb-2">Join the Newsletter</h3>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Weekly wellness tips, guided meditations, and exclusive offers — delivered with love.
              </p>
              {isSubscribed ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="font-display font-semibold">You're subscribed!</p>
                      <p className="font-body text-xs text-muted-foreground">You're on the list for weekly tips.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUnsubscribe}
                    disabled={isProcessing}
                    className="text-xs font-body text-muted-foreground hover:text-destructive underline underline-offset-4 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? "Updating..." : "Unsubscribe from newsletter"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="flex-1 rounded-full border border-border bg-background/80 px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="rounded-full bg-primary px-6 py-3.5 font-body text-sm font-medium text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 flex items-center gap-2"
                  >
                    {isProcessing && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {isProcessing ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
