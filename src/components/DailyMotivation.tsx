import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Quote, BookOpen, Sparkles } from "lucide-react";
import natureImg from "@/assets/nature-calm.jpg";

const quotes = [
  { text: "The body heals with play, the mind heals with laughter, and the spirit heals with joy.", author: "Proverb" },
  { text: "Almost everything will work again if you unplug it for a few minutes — including you.", author: "Anne Lamott" },
  { text: "Wellness is the complete integration of body, mind, and spirit.", author: "Greg Anderson" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Nourishing yourself in a way that helps you blossom is attainable, and you are worth the effort.", author: "Deborah Day" },
  { text: "The greatest wealth is health.", author: "Virgil" },
  { text: "Self-care is not selfish. You cannot serve from an empty vessel.", author: "Eleanor Brown" },
];

const features = [
  { icon: Quote, title: "Daily Quotes", desc: "Handpicked wellness quotes to inspire your morning routine." },
  { icon: Sparkles, title: "Affirmations", desc: "Positive affirmations to rewire your mindset for success." },
  { icon: BookOpen, title: "Uplifting Stories", desc: "Real transformation stories from our wellness community." },
];

const DailyMotivation = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const today = new Date();
    setIndex((today.getDate() + today.getMonth()) % quotes.length);
  }, []);

  const refresh = () => setIndex((prev) => (prev + 1) % quotes.length);
  const quote = quotes[index];

  return (
    <section id="motivation" className="relative overflow-hidden">
      {/* Quote banner */}
      <div className="relative py-28 md:py-36">
        <div className="absolute inset-0">
          <img src={natureImg} alt="Calm nature" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-sage-dark/80 via-sage-dark/70 to-sage-dark/85" />
        </div>

        <div className="container relative mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-warm-white/10 backdrop-blur-sm border border-warm-white/10 px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-sand-light animate-pulse-soft" />
              <span className="font-body text-xs uppercase tracking-[0.2em] text-sand-light/80">Daily Motivation</span>
            </div>

            <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl font-light italic text-warm-white max-w-3xl mx-auto leading-snug mb-6">
              "{quote.text}"
            </blockquote>
            <p className="font-body text-sand-light/70 text-sm mb-10">— {quote.author}</p>
            <button
              onClick={refresh}
              className="group inline-flex items-center gap-2 rounded-full bg-warm-white/10 backdrop-blur-sm border border-warm-white/15 px-7 py-3 font-body text-sm text-sand-light hover:bg-warm-white/20 transition-all duration-300"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              New Quote
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-background py-20 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-sage-light/15 blur-[80px] -z-10" />
        <div className="container mx-auto px-4 md:px-8">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center font-body text-muted-foreground max-w-xl mx-auto mb-14 leading-relaxed"
          >
            Every day, Melodia brings you curated quotes, powerful affirmations, and uplifting stories to keep you motivated on your wellness journey.
          </motion.p>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="text-center group"
              >
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-5 group-hover:shadow-glow transition-all duration-500">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyMotivation;
