import { useEffect, useState } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useParams } from "react-router-dom"

const SERVERS_API_URL = `http://210.79.128.231/server`

type LogEntry = {
  id: string
  type: string
  data: string
  timestamp: string
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  const address = useActiveAddress()
  const { serverId } = useParams()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${SERVERS_API_URL}/get-logs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serverID: serverId,
            walletID: address,
            limit: 50,
          }),
        })

        if (!res.ok) throw new Error("Failed to fetch logs")

        const data = await res.json()
        if (Array.isArray(data.logs)) {
          const sortedLogs = data.logs.sort(
            (a: LogEntry, b: LogEntry) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
          setLogs(sortedLogs)
        } else {
          setLogs([])
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load logs")
      } finally {
        setLoading(false)
      }
    }

    if (serverId && address) {
      fetchLogs()
    }
  }, [serverId, address])

  if (loading) {
  return (
    <div className="flex-1 h-full bg-black text-white flex items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <span className="text-lg">Loading logs...</span>
      </div>
    </div>
  )
}

 if (logs.length === 0) {
  return (
    <div className="flex-1 h-full bg-black text-white flex items-center justify-center">
      <div className="flex items-center gap-2 text-zinc-400">
        <AlertTriangle className="w-6 h-6" />
        <span>No logs found.</span>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-1 bg-zinc-950/80 border border-zinc-800 rounded-lg p-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 border-b border-zinc-800 last:border-b-0 py-2"
            >
              <span className="text-xs text-zinc-500 shrink-0 w-32">
                {new Date(log.timestamp).toLocaleString()}
              </span>
              <span className="text-xs font-semibold uppercase">
                [{log.type}]
              </span>
              <span className="text-sm text-zinc-300 break-all">{log.data}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
