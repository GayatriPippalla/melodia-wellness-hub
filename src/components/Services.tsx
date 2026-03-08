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
  <section id="services" className="py-24 md:py-32 bg-cream">
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
          How we can <span className="italic">support</span> you
        </h2>
        <p className="font-body text-muted-foreground mt-4">
          Comprehensive wellness services designed to nurture every dimension of your well-being.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group bg-card rounded-3xl p-8 hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-sage-light flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
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
