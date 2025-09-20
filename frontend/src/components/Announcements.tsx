import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Settings, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useParams } from "react-router"
import { Save } from "lucide-react"

const SERVERS_API_URL = `http://210.79.128.231/server`

function Announcements() {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const address = useActiveAddress()
  const { serverId } = useParams()

  const handleSendAnnouncement = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message before sending.")
      return
    }

    setSending(true)
    try {
      const res = await fetch(`${SERVERS_API_URL}/make-announcement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverID: serverId, walletID: address, message }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.msg || "Failed to send announcement")
      }

      toast.success("Announcement sent successfully!")
      setMessage("")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to send announcement")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">
            Send Announcement
          </h2>
          <p className="text-zinc-400 mb-6">
            Enter your message for your community (Markdown supported)
          </p>

          <Textarea
            placeholder="Write your announcement here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-zinc-900/50 border-zinc-700 text-white min-h-[200px] resize-none"
          />
        </section>

        <div className="flex justify-start">
          <Button
  onClick={handleSendAnnouncement}
  disabled={sending}
  className="bg-white text-black hover:bg-zinc-200 font-semibold px-8 py-2 transition-all duration-200 hover:scale-105 cursor-pointer"
>
  {sending ? (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      Sending...
    </>
  ) : (
    <>
      <Save className="w-4 h-4 mr-2" />
      Send
    </>
  )}
</Button>
        </div>
      </div>
    </div>
  )
}

export default Announcements
