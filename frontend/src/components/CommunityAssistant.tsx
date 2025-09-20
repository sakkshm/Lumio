//communityAssistant.tsx
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useParams } from "react-router-dom"
import { Save } from "lucide-react"

const SERVERS_API_URL = `https://lumio-server.sakkshm.me/server`

export default function CommunityAssistant() {
  const [personaPrompt, setPersonaPrompt] = useState("")
  const [docsPrompt, setDocsPrompt] = useState("")
  const [loading, setLoading] = useState(true)

  const address = useActiveAddress()
  const { serverId } = useParams()

  // Fetch prompts on mount
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${SERVERS_API_URL}/get-chatbot-prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serverID: serverId,
            walletID: address,
          }),
        })

        if (!res.ok) throw new Error("Failed to fetch chatbot prompts")

        const data = await res.json()
        if (data.personaPrompt) setPersonaPrompt(data.personaPrompt)
        if (data.docsPrompt) setDocsPrompt(data.docsPrompt)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load chatbot prompts")
      } finally {
        setLoading(false)
      }
    }

    if (serverId && address) {
      fetchPrompts()
    }
  }, [serverId, address])

  const handleSave = async () => {
    try {
      const res = await fetch(`${SERVERS_API_URL}/set-chatbot-prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverID: serverId,
          walletID: address,
          personaPrompt,
          docsPrompt,
        }),
      })

      if (!res.ok) {
        toast.error("Failed to save prompts")
        return
      }

      toast.success("Prompts saved successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Unable to save prompts")
    }
  }

  if (loading) {
  return (
    <div className="flex items-center justify-center h-full flex-1 text-white">
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <span className="text-lg">Loading...</span>
      </div>
    </div>
  )
}


  return (
    <div className="flex flex-col h-full">
      <div className="space-y-12 flex-1">
        {/* ---------- Inputs Side by Side ---------- */}
        <div className="grid grid-cols-2 gap-8">
          {/* ---------- Exclusive Actions ---------- */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-white" />
              <h2 className="text-xl font-semibold text-white">
                Exclusive Actions
              </h2>
            </div>
            <p className="text-zinc-400 mb-6 text-left">
              Enter a master prompt for your AI Agent
            </p>

            <Textarea
              placeholder="Place your prompt here..."
              value={personaPrompt}
              onChange={(e) => setPersonaPrompt(e.target.value)}
              className="bg-zinc-900/50 border-zinc-700 text-white min-h-[200px] resize-none"
            />
          </section>

          {/* ---------- Docs Agent Setup ---------- */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-white" />
              <h2 className="text-xl font-semibold text-white">
                Docs Agent Setup
              </h2>
            </div>
            <p className="text-zinc-400 mb-6 text-left">
              Enter your community docs as wikis
            </p>

            <Textarea
              placeholder="Paste docs, links, or notes here..."
              value={docsPrompt}
              onChange={(e) => setDocsPrompt(e.target.value)}
              className="bg-zinc-900/50 border-zinc-700 text-white min-h-[200px] resize-none"
            />
          </section>
        </div>

        {/* ---------- Save Button ---------- */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-white text-black w-40 h-10 hover:bg-zinc-200 font-semibold px-10 py-3 text-lg transition-all duration-200 hover:scale-105 cursor-pointer rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
