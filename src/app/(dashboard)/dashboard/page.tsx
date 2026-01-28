import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LogoutButton from "./LogoutButton"
import EditProfileForm from "./EditProfileForm"
import UpgradeBanner from "./UpgradeBanner"
import ProFeature from "./ProFeature"

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (error) {
    throw new Error("Failed to load profile")
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="rounded border p-4">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Name:</strong> {profile.full_name ?? "Not set"}</p>
         <p>
          <strong>Plan:</strong>{" "}
          <span className="font-semibold capitalize">
            {subscription?.plan}
          </span>
        </p>
      </div>

         {subscription?.plan === "free" && (
        <UpgradeBanner />
      )}

      {subscription?.plan === "pro" && (
        <ProFeature />
      )}

      <EditProfileForm
  userId={session.user.id}
  initialName={profile.full_name}
/>

      <LogoutButton />
    </div>
  )
}
