import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound, Clock, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPendingMessage(false);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check profile status
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("status")
        .single();

      if (profileErr || !profile) {
        // Could be an admin — check admin role
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("role", "admin");

        if (roles && roles.length > 0) {
          navigate("/admin");
          return;
        }

        await supabase.auth.signOut();
        toast("Account not found. Please sign up first.");
        return;
      }

      if (profile.status === "pending") {
        await supabase.auth.signOut();
        setPendingMessage(true);
        return;
      }

      if (profile.status === "rejected") {
        await supabase.auth.signOut();
        toast("Your account has been rejected. Please contact support.");
        return;
      }

      // Approved — redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />
      <section className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-primary" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
                Welcome <span className="italic gradient-text">Back</span>
              </h1>
              <p className="font-body text-sm text-muted-foreground mt-3">
                Sign in to your Melodia Wellness account
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
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={() => setPendingMessage(false)}
                >
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleLogin} className="glass-card rounded-3xl p-8 space-y-5">
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="font-body pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="font-body pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full rounded-full">
                  {loading ? "Signing in…" : "Sign In"}
                </Button>

                <p className="font-body text-xs text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LoginPage;
