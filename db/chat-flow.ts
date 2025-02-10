import { ChatFlow, FlowState } from "@/types/chat-flow"
import { supabase } from "@/lib/supabase/browser-client"

export const getChatFlowByChatId = async (chatId: string): Promise<ChatFlow[]> => {
  const { data, error } = await supabase
    .from("chat_flow")
    .select("*")
    .eq("chat_id", chatId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error("Error fetching chat flow:", error)
    return []
  }

  return data || []
}