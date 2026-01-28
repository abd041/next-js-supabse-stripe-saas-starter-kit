import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  const supabase = createSupabaseServerClient()

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any

    const userId = session.metadata.user_id

    await supabase
      .from("subscriptions")
      .update({
        plan: "pro",
        status: "active",
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      })
      .eq("user_id", userId)
  }

  return NextResponse.json({ received: true })
}
