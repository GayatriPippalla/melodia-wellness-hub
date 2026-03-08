import { motion } from "framer-motion";
import heroImg from "@/assets/hero-wellness.jpg";

const Hero = () => (
  <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroImg} alt="Peaceful wellness scene" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-background/60" />
    </div>

    <div className="container relative mx-auto px-4 md:px-8 pt-24 pb-16">
      <div className="max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-body text-sm uppercase tracking-[0.25em] text-muted-foreground mb-4"
        >
          Holistic Wellness Coaching
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] text-foreground mb-6"
        >
          Tune into <br />
          <span className="italic font-normal text-primary">your wellness</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="font-body text-lg text-muted-foreground max-w-md mb-10 leading-relaxed"
        >
          Reclaim balance, clarity, and vitality through personalized coaching rooted in mind-body harmony.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#contact"
            className="rounded-full bg-primary px-8 py-3.5 text-center font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
          >
            Book a Discovery Call
          </a>
          <a
            href="#assessment"
            className="rounded-full border border-foreground/20 px-8 py-3.5 text-center font-body text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Free Wellness Assessment
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
