"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Rocket } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="text-center space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
      >
        <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-shift_8s_ease_infinite]">
          Transform Your Ideas
        </span>
        <br />
        <span className="text-foreground">Into Reality</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
      >
        Join our exclusive waitlist and be among the first to experience the future of innovation. 
        Get early access to groundbreaking features, connect with a community of forward-thinkers, 
        and help shape the next generation of solutions. No spam, just updates on what matters.
      </motion.p>
    </div>
  );
}
