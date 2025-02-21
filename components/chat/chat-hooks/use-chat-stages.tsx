import { useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { ChatbotUIContext } from '@/context/context'
import { ChatFlow } from '@/types'
import { getChatFlowByChatId } from '@/db/chat-flow'

export const stageDisplayNames: Record<string, string> = {
  // V1
  explore: "Explore Repository",
  index: "Index Code", 
  codepush: "Push Changes",
  deploy: "Deploy Changes",
  search: "Search Files",
  cleanup: "Clean Up",
  logs: "View Logs",
  // V3
  index_mapping_generator: "Generate Index Mapping",
  indexing_script_generator: "Generate Indexing Script",
  start_indexing: "Start Indexing",
  search_api_generator: "Generate Search API",
  es_search_api_generator: "Generate Pre-Indexed Search API",
  code_push: "Push Code",
  deploy_api: "Deploy API",
  initiate_vector_training: "Vector Training",
  perform_search_activity: "Search"
}

export const stateColors: Record<string, string> = {
  NOT_STARTED: "bg-gray-100",
  IN_PROGRESS: "bg-blue-100",
  SUCCESS: "bg-green-100",
  FAILED: "bg-red-100"
}

export const useChatStages = () => {
  const { selectedChat, chatStages, setChatStages } = useContext(ChatbotUIContext)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const selectedChatId = selectedChat?.id
  const model = selectedChat?.model

  const V1_STAGES = useMemo(() => [
    "explore",
    "index",
    "codepush",
    "deploy",
    "search",
    "cleanup",
  ] as const, [])

  const V3_STAGES = useMemo(() => [
    "index_mapping_generator",
    "indexing_script_generator",
    "start_indexing",
    "search_api_generator",
    "es_search_api_generator",
    "code_push",
    "deploy_api",
    "initiate_vector_training",
    "perform_search_activity"
  ] as const, [])

  const fetchStages = useCallback(async () => {
    if (!selectedChatId || !model) {
      console.warn("Skipping fetchStages: selectedChat is undefined")
      return
    }
    const applicableStages = model.toLowerCase().includes('v3') ? V3_STAGES : V1_STAGES
    
    setIsLoading(true)
    setError(null)
    
    const defaultStages: ChatFlow[] = applicableStages.map(stage => ({
      id: 0,
      chat_id: selectedChatId,
      command_stage: stage,
      flow_state: 'NOT_STARTED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: null
    }))

    try {
      const data = await getChatFlowByChatId(selectedChatId)
      if (data.length === 0) {
        setChatStages([...defaultStages])
      } else {
        const stageMap = new Map(data.map(stage => [stage.command_stage, stage]))
        const allStages = defaultStages.map(defaultStage => 
          stageMap.get(defaultStage.command_stage) || defaultStage
        )
        setChatStages([...allStages])
      }
    } catch (error) {
      console.error("Error fetching stages:", error)
      setError(error instanceof Error ? error : new Error('Failed to fetch stages'))
      setChatStages([...defaultStages])
    } finally {
      setIsLoading(false)
    }
  }, [selectedChatId, model, setChatStages])

  return {
    chatStages,
    fetchStages,
    setChatStages,
    isLoading,
    error
  }
}
