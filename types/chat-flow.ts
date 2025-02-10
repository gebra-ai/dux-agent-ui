import { Tables, Json } from "@/supabase/types"

export type CommandStage = 'explore' | 'migrate' | 'codepush' | 'deploy' | 'search' | 'cleanup'
export type FlowState = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUCCESS' | 'FAILED'

export interface ChatFlow {
  id: number
  chat_id: string
  command_stage: CommandStage
  flow_state: FlowState
  metadata: Json
  created_at: string
  updated_at: string
}

export interface ChatFlowPayload {
  chatId: string
  commandStage: CommandStage
  metadata?: any
  sequenceOrder: number
}

export interface ChatFlowUpdatePayload {
  flowState: FlowState
  metadata?: any
}
