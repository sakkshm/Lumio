import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"  

type Poll = {
  question: string
  options: string[]
}

export default function Polls({
  polls,
  setPolls,
  isDialogOpen,
  setIsDialogOpen,
}: {
  polls: Poll[]
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
}) {
  const [question, setQuestion] = React.useState("")
  const [options, setOptions] = React.useState<string[]>(["", ""])
  const [selectedPoll, setSelectedPoll] = React.useState<Poll | null>(null)
  const [loading, setLoading] = React.useState(true) // ✅ loading state

  React.useEffect(() => {
    // Simulate loading polls (replace with API later)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleAddOption = () => setOptions([...options, ""])

  const handleSavePoll = () => {
    const trimmedOptions = options.map((opt) => opt.trim())

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

    const newPoll = {
      pollNumber: polls.length + 1,
      question: question.trim(),
      options: trimmedOptions,
    }

    console.log("New Poll Created:", newPoll)

    setPolls([...polls, newPoll])
    setQuestion("")
    setOptions(["", ""])
    setIsDialogOpen(false)

    toast.success("Your poll has been saved successfully.")
  }

  if (loading) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[70vh]">
  <Loader2 className="w-8 h-8 animate-spin text-white" />
  <span className="ml-3 text-lg">Loading polls...</span>
</div>
  )
}


  return (
    <div className="space-y-6 h-full">
      {polls.length === 0 ? (
    <div className="flex items-center justify-center flex-1 min-h-[70vh] text-zinc-400">
      No polls yet
    </div>
  ) : (
    <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 scrollbar-hide">
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
    </div>
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
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium cursor-pointer"
              >
                Save Poll
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
