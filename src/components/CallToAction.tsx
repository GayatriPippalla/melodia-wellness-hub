import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const CallToAction = () => (
  <section className="py-24 md:py-36 relative overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-sage-light via-accent to-sand-light" />
    <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sand/20 blur-[80px]" />

    <div className="container relative mx-auto px-4 md:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-6"
        >
          <Sparkles size={22} className="text-primary" />
        </motion.div>

        <div className="inline-flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-sm px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Take the First Step</span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight mb-6">
          Start transforming your health <span className="italic gradient-text">today</span>.
        </h2>
        <p className="font-body text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
          Your journey to a balanced, vibrant life begins with a single step. Let Melodia guide you there.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 font-body text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-glow hover:scale-[1.02]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Book a Discovery Call
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-sage-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a
            href="/assessment"
            className="inline-flex items-center justify-center gap-2 rounded-full glass px-8 py-4 font-body text-sm font-medium text-foreground hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]"
          >
            Get Free Wellness Assessment
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CallToAction;
