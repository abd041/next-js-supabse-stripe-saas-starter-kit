import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST() {
  const supabase = createSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Pro Plan",
          },
          unit_amount: 1000, // $10/month
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    metadata: {
      user_id: session.user.id,
    },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
