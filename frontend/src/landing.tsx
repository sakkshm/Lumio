import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Network, Shield, MessageSquare, Users, BarChart3, Bell, ChevronRight, X } from "lucide-react"
import { useNavigate } from "react-router-dom" 
import noise from "@/components/noisy.png"
import front from "./front.png"

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
                          
              <Button onClick={() => navigate("/login")} className="bg-black hover:bg-black text-white border border-gray-600 rounded-full px-8 py-3 cursor-pointer">
                Add to Server
              </Button>
            </div>
          </section>
        </div>

        {/* Dashboard Preview */}
        <section className="px-8 mb-20">
  <div className="max-w-7xl mx-auto relative -mt-10">
    <div className="relative">
      {/* The image itself */}
      <img
        src={front}
        alt="Lumio Dashboard Preview"
        className="w-full max-w-7xl h-[600px] object-cover rounded-2xl shadow-2xl border border-gray-400/40"
      />

      {/* Fade effect at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-black/70 to-black rounded-b-2xl" />

    </div>
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
<footer className="px-8 py-12">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-4 gap-8">
      <div>
        <div className="text-xl font-bold mb-6">LUMIO</div>
        
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
      © 2025 Lumio AI. All rights reserved.
    </div>
  </div>
</footer>

      </div>
    </div>
  )
}
