import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const questions = [
  {
    q: "How would you describe your current stress level?",
    options: ["Low — I feel calm most days", "Moderate — manageable but present", "High — it's affecting my daily life", "Overwhelmed — I need support now"],
  },
  {
    q: "How well are you sleeping?",
    options: ["Great — 7-9 hours of restful sleep", "Okay — some restless nights", "Poor — I struggle to fall or stay asleep", "Very poor — sleep deprivation is a concern"],
  },
  {
    q: "How often do you move your body intentionally?",
    options: ["Daily", "3-4 times a week", "Once a week or less", "Rarely"],
  },
  {
    q: "How connected do you feel to your sense of purpose?",
    options: ["Very connected", "Somewhat connected", "Searching for it", "Completely disconnected"],
  },
];

const WellnessAssessment = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const handleSelect = (optIdx: number) => {
    const newAnswers = [...answers, optIdx];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setDone(false);
  };

  return (
    <section id="assessment" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-body text-sm uppercase tracking-[0.2em] text-primary mb-3">Free Assessment</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
            Wellness <span className="italic">check-in</span>
          </h2>
          <p className="font-body text-muted-foreground mt-4">
            Answer a few questions to discover where you stand — and how coaching can help.
          </p>
        </motion.div>

        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-3xl p-8 md:p-12"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-body text-xs text-muted-foreground">
                Question {step + 1} of {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-1.5 rounded-full transition-colors ${
                      i <= step ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="font-display text-2xl text-foreground mb-8">{questions[step].q}</h3>

            <div className="space-y-3">
              {questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="w-full text-left rounded-2xl border border-border p-4 font-body text-sm text-foreground hover:border-primary hover:bg-sage-light/30 transition-all flex items-center justify-between group"
                >
                  {opt}
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-8 md:p-12 text-center"
          >
            <CheckCircle2 size={48} className="mx-auto text-primary mb-4" />
            <h3 className="font-display text-3xl text-foreground mb-4">Assessment Complete!</h3>
            <p className="font-body text-muted-foreground mb-8 max-w-md mx-auto">
              Based on your responses, a personalized coaching plan could help you find more balance and vitality. Let's connect to discuss your results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="rounded-full bg-primary px-8 py-3.5 font-body text-sm font-medium text-primary-foreground hover:bg-sage-dark transition-colors"
              >
                Book a Discovery Call
              </a>
              <button
                onClick={reset}
                className="rounded-full border border-border px-8 py-3.5 font-body text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                Retake Assessment
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default WellnessAssessment;
