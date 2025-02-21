import { Tables, Json } from "@/supabase/types"

export interface ChatFlow {
  id: number
  chat_id: string
  command_stage: string
  flow_state: string
  metadata: Json
  created_at: string
  updated_at: string
}

export interface ChatFlowPayload {
  chatId: string
  commandStage: string
  metadata?: any
  sequenceOrder: number
}

export interface ChatFlowUpdatePayload {
  flowState: string
  metadata?: any
}
