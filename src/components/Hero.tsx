import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
const Hero = () => {

  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-5 py-2 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Melodia Wellness
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl sm:text-7xl md:text-8xl font-light mb-6 tracking-tighter leading-[1.05]"
          >
            Tune into the <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Wellness</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed"
          >
            Discover balance, peace, and harmony in your life through holistic wellness coaching.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/services">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Book a Discovery Call
              </Button>
            </a>
            <a href="/assessment">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-full px-8 py-6 text-sm font-medium backdrop-blur-sm bg-background/50 hover:bg-background/80 border border-border/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Get Free Assessment</span>
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
