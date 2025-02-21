import { stageDisplayNames, useChatStages } from "@/components/chat/chat-hooks/use-chat-stages"
import { useEffect, useState, MouseEvent, useContext, useRef } from "react"
import { ChevronDown, ChevronUp, GripHorizontal, CheckCircle, Clock, XCircle, MinusCircle } from "lucide-react"
import { toast } from "sonner"
import Loading from "@/app/[locale]/loading"
import { ChatbotUIContext } from '@/context/context'

export const ChatFlowStages = () => {
  const { chatStages, fetchStages, isLoading, error } = useChatStages()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const { selectedChat, setChatStages } = useContext(ChatbotUIContext)
  const selectedChatIdRef = useRef(selectedChat?.id)
  useEffect(() => {
    setChatStages([])
    if(!selectedChat?.id) {
      return
    }
    if(selectedChatIdRef.current !== selectedChat?.id) {
      setChatStages([])
      fetchStages()
    }
  }, [selectedChat?.id])

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load flow stages: ${error.message}`)
    }
  }, [error])

  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as Element).closest('.drag-handle')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  const getStageDetails = (stage: any) => {
    let styleClasses = ""
    let icon = null
    const status = stage.flow_state.toLowerCase()
    if (status.includes("completed") || status.includes("success")) {
      styleClasses = "bg-green-100 text-green-700"
      icon = <CheckCircle className="h-5 w-5" />
    } else if (status.includes("in_progress") || status.includes("pending")) {
      styleClasses = "bg-blue-100 text-blue-700"
      icon = <Clock className="h-5 w-5" />
    } else if (status.includes("not_started")) {
      styleClasses = "bg-gray-100 text-gray-700"
      icon = <MinusCircle className="h-5 w-5" />
    } else if (status.includes("failed")) {
      styleClasses = "bg-red-100 text-red-700"
      icon = <XCircle className="h-5 w-5" />
    } else {
      styleClasses = "bg-gray-100 text-gray-700"
      icon = <MinusCircle className="h-5 w-5" />
    }
    return {
      styleClasses, 
      icon, 
      tooltip: `${stageDisplayNames[stage.command_stage]}: ${stage.flow_state.replace(/_/g, ' ')}`
    }
  }

  return (
    <div 
      className="fixed bg-white p-4 rounded-lg border shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transform: 'translate(calc(100vw - 100% - 1rem), 5rem)',
        zIndex: 9999
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="drag-handle cursor-move">
            <GripHorizontal className="h-4 w-4 text-gray-500" />
          </div>
          <h3 className="font-semibold">Flow Stages</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-2 rounded p-1 hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>
      {!isCollapsed && (
        isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col space-y-2 mt-2">
            {chatStages.map((stage: any) => {
              const { styleClasses, icon, tooltip } = getStageDetails(stage)
              return (
                <div key={stage.command_stage}>
                  <div
                    title={tooltip}
                    className={`transition-transform hover:scale-105 rounded-lg p-2 flex items-center gap-2 shadow ${styleClasses}`}
                  >
                    {icon}
                    <span className="font-bold">{stageDisplayNames[stage.command_stage]}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}