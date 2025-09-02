import { useLocation, useParams } from "react-router-dom"

export default function PollPage() {
  const { pollId } = useParams()
  const { state: poll } = useLocation()

  return (
    <div className="p-10 text-center text-white">
      <h2 className="text-2xl font-bold">Poll ID: {pollId}</h2>

      {poll ? (
        <>
          <p className="text-xl mt-4">{poll.question}</p>
          <ul className="mt-4 space-y-2">
            {poll.options?.map((opt: string, i: number) => (
              <li key={i} className="p-3 bg-zinc-800 rounded-xl">
                {opt}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-zinc-400 mt-4">
          Poll data not available. (Try fetching by ID here.)
        </p>
      )}
    </div>
  )
}
