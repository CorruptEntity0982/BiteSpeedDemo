"use client"

import type React from "react"
import { MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NodesPanelProps {
  onAddNode: (nodeType: string) => void
}

// Define available node types for extensibility
const availableNodeTypes = [
  {
    type: "textMessage",
    label: "Message",
    icon: MessageSquare,
    description: "Send a text message",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  // Future node types can be added here
  // {
  //   type: 'conditionalNode',
  //   label: 'Condition',
  //   icon: GitBranch,
  //   description: 'Branch based on condition',
  //   color: 'text-blue-600',
  //   bgColor: 'bg-blue-50',
  // },
]

export function NodesPanel({ onAddNode }: NodesPanelProps) {
  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="h-full flex flex-col">
      {/* Panel header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Nodes Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Drag and drop nodes to build your chatbot flow</p>
      </div>

      {/* Available nodes */}
      <div className="flex-1 p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Available Nodes</h3>

        {availableNodeTypes.map((nodeType) => {
          const IconComponent = nodeType.icon

          return (
            <div
              key={nodeType.type}
              className={`
                border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-grab
                hover:border-gray-400 hover:bg-gray-50 transition-colors
                active:cursor-grabbing
              `}
              draggable
              onDragStart={(e) => handleDragStart(e, nodeType.type)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${nodeType.bgColor}`}>
                  <IconComponent className={`w-5 h-5 ${nodeType.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{nodeType.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{nodeType.description}</p>
                </div>
              </div>

              {/* Alternative: Click to add button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-xs"
                onClick={() => onAddNode(nodeType.type)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add to Flow
              </Button>
            </div>
          )
        })}
      </div>

      {/* Future extensibility note */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">More node types coming soon...</p>
      </div>
    </div>
  )
}
