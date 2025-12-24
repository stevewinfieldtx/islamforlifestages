"use server"

import { stripe, STRIPE_PRICES } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function createCheckoutSession(priceType: "monthly" | "annual") {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const priceId = STRIPE_PRICES[priceType]

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 7,
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/daily?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/subscribe?canceled=true`,
    customer_email: user.email,
    metadata: {
      userId: user.id,
    },
  })

  if (session.url) {
    redirect(session.url)
  }
}

export async function getSubscriptionStatus() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { isSubscribed: false, trialEnds: null }

  // Check if user has active subscription in Stripe
  const customers = await stripe.customers.list({
    email: user.email!,
    limit: 1,
  })

  if (customers.data.length === 0) {
    return { isSubscribed: false, trialEnds: null }
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customers.data[0].id,
    status: "all",
    limit: 1,
  })

  if (subscriptions.data.length === 0) {
    return { isSubscribed: false, trialEnds: null }
  }

  const subscription = subscriptions.data[0]
  const isActive = subscription.status === "active" || subscription.status === "trialing"
  const trialEnds = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null

  return {
    isSubscribed: isActive,
    trialEnds,
    status: subscription.status,
  }
}
