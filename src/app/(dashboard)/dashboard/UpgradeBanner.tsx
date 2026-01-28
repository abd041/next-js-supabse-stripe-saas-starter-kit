"use client"

export default function UpgradeBanner() {
  const upgrade = async () => {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    })
    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <div className="rounded border border-yellow-400 bg-yellow-50 p-4">
      <p className="font-semibold">You are on the Free plan</p>
      <button
        onClick={upgrade}
        className="mt-2 rounded bg-black px-4 py-2 text-white"
      >
        Upgrade to Pro
      </button>
    </div>
  )
}
