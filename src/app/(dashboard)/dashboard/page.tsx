import { createSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LogoutButton from "./LogoutButton"
import EditProfileForm from "./EditProfileForm"

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

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="rounded border p-4">
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Name:</strong> {profile.full_name ?? "Not set"}</p>
      </div>

      <EditProfileForm
  userId={session.user.id}
  initialName={profile.full_name}
/>

      <LogoutButton />
    </div>
  )
}
