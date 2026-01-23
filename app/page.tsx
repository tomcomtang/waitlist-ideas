"use client";

import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";
import WaitlistForm from "@/components/waitlist-form";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import CanvasBackground from "@/components/canvas-background";
import SubscriptionSection from "@/components/subscription-section";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // 检查 Name 是否为空
    if (!name || name.trim() === "") {
      toast.error("Please enter your name");
      return;
    }

    // 检查 Email 是否为空
    if (!email || email.trim() === "") {
      toast.error("Please enter your email address");
      return;
    }

    // 检查邮箱格式是否正确
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        // 直接提交到 Notion（邮件发送功能暂时跳过）
        const notionResponse = await fetch("/api/notion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        });

        if (!notionResponse.ok) {
          if (notionResponse.status === 429) {
            reject("Rate limited");
          } else {
            // 尝试获取详细的错误信息
            try {
              const errorData = await notionResponse.json();
              reject(errorData.error || "Notion insertion failed");
            } catch {
              reject("Notion insertion failed");
            }
          }
        } else {
          resolve({ name });
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Adding you to the waitlist...",
      success: (data) => {
        setName("");
        setEmail("");
        return "Welcome to the waitlist! ";
      },
      error: (error) => {
        if (error === "Rate limited") {
          return "Too many requests. Please try again later";
        } else if (typeof error === "string" && error.includes("Database not found")) {
          return "Database configuration error. Please contact support.";
        } else if (typeof error === "string" && error.includes("Unauthorized")) {
          return "Authentication error. Please contact support.";
        } else if (typeof error === "string") {
          return error;
        }
        return "Failed to save your details. Please try again";
      },
    });

    promise.finally(() => {
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center overflow-x-hidden relative">
      <CanvasBackground />

      <section className="flex flex-1 w-full flex-col items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <HeroSection />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <SubscriptionSection
              name={name}
              email={email}
              handleNameChange={handleNameChange}
              handleEmailChange={handleEmailChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </motion.div>

        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
