import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Welcome to the Melodia community! ✨");
    setEmail("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! I'll get back to you within 24 hours.");
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">Get in Touch</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight">
              Let's start your <span className="italic">journey</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  className="rounded-2xl border border-border bg-card px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  className="rounded-2xl border border-border bg-card px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                rows={4}
                placeholder="Tell me about your wellness goals..."
                required
                className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
              >
                <Send size={16} />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Info + Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="space-y-6 mb-12">
                {[
                  { icon: Mail, text: "hello@melodiawellness.com" },
                  { icon: Phone, text: "+1 (555) 234-5678" },
                  { icon: MapPin, text: "Austin, TX — Virtual & In-Person" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <span className="font-body text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-card rounded-3xl p-8">
              <h3 className="font-display text-2xl text-foreground mb-2">Join the Newsletter</h3>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Weekly wellness tips, guided meditations, and exclusive offers — delivered with love.
              </p>
              <form onSubmit={handleNewsletter} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 rounded-full border border-border bg-background px-5 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
