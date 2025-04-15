import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createPromptAction,
  setPromptAsActiveAction
} from "@/actions/db/prompts-actions"

export default function PromptsAdminClient() {
  const router = useRouter()

  const handleSetActive = async (
    id: string,
    type: "system" | "user" | "assistant"
  ) => {
    const result = await setPromptAsActiveAction(id, type)
    if (result.isSuccess) {
      toast.success(result.message)
      router.refresh()
    } else {
      toast.error(result.message)
    }
  }
}
