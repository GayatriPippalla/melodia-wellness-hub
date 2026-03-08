import { motion } from "framer-motion";
import { Heart, Brain, Leaf, Sun } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "1-on-1 Coaching",
    desc: "Personalized sessions to address your unique goals, from stress management to lifestyle transformation.",
  },
  {
    icon: Brain,
    title: "Mindfulness & Meditation",
    desc: "Guided practices to cultivate inner peace, sharpen focus, and build emotional resilience.",
  },
  {
    icon: Leaf,
    title: "Nutrition Guidance",
    desc: "Holistic nutrition plans that nourish your body and support sustainable, feel-good habits.",
  },
  {
    icon: Sun,
    title: "Energy & Movement",
    desc: "Gentle movement routines and breathwork to restore your natural energy flow and vitality.",
  },
];

const Services = () => (
  <section id="services" className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl mx-auto mb-16"
      >
        <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">Services</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
          How I can <span className="italic">support</span> you
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group bg-card rounded-3xl p-8 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-2xl bg-sage-light flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <s.icon size={22} className="text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-12"
      >
        <a
          href="#contact"
          className="inline-flex rounded-full bg-primary px-8 py-3.5 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
        >
          Book a Discovery Call
        </a>
      </motion.div>
    </div>
  </section>
);

export default Services;
