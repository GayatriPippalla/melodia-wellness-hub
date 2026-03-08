import { motion } from "framer-motion";
import coachImg from "@/assets/coach-portrait.jpg";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const About = () => (
  <section id="about" className="py-24 md:py-32 bg-cream">
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden aspect-[4/5]">
            <img src={coachImg} alt="Melodia wellness coach" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-sage-light hidden md:block" />
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">About Melodia</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
            Your journey to <span className="italic">wholeness</span> starts here
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed mb-6">
            At Melodia Wellness, we believe true well-being is a harmonious blend of mind, body, and spirit. Our holistic approach draws from time-tested practices and modern science to guide you toward lasting transformation.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            We meet you exactly where you are — with compassion, expertise, and a personalized plan designed to help you rediscover your inner rhythm and live a life filled with vitality and purpose.
          </p>
          <div className="flex gap-12">
            {[
              { num: "500+", label: "Clients Guided" },
              { num: "8+", label: "Years Experience" },
              { num: "95%", label: "Client Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-semibold text-primary">{stat.num}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;
