import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, User, Target, Activity, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";

const UserDashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (!data || data.status !== "approved") {
        await supabase.auth.signOut();
        navigate("/login");
        return;
      }

      setProfile(data);
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />
      <section className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-light text-foreground">
                  Welcome, <span className="italic gradient-text">{profile.full_name?.split(" ")[0]}</span>
                </h1>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Your wellness dashboard
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full gap-2 text-xs">
                <LogOut size={14} /> Logout
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">Profile</h3>
                </div>
                <div className="space-y-2 font-body text-sm">
                  <p><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{profile.full_name}</span></p>
                  <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{profile.email}</span></p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <CheckCircle2 size={14} className="text-primary" />
                    <span className="text-primary text-xs font-medium">Approved</span>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Activity size={18} className="text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">Wellness</h3>
                </div>
                <div className="space-y-2 font-body text-sm">
                  <p>
                    <span className="text-muted-foreground">Stress Level:</span>{" "}
                    <span className="text-foreground font-medium">{profile.stress_level}/10</span>
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(profile.stress_level / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Target size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">Your Wellness Goal</h3>
              </div>
              <p className="font-body text-sm text-foreground leading-relaxed">
                {profile.wellness_goal}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default UserDashboard;
