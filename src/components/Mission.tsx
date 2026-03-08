import { motion } from "framer-motion";
import { Music } from "lucide-react";

const Mission = () => (
  <section id="mission" className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-6">
          <Music size={24} className="text-primary" />
        </div>
        <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">Our Mission</p>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-snug mb-8 italic">
          "At Melodia Wellness, we create a symphony of wellness, empowering you to find balance, peace, and harmony. Tune into your inner rhythm for a life of vibrant health and happiness."
        </h2>
        <div className="w-16 h-px bg-primary/30 mx-auto" />
      </motion.div>
    </div>
  </section>
);

export default Mission;
