"use client"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useActiveAddress } from "@arweave-wallet-kit/react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const MEMBER_COLORS = ["#0088FE", "#00C49F"]
const SERVERS_API_URL = `http://210.79.128.231/server`

export default function Analytics() {
  const [memberData, setMemberData] = useState([
    { name: "Telegram Users", value: 0 },
    { name: "Discord Users", value: 0 },
  ])
  const [analytics, setAnalytics] = useState({
    telegramMemberCount: 0,
    discordMemberCount: 0,
    telegramMessageCount: 0,
    discordMessageCount: 0,
  })
  const [loading, setLoading] = useState(true)

  const address = useActiveAddress()
  const { serverId } = useParams()

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!serverId || !address) return

      try {
        const res = await fetch(`${SERVERS_API_URL}/get-analytics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serverID: serverId, walletID: address }),
        })

        if (!res.ok) throw new Error("Failed to fetch analytics")
        const result = await res.json()

        setMemberData([
          { name: "Telegram Users", value: result.telegramMemberCount || 0 },
          { name: "Discord Users", value: result.discordMemberCount || 0 },
        ])

        setAnalytics({
          telegramMemberCount: result.telegramMemberCount || 0,
          discordMemberCount: result.discordMemberCount || 0,
          telegramMessageCount: result.telegramMessageCount || 0,
          discordMessageCount: result.discordMessageCount || 0,
        })
      } catch (err) {
        console.error(err)
        toast.error("Unable to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [serverId, address])

  if (loading) {
  return (
    <div className="flex-1 h-full bg-black text-white flex items-center justify-center">
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <span className="text-lg">Loading analytics...</span>
      </div>
    </div>
  )
}

  return (
    <div className="flex flex-col md:flex-row gap-4 p-6 bg-black">
      {/* Pie Chart */}
      <div className="flex-1 bg-zinc-900 rounded-2xl shadow p-4 flex items-center justify-center min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={memberData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                const RADIAN = Math.PI / 180
                const radius = outerRadius + 15
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    {name} ({(percent * 100).toFixed(0)}%)
                  </text>
                )
              }}
            >
              {memberData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={MEMBER_COLORS[index % MEMBER_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "white" }}
              itemStyle={{ color: "white" }}
            />
            <Legend wrapperStyle={{ color: "white" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Analytics Cards */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-zinc-400">Telegram Members</p>
          <p className="text-2xl font-bold text-white">{analytics.telegramMemberCount}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-zinc-400">Discord Members</p>
          <p className="text-2xl font-bold text-white">{analytics.discordMemberCount}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-zinc-400">Telegram Messages</p>
          <p className="text-2xl font-bold text-white">{analytics.telegramMessageCount}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl shadow flex flex-col items-center justify-center">
          <p className="text-zinc-400">Discord Messages</p>
          <p className="text-2xl font-bold text-white">{analytics.discordMessageCount}</p>
        </div>
      </div>
    </div>
  )
}
