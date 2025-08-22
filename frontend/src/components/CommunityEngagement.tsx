import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useNavigate } from "react-router-dom"

export default function CommunityEngagement({ activeSection }: { activeSection: string }) {
  const address = useActiveAddress()
  const navigate = useNavigate()

  if (!address) {
    navigate("/")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "Leaderboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              
            </div>
          </div>
        )

      case "Polls":
        return (
          <div className="space-y-6">
            
            <div className="grid gap-6"></div>
          </div>
        )

      case "Onboarding":
        return (
          <div className="space-y-6">
            
            <div className="grid gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Welcome Journey</h3>
              </div>
            </div>
          </div>
        )

      case "Bounties":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              
              <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium">
                Create Bounty
              </button>
            </div>
          </div>
        )

      case "Saved moments":
        return (
          <div className="space-y-6">
            
          </div>
        )

      case "Waitlist":
        return (
          <div className="space-y-6">
            
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Join Early Access</h3>
              <p className="text-zinc-400 mb-6">Get notified when new features become available</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Interested Features</label>
                  <div className="space-y-2">
                    {["Advanced Analytics", "Mobile App", "API Access", "Custom Integrations"].map((feature) => (
                      <label key={feature} className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-zinc-300">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button className="w-full px-4 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors font-medium">
                  Join Waitlist
                </button>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Waitlist Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">1,247</div>
                  <div className="text-sm text-zinc-400">Total Signups</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">89</div>
                  <div className="text-sm text-zinc-400">This Week</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "Personas":
        return (
          <div className="space-y-6">
            
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
