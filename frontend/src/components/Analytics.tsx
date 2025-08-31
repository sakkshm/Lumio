"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function Analytics() {
  // Example data
  const data = [
    { name: "Telegram Users", value: 420 },
    { name: "Discord Users", value: 280 },
  ]

  const COLORS = ["#0088FE", "#00C49F"]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">User Analytics</h2>
      <p className="text-zinc-400">Breakdown of users across platforms</p>

      <div className="w-full h-80 bg-zinc-900 rounded-2xl shadow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                const RADIAN = Math.PI / 180
                const radius = outerRadius + 20
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
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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
            <Legend
              wrapperStyle={{
                color: "white", 
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
