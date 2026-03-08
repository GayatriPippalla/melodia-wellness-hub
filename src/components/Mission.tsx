import { motion } from "framer-motion";
import { Music } from "lucide-react";

const Mission = () => (
  <section id="mission" className="py-24 md:py-36 bg-background relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sage-light/15 blur-[120px] -z-10" />

    <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-8"
        >
          <Music size={26} className="text-primary" />
        </motion.div>

        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-body text-xs uppercase tracking-[0.2em] text-accent-foreground">Our Mission</span>
        </div>

        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-snug mb-10 italic">
          "At Melodia Wellness, we create a symphony of wellness, empowering you to find balance, peace, and harmony. Tune into your inner rhythm for a life of vibrant health and happiness."
        </h2>

        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-primary/30" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <div className="w-12 h-px bg-primary/30" />
        </div>
      </motion.div>
    </div>
  </section>
);

export default Mission;
