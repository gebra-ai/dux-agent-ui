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

  // Define all possible flows and their stages
  const flowDefinitions = useMemo(() => ({
    v1: ["explore", "index", "codepush", "deploy", "search", "cleanup"],
    v3_normal_indexing: [
      "index_mapping_generator", 
      "indexing_script_generator", 
      "start_indexing", 
      "search_api_generator", 
      "code_push", 
      "deploy_api", 
      "perform_search_activity",
    ],
    v3_existing_indexing: [
      "es_search_api_generator", 
      "code_push", 
      "deploy_api", 
      "perform_search_activity",
    ],
    v3_vector_training: [
      "initiate_vector_training",
      "perform_search_activity"
    ]
  }), [])

  // Define starting stages that identify each flow
  const flowStartStages = useMemo(() => ({
    v1: "explore",
    v3_normal_indexing: "index_mapping_generator",
    v3_existing_indexing: "es_search_api_generator",
    v3_vector_training: "initiate_vector_training"
  }), [])

  const determineActiveFlow = useCallback((existingStages: ChatFlow[]) => {
    // If no stages have been started yet, return empty array
    if (!existingStages.length || existingStages.every(stage => stage.flow_state === 'NOT_STARTED')) {
      return null;
    }

    // Check which flow has been started
    for (const [flowKey, startStage] of Object.entries(flowStartStages)) {
      const startStageData = existingStages.find(s => s.command_stage === startStage);
      if (startStageData && startStageData.flow_state !== 'NOT_STARTED') {
        return flowKey as keyof typeof flowDefinitions;
      }
    }

    return null;
  }, [flowStartStages]);

  const fetchStages = useCallback(async () => {
    if (!selectedChatId || !model) {
      console.warn("Skipping fetchStages: selectedChat is undefined")
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const existingData = await getChatFlowByChatId(selectedChatId)
      const activeFlow = determineActiveFlow(existingData);
      
      if (!activeFlow) {
        setChatStages([]);
        setIsLoading(false);
        return;
      }
      
      const applicableStages = flowDefinitions[activeFlow];
      const defaultStages: ChatFlow[] = applicableStages.map(stage => ({
        id: 0,
        chat_id: selectedChatId,
        command_stage: stage,
        flow_state: 'NOT_STARTED',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: null
      }))

      // Map existing stage data to default stages
      if (existingData.length > 0) {
        const stageMap = new Map(existingData.map(stage => [stage.command_stage, stage]))
        const allStages = defaultStages.map(defaultStage => 
          stageMap.get(defaultStage.command_stage) || defaultStage
        )
        setChatStages([...allStages])
      } else {
        setChatStages([...defaultStages])
      }
    } catch (error) {
      console.error("Error fetching stages:", error)
      setError(error instanceof Error ? error : new Error('Failed to fetch stages'))
      setChatStages([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedChatId, model, setChatStages, flowDefinitions, determineActiveFlow])

  return {
    chatStages,
    fetchStages,
    setChatStages,
    isLoading,
    error
  }
}
