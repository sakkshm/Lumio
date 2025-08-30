import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function CommunityAssistant() {
  return (
    <div className="flex flex-col h-full">
      <div className="space-y-12 flex-1">
        {/* ---------- Exclusive Actions ---------- */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-white" />
            <h2 className="text-xl font-semibold text-white">
              Exclusive Actions
            </h2>
          </div>
          <p className="text-zinc-400 mb-6 text-left">
            Enter a master prompt for your AI Agent
          </p>

          <Textarea
            placeholder="Place your prompt here..."
            className="bg-zinc-900/50 border-zinc-700 text-white min-h-[200px] resize-none"
          />
        </section>

        {/* ---------- Docs Agent Setup ---------- */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-white" />
            <h2 className="text-xl font-semibold text-white">Docs Agent Setup</h2>
          </div>
          <p className="text-zinc-400 mb-6 text-left">
            Enter your community docs as wikis
          </p>

          <Textarea
            placeholder="Paste docs, links, or notes here..."
            className="bg-zinc-900/50 border-zinc-700 text-white min-h-[200px] resize-none"
          />
        </section>

        {/* ---------- Shared Save Button ---------- */}
        <div className="flex justify-start">
          <Button className="bg-zinc-700 hover:bg-zinc-600 text-white">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
