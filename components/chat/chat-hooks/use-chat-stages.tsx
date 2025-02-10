import { useContext, useState, useEffect, useCallback } from 'react'
import { ChatbotUIContext } from '@/context/context'
import { CommandStage, FlowState, ChatFlow } from '@/types'
import { getChatFlowByChatId } from '@/db/chat-flow'

export const stageDisplayNames: Record<CommandStage, string> = {
  explore: "Explore Repository",
  migrate: "Migrate Code", 
  codepush: "Push Changes",
  deploy: "Deploy Changes",
  search: "Search Files",
  cleanup: "Clean Up"
}

export const stateColors: Record<FlowState, string> = {
  NOT_STARTED: "bg-gray-100",
  IN_PROGRESS: "bg-blue-100",
  SUCCESS: "bg-green-100",
  FAILED: "bg-red-100"
}

export interface StageState {
  stage: CommandStage
  status: FlowState
}

export const useChatStages = () => {
  const { selectedChat } = useContext(ChatbotUIContext)
  const selectedChatId = selectedChat?.id;
  const [stageStates, setStageStates] = useState<ChatFlow[]>([])

  const fetchStages = useCallback(async () => {
    const defaultStages: ChatFlow[] = Object.keys(stageDisplayNames).map(stage => ({
      id: 0,
      chat_id: selectedChatId || '',
      command_stage: stage as CommandStage,
      flow_state: 'NOT_STARTED' as FlowState,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: null
    }))

    try {
      const data = selectedChatId ? await getChatFlowByChatId(selectedChatId) : []
      if (data.length === 0) {
        setStageStates([...defaultStages])
      } else {
        const stageMap = new Map(data.map(stage => [stage.command_stage, stage]))
        const allStages = defaultStages.map(defaultStage => 
          stageMap.get(defaultStage.command_stage) || defaultStage
        )
        setStageStates([...allStages])
      }
    } catch (error) {
      console.error("Error fetching stages:", error)
      setStageStates([...defaultStages])
    }
  }, [])

  useEffect(() => {
  }, [stageStates])

  return {
    stageStates,
    fetchStages,
    setStageStates
  }
}
