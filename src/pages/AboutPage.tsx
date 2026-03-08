import { motion } from "framer-motion";
import { Eye, Music, Leaf, Heart } from "lucide-react";
import PageNavbar from "@/components/PageNavbar";
import Footer from "@/components/Footer";
import founderImg from "@/assets/founder-story.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <PageNavbar />

    {/* Page Header */}
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-cream">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-body text-sm uppercase tracking-[0.25em] text-primary mb-4"
        >
          About Us
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight"
        >
          The Story of <span className="italic text-primary">Melodia</span>
        </motion.h1>
      </div>
    </section>

    {/* Vision */}
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-14 h-14 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-6">
            <Eye size={24} className="text-primary" />
          </div>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">Our Vision</p>
          <h2 className="font-display text-3xl md:text-4xl font-light italic text-foreground leading-snug mb-6">
            "To be a leading wellness sanctuary where individuals discover their true self and radiate wellness, inspiring a global rhythm of health and happiness."
          </h2>
          <div className="w-16 h-px bg-primary/30 mx-auto" />
        </motion.div>
      </div>
    </section>

    {/* Motto */}
    <section className="py-20 md:py-28 bg-sage-light">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mx-auto mb-6">
            <Music size={24} className="text-primary" />
          </div>
          <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-4">Our Motto</p>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-foreground">
            One Note at a <span className="italic">Time</span>
          </h2>
          <p className="font-body text-muted-foreground mt-6 max-w-md mx-auto">
            Just like a melody unfolds one note at a time, lasting wellness is built through small, intentional steps — each one bringing you closer to harmony.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Introduction */}
    <section className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-sage-light flex items-center justify-center mb-6">
              <Leaf size={22} className="text-primary" />
            </div>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">Who We Are</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
              A sanctuary for <span className="italic">your whole self</span>
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Melodia Wellness is a safe, nurturing space where mind, body, and spirit come together to create harmony. We believe that true wellness isn't about perfection — it's about finding your unique rhythm and honoring every part of who you are.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed">
              Here, you'll find a community built on compassion, understanding, and a shared commitment to growth. Whether you're taking your first step toward wellness or deepening an existing practice, Melodia is your home to heal, grow, and thrive.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "Holistic Approach", desc: "Mind, body, and spirit in harmony" },
              { label: "Safe Space", desc: "A judgment-free environment" },
              { label: "Personalized Care", desc: "Tailored to your unique journey" },
              { label: "Lasting Results", desc: "Sustainable transformation" },
            ].map((item) => (
              <div key={item.label} className="bg-card rounded-2xl p-6 text-center">
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{item.label}</h4>
                <p className="font-body text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Founder Story */}
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative order-2 md:order-1"
          >
            <div className="rounded-3xl overflow-hidden aspect-[4/5]">
              <img src={founderImg} alt="Melodia founder" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-5 w-28 h-28 rounded-full bg-sage-light hidden md:block" />
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-sand hidden md:block" />
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-sage-light flex items-center justify-center mb-6">
              <Heart size={22} className="text-primary" />
            </div>
            <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">Founder's Story</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
              From burnout to <span className="italic">inner balance</span>
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-5">
              A few years ago, I found myself running on empty. The relentless pace of modern life had left me exhausted, disconnected, and searching for something more. Burnout didn't arrive all at once — it crept in quietly, stealing my energy, my joy, and my sense of self.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-5">
              The turning point came when I stopped looking outward for answers and started listening inward. Through mindfulness, holistic nutrition, and gentle movement, I slowly rediscovered the rhythm that had always been within me — a melody of balance, peace, and purpose.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              That journey of transformation inspired Melodia Wellness. I created this space so that no one has to navigate the path to wellness alone. Every program, every session, every resource is born from my own experience of healing — and a deep desire to help others tune into their own inner harmony.
            </p>
            <a
              href="/#contact"
              className="inline-flex rounded-full bg-primary px-8 py-3.5 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
            >
              Let's Connect
            </a>
          </motion.div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default AboutPage;
