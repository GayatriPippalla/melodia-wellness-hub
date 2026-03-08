import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, KeyRound, User, Target, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";

const SignupPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    wellnessGoal: "",
    stressLevel: 5,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (authError) throw authError;

      const userId = authData.user?.id;
      if (!userId) throw new Error("Signup failed. Please try again.");

      // 2. Create profile with pending status
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: userId,
        full_name: form.fullName,
        email: form.email,
        wellness_goal: form.wellnessGoal,
        stress_level: form.stressLevel,
      });
      if (profileError) throw profileError;

      // Sign out immediately — user must wait for approval
      await supabase.auth.signOut();
      setSuccess(true);
    } catch (err: any) {
      toast(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <PageNavbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <UserPlus size={32} className="text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
              Account <span className="italic gradient-text">Created</span>
            </h1>
            <div className="glass-card rounded-2xl p-8 mb-6">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Your account has been created. Please wait for admin approval before logging in.
              </p>
            </div>
            <Link
              to="/login"
              className="font-body text-sm text-primary hover:text-primary/80 transition-colors duration-300"
            >
              Go to Login →
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />
      <section className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="font-body text-xs uppercase tracking-[0.2em] text-accent-foreground">
                  Join Us
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
                Begin your <span className="italic gradient-text">journey</span>
              </h1>
              <p className="font-body text-sm text-muted-foreground mt-3">
                Create your Melodia Wellness account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 space-y-5">
              {/* Full Name */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="Your full name"
                    className="font-body pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="you@example.com"
                    className="font-body pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    className="font-body pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    className="font-body pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Wellness Goal */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">
                  <Target size={14} className="inline mr-1.5 text-primary" />
                  Wellness Goal
                </label>
                <Textarea
                  value={form.wellnessGoal}
                  onChange={(e) => handleChange("wellnessGoal", e.target.value)}
                  placeholder="What do you hope to achieve on your wellness journey?"
                  className="font-body min-h-[80px]"
                  required
                />
              </div>

              {/* Stress Level */}
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-3 block">
                  <Activity size={14} className="inline mr-1.5 text-primary" />
                  Stress Level: <span className="text-primary font-semibold">{form.stressLevel}/10</span>
                </label>
                <Slider
                  value={[form.stressLevel]}
                  onValueChange={(val) => handleChange("stressLevel", val[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-body text-[10px] text-muted-foreground">Low stress</span>
                  <span className="font-body text-[10px] text-muted-foreground">High stress</span>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-full mt-2">
                {loading ? "Creating account…" : "Create Account"}
              </Button>

              <p className="font-body text-xs text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SignupPage;
