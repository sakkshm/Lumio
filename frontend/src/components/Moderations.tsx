import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Ban, Settings, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useParams } from "react-router-dom";

const SERVERS_API_URL = `${import.meta.env.VITE_BACKEND_URL}/server`

export default function Moderations() {
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [inputValue, setInputValue] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const address = useActiveAddress()
  const { serverId } = useParams();

  const moderationLevels = [
    {
      id: "low",
      name: "Low",
      level: 1,
      description: "Basic filtering with minimal restrictions",
      icon: Eye,
      color: "bg-green-500/10 border-green-500/20 text-green-400",
    },
    {
      id: "medium",
      name: "Medium",
      level: 2,
      description: "Balanced moderation for most communities",
      icon: Shield,
      color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    },
    {
      id: "high",
      name: "High",
      level: 3,
      description: "Strict filtering with comprehensive protection",
      icon: AlertTriangle,
      color: "bg-red-500/10 border-red-500/20 text-red-400",
    },
  ]

  // Fetch moderation config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${SERVERS_API_URL}/get-moderation-config`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serverID: serverId,
            walletID: address,
          }),
        })

        if (!res.ok) throw new Error("Failed to fetch moderation config")

        const data = await res.json()
        if (data.strictnessLevel) setSelectedLevel(data.strictnessLevel)
        if (data.bannedWords) setTags(data.bannedWords.split(",").filter(Boolean))
      } catch (err) {
        console.error(err)
        toast.error("Failed to load moderation settings")
      } finally {
        setLoading(false)
      }
    }

    if (serverId && address) {
      fetchConfig()
    }
  }, [serverId, address])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault()
      const newTag = inputValue.trim().replace(/,$/, "")
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setInputValue("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSave = async () => {
    const blockedWordsString = tags.join(",")

    try {
      const response = await fetch(`${SERVERS_API_URL}/set-moderation-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverID: serverId,
          walletID: address,
          strictnessLevel: selectedLevel,
          bannedWords: blockedWordsString,
        }),
      })

      if (!response.ok) {
        toast.error("Failed to save settings")
        return
      }

      toast.success("Settings saved successfully!")
    } catch {
      toast.error("Unable to save settings!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Moderation Level Selection */}
          <Card className="bg-zinc-950/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Moderation Level
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Choose the appropriate moderation level for your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {moderationLevels.map((levelOption) => {
                  const Icon = levelOption.icon
                  return (
                    <div
                      key={levelOption.id}
                      onClick={() => setSelectedLevel(levelOption.level)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedLevel === levelOption.level
                          ? levelOption.color
                          : "bg-zinc-900/50 border-zinc-700 hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold">{levelOption.name}</span>
                        {selectedLevel === levelOption.level && (
                          <Badge variant="secondary" className="ml-auto bg-white/10 text-white">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">{levelOption.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Custom Blocked Words */}
          <Card className="bg-zinc-950/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Ban className="w-5 h-5" /> Custom Word Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-md px-3 py-3 focus-within:border-white/20">
                  {tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      className="bg-zinc-800 text-white border border-zinc-600 px-2 py-1 flex items-center gap-2"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-xs text-zinc-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                  <input
                    type="text"
                    placeholder="Type a word..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-white placeholder:text-zinc-500 outline-none py-2"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Type a word and press <span className="text-white">Enter</span> or{" "}
                  <span className="text-white">Comma</span> to add it as a tag.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-white text-black hover:bg-zinc-200 font-semibold px-8 py-2 transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <Settings className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
