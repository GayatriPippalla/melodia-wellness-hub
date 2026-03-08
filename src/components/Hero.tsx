import { motion } from "framer-motion";
import heroImg from "@/assets/hero-wellness.jpg";

const Hero = () => (
  <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
    {/* Background with parallax-style overlay */}
    <div className="absolute inset-0">
      <img
        src={heroImg}
        alt="Peaceful wellness scene"
        className="w-full h-full object-cover scale-105"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
    </div>

    {/* Floating decorative elements */}
    <div className="absolute top-32 right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float hidden lg:block" />
    <div className="absolute bottom-40 left-10 w-48 h-48 rounded-full bg-sage-light/20 blur-2xl animate-float hidden lg:block" style={{ animationDelay: '2s' }} />

    <div className="container relative mx-auto px-4 md:px-8 pt-24 pb-16">
      <div className="max-w-2xl mx-auto text-center md:text-left md:mx-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full glass px-5 py-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
          <span className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">Melodia Wellness</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] text-foreground mb-6"
        >
          Tune into the{" "}
          <span className="italic font-normal gradient-text">Wellness</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed md:mx-0 mx-auto"
        >
          Discover balance, peace, and harmony in your life through holistic wellness coaching.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
        >
          <a
            href="/contact"
            className="group relative overflow-hidden rounded-full bg-primary px-8 py-4 text-center font-body text-sm font-medium text-primary-foreground transition-all duration-300 hover:shadow-glow hover:scale-[1.02]"
          >
            <span className="relative z-10">Book a Discovery Call</span>
            <div className="absolute inset-0 bg-sage-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a
            href="/assessment"
            className="rounded-full glass px-8 py-4 text-center font-body text-sm font-medium text-foreground hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]"
          >
            Get Free Wellness Assessment
          </a>
        </motion.div>
      </div>
    </div>

    {/* Bottom gradient fade */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
  </section>
);

export default Hero;
