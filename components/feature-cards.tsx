"use client";

import { motion } from "framer-motion";
import { Bell, Users, Gift, Shield } from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Early Notifications",
    description: "Be the first to know when we launch. Get instant updates on new features and releases.",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Connect with like-minded individuals and be part of an exclusive community of innovators.",
  },
  {
    icon: Gift,
    title: "Exclusive Benefits",
    description: "Enjoy special perks, discounts, and early access to premium features reserved for waitlist members.",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "Get dedicated support and have your voice heard in shaping the future of our platform.",
  },
];

export default function FeatureCards() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
