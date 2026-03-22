import { motion } from "framer-motion";
import {
  ClipboardList,
  Brain,
  Target,
  Users,
  Flower2,
  HeartPulse,
  Compass,
  Search,
  Leaf,
  HeartHandshake,
  Briefcase,
  ArrowRight,
  Phone,
} from "lucide-react";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: ClipboardList,
    title: "Personalized Wellness Planning",
    desc: "Custom health blueprints tailored to your unique lifestyle, goals, and body's needs for lasting transformation.",
  },
  {
    icon: Brain,
    title: "Stress Management Techniques",
    desc: "Evidence-based strategies to manage stress, build resilience, and bring calm back into your everyday life.",
  },
  {
    icon: Target,
    title: "Goal Setting",
    desc: "Define clear, achievable milestones that keep you inspired and moving toward your wellness vision.",
  },
  {
    icon: Users,
    title: "Accountability Coaching",
    desc: "Consistent check-ins and support to help you stay on track, celebrate wins, and navigate setbacks.",
  },
  {
    icon: Flower2,
    title: "Mindfulness Training",
    desc: "Guided practices to cultivate present-moment awareness, emotional clarity, and inner stillness.",
  },
  {
    icon: HeartPulse,
    title: "Self-Care Strategies",
    desc: "Practical routines and rituals that nourish your body, mind, and spirit — without the guilt.",
  },
  {
    icon: Briefcase,
    title: "Career Guidance",
    desc: "Align your professional path with your personal values for a career that energizes rather than drains you.",
  },
  {
    icon: Search,
    title: "Self Exploration",
    desc: "Deep-dive exercises and reflection to uncover your strengths, passions, and authentic self.",
  },
  {
    icon: Leaf,
    title: "Natural Acceptance",
    desc: "Learn to embrace your journey with compassion, letting go of perfectionism and welcoming growth.",
  },
  {
    icon: HeartHandshake,
    title: "Counselling",
    desc: "Supportive, confidential sessions to help you process challenges and unlock your full potential.",
  },
  {
    icon: Compass,
    title: "Lifestyle Coaching",
    desc: "Holistic guidance on nutrition, movement, sleep, and daily habits for a balanced, vibrant life.",
  },
];

const ServicesPage = () => (
  <div className="min-h-screen bg-background">
    <PageNavbar />

    {/* Page Header */}
    <div className="relative h-auto pt-16 pb-8 md:pt-24 md:pb-12 overflow-hidden bg-[#D8C7CC]">
      {/* Static decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF]/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#F5ECE9]/30 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 text-center mt-4 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-2"
        >
          What We Offer
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight"
        >
          Our <span className="italic text-primary">Services</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-body text-muted-foreground mt-3 max-w-lg mx-auto"
        >
          Comprehensive wellness services designed to nurture every dimension of your well-being.
        </motion.p>
      </div>
    </div>

    {/* Service Cards Grid */}
    <section className="pt-8 pb-20 md:pt-12 md:pb-28 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group bg-card rounded-3xl p-8 flex flex-col hover:shadow-xl transition-all hover:-translate-y-1 border border-transparent hover:border-primary/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <s.icon
                  size={24}
                  className="text-primary group-hover:text-primary-foreground transition-colors"
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {s.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                {s.desc}
              </p>
              <a
                href={`/discovery?topic=${encodeURIComponent(s.title)}`}
                className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:text-sage-dark transition-colors group/btn"
              >
                Book Session
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover/btn:translate-x-1"
                />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Bottom CTA */}
    <section className="py-24 md:py-32 bg-sage-light">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mx-auto mb-6">
            <Phone size={24} className="text-primary" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-5">
            Book a discovery call to start your wellness{" "}
            <span className="italic">journey</span>.
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto mb-10">
            A free, no-pressure conversation to explore how Melodia can support
            your path to balance and vitality.
          </p>
          <a
            href="/discovery"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
          >
            Book a Discovery Call
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default ServicesPage;
