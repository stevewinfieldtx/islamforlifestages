"use client"

import { Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/app/actions/stripe"
import { useSearchParams } from "next/navigation"

function SubscribeContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "monthly"
  const canceled = searchParams.get("canceled")

  const handleSubscribe = async (priceType: "monthly" | "annual") => {
    await createCheckoutSession(priceType)
  }

  return (
    <div className="w-full max-w-2xl relative z-10">
      {canceled && (
        <div className="glass-card rounded-2xl p-4 mb-6 text-center border border-amber-500/30">
          <p className="text-amber-200">Checkout was canceled. You can try again when you're ready.</p>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-amber-100 mb-2">Choose Your Plan</h2>
        <p className="text-blue-200/60">Start with 7 days free, cancel anytime</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div
          className={`glass-card rounded-2xl p-6 text-center ${plan === "monthly" ? "border-2 border-teal-500/30" : ""}`}
        >
          <h4 className="text-xl font-semibold text-amber-100 mb-2">Monthly</h4>
          <p className="text-4xl font-bold text-amber-400 mb-4">
            $2<span className="text-lg font-normal text-amber-400/60">/mo</span>
          </p>
          <ul className="text-blue-200/60 text-sm mb-6 space-y-2">
            <li>Daily personalized verses</li>
            <li>AI-generated stories & poems</li>
            <li>Cancel anytime</li>
          </ul>
          <Button
            onClick={() => handleSubscribe("monthly")}
            className={`w-full ${plan === "monthly" ? "bg-amber-500 hover:bg-amber-600 text-black" : "bg-white/10 hover:bg-white/20 text-amber-100"}`}
          >
            Start Free Trial
          </Button>
        </div>

        <div
          className={`glass-card rounded-2xl p-6 text-center relative ${plan === "annual" ? "border-2 border-amber-500/50" : "border-2 border-amber-500/30"}`}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            SAVE 50%
          </div>
          <h4 className="text-xl font-semibold text-amber-100 mb-2">Annual</h4>
          <p className="text-4xl font-bold text-amber-400 mb-4">
            $12<span className="text-lg font-normal text-amber-400/60">/yr</span>
          </p>
          <ul className="text-blue-200/60 text-sm mb-6 space-y-2">
            <li>Everything in Monthly</li>
            <li>Just $1/month</li>
            <li>Best value</li>
          </ul>
          <Button
            onClick={() => handleSubscribe("annual")}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      <p className="text-center text-blue-200/40 text-sm mt-6">Your card won't be charged until the trial ends</p>
    </div>
  )
}

export default function SubscribePage() {
  return (
    <div className="min-h-screen w-full stained-glass-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-glow-pulse" />
        <div
          className="absolute bottom-1/4 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl animate-glow-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3 mb-8">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
          <Image src="/images/logo.jpg" alt="Bible for Life Stages" fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-amber-100">Bible for Life Stages</h1>
        </div>
      </div>

      <Suspense fallback={<div className="text-amber-100">Loading...</div>}>
        <SubscribeContent />
      </Suspense>
    </div>
  )
}
