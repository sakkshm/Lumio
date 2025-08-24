"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"
import { useActiveAddress } from "@arweave-wallet-kit/react"

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
    { id: "bot-selection", label: "Connectivity" },
    { id: "moderations", label: "Moderations" },
    { id: "assistant", label: "Community Assistant" },
    {
      id: "engagement",
      label: "Community Engagement",
      subItems: ["Leaderboard", "Polls", "Onboarding", "Bounties", "Saved moments", "Waitlist", "Personas"],
    },
    { id: "analytics", label: "Analytics" },
    { id: "logs", label: "Logs" },
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
        return <div>Select a section</div>
    }
  }
  const getActiveTabLabel = () => {
    const item = menuItems.find((menu) => menu.id === activeTab)
    return item ? item.label : activeTab
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
        <div className="pt-9 px-6 flex items-center ">
          <img src="./logo.png" width="40px" className="mr-2"/>
          <h1 className="text-3xl font-bold tracking-tight">Lumio</h1>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map(({ id, label, subItems }) => {
            const isActive = activeTab === id
            const isOpen = openDropdown === id

            return (
              <div key={id} className="mt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (subItems) {
                      setOpenDropdown(isOpen ? null : id)
                      setActiveTab(id) // select parent tab
                    } else {
                      setActiveTab(id)
                      setOpenDropdown(null) // close dropdown if others
                    }
                  }}
                  className={`w-full flex items-center gap-4 justify-start rounded-lg px-5 py-3 transition-all text-md
                    ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}
                >
                  {label}
                </Button>
                {/* Nested items */}
                {subItems && isOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {subItems.map((sub) => (
                      <Button
                        key={sub}
                        variant="ghost"
                        onClick={() => {
                          setActiveTab(id)
                          setActiveSubTab(sub)
                        }}
                        className={`w-full justify-start rounded-lg px-3 py-1.5 text-sm transition-all font-ligh
                          ${
                            activeSubTab === sub && isActive
                              ? "bg-zinc-700 text-white"
                              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
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
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold">
            {getActiveTabLabel()}
            {activeTab === "engagement" ? ` / ${activeSubTab}` : ""}
          </h2>
          {/* Address top right */}
          {address && (
            <Badge
              variant="outline"
              className="border-zinc-700 text-zinc-300 font-mono text-sm px-3 py-2 rounded-lg flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{shortenAddress(address)}</span>
            </Badge>
          )}
        </header>

        <main>{renderContent()}</main>
      </div>
    </div>
  )
}
