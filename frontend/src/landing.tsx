import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Network, Shield, MessageSquare, Users, BarChart3, Bell, ChevronRight, X } from "lucide-react"
import { useNavigate } from "react-router-dom" 
import noise from "@/components/noisy.png"

export default function LumioLandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Global placeholder background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-50 z-0"
        style={{ backgroundImage: `url(/placeholder.svg?height=1080&width=1920&query=dark+abstract+noise+texture)` }}
      />

      {/* Content wrapper */}
      <div className="relative z-10">
        
        {/* Wrapper for Navbar + Hero with noise */}
        <div className="relative">
          {/* Noise background (only covers navbar + hero) */}
          {/* Noise background */}
<div
  className="absolute inset-0 bg-repeat opacity-60 pointer-events-none"
  style={{
    backgroundImage: `url(${noise})`,
    backgroundSize: "220%",
    backgroundPosition: "80% center" // shift left (smaller % = more left)
  }}
/>


{/* Fade-out gradient */}
{/* Fade-out gradient */}
<div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-black pointer-events-none" />
          {/* Header */}
          <header className="relative z-10 flex items-center justify-between px-8 py-6">
            <div className="text-xl font-bold">LUMIO</div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">products</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">developers</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">explore</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">contact</a>
            </nav>
            <Button
              onClick={() => navigate("/login")}
              className="bg-black hover:bg-black text-white border border-gray-600 rounded-full px-6 cursor-pointer"
            >
              Get Started
            </Button>
          </header>

          {/* Hero Section */}
          <section className="relative text-center py-20 px-8 overflow-hidden">
            {/* Foreground content */}
            <div className="relative z-10">
<h1 className="text-6xl font-bold mb-6 leading-tight font-roboto">
  Handle Your{" "}
  <span className="italic font-dancing font-light">
    Social
  </span>
  <br />
  <span className="italic font-dancing font-light">
    Communities
  </span>{" "}
  Like A Pro
</h1>


              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Lumio powers AI-driven community management on the <span className="text-white">Permaweb</span>, unifying
                networks and enabling autonomous governance.
              </p>

              <Button className="bg-black hover:bg-black text-white border border-gray-600 rounded-full px-8 py-3 cursor-pointer">
                Add to Server
              </Button>
            </div>
          </section>
        </div>

        {/* Dashboard Preview */}
        <section className="px-8 mb-20">
  <div className="max-w-6xl mx-auto relative">
    {/* Dashboard Container */}
    <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-gray-400/40 shadow-2xl overflow-hidden -mt-10">
      {/* Dashboard Header */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/50 p-6 border-r border-gray-700/40">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-7 h-7 bg-white rounded flex items-center justify-center shadow">
              <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
            </div>
            <span className="text-lg font-semibold text-white">Lumio</span>
          </div>

          <nav className="space-y-1 text-sm">
            <div className="flex items-center gap-3 bg-gray-800/70 text-white px-3 py-2 rounded-lg">
              <Network className="w-4 h-4" />
              Connectivity
            </div>
            <div className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800/40 px-3 py-2 rounded-lg transition">
              <Shield className="w-4 h-4" />
              Moderations
            </div>
            <div className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800/40 px-3 py-2 rounded-lg transition">
              <MessageSquare className="w-4 h-4" />
              Community Assistant
            </div>
            <div className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800/40 px-3 py-2 rounded-lg transition">
              <Users className="w-4 h-4" />
              Community Engagement
            </div>
            <div className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-gray-800/40 px-3 py-2 rounded-lg transition">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Connectivity</h2>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>

          <div className="border-b border-gray-700/40 mb-6"></div>

          <h3 className="text-base font-medium mb-4 text-white">Select Platform</h3>

          <div className="grid grid-cols-3 gap-6">
            {/* Discord Card */}
            <Card className="bg-gray-800/30 border border-gray-700/30 p-5 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full mr-0.5"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-600 text-gray-400 bg-transparent"
                >
                  View Demo
                </Button>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">Discord</h4>
              <p className="text-xs text-gray-400 mb-3">
                Create bots for Discord servers and communities
              </p>
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  Slash Commands
                  <div className="w-1 h-1 bg-green-500 rounded-full ml-auto"></div>
                  Voice Integration
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  Role Management
                </div>
              </div>
              <Button className="w-full bg-black border-2 text-white hover:bg-gray-600 text-xs h-8 rounded-md">
                Add to Server
              </Button>
            </Card>

            {/* Telegram Card */}
            <Card className="bg-gray-800/30 border border-gray-700/30 p-5 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="w-4 h-2 bg-black rotate-45 rounded-sm"></div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-600 text-gray-400 bg-transparent"
                >
                  View Demo
                </Button>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">Telegram</h4>
              <p className="text-xs text-gray-400 mb-3">
                Deploy bots for Telegram messaging platform
              </p>
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  Slash Commands
                  <div className="w-1 h-1 bg-green-500 rounded-full ml-auto"></div>
                  Voice Integration
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  Role Management
                </div>
              </div>
              <Button className="w-full bg-black border-2 text-white hover:bg-gray-600 text-xs h-8 rounded-md">
                Add to Community
              </Button>
            </Card>

            {/* Subspace Card */}
            <Card className="bg-gray-800/30 border border-gray-700/30 p-5 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-600 text-gray-400 bg-transparent"
                >
                  View Demo
                </Button>
              </div>
              <h4 className="text-sm font-medium text-white mb-1">Subspace</h4>
              <p className="text-xs text-gray-400 mb-3">
                Build on the subspace decentralized Network
              </p>
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  Slash Commands
                  <div className="w-1 h-1 bg-green-500 rounded-full ml-auto"></div>
                  Voice Integration
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  Role Management
                </div>
              </div>
              <Button className="w-full bg-black border-2 text-white hover:bg-gray-600 text-xs h-8 rounded-md">
                Add to Server
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


        {/* Partner Logos */}
        <section className="px-8 mb-20">
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-2xl font-bold">logoipsum</div>
            <div className="text-2xl font-bold">LUMIO</div>
            <div className="text-2xl font-bold">○</div>
            <div className="text-2xl font-bold">∞</div>
            <div className="text-2xl font-bold">Logoipsum</div>
            <div className="text-2xl font-bold">LOGO</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-8 mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Do More With Lumio</h2>

          <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
            {/* Server Analytics */}
            <Card className="bg-black border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold mb-2">Server Analytics</h3>
              <p className="text-gray-400 text-sm mb-6">
                Get detailed insights with targets and goals to grow your community members.
              </p>

              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="60, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="30, 100"
                    strokeDashoffset="-60"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="10, 100"
                    strokeDashoffset="-90"
                  />
                </svg>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-400">Members Target</span>
                  <span className="ml-auto text-white">10000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-400">Bots Completed</span>
                  <span className="ml-auto text-white">1000</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-400">Active Events</span>
                  <span className="ml-auto text-white">5</span>
                </div>
              </div>
            </Card>

            {/* Auto Moderation */}
            <Card className="bg-black border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold mb-2">Auto Moderation</h3>
              <p className="text-gray-400 text-sm mb-6">
                Automatically detect and moderate content in the server and the level of strictness is customizable.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className="text-sm text-white">User has been Warned</span>
                </div>

                <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-white">User Role Added</span>
                </div>

                <div className="flex items-center gap-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⚠</span>
                  </div>
                  <span className="text-sm text-white">User is now on timeout</span>
                </div>
              </div>
            </Card>

            {/* Docs Agent */}
            <Card className="bg-black border-gray-700/50 p-6">
              <h3 className="text-xl font-semibold mb-2">Docs Agent</h3>
              <p className="text-gray-400 text-sm mb-6">
                Lumio can keep track of your documentation, and will respond to any docs related query
              </p>

              <div className="space-y-3">
                <div className="bg-gray-800/60 rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white">
                      ?
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">What is a Parmaweb?</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/60 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">Paranet - Lumio's response</p>
                      <p className="text-sm text-white">
                        A Paranet is a decentralized knowledge graph that enables AI agents to collaborate and share
                        information across different domains. Read more
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/60 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">What is a paranet?</span>
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ml-auto">
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20 px-8">
          <h2 className="text-4xl font-bold mb-6">Join The Experience</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Be part of the open economy of the future. Build, scale, and thrive with Lumio.
          </p>
          <Button className="bg-gray-800  text-white border rounded-full px-8 py-3">
            Add to Server
          </Button>
        </section>

        {/* Footer */}
        <footer className=" px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-5 gap-8">
              <div>
                <div className="text-xl font-bold mb-6">LUMIO</div>
                <div className="flex space-x-4">
                  <X className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                  <div className="w-5 h-5 bg-gray-400 hover:bg-white cursor-pointer rounded"></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Products</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="hover:text-white cursor-pointer">Overview</div>
                  <div className="hover:text-white cursor-pointer">Features</div>
                  <div className="hover:text-white cursor-pointer">Pricing</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Developers</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="hover:text-white cursor-pointer">API</div>
                  <div className="hover:text-white cursor-pointer">Docs</div>
                  <div className="hover:text-white cursor-pointer">Community</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="hover:text-white cursor-pointer">About</div>
                  <div className="hover:text-white cursor-pointer">Careers</div>
                  <div className="hover:text-white cursor-pointer">Blog</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="hover:text-white cursor-pointer">Help Center</div>
                  <div className="hover:text-white cursor-pointer">Contact</div>
                  <div className="hover:text-white cursor-pointer">Status</div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 text-center text-gray-400 text-sm">
              © 2024 Lumio AI. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
