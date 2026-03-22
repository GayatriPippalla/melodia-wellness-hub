import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Send, ClipboardList } from "lucide-react";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/components/ui/sonner";

const sleepOptions = ["Excellent", "Good", "Fair", "Poor", "Very Poor"];
const balanceOptions = ["Very Balanced", "Somewhat Balanced", "Neutral", "Somewhat Unbalanced", "Very Unbalanced"];

const WellnessAssessmentPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    stressLevel: 5,
    sleepQuality: "",
    workLifeBalance: "",
    mainGoal: "",
  });

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.sleepQuality || !form.workLifeBalance || !form.mainGoal) {
      toast("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "wellness_assessments"), {
        name: form.name,
        email: form.email,
        stressLevel: form.stressLevel,
        sleepQuality: form.sleepQuality,
        workLifeBalance: form.workLifeBalance,
        mainGoal: form.mainGoal,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err: any) {
      toast("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <PageNavbar />
        <section className="pt-32 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-lg mx-auto px-4"
          >
            <div className="w-20 h-20 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={36} className="text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Thank You
            </h2>
            <p className="font-body text-muted-foreground text-base leading-relaxed mb-8">
              We will review your assessment and contact you soon. Your wellness journey is about to begin!
            </p>
            <a
              href="/"
              className="inline-flex rounded-full bg-primary px-8 py-3 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
            >
              Back to Home
            </a>
          </motion.div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageNavbar />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 bg-cream">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mx-auto mb-5">
              <ClipboardList size={24} className="text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3">
              Free Wellness Assessment
            </h1>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              Take a few minutes to reflect on your current wellbeing. We'll use your answers to create a personalized wellness roadmap.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            {/* Name & Email */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Full Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  className="font-body"
                  required
                />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@email.com"
                  className="font-body"
                  required
                />
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-3 block">
                Stress Level: <span className="text-primary font-semibold">{form.stressLevel}/10</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={form.stressLevel}
                onChange={(e) => update("stressLevel", parseInt(e.target.value))}
                className="w-full accent-primary h-2"
              />
              <div className="flex justify-between font-body text-xs text-muted-foreground mt-1">
                <span>Low stress</span>
                <span>High stress</span>
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-3 block">Sleep Quality</label>
              <div className="flex flex-wrap gap-2">
                {sleepOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update("sleepQuality", opt)}
                    className={`px-4 py-2 rounded-full font-body text-sm transition-colors border ${
                      form.sleepQuality === opt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Work-Life Balance */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-3 block">Work-Life Balance</label>
              <div className="flex flex-wrap gap-2">
                {balanceOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update("workLifeBalance", opt)}
                    className={`px-4 py-2 rounded-full font-body text-sm transition-colors border ${
                      form.workLifeBalance === opt
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Goal */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-2 block">
                What is your main goal for wellness?
              </label>
              <Textarea
                value={form.mainGoal}
                onChange={(e) => update("mainGoal", e.target.value)}
                placeholder="Describe what you'd like to achieve on your wellness journey…"
                className="font-body min-h-[120px]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="rounded-full gap-2 px-8 py-3 w-full sm:w-auto"
            >
              <Send size={16} />
              {loading ? "Submitting…" : "Submit Assessment"}
            </Button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WellnessAssessmentPage;
