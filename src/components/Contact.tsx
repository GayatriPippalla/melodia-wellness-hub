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
    <section id="contact" className="py-24 md:py-36 bg-background relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-sage-light/15 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-sand-light/30 blur-[80px] -z-10" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-body text-xs uppercase tracking-[0.2em] text-accent-foreground">Get in Touch</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8 leading-tight">
              Let's start your <span className="italic gradient-text">journey</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-300"
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-300"
              />
              <textarea
                rows={4}
                placeholder="Tell me about your wellness goals..."
                required
                className="w-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none transition-all duration-300"
              />
              <button
                type="submit"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 font-body text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-glow hover:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Send size={16} />
                  Send Message
                </span>
                <div className="absolute inset-0 bg-sage-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
          </motion.div>

          {/* Info + Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="space-y-5 mb-12">
                {[
                  { icon: Mail, text: "hello@melodiawellness.com" },
                  { icon: Phone, text: "+1 (555) 234-5678" },
                  { icon: MapPin, text: "Austin, TX — Virtual & In-Person" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <span className="font-body text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="font-display text-2xl text-foreground mb-2">Join the Newsletter</h3>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Weekly wellness tips, guided meditations, and exclusive offers — delivered with love.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 rounded-full border border-border bg-background/80 px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary px-6 py-3.5 font-body text-sm font-medium text-primary-foreground hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
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
