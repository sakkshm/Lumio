"use client"

import { useParams } from "react-router-dom"

export default function ServerPage() {
  const { serverId } = useParams()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Server Page</h1>
      <p className="text-zinc-400 mt-2">You opened server:</p>
      <p className="font-mono text-lg bg-zinc-800 px-4 py-2 rounded mt-3">
        {serverId}
      </p>
    </div>
  )
}
