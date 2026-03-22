import { motion } from "framer-motion";
import { Feather } from "lucide-react";
import { useEffect, useState } from "react";

interface FeatherConfig {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  rotationDirection: number;
  swayAmount: number;
}

const FallingFeathers = () => {
  const [feathers, setFeathers] = useState<FeatherConfig[]>([]);

  useEffect(() => {
    // Generate pseudo-random feathers on mount
    const newFeathers = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 20 + Math.random() * 24,
      duration: 15 + Math.random() * 15, // 15s to 30s
      delay: -(Math.random() * 25), // random starting point
      opacity: 0.1 + Math.random() * 0.3,
      rotationDirection: Math.random() > 0.5 ? 1 : -1,
      swayAmount: 5 + Math.random() * 10,
    }));
    setFeathers(newFeathers);
  }, []);

  if (feathers.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {feathers.map((f) => (
        <motion.div
          key={f.id}
          className="absolute text-primary"
          style={{ opacity: f.opacity }}
          initial={{
            top: "-10%",
            left: `${f.x}%`,
            rotate: 0,
          }}
          animate={{
            top: "110%",
            left: [`${f.x}%`, `${f.x - f.swayAmount}%`, `${f.x + f.swayAmount}%`, `${f.x}%`],
            rotate: 360 * f.rotationDirection,
          }}
          transition={{
            top: {
              duration: f.duration,
              repeat: Infinity,
              ease: "linear",
              delay: f.delay,
            },
            left: {
              duration: f.duration * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: f.delay,
            },
            rotate: {
              duration: f.duration * 0.8,
              repeat: Infinity,
              ease: "linear",
              delay: f.delay,
            }
          }}
        >
          <Feather size={f.size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};

export default FallingFeathers;
