import { useContext, useState, useEffect, useCallback } from 'react'
import { ChatbotUIContext } from '@/context/context'
import { ChatFlow } from '@/types'

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

  const fetchStages = useCallback(async () => {
    if (!selectedChatId || !model) {
      console.warn("Skipping fetchStages: selectedChat is undefined")
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/chat-flow/active?chatId=${selectedChatId}`)
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setChatStages(data)
      } else {
        setChatStages([])
      }
    } catch (error) {
      console.error("Error fetching stages:", error)
      setError(error instanceof Error ? error : new Error('Failed to fetch stages'))
      setChatStages([])
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
