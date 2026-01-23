"use client";

import { ChangeEvent } from "react";
import { motion } from "framer-motion";

interface SubscriptionSectionProps {
  name: string;
  email: string;
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  loading: boolean;
}

export default function SubscriptionSection({
  name,
  email,
  handleNameChange,
  handleEmailChange,
  handleSubmit,
  loading,
}: SubscriptionSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div className="grid justify-self-center w-full max-w-[68rem] border border-subscription-border bg-[radial-gradient(100%_57.65%_at_0%_54.86%,_#6D48FF_0%,_#411FC7_45%,_rgba(65,31,199,0)_100%)] rounded-[1.5rem] px-5 py-7 tablet:rounded-[2.5rem] tablet:p-10 tablet:grid-cols-[280px_1fr] tablet:grid-rows-[1fr_auto_auto_1fr] tablet:gap-x-10 laptop:py-16 laptop:px-16 laptop:grid-cols-[380px_1fr] laptop:gap-x-14">
        <h2 className="font-bold tracking-tighter whitespace-break-spaces text-[2rem] leading-[0.9] mb-6 tablet:text-[4rem] tablet:mb-0 tablet:row-span-5 tablet:col-start-1 tablet:self-center laptop:text-[4rem]">
          Get to
          <br />
          know first!
        </h2>
        
        <div className="mb-5 text-base leading-[1.2] tablet:text-lg tablet:row-start-2 tablet:col-start-2 laptop:mb-6 laptop:text-xl">
          <p>Just one email — we'll let you know when we launch. No follow-ups, no spam. Deal?</p>
        </div>
        
        <form
          className="relative w-full tablet:row-start-3 tablet:col-start-2 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label className="block">
            <span className="sr-only">Your name</span>
            <input
              type="text"
              placeholder="Your name"
              className="text-lg leading-[1.2] border border-input-border rounded-full w-full transition-colors px-5 py-3 tablet:py-3.5 placeholder:opacity-60 hover:border-white focus:border-white focus:outline-none bg-transparent text-white"
              name="name"
              value={name}
              onChange={handleNameChange}
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Your email here</span>
            <input
              type="email"
              placeholder="Your email here"
              className="text-lg leading-[1.2] border border-input-border rounded-full w-full transition-colors px-5 py-3 tablet:py-3.5 placeholder:opacity-60 hover:border-white focus:border-white focus:outline-none pr-[110px] bg-transparent text-white"
              name="email"
              value={email}
              onChange={handleEmailChange}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 cursor-pointer text-sm leading-none rounded-full button-gradient px-4 tablet:px-5 laptop:text-base laptop:px-6 disabled:opacity-70 disabled:cursor-default text-white font-medium h-auto"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </label>
        </form>
      </div>
    </motion.div>
  );
}
