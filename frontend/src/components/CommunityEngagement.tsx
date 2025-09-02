import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, X, Trash2 } from "lucide-react"

const generateShortId = () => Math.random().toString(36).substring(2, 8)

export default function CommunityEngagement({ activeSection }: { activeSection: string }) {
  const address = useActiveAddress()
  const navigate = useNavigate()

  // Poll state
  const [polls, setPolls] = useState<{ id: string; question: string; options: string[] }[]>([])
  const [showPollModal, setShowPollModal] = useState(false)
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  if (!address) {
    navigate("/")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "Leaderboard":
        return (
          <div className="text-zinc-400 text-center">
            <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
            <p className="text-lg">Coming soon! This section will showcase top contributors.</p>
          </div>
        )
      case "Announcements":
        return (
          <div className="text-zinc-400 text-center">
            <h2 className="text-2xl font-semibold mb-4">Announcements</h2>
            <p className="text-lg">Stay tuned for important updates and announcements.</p>
          </div>
        )
      case "onboarding":
        return (
          <div className="text-zinc-400 text-center">
            <h2 className="text-2xl font-semibold mb-4">Onboarding</h2>
            <p className="text-lg">This section will guide new users through the onboarding process.</p>
          </div>
        )
      case "Polls":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 h-[70vh] flex items-center justify-center">
              {polls.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center 
                  min-w-[900px] min-h-[400px] 
                  p-10 border border-zinc-800 
                  rounded-2xl shadow-md bg-zinc-900/50 text-center"
                >
                  <p className="text-zinc-400 mb-6 text-xl">No polls yet</p>
                  <Button
                    onClick={() => setShowPollModal(true)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={24} /> Add Poll
                  </Button>
                </div>
              ) : (
                <>
                  {/* Poll List */}
                  <div className="flex flex-wrap gap-6">
                    {polls.map((poll) => (
                      <Card
                        key={poll.id}
                        className="relative w-[280px] p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-800/70"
                        onClick={() => navigate(`/efe4r/server/${poll.id}/poll`, { state: poll })}
                      >
                        {/* Delete Poll Button */}
                        <button
                          className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation() // prevent triggering poll click
                            setPolls((prev) => prev.filter((p) => p.id !== poll.id))
                          }}
                        >
                          <Trash2 size={20} />
                        </button>

                        {/* Only show question */}
                        <h3 className="font-semibold text-lg text-white">{poll.question}</h3>
                      </Card>
                    ))}
                  </div>

                  {/* Add Another Poll */}
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={() => setShowPollModal(true)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={20} /> Add Another Poll
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Create Poll Modal */}
            <Dialog open={showPollModal} onOpenChange={setShowPollModal}>
              <DialogContent className="rounded-2xl bg-zinc-900 border border-zinc-800 max-w-3xl p-10">
                <DialogHeader>
                  <DialogTitle className="text-white text-3xl">Create a Poll</DialogTitle>
                  <DialogDescription className="text-zinc-400 text-xl">
                    Ask a question and add multiple options.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-8 mt-6">
                  <Input
                    className="text-xl py-5"
                    placeholder="Enter your poll question"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                  />

                  <div className="space-y-4">
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <Input
                          className="text-lg py-4"
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={(e) =>
                            setPollOptions((prev) =>
                              prev.map((o, idx) => (idx === i ? e.target.value : o))
                            )
                          }
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() =>
                            setPollOptions((prev) => prev.filter((_, idx) => idx !== i))
                          }
                        >
                          <X size={22} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setPollOptions([...pollOptions, ""])}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Plus size={20} /> Add Option
                    </Button>
                  </div>
                </div>

                <DialogFooter className="mt-8">
                  <Button
                    className="px-8 py-4 text-xl cursor-pointer"
                    onClick={() => {
                      if (!pollQuestion || pollOptions.filter(Boolean).length < 2) return
                      setPolls([
                        ...polls,
                        {
                          id: generateShortId(),  // ✅ use uuid for unique poll ID
                          question: pollQuestion,
                          options: pollOptions.filter(Boolean),
                        },
                      ])
                      setPollQuestion("")
                      setPollOptions(["", ""])
                      setShowPollModal(false)
                    }}
                  >
                    Create Poll
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )
      default:
        return <div className="text-zinc-400">Select a section from the sidebar</div>
    }
  }

  return (
    <div className="p-8 w-full">
      <div className="max-w-5xl mx-auto">{renderContent()}</div>
    </div>
  )
}
