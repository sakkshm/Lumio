import React, { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Settings, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useParams } from "react-router"
import { Save } from "lucide-react"

const SERVERS_API_URL = `https://lumio-server.sakkshm.me/server`

function Onboarding() {
  const [onboardingMessage, setOnboardingMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const address = useActiveAddress()
  const { serverId } = useParams()

  // Fetch saved onboarding message on mount
  useEffect(() => {
    const fetchOnboardingMessage = async () => {
      try {
        const res = await fetch(`${SERVERS_API_URL}/get-onboarding-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serverID: serverId,
            walletID: address
          })
        })

        if (!res.ok) throw new Error("Failed to fetch onboarding message")

        const data = await res.json()
        if (data.onboardingMessage) {
          setOnboardingMessage(data.onboardingMessage)
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load onboarding message")
      } finally {
        setLoading(false)
      }
    }

    fetchOnboardingMessage()
  }, [])

  const handleSave = async () => {
    try {
      const res = await fetch(`${SERVERS_API_URL}/set-onboarding-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          onboardingMessage, 
          serverID: serverId, 
          walletID: address
        }),
      })

      if (!res.ok) {
        toast.error("Failed to save onboarding message")
        return
      }

      toast.success("Onboarding message saved successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Unable to save onboarding message")
    }
  }

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[70vh] w-full">
      <Loader2 className="w-8 h-8 animate-spin text-white" />
      <span className="ml-3 text-lg text-white">
        Loading onboarding message...
      </span>
    </div>
  )
}

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">
            Onboarding Setup
          </h2>
          <p className="text-zinc-400 mb-6">
            Enter onboarding message for your community (markdown supported), type {"{user}"} to mention new users first name.
          </p>

          <Textarea
            placeholder="Write your onboarding message here..."
            value={onboardingMessage}
            onChange={(e) => setOnboardingMessage(e.target.value)}
            className="bg-zinc-900/50 border-zinc-700 text-white min-h-[200px] resize-none"
          />
        </section>

        <div className="flex justify-start">
<Button
  onClick={handleSave}
  className="bg-white text-black hover:bg-zinc-200 font-semibold px-8 py-2 transition-all duration-200 hover:scale-105 cursor-pointer"
>
  <Save className="w-4 h-4 mr-2" />  {/* ✅ replaced Settings with Save */}
  Save
</Button>

        </div>
      </div>
    </div>
  )
}

export default Onboarding
