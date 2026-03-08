import { motion } from "framer-motion";
import coachImg from "@/assets/coach-portrait.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const About = () => (
  <section id="about" className="py-24 md:py-36 bg-background relative overflow-hidden">
    {/* Decorative background */}
    <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-sage-light/30 blur-[100px] -z-10" />
    <div className="absolute bottom-20 left-0 w-[400px] h-[400px] rounded-full bg-sand-light/40 blur-[80px] -z-10" />

    <div className="container mx-auto px-4 md:px-8">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="rounded-4xl overflow-hidden aspect-[4/5] shadow-elevated">
            <img
              src={coachImg}
              alt="Melodia wellness coach"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
          {/* Floating accent card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-6 -right-4 md:-right-8 glass-card rounded-2xl p-5 hidden md:block"
          >
            <p className="font-display text-3xl font-semibold gradient-text">500+</p>
            <p className="font-body text-xs text-muted-foreground">Lives Transformed</p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-body text-xs uppercase tracking-[0.2em] text-accent-foreground">About Melodia</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
            Your journey to <span className="italic gradient-text">wholeness</span> starts here
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-6">
            At Melodia Wellness, we believe true well-being is a harmonious blend of mind, body, and spirit. Our holistic approach draws from time-tested practices and modern science to guide you toward lasting transformation.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed mb-10">
            We meet you exactly where you are — with compassion, expertise, and a personalized plan designed to help you rediscover your inner rhythm.
          </p>

          <div className="flex gap-8 md:gap-12">
            {[
              { num: "500+", label: "Clients Guided" },
              { num: "8+", label: "Years Experience" },
              { num: "95%", label: "Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-semibold gradient-text">{stat.num}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;
