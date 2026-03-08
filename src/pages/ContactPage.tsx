import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageCircle, CheckCircle } from "lucide-react";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const ContactPage = () => {
  const [formSent, setFormSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      if (error) throw error;
      setFormSent(true);
    } catch (err: any) {
      toast("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast("Please enter your email.");
      return;
    }
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email: newsletterEmail });
      if (error) {
        if (error.code === "23505") {
          toast("You're already subscribed!");
        } else {
          throw error;
        }
      }
      setSubscribed(true);
      toast("You're subscribed! Welcome to the Melodia community.");
    } catch (err: any) {
      toast("Something went wrong. Please try again.");
      console.error(err);
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
          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-3"
            >
              {formSent ? (
                <div className="rounded-2xl border border-border bg-card p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={30} className="text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-2">Message Sent!</h3>
                  <p className="font-body text-muted-foreground">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="rounded-2xl border border-border bg-card p-8 md:p-10 space-y-6">
                  <h2 className="font-display text-2xl font-semibold text-foreground mb-1">Send a Message</h2>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    Fill in the form below and we'll respond within 24 hours.
                  </p>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">Name</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="font-body"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                      className="font-body"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">Message</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help you on your wellness journey?"
                      className="font-body min-h-[140px]"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="rounded-full gap-2 px-8">
                    <Send size={16} />
                    {loading ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Newsletter */}
              <div className="rounded-2xl bg-sage-light p-8">
                <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center mb-4">
                  <Mail size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Weekly Wellness Tips</h3>
                <p className="font-body text-sm text-muted-foreground mb-5">
                  Get curated wellness tips, affirmations, and mindful insights delivered to your inbox every week.
                </p>

                {subscribed ? (
                  <div className="flex items-center gap-2 font-body text-sm text-primary">
                    <CheckCircle size={16} />
                    You're subscribed!
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
                    <Button type="submit" className="rounded-full w-full gap-2 text-sm">
                      <Mail size={14} />
                      Join My Newsletter for Weekly Tips
                    </Button>
                  </form>
                )}
              </div>

              {/* Quick info */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">Get in Touch</h3>
                <div className="space-y-4 font-body text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-0.5">Email</p>
                    <p>hello@melodiawellness.com</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">Response Time</p>
                    <p>Within 24 hours</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">Discovery Call</p>
                    <p>Free 15-minute consultation</p>
                  </div>
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
