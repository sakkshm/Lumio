"use client"

import { ConnectButton } from "@arweave-wallet-kit/react"
import { Button } from "@/components/ui/button"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Shield, Infinity, Zap } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const address = useActiveAddress()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-zinc-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center text-center max-w-md w-full space-y-12 p-8 rounded-2xl shadow-2xl bg-black/40 backdrop-blur"
      >
        {/* Logo + Tagline */}
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-3"
          >
            <h1 className="text-5xl font-extrabold bg-white bg-clip-text text-transparent tracking-tight">
              Lumio
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-gray-700 to-gray-500 mx-auto rounded-full"></div>
          </motion.div>

          <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto">
            AI-powered, autonomous community maintainer on the{" "}
            <span className="font-semibold text-white">Permaweb</span>.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-4">
          <ConnectButton className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white border border-gray-700 rounded-xl py-4 px-6 transition-all duration-300 hover:border-gray-500 font-medium shadow-lg" />

          <Button
            onClick={() => {
              if (address) navigate("/dashboard")
            }}
            disabled={!address}
            className="w-full bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-200 hover:to-gray-100 rounded-xl py-4 px-6 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl cursor-pointer"
          >
            Enter Dashboard
          </Button>
        </div>

        {/* Features footer */}
        <div className="pt-6 border-t border-gray-800 w-full">
          <div className="flex justify-center gap-6 text-gray-400 text-sm font-medium">
            <span className="flex items-center gap-1">
              <Shield size={14} className="text-gray-500" /> Decentralized
            </span>
            <span className="flex items-center gap-1">
              <Infinity size={14} className="text-gray-500" /> Permanent
            </span>
            <span className="flex items-center gap-1">
              <Zap size={14} className="text-gray-500" /> Autonomous
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
