import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Server, Wallet } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { motion, AnimatePresence } from "framer-motion"
import { toast, Toaster } from "sonner"
import { ServerCardSkeleton } from "./components/ServerCardSkeleton"
import noise from "@/components/noisy.png"

// API endpoint
const SERVERS_API_URL = `${import.meta.env.VITE_BACKEND_URL}/server`

// Server type definition
interface ServerType {
  serverID: string
  name: string
  description?: string
}

export default function Dashboard() {
  const navigate = useNavigate()
  const address = useActiveAddress()

  // UI + state management
  const [showForm, setShowForm] = useState(false)
  const [serverName, setServerName] = useState("")
  const [description, setDescription] = useState("")
  const [servers, setServers] = useState<ServerType[]>([])
  const [loading, setLoading] = useState(true)

  const isSaving = useRef(false) // prevent duplicate requests

  // Generate unique server ID
  const generateUUID = () => {
    try {
      return crypto.randomUUID().substring(0, 8)
    } catch {
      return Math.random().toString(36).substring(2, 10)
    }
  }

  // Fetch servers when wallet address changes
  useEffect(() => {
    if (!address) return

    const fetchServers = async () => {
      try {
        const response = await fetch(`${SERVERS_API_URL}/get-servers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletID: address }),
        })

        if (!response.ok) throw new Error("Failed to fetch servers")

        const data = await response.json()

        if (Array.isArray(data)) {
          setServers(data)
        } else {
          console.error("Unexpected server data:", data)
          setServers([])
        }
      } catch (err) {
        console.error("Error fetching servers:", err)
        toast.error("Failed to load servers")
        setServers([])
      } finally {
        setLoading(false)
      }
    }

    fetchServers()
  }, [address])

  // Save new server
  const handleSave = async () => {
    if (isSaving.current) return
    isSaving.current = true

    if (!serverName) {
      toast.error("Server name is required")
      isSaving.current = false
      return
    }

    const newServer = {
      serverID: generateUUID(),
      name: serverName,
      description,
    }

    try {
      const response = await fetch(`${SERVERS_API_URL}/add-server`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverID: newServer.serverID,
          walletID: address,
          name: newServer.name,
          description: newServer.description,
        }),
      })

      if (!response.ok) {
        toast.error("Failed to add server")
        isSaving.current = false
        return
      }

      const data = await response.json()
      console.log("Server added:", data)

      // Update UI with new server
      setServers((prev) => [...prev, newServer])
      toast.success("Server created successfully!")

      // Navigate to server page
      navigate(`/${newServer.serverID}/server`, { state: { server: newServer } })

      // Cleanup
      setShowForm(false)
      setServerName("")
      setDescription("")
    } catch (err) {
      toast.error("Failed to add server")
      isSaving.current = false
    }
  }

  // Shorten wallet address for display
  const truncateAddress = (address: string | undefined, start = 5, end = 4) => {
    if (!address) return ""
    if (address.length <= start + end) return address
    return `${address.slice(0, start)}...${address.slice(-end)}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className="fixed inset-0 bg-repeat opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${noise})`,
          backgroundSize: "110%",
          backgroundPosition: "center",
        }}
      />
      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #222",
          },
        }}
      />

      {/* ---------- Header ---------- */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <h1 className="text-2xl font-bold">Lumio</h1>

          <div className="flex items-center gap-4">
            {/* Wallet badge */}
            {address && (
              <Badge
                variant="outline"
                className="border-zinc-700 text-zinc-300 font-mono text-md flex items-center gap-1"
              >
                <Wallet className="w-3 h-3" /> {truncateAddress(address)}
              </Badge>
            )}

            {/* Add Server button */}
            <Button
              onClick={() => setShowForm(true)}
              className="bg-white text-black hover:bg-zinc-200 font-medium cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Server
            </Button>
          </div>
        </div>
      </header>

      {/* ---------- Main Content ---------- */}
      <main className="p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">
          {/* Loading skeleton */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 pt-4">
              <ServerCardSkeleton />
              <ServerCardSkeleton />
              <ServerCardSkeleton />
              <ServerCardSkeleton />
            </div>
          ) : servers.length === 0 ? (
            // Empty state
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                  <Server className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No servers yet</h3>
                <p className="text-zinc-400 text-center mb-8 max-w-md">
                  Get started by creating your first server.
                </p>
              </CardContent>
            </Card>
          ) : (
            // Server list
            <div>
              <h1 className="mt-4 mb-6 text-2xl font-bold">Your Servers</h1>
              <div className="grid gap-6 sm:grid-cols-2">
                {servers.map((server) => (
                  <Link key={server.serverID} to={`/${server.serverID}/server`}>
                    <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Server className="w-5 h-5 text-zinc-400" /> {server.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-zinc-400 text-sm">
                          {server.description || "No description"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ---------- Add Server Modal ---------- */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Card className="w-xl bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" /> Add New Server
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 px-6 md:px-12">
                  {/* Server name input */}
                  <div className="flex flex-col space-y-2 w-full">
                    <label className="text-sm font-medium text-zinc-300">
                      Server Name
                    </label>
                    <Input
                      value={serverName}
                      onChange={(e) => setServerName(e.target.value)}
                      placeholder="Enter server name"
                      className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 px-3 py-2"
                    />
                  </div>

                  {/* Description input */}
                  <div className="flex flex-col space-y-2 w-full">
                    <label className="text-sm font-medium text-zinc-300">
                      Description
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your server"
                      className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[120px] px-3 py-2"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-white text-black hover:bg-zinc-200 font-medium cursor-pointer"
                    >
                      Create Server
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
