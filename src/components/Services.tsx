import { motion } from "framer-motion";
import { ClipboardList, Brain, Target, Flower2, Compass, HeartHandshake } from "lucide-react";

const services = [
  {
    icon: ClipboardList,
    title: "Personalized Wellness Planning",
    desc: "Custom health blueprints tailored to your unique lifestyle, goals, and body's needs.",
  },
  {
    icon: Brain,
    title: "Stress Management",
    desc: "Evidence-based techniques to manage stress, build resilience, and restore calm to your daily life.",
  },
  {
    icon: Target,
    title: "Goal Setting",
    desc: "Clear, achievable milestones that keep you motivated and on track toward your wellness vision.",
  },
  {
    icon: Flower2,
    title: "Mindfulness",
    desc: "Guided practices to cultivate present-moment awareness, inner peace, and emotional clarity.",
  },
  {
    icon: Compass,
    title: "Lifestyle Coaching",
    desc: "Holistic guidance on nutrition, movement, sleep, and habits for a balanced, vibrant life.",
  },
  {
    icon: HeartHandshake,
    title: "Counselling",
    desc: "Supportive, confidential sessions to help you navigate challenges and unlock your full potential.",
  },
];

const Services = () => (
  <section id="services" className="py-24 md:py-36 bg-cream relative overflow-hidden">
    {/* Decorative blurs */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-sage-light/20 blur-[100px] -z-10" />

    <div className="container mx-auto px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-body text-xs uppercase tracking-[0.2em] text-accent-foreground">Services</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
          How we can <span className="italic gradient-text">support</span> you
        </h2>
        <p className="font-body text-muted-foreground mt-4">
          Comprehensive wellness services designed to nurture every dimension of your well-being.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group glass-card rounded-3xl p-8 transition-all duration-500 hover:shadow-elevated hover:-translate-y-2 hover:bg-card"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-glow transition-all duration-500">
              <s.icon size={24} className="text-primary group-hover:text-primary-foreground transition-colors duration-500" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:gradient-text transition-all duration-300">{s.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center mt-14"
      >
        <a
          href="/contact"
          className="group relative inline-flex overflow-hidden rounded-full bg-primary px-8 py-4 font-body text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-glow hover:scale-[1.02]"
        >
          <span className="relative z-10">Book a Discovery Call</span>
          <div className="absolute inset-0 bg-sage-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </motion.div>
    </div>
  </section>
);

export default Services;
