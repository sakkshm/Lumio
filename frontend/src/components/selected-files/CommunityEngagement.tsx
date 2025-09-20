import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useNavigate } from "react-router-dom"
import Onboarding from "./Onboarding"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React from "react"
import { toast, Toaster } from "sonner"

type Poll = {
  question: string
  options: string[]
}

export default function CommunityEngagement({
  activeSection,
  polls,
  setPolls,
  isDialogOpen,
  setIsDialogOpen,
}: {
  activeSection: string
  polls: Poll[]
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
}) {
  const address = useActiveAddress()
  const navigate = useNavigate()

  const [question, setQuestion] = React.useState("")
  const [options, setOptions] = React.useState<string[]>(["", ""]) // start with 2
  const [selectedPoll, setSelectedPoll] = React.useState<Poll | null>(null) // for viewing poll details

  if (!address) {
    navigate("/")
  }

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

const handleSavePoll = () => {
  const trimmedOptions = options.map((opt) => opt.trim())

  if (!question.trim()) {
    toast.error("Please enter a poll question before saving.")
    return
  }

  // Strict mode: no empty option allowed
  if (trimmedOptions.some((opt) => !opt)) {
    toast.error("Please fill all options before saving.")
    return
  }

  if (trimmedOptions.length < 2) {
    toast.error("Please add at least 2 options.")
    return
  }

  const newPoll: Poll = {
    question: question.trim(),
    options: trimmedOptions,
  }

  setPolls([...polls, newPoll])
  setQuestion("")
  setOptions(["", ""]) // reset back to 2
  setIsDialogOpen(false)

  toast.success("Your poll has been saved successfully.")
}


  const renderContent = () => {
    switch (activeSection) {
      case "Polls":
        return (
          <div className="space-y-6 h-full">
            {polls.length === 0 ? (
              <div className="flex items-center justify-center flex-1 min-h-[70vh] text-zinc-400">
                
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

case "Leaderboard":
  return (
    <div className="space-y-6 w-full">
      {/* Leaderboard Filters */}
      <div className="flex space-x-3">
        {["All-time", "Weekly", "Daily", "Top 15", "Top 60"].map((filter, idx) => (
          <button
            key={idx}
            className="px-4 py-2 rounded-lg font-medium text-sm
              bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="w-[120%] h-[55vh] mx-auto bg-zinc-900/50 
                border border-zinc-800 rounded-xl 
                overflow-y-auto scrollbar-hide text-xl">
        {/* Header */}
        <div className="grid grid-cols-[60px_2fr_1fr_1fr] px-6 py-3 
                        text-zinc-400 text-sm font-medium border-b border-zinc-800 sticky top-0 bg-zinc-900/70 backdrop-blur">
          <span>#</span>
          <span>Name</span>
          <span>Most Active</span>
          <span>Date</span>
        </div>

        {/* Rows */}
        {[
          { rank: 1, name: "joshua728", badge: "👑", active: "Telegram", consistency: "92.02%", date: "21 Aug 2025" },
          { rank: 2, name: "przewodowy", active: "Discord", consistency: "95.67%", date: "03 Jul 2025" },
          { rank: 3, name: "rocket", badge: "Mythical", badgeColor: "bg-green-600", active: "Telegram", consistency: "92.70%", date: "27 Aug 2023" },
          { rank: 4, name: "codeWizard", active: "Discord", consistency: "90.33%", date: "05 Sep 2025" },
          { rank: 5, name: "typeMaster", active: "Telegram", consistency: "88.21%", date: "11 Sep 2025" },
          { rank: 6, name: "fastFingers", active: "Discord", consistency: "91.42%", date: "14 Aug 2025" },
          { rank: 7, name: "aiGuru", badge: "Legend", badgeColor: "bg-purple-600", active: "Telegram", consistency: "89.00%", date: "02 Sep 2025" },
          { rank: 8, name: "neonNinja", active: "Discord", consistency: "87.65%", date: "19 Jul 2025" },
        ].map((player, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[60px_2fr_1fr_1fr] px-6 py-4 
                       text-white hover:bg-zinc-800/50 transition"
          >
            <span className="font-semibold">{player.rank}</span>
            <span className="flex items-center space-x-2">
              <span>{player.name}</span>
              {player.badge && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    player.badgeColor || "bg-yellow-500 text-black"
                  }`}
                >
                  {player.badge}
                </span>
              )}
            </span>
            <span>{player.active}</span>
            <span className="text-zinc-400 text-sm">{player.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
      case "Onboarding":
        return (
          <div className="space-y-6">
            <div className="grid gap-6">this is the Onboarding part</div>
            <Onboarding />
          </div>
        )

      default:
        return <div className="text-zinc-400">Select a section from the sidebar</div>
    }
  }

  return (
    <div className="p-8 w-full">
      <div className="max-w-4xl">{renderContent()}</div>
    </div>
  )
}
