"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import disnew from "./discordNew.jpg"
import telenew from "./teleNew.jpg"
import subnew from "./subNew.jpg"
import { Settings } from "lucide-react"

interface BotSelectionSidebarProps {
  className?: string
}

interface Platform {
  id: string
  name: string
  description: string
  features: string[]
  status: string
  logo: string
  link: string
}

export default function BotSelectionSidebar({ className }: BotSelectionSidebarProps) {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)

  const platforms = [
    {
      id: "telegram",
      name: "Telegram",
      description: "Deploy bots for Telegram messaging platform",
      features: ["Message handling", "Inline keyboards", "File sharing"],
      status: "Active",
      logo: telenew,
      link: "/telegram",
    },
    {
      id: "discord",
      name: "Discord",
      description: "Create bots for Discord servers and communities",
      features: ["Slash commands", "Voice integration", "Role management"],
      status: "Active",
      logo: disnew,
      link: "/discord",
    },
    {
      id: "subspace",
      name: "Subspace",
      description: "Build on the subspace decentralized Network",
      features: ["Slash Commands", "Voice Integration", "Role Management"],
      status: "Beta",
      logo: subnew,
      link: "/subspace",
    },
  ]

  const handlePlatformClick = (platform: Platform) => {
    setSelectedPlatform(platform)
    setShowPopup(true)
  }

  const handleSaveClick = () => {
    const randomLinks = [
      "https://example.com/random1",
      "https://example.com/random2",
      "https://example.com/random3",
      "https://github.com",
      "https://vercel.com",
    ]
    const randomLink = randomLinks[Math.floor(Math.random() * randomLinks.length)]
    window.open(randomLink, "_blank")
  }

  const handleCopyCode = async () => {
    const codeSnippet = `// ${selectedPlatform?.name} Bot Configuration
import { ${selectedPlatform?.name}Bot } from '@lumio/sdk'

const bot = new ${selectedPlatform?.name}Bot({
  token: process.env.${selectedPlatform?.name.toUpperCase()}_TOKEN,
  webhookUrl: 'https://your-app.vercel.app/api/webhook',
  features: ${JSON.stringify(selectedPlatform?.features, null, 2)}
})

bot.start()`

    try {
      await navigator.clipboard.writeText(codeSnippet)
      toast.success("Code copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy code")
    }
  }

  return (
    <>
      <div className={`bg-zinc-950 min-h-screen flex flex-col p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-white mb-6 ml-[-843px] text-zinc-500">Select Platform</h2>

        {/* Platform Cards - take available space */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 flex-1">
          {platforms.map((platform) => (
            <div
              key={platform.id}
                onClick={() => {
                  if (platform.id !== "subspace") {
                    handlePlatformClick(platform)
                  }
                }}
              className="relative p-6 rounded-xl h-90 cursor-pointer border border-zinc-800 transition-all duration-200 flex flex-col w-full
                bg-gradient-to-b from-zinc-950 to-zinc-900 hover:border-zinc-700"
            >
              {platform.id === "subspace" && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center z-10 pointer-events-none">
                  {/* Diagonal Banner */}
                  <div className="bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 text-white 
                                  text-2xl font-bold px-16 py-5 transform rotate-12 
                                  shadow-xl border border-zinc-600 rounded-lg backdrop-blur-[2px]">
                    COMING SOON
                  </div>
                </div>
              )}
              <div className={platform.id === "subspace" ? "blur-[1px]" : ""}>
                {/* Logo */}
              <div className="flex justify-center mb-4">
                <img
                  src={platform.logo || "/placeholder.svg"}
                  alt={`${platform.name} logo`}
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Name */}
              <h3 className="font-semibold text-white text-lg mb-2 text-center">{platform.name}</h3>

              {/* Description */}
              <p className="text-zinc-400 text-sm mb-4 text-center">{platform.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {platform.features.map((feature) => (
                  <span key={feature} className="px-3 py-1 bg-zinc-800/50 text-zinc-400 rounded text-xs">
                    {feature}
                  </span>
                ))}
              </div>

              {/* Add to Server / Community button */}
              <Button
                onClick={() => handlePlatformClick(platform)}
                className="mt-auto w-full border border-zinc-500 bg-zinc-950 text-zinc-500 hover:bg-zinc-800 font-medium py-2 rounded-lg"
              >
                {platform.name === "Telegram" ? "Add to Community" : "Add to Server"}
              </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && selectedPlatform && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-5xl bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <img
                      src={selectedPlatform.logo || "/placeholder.svg"}
                      alt={`${selectedPlatform.name} logo`}
                      className="w-6 h-6"
                    />
                    {selectedPlatform.name} Integration
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPopup(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                  {/* First Column - Join the Link */}
                  <div className="space-y-6 text-left">
                    <h3 className="text-xl font-semibold text-white">Step 1: Deploy Bot</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Connect your {selectedPlatform.name} Server to start using Lumio and managing your community.
                      {selectedPlatform.name === "Telegram" && (
                        <p className="mt-2 text-zinc-300">
                          <b>Note:</b> Promote the bot to Admin. Go to members list → right click on "Lumio" → Promote
                          to Admin and enable all permissions.
                        </p>
                      )}
                    </p>
                  </div>

                  {/* Second Column - Code Snippet */}
                  <div className="space-y-6 text-right">
                    <h3 className="text-xl font-semibold text-white">Step 2: Enter command</h3>
                    <p className="text-zinc-400 leading-relaxed">
                      Paste this command in your chat to link your server with Lumio.
                    </p>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-6 overflow-x-auto w-full">
                      <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed text-left">
                        <code>{`/link code`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Buttons Row */}
                  <div className="col-span-1 md:col-span-2 flex gap-4 mt-6">
                    <Button
                      onClick={handleSaveClick}
                      className="flex-1 bg-white text-black hover:bg-zinc-200 font-medium py-3 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Save & Connect
                    </Button>
                    <Button
                      onClick={handleCopyCode}
                      className="flex-1 bg-white text-black hover:bg-zinc-200 font-medium py-3 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                </CardContent>

              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
