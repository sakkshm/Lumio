import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"
import {
  Wallet,
  LayoutDashboard,
  Shield,
  Bot,
  Users,
  BarChart3,
  List,
  Bell,
} from "lucide-react"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import noise from "@/components/noisy.png"

// Import dashboard sections
import Moderations from "./components/Moderations"
import CommunityAssistant from "./components/CommunityAssistant"
import CommunityEngagement from "./components/CommunityEngagement"
import Analytics from "./components/Analytics"
import Logs from "./components/Logs"
import BotSelectionSidebar from "./components/bot-selection-sidebar"

export default function Dashboard() {
  const address = useActiveAddress()

  const [activeTab, setActiveTab] = useState("bot-selection")
  const [activeSubTab, setActiveSubTab] = useState("Leaderboard")
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const shortenAddress = (addr: string | undefined) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-5)}`
  }

  const menuItems = [
    { id: "bot-selection", label: "Connectivity", icon: LayoutDashboard },
    { id: "moderations", label: "Moderations", icon: Shield },
    { id: "assistant", label: "Community Assistant", icon: Bot },
    {
      id: "engagement",
      label: "Community Engagement",
      icon: Users,
      subItems: [
        "Leaderboard",
        "Polls",
        "Onboarding",
        "Bounties",
        "Saved moments",
        "Waitlist",
        "Personas",
      ],
    },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "logs", label: "Logs", icon: List },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "bot-selection":
        return <BotSelectionSidebar />
      case "moderations":
        return <Moderations />
      case "assistant":
        return <CommunityAssistant />
      case "engagement":
        return <CommunityEngagement activeSection={activeSubTab} />
      case "analytics":
        return <Analytics />
      case "logs":
        return <Logs />
      default:
        return <div className="text-lg">Select a section</div>
    }
  }

  const getActiveTabLabel = () => {
    const item = menuItems.find((menu) => menu.id === activeTab)
    return item ? item.label : activeTab
  }

  return (
  <div
    className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-zinc-950 text-white flex relative overflow-hidden"
  >
    {/* Global Noise Background */}
    <div
      className="absolute inset-0 opacity-100 pointer-events-none"
      style={{
        backgroundImage: `url(${noise})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    {/* ---------- Sidebar ---------- */}
    <aside className="fixed left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-md flex flex-col border-r border-zinc-800">
    <div
    className="absolute inset-0 opacity-50 pointer-events-none"
    style={{
      backgroundImage: `url(${noise})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />
        <div className="pt-8 px-6 flex items-center">
          <img src="./logo.png" width="40px" className="mr-3" />
          <h1 className="text-2xl font-semibold tracking-tight">Lumio</h1>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 text-base">
          {menuItems.map(({ id, label, subItems, icon: Icon }) => {
            const isActive = activeTab === id
            const isOpen = openDropdown === id

            return (
              <div key={id}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (subItems) {
                      setOpenDropdown(isOpen ? null : id)
                      setActiveTab(id)
                    } else {
                      setActiveTab(id)
                      setOpenDropdown(null)
                    }
                  }}
                  className={`w-full flex items-center gap-3 justify-start rounded-lg px-4 py-3 text-base transition-all
                    ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon className="w-5 h-5 text-zinc-400" />
                  <span
                    className={
                      label === "Connectivity"
                        ? "text-zinc-400"
                        : isActive
                          ? "text-white"
                          : "text-zinc-400 group-hover:text-white"
                    }
                  >
                    {label}
                  </span>
                </Button>
                {subItems && isOpen && (
                  <div className="ml-6 mt-2 space-y-1">
                    {subItems.map((sub) => (
                      <Button
                        key={sub}
                        variant="ghost"
                        onClick={() => {
                          setActiveTab(id)
                          setActiveSubTab(sub)
                        }}
                        className={`w-full justify-start rounded-md px-3 py-2 text-sm transition-all
                          ${
                            activeSubTab === sub && isActive
                              ? "bg-white/10 text-white"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                      >
                        {sub}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Profile bottom */}
          {address && (
            <div className="px-4 pb-6 mt-auto">   {/* 👈 pushes it to bottom with breathing space */}
              <Badge 
                variant="outline"
                className="w-full justify-center text-zinc-300 font-mono text-sm px-3 py-2 rounded-lg flex items-center gap-2 bg-zinc-900/60 backdrop-blur-sm"
              >
                <Wallet className="w-5 h-5 text-zinc-400 shrink-0" />
                <span>{shortenAddress(address)}</span>
              </Badge>
            </div> 
          )}
      </aside>
    {/* ---------- Main Content ---------- */}
    <div className="ml-64 flex-1 p-8 relative z-10">
      <main className="bg-black rounded-2xl border border-zinc-800 p-8 shadow-xl">

        {/* Header inside the card */}
        <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {getActiveTabLabel()}
            {activeTab === "engagement" ? ` / ${activeSubTab}` : ""}
          </h2>
        </header>
        {/* Content */}
        <div className="text-center">{renderContent()}</div>
      </main>
    </div>
  </div>
)
}
