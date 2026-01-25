"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function EditProfileForm({
  userId,
  initialName,
}: {
  userId: string
  initialName: string | null
}) {
  const [name, setName] = useState(initialName ?? "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const updateProfile = async () => {
    setLoading(true)
    setMessage(null)

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", userId)

    setLoading(false)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Profile updated")
    }
  }

  return (
    <div className="space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2"
        placeholder="Your name"
      />

      <button
        onClick={updateProfile}
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        Save
      </button>

      {message && <p className="text-sm">{message}</p>}
    </div>
  )
}
