import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
})

export const STRIPE_PRICES = {
  monthly: "price_1SXQqpBeA3nATQA0LYWreTfS",
  annual: "price_1SXQrCBeA3nATQA0X1iwTyLm",
}

export const STRIPE_PRODUCT_ID = "prod_TUPfXyvJ6ZSjH3"
