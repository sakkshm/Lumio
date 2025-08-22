import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default function CommunityAssistant() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold"></h2>
      <p className="text-zinc-400">Enter your community docs as wikis</p>
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
  )
}
