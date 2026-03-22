import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, CheckCircle } from "lucide-react";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { db, auth } from "@/lib/firebase";
import { 
  collection, query, where, getDocs, serverTimestamp, 
  updateDoc, doc, setDoc, getDoc 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ContactPage = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        const normalizedEmail = user.email.toLowerCase().trim();
        try {
          const { getDoc } = await import("firebase/firestore");
          const docRef = doc(db, "newsletter_subscribers", normalizedEmail);
          const snap = await getDoc(docRef);
          
          if (snap.exists()) {
            const d = snap.data();
            const isActive = d.status === "active" || d.subscribed === true;
            setSubscribed(isActive);
            setNewsletterEmail(normalizedEmail);
          } else {
            setSubscribed(false);
            setNewsletterEmail(normalizedEmail);
          }
        } catch (err) {
          console.error("Error loading subscription status:", err);
        }
      } else {
        setSubscribed(false);
        setNewsletterEmail("");
      }
    });
    return () => unsub();
  }, []);

  const handleUnsubscribe = async () => {
    const email = (auth.currentUser?.email || newsletterEmail || "").toLowerCase().trim();
    if (!email) {
      toast.error("Could not find your subscription email.");
      return;
    }

    setIsProcessing(true);
    try {
      // Use email as unique Doc ID to ensure consistency
      await setDoc(doc(db, "newsletter_subscribers", email), {
        status: "inactive",
        unsubscribedAt: serverTimestamp(),
        email: email
      }, { merge: true });

      // Clean up legacy duplicates
      const q = query(collection(db, "newsletter_subscribers"), where("email", "==", email));
      const snap = await getDocs(q);
      const updates = snap.docs
        .filter(d => d.id !== email)
        .map(d => updateDoc(doc(db, "newsletter_subscribers", d.id), { status: "inactive" }));
      
      await Promise.all(updates);

      setSubscribed(false);
      toast.success("You have unsubscribed from our newsletter.");
    } catch (err) {
      console.error("Unsubscribe Error:", err);
      toast.error("Failed to update preferences. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.toLowerCase().trim();
    if (!email) {
      toast("Please enter your email.");
      return;
    }
    
    setIsProcessing(true);
    try {
      await setDoc(doc(db, "newsletter_subscribers", email), {
        email,
        status: "active",
        subscribedAt: serverTimestamp(),
      }, { merge: true });

      const q = query(collection(db, "newsletter_subscribers"), where("email", "==", email));
      const snap = await getDocs(q);
      const updates = snap.docs
        .filter(d => d.id !== email)
        .map(d => updateDoc(doc(db, "newsletter_subscribers", d.id), { status: "inactive" }));
      await Promise.all(updates);

      setSubscribed(true);
      setNewsletterEmail("");
      toast.success("Welcome to the Melodia community!");
    } catch (err: any) {
      toast.error("Cloud Error: Failed to subscribe. Please check your connection.");
      console.error("Subscription Error Details:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />

      {/* Hero */}
      <section className="pt-28 pb-14 md:pt-36 md:pb-18 bg-cream">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-5">
              <MessageCircle size={24} className="text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3">
              Let's Chat About Your Goals
            </h1>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              Whether you have a question or are ready to begin your wellness journey, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl bg-sage-light p-8"
            >
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center mb-4">
                <Mail size={18} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Weekly Wellness Tips</h3>
              <p className="font-body text-sm text-muted-foreground mb-5">
                Get curated wellness tips, affirmations, and mindful insights delivered to your inbox every week.
              </p>

              {subscribed ? (
                <div className="flex flex-col items-start gap-4">
                  <div className="flex items-center gap-2 font-body text-sm text-primary">
                    <CheckCircle size={16} />
                    You're subscribed!
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleUnsubscribe}
                    disabled={isProcessing}
                    className="text-muted-foreground hover:text-destructive h-auto p-0 text-xs font-body transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Unsubscribe"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="space-y-3">
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    className="font-body bg-background"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={isProcessing}
                    className="rounded-full w-full gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Mail size={14} />
                        Join My Newsletter for Weekly Tips
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Quick info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">Get in Touch</h3>
              <div className="space-y-4 font-body text-sm text-muted-foreground">
                <div className="pb-4 border-b border-border/50">
                  <p className="font-medium text-foreground mb-0.5">Email</p>
                  <p>geetha.melodiawellness@gmail.com</p>
                </div>
                <div className="pb-4 border-b border-border/50">
                  <p className="font-medium text-foreground mb-0.5">Response Time</p>
                  <p>Within 24 hours</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-0.5">Discovery Call</p>
                  <p>Free 15-minute consultation</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
