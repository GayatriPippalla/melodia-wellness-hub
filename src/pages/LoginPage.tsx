import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "@/components/ui/sonner";
import { BackgroundPaths } from "@/components/ui/background-paths";
import About from "@/components/About";
import Footer from "@/components/Footer";

import Logo from "@/components/Logo";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPendingMessage(false);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        await signOut(auth);
        toast("Account not found. Please sign up first.");
        return;
      }

      const profile = userDoc.data();

      if (profile.role === "admin") {
        navigate("/admin");
        return;
      }

      if (profile.status === "pending") {
        await signOut(auth);
        setPendingMessage(true);
        return;
      }

      if (profile.status === "rejected") {
        await signOut(auth);
        toast("Your account has been rejected. Please contact support.");
        return;
      }

      navigate("/home");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        toast("Invalid credentials. Please check your email and password.");
      } else {
        toast(err.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-8">
          <Link to="/" className="transition-transform duration-300 hover:scale-[1.02]">
            <Logo />
          </Link>
        </div>
      </div>

      {/* Login with animated background */}
      <BackgroundPaths>
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-center mb-10">
                <div className="mx-auto mb-4 flex justify-center">
                  <Logo showText={false} className="w-24 h-24" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
                  Welcome to <span className="italic gradient-text">Melodia</span>
                </h1>
                <p className="font-body text-sm text-muted-foreground mt-3">
                  Sign in to access your wellness journey
                </p>
              </div>

              {pendingMessage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-3xl p-8 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <Clock size={24} className="text-accent-foreground" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    Approval Pending
                  </h2>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    Your account is waiting for admin approval. You'll be able to log in once your account has been approved.
                  </p>
                  <Button variant="outline" className="mt-6 rounded-full" onClick={() => setPendingMessage(false)}>
                    Try Again
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleLogin} className="glass-card rounded-3xl p-8 space-y-5 backdrop-blur-md">
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="font-body pl-10" required />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">Password</label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="font-body pl-10" required />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full rounded-full">
                    {loading ? "Signing in…" : "Sign In"}
                  </Button>

                  <p className="font-body text-xs text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </BackgroundPaths>

      {/* About section below */}
      <About />
      <Footer />
    </div>
  );
};

export default LoginPage;
