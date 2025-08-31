import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function Analytics() {
  const data = [
    { name: "Telegram Users", value: 420 },
    { name: "Discord Users", value: 280 },
  ]

  const COLORS = ["#0088FE", "#00C49F"]

  return (
    <div className="space-y-6 p-6 h-full">
      <h2 className="text-xl font-semibold text-white text-center">User Analytics</h2>
      <p className="text-zinc-400 text-center">Breakdown of users across platforms</p>

      {/* Grid with 3 equal-height sections */}
      <div className="grid grid-cols-3 gap-6 w-full">
        {/* --- Semi-circle chart --- */}
        <div className="bg-zinc-900 rounded-2xl shadow p-4 flex items-center justify-center h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="80%"     // keep it inside card
                startAngle={180}
                endAngle={0}
                outerRadius="80%"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        {/* --- Telegram count --- */}
        <div className="bg-zinc-900 rounded-2xl shadow p-6 flex flex-col items-center justify-center h-64">
          <h3 className="text-lg text-zinc-300">Telegram Users</h3>
          <p className="text-3xl font-bold text-[#0088FE]">{data[0].value}</p>
        </div>

        {/* --- Discord count --- */}
        <div className="bg-zinc-900 rounded-2xl shadow p-6 flex flex-col items-center justify-center h-64">
          <h3 className="text-lg text-zinc-300">Discord Users</h3>
          <p className="text-3xl font-bold text-[#00C49F]">{data[1].value}</p>
        </div>
      </div>
    </div>
  )
}
