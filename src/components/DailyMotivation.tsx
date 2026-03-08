import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
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

const DailyMotivation = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const today = new Date();
    setIndex((today.getDate() + today.getMonth()) % quotes.length);
  }, []);

  const refresh = () => setIndex((prev) => (prev + 1) % quotes.length);
  const quote = quotes[index];

  return (
    <section id="motivation" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={natureImg} alt="Calm nature" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-sage-dark/70" />
      </div>

      <div className="container relative mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-sm uppercase tracking-[0.25em] text-sage-light mb-4">Daily Motivation</p>
          <blockquote className="font-display text-3xl md:text-5xl font-light italic text-warm-white max-w-3xl mx-auto leading-snug mb-6">
            "{quote.text}"
          </blockquote>
          <p className="font-body text-sand text-sm mb-8">— {quote.author}</p>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-full border border-sand-light/30 px-6 py-2.5 font-body text-sm text-sand-light hover:bg-sand-light/10 transition-colors"
          >
            <RefreshCw size={14} />
            New Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default DailyMotivation;
