import React, { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useParams } from "react-router-dom"

type Poll = {
  question: string
  options: string[]
}

type PollsProps = {
  polls: Poll[]
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  serverID: string
  walletID: string
}

export default function Polls({
  polls,
  setPolls,
  isDialogOpen,
  setIsDialogOpen,
  serverID,
  walletID,
}: PollsProps) {
  const params = useParams()
  const [question, setQuestion] = React.useState("")
  const [options, setOptions] = React.useState<string[]>(["", ""])
  const [selectedPoll, setSelectedPoll] = React.useState<Poll | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [loadingPolls, setLoadingPolls] = React.useState(false)
  const SERVERS_API_URL = `https://lumio-server.sakkshm.me/server`

  // --- Fetch polls from backend on mount ---
  const fetchPolls = async () => {
    const serverID = params.serverId!;
    
    if (!serverID || !walletID) return
    setLoadingPolls(true)
    try {
      const res = await fetch(`${SERVERS_API_URL}/get-polls`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverID, walletID }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.msg || "Failed to fetch polls")
      }

      const data = await res.json()
      setPolls(data.polls)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Unable to fetch polls")
    } finally {
      setLoadingPolls(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [serverID, walletID])

  const handleAddOption = () => setOptions([...options, ""])

  const handleSavePoll = async () => {
    const trimmedOptions = options.map((opt) => opt.trim())

    // --- Validation ---
    if (!question.trim()) {
      toast.error("Please enter a poll question before saving.")
      return
    }
    if (trimmedOptions.some((opt) => !opt)) {
      toast.error("Please fill all options before saving.")
      return
    }
    if (trimmedOptions.length < 2) {
      toast.error("Please add at least 2 options.")
      return
    }
    if (trimmedOptions.length > 10) {
      toast.error("Poll supports a maximum of 10 options.")
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`${SERVERS_API_URL}/post-poll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverID: params.serverId!,
          walletID,
          question,
          options: trimmedOptions,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.msg || "Failed to save poll")
      }

      const data = await res.json()
      const newPoll = data.poll
      setPolls((prev) => [newPoll, ...prev])
      setQuestion("")
      setOptions(["", ""])
      setIsDialogOpen(false)
      toast.success("Poll posted successfully!")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Unable to save poll")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 h-full">
      {loadingPolls ? (
        <div className="flex items-center justify-center flex-1 min-h-[70vh] text-zinc-400">
          Loading polls...
        </div>
      ) : polls.length === 0 ? (
        <div className="flex items-center justify-center flex-1 min-h-[70vh] text-zinc-400">
          No polls yet.
        </div>
      ) : (
        <>
          {polls.map((poll, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPoll(poll)}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 cursor-pointer hover:bg-zinc-900/70 transition"
            >
              <h3 className="text-lg font-semibold text-white">
                {poll.question}
              </h3>
              <p className="text-sm text-zinc-400">
                {poll.options.length} options
              </p>
            </div>
          ))}
        </>
      )}

      {/* Poll Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg p-0">
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-semibold">
                Create a Poll
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-300">
                  Question
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Enter your question..."
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-300">
                  Options
                </label>
                <div className="space-y-3">
                  {options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...options]
                        newOptions[idx] = e.target.value
                        setOptions(newOptions)
                      }}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      placeholder={`Option ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  + Add Option
                </button>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                onClick={handleSavePoll}
                disabled={saving}
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium cursor-pointer"
              >
                {saving ? "Saving..." : "Save Poll"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Poll Detail Dialog */}
      <Dialog open={!!selectedPoll} onOpenChange={() => setSelectedPoll(null)}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg p-8 space-y-6">
          {selectedPoll && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white text-xl font-semibold">
                  {selectedPoll.question}
                </DialogTitle>
              </DialogHeader>
              <ul className="space-y-2">
                {selectedPoll.options.map((opt, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 bg-zinc-800 rounded-lg text-white"
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
