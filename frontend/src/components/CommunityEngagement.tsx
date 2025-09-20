import React, { useEffect } from "react"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useNavigate } from "react-router-dom"
import Onboarding from "./Onboarding"
import Polls from "./PollsPage"
import Announcements from "./Announcements"

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
  serverID,
}: {
  activeSection: string
  polls: Poll[]
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  serverID: string
}) {
  const address = useActiveAddress()
  const navigate = useNavigate()

  // Redirect to home if no active address
  useEffect(() => {
    if (!address) navigate("/")
  }, [address, navigate])

  const renderContent = () => {
    switch (activeSection) {
      case "Polls":
        if (!address) return null // safeguard

        return (
          <Polls
            polls={polls}
            setPolls={setPolls}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            serverID={serverID}
            walletID={address}
          />
        )

      case "Onboarding":
        return (
          <div className="space-y-6">
            <Onboarding />
          </div>
        )
      
      case "Announcements":
        return (
          <div className="space-y-6">
            <Announcements />
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
