import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default function CommunityAssistant() {
  return (
    <div className="flex flex-col">
      <div className="space-y-6">
      <h2 className="text-xl font-semibold"></h2>
      <p className="text-zinc-400 text-xl">Describe a persona for your Chat bot</p>
      <Textarea
        placeholder="Place your prompt here..."
        className="bg-zinc-900 border-zinc-700 text-white min-h-[200px]"
      />
    </div>
    <div className="space-y-6">
      <h2 className="text-xl font-semibold"></h2>
      <p className="text-zinc-400 text-xl">Enter your community docs/wikis</p>
      <Textarea
        placeholder="Paste or write your docs here..."
        className="bg-zinc-900 border-zinc-700 text-white min-h-[200px]"
      />
      <div className="flex justify-end">
        <Button className="h-10 w-28 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>
    </div>
    </div>
  )
}
