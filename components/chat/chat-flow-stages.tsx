import { stageDisplayNames, stateColors, useChatStages } from "@/components/chat/chat-hooks/use-chat-stages"
import { useEffect, useState, MouseEvent } from "react"
import { ChevronDown, ChevronUp, GripHorizontal } from "lucide-react"

export const ChatFlowStages = () => {
  const { stageStates, fetchStages } = useChatStages()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    fetchStages()
  }, [])

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
        <div className="flex flex-col space-y-2 mt-2">
          {stageStates.map((stage) => (
            <div
              key={stage.command_stage}
              className={`rounded-md p-2 ${stateColors[stage.flow_state]}`}
            >
              {stageDisplayNames[stage.command_stage]} - {stage.flow_state.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
