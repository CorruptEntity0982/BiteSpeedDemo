"use client"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { MessageSquare } from "lucide-react"

interface TextMessageNodeData {
  text: string
}

export function TextMessageNode({ data, selected }: NodeProps<TextMessageNodeData>) {
  return (
    <div
      className={`
      bg-white border-2 rounded-lg shadow-sm min-w-[200px] max-w-[300px]
      ${selected ? "border-blue-500" : "border-gray-200"}
      hover:border-gray-300 transition-colors
    `}
    >
      {/* Target handle - can have multiple incoming connections */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400 border-2 border-white" />

      {/* Node header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-green-50 rounded-t-lg">
        <MessageSquare className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-800">Send Message</span>
      </div>

      {/* Node content */}
      <div className="p-3">
        <p className="text-sm text-gray-700 break-words">{data.text || "Enter your message..."}</p>
      </div>

      {/* Source handle - only one outgoing connection allowed */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400 border-2 border-white" />
    </div>
  )
}
