import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        initial={{ rotate: -10, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`${showText ? "w-10 h-10 md:w-12 md:h-12" : "w-full h-full"} relative flex items-center justify-center`}
      >
        <div className="w-full h-full relative overflow-hidden rounded-full bg-[#70012b]">
          <img 
            src="/logo-symbol.jpg" 
            alt="Melodia Logo" 
            className="w-full h-full object-cover scale-[1.05]"
          />
        </div>
      </motion.div>
      {showText && (
        <span className="font-display text-2xl md:text-3xl font-semibold tracking-wide text-foreground">
          Melodia
        </span>
      )}
    </div>
  );
};

export default Logo;
