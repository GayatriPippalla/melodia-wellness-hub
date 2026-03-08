import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CallToAction = () => (
  <section className="py-24 md:py-32 bg-sage-light">
    <div className="container mx-auto px-4 md:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto"
      >
        <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">Take the First Step</p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight mb-6">
          Start transforming your health <span className="italic">today</span>.
        </h2>
        <p className="font-body text-muted-foreground mb-10 max-w-md mx-auto">
          Your journey to a balanced, vibrant life begins with a single step. Let Melodia guide you there.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
          >
            Book a Discovery Call
            <ArrowRight size={16} />
          </a>
          <a
            href="#assessment"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-8 py-4 font-body text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Get Free Wellness Assessment
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CallToAction;
