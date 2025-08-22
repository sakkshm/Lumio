import { useNavigate } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen bg-black overflow-hidden text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/5 to-transparent animate-wave-x"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-400/5 to-transparent animate-wave-y"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-radial from-gray-800/40 via-gray-900/30 to-black"></div>

        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full animate-spin-slow">
            <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-conic from-white/20 via-gray-300/15 via-gray-500/10 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="absolute top-0 right-0 w-full h-full animate-spin-reverse">
            <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-gradient-conic from-gray-300/20 via-white/10 to-transparent rounded-full blur-2xl"></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[400px] h-[400px] rounded-full border-2 border-white/15 animate-ping-slow"></div>
            <div className="absolute w-[600px] h-[600px] rounded-full border border-gray-400/10 animate-ping-slower"></div>
            <div className="absolute w-[800px] h-[800px] rounded-full border border-gray-500/8 animate-ping-slowest"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-full animate-pulse-slow">
            <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-conic from-gray-400/15 via-gray-300/10 to-transparent rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-gradient-radial from-gray-400/30 to-transparent rounded-full blur-xl animate-float-complex"></div>
        <div className="absolute bottom-1/3 left-1/6 w-32 h-32 bg-gradient-radial from-white/25 to-transparent rounded-full blur-lg animate-orbit"></div>
        <div className="absolute top-1/2 right-1/5 w-24 h-24 bg-gradient-radial from-gray-300/20 to-transparent rounded-full blur-md animate-float-spiral"></div>
        <div className="absolute bottom-1/4 right-1/3 w-28 h-28 bg-gradient-radial from-gray-500/20 to-transparent rounded-full blur-lg animate-drift"></div>

        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="constellation" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#9ca3af" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6b7280" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M100,200 L300,150 L500,300 L700,100 L900,250"
            stroke="url(#constellation)"
            strokeWidth="1"
            fill="none"
            className="animate-draw-line"
          />
          <path
            d="M200,400 L400,350 L600,500 L800,300"
            stroke="url(#constellation)"
            strokeWidth="1"
            fill="none"
            className="animate-draw-line-delayed"
          />
        </svg>
      </div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 backdrop-blur-sm bg-black/20">
        <div className="text-white font-bold text-2xl tracking-wider flex justify-center items-center">
          <img src="./logo.png" width="40px" className="mr-2"/>
          LUMIO
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm text-gray-300">
          <a className="hover:text-white transition-colors cursor-pointer font-medium">Products</a>
          <a className="hover:text-white transition-colors cursor-pointer font-medium">Developers</a>
          <a className="hover:text-white transition-colors cursor-pointer font-medium">Explore</a>
          <a className="hover:text-white transition-colors cursor-pointer font-medium">Contact</a>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8">
        <div className="mb-8">
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-6 tracking-tight">Lumio is Live</h1>
        <h2 className="text-xl md:text-2xl text-gray-300 text-center mb-8 font-light">
          AI-powered Autonomous Community Maintainer
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mb-12 leading-relaxed text-lg">
          Fast, affordable, and seamless — Lumio powers AI-driven community management on the Permaweb, unifying networks and enabling autonomous governance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 bg-gradient-to-r from-white to-gray-200 text-black font-semibold rounded-lg text-lg shadow-lg hover:from-gray-100 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="relative z-10 py-20 px-8 bg-gradient-to-b from-black via-gray-900/50 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Enter a new universe of connected services</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
            Lumio makes it easy to scale communities with low cost, fast execution, and security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-6xl font-bold text-white mb-2">249+</h3>
              <p className="text-gray-400 text-lg">Active communities</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-6xl font-bold text-white mb-2">$116B+</h3>
              <p className="text-gray-400 text-lg">Value secured</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group">
            <div className="w-12 h-12 bg-white/10 rounded-lg mb-6 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
            <h4 className="text-xl font-bold mb-4">One Secure Account</h4>
            <p className="text-gray-400 leading-relaxed">
              Manage all your digital assets in one place with enterprise-grade security.
            </p>
          </div>
          <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group">
            <div className="w-12 h-12 bg-white/10 rounded-lg mb-6 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <h4 className="text-xl font-bold mb-4">Seamless Payments</h4>
            <p className="text-gray-400 leading-relaxed">Instant, low-cost transactions across multiple blockchains.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group">
            <div className="w-12 h-12 bg-white/10 rounded-lg mb-6 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <div className="w-6 h-6 bg-white rounded-lg rotate-45"></div>
            </div>
            <h4 className="text-xl font-bold mb-4">Decentralized Governance</h4>
            <p className="text-gray-400 leading-relaxed">
              Participate in community-driven governance and decision making.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 bg-black text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Enter the Cosmos</h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
          Be part of the open economy of the future. Build, scale, and thrive with Lumio.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-12 py-4 bg-gradient-to-r from-gray-200 to-white text-black font-semibold rounded-xl text-lg shadow-lg hover:scale-105 hover:shadow-white/20 transition-all duration-300"
        >
          Get Started
        </button>
      </section>

      <footer className="relative z-10 py-12 px-8 border-t border-gray-800 text-gray-400 bg-gray-900/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h5 className="font-semibold text-white mb-4">Products</h5>
            <ul className="space-y-3">
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Overview</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Features</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Pricing</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Developers</h5>
            <ul className="space-y-3">
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Docs</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">API</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Community</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Company</h5>
            <ul className="space-y-3">
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">About</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Careers</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Blog</a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-4">Support</h5>
            <ul className="space-y-3">
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Help Center</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Contact</a>
              </li>
              <li>
                <a className="hover:text-white transition-colors cursor-pointer">Status</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
