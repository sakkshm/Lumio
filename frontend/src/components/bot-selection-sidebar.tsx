import telegram from "./telegram.png"
import discord from "./discord.png"
import sub from "./sub.png"
import { useNavigate } from "react-router-dom"

interface BotSelectionSidebarProps {
  className?: string
}

export default function BotSelectionSidebar({ className }: BotSelectionSidebarProps) {
  const navigate = useNavigate()

  const platforms = [
    {
      id: "telegram",
      name: "Telegram",
      description: "Deploy bots for Telegram messaging platform",
      features: ["Message handling", "Inline keyboards", "File sharing"],
      status: "Active",
      logo: telegram,
      link: "/telegram", // <-- route you can change later
    },
    {
      id: "discord",
      name: "Discord",
      description: "Create bots for Discord servers and communities",
      features: ["Slash commands", "Voice integration", "Role management"],
      status: "Active",
      logo: discord,
      link: "/discord",
    },
    {
      id: "subspace",
      name: "Subspace",
      description: "Build on the Subspace decentralized network",
      features: ["Decentralized storage", "Cross-chain", "Web3 native"],
      status: "Beta",
      logo: sub,
      link: "/subspace",
    },
  ]

  return (
    <div className={`bg-zinc-950 h-full p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-white mb-4">Select Platforms</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            onClick={() => navigate(platform.link)}
            className="relative p-5 rounded-xl cursor-pointer border-2 transition-all duration-200 flex flex-col w-full
              border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
          >
            {/* Logo */}
            <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-3">
              <img
                src={platform.logo || "/placeholder.svg"}
                alt={`${platform.name} logo`}
                className="w-10 h-10"
              />
            </div>

            {/* Name */}
            <h3 className="font-semibold text-white mb-1">{platform.name}</h3>

            {/* Description */}
            <p className="text-zinc-400 text-sm mt-2">{platform.description}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mt-3">
              {platform.features.map((feature) => (
                <span
                  key={feature}
                  className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
