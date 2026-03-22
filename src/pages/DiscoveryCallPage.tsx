import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Send, Phone, Clock, Lightbulb } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/components/ui/sonner";

const topicOptions = [
  "Stress Management",
  "Mental Health",
  "Physical Wellness",
  "Lifestyle Balance",
  "Therapy / Counseling",
  "Other",
];

const timeSlots = [
  "Morning (6 AM – 12 PM)",
  "Afternoon (12 PM – 5 PM)",
  "Evening (5 PM – 9 PM)",
];

const DiscoveryCallPage = () => {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get("topic") || "";
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: auth.currentUser?.email || "",
    topic: initialTopic,
    customTopic: "",
    message: "",
    preferredTime: "",
    preferredDateTime: "",
  });

  // Sync with search params if they change
  useEffect(() => {
    const topicParam = searchParams.get("topic");
    if (topicParam) {
      setForm(prev => ({ ...prev, topic: topicParam }));
    }
  }, [searchParams]);

  // Handle dynamic time slots based on selected date
  useEffect(() => {
    if (!form.preferredDateTime) return;
    
    const date = new Date(form.preferredDateTime);
    const day = date.getDay(); // 0 for Sunday
    const isSunday = day === 0;

    if (!isSunday) {
      // If not Sunday, only 'Evening' is valid.
      // Check if current selection is invalid
      if (form.preferredTime && !form.preferredTime.includes("Evening") && form.preferredTime !== "Flexible") {
        setForm(prev => ({ ...prev, preferredTime: "Evening (5 PM – 9 PM)" }));
      }
    }
  }, [form.preferredDateTime]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = form.topic === "Other" ? form.customTopic : form.topic;
    if (!form.name || !form.email || !finalTopic || !form.message || (!form.preferredTime && !form.preferredDateTime)) {
      toast("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const emailLower = form.email.toLowerCase();
      const initialMessage = {
        id: crypto.randomUUID(),
        sender: "user",
        text: form.message,
        timestamp: new Date(),
        senderName: form.name,
        read: true
      };
      
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast("You must be logged in to book a call.");
        return;
      }
      
      const dateVal = form.preferredDateTime || new Date().toISOString().split('T')[0];
      const timeSlotVal = form.preferredTime || "Flexible";
      
      await addDoc(collection(db, "discovery_requests"), {
        user_id: userId,
        name: form.name,
        topic: finalTopic,
        message: form.message,
        messages: [initialMessage],
        lastMessagePreview: form.message,
        lastMessageAt: serverTimestamp(),
        // New data structure
        selected_date: dateVal,
        selected_time_slot: timeSlotVal,
        preferredTime: timeSlotVal === "Flexible" ? `Flexible (@ ${dateVal})` : `${dateVal} @ ${timeSlotVal}`, // Maintain for UI
        status: "pending",
        isRead: false,
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
              Request Received!
            </h2>
            <p className="font-body text-muted-foreground text-base leading-relaxed mb-8">
              Thank you for booking a discovery call. We'll review your request and get back to you soon to confirm the details.
            </p>
            <a
              href="/home"
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
              <Phone size={24} className="text-primary" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3">
              Book a Discovery Call
            </h1>
            <p className="font-body text-muted-foreground max-w-lg mx-auto">
              A free, no-pressure conversation to explore how Melodia can support your path to balance and vitality.
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

            {/* Topic - What do you want help with? */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-3 block">
                What do you want help with?
              </label>
              
              {initialTopic ? (
                <div className="rounded-2xl bg-primary/5 p-4 border border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Lightbulb size={18} />
                    </div>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">Selected Focus</p>
                      <p className="font-body text-xs text-muted-foreground">{form.topic}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[10px] rounded-full text-muted-foreground hover:text-primary"
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete("topic");
                      window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
                      update("topic", "");
                    }}
                  >
                    Change Focus
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {topicOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => update("topic", opt)}
                        className={`px-4 py-2 rounded-full font-body text-sm transition-colors border ${
                          form.topic === opt
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Custom topic input for "Other" */}
                  {form.topic === "Other" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-3"
                    >
                      <Input
                        value={form.customTopic}
                        onChange={(e) => update("customTopic", e.target.value)}
                        placeholder="Please specify your topic…"
                        className="font-body"
                        required
                      />
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-2 block">
                Tell us more about what you're looking for
              </label>
              <Textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Share any details about your current situation or what you'd like to achieve…"
                className="font-body min-h-[120px]"
                required
              />
            </div>

            {/* Preferred Time */}
            <div>
              <label className="font-body text-sm font-medium text-foreground mb-3 block">
                <Clock size={14} className="inline mr-1.5 -mt-0.5" />
                Select a Time Slot
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {timeSlots.filter(slot => {
                  if (!form.preferredDateTime) return true; // Show all if no date yet
                  const date = new Date(form.preferredDateTime);
                  const isSunday = date.getDay() === 0;
                  if (!isSunday) return slot.includes("Evening");
                  return true;
                }).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => update("preferredTime", slot)}
                    className={`px-4 py-2 rounded-full font-body text-sm transition-colors border ${
                      form.preferredTime === slot
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Flexible Date Picker */}
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="font-body text-xs text-muted-foreground mb-2">
                  Pick your flexible date:
                </p>
                <input
                  type="date"
                  value={form.preferredDateTime}
                  onChange={(e) => {
                    update("preferredDateTime", e.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="rounded-full gap-2 px-8 py-3 w-full sm:w-auto"
            >
              <Send size={16} />
              {loading ? "Submitting…" : "Book Discovery Call"}
            </Button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DiscoveryCallPage;
