import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check admin role
      const { data: roles, error: roleErr } = await supabase
        .from("user_roles")
        .select("role")
        .eq("role", "admin");

      if (roleErr || !roles || roles.length === 0) {
        await supabase.auth.signOut();
        toast("Access denied. Admin privileges required.");
        return;
      }

      onLogin();
    } catch (err: any) {
      toast(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Admin Login</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Melodia Wellness Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-2xl border border-border bg-card p-8 space-y-5">
          <div>
            <label className="font-body text-sm font-medium text-foreground mb-2 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@melodia.com"
                className="font-body pl-10"
                required
              />
            </div>
          </div>
          <div>
            <label className="font-body text-sm font-medium text-foreground mb-2 block">Password</label>
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
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
