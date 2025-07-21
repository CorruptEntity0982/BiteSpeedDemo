"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Node } from "@xyflow/react"

interface SettingsPanelProps {
  node: Node
  onUpdateNode: (nodeId: string, data: any) => void
  onClose: () => void
}

export function SettingsPanel({ node, onUpdateNode, onClose }: SettingsPanelProps) {
  const [text, setText] = useState(node.data.text || "")

  // Update local state when node changes
  useEffect(() => {
    setText(node.data.text || "")
  }, [node.data.text])

  // Handle text change with debounced update
  const handleTextChange = (newText: string) => {
    setText(newText)
    // Update node data immediately for real-time preview
    onUpdateNode(node.id, { text: newText })
  }

  // Get node type specific settings
  const renderNodeSettings = () => {
    switch (node.type) {
      case "textMessage":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="message-text" className="text-sm font-medium">
                Text
              </Label>
              <Textarea
                id="message-text"
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter your message..."
                className="mt-1 min-h-[100px]"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be sent to users when they reach this node.
              </p>
            </div>
          </div>
        )

      default:
        return <div className="text-sm text-gray-500">No settings available for this node type.</div>
    }
  }

  // Get node type display info
  const getNodeTypeInfo = () => {
    switch (node.type) {
      case "textMessage":
        return {
          label: "Message",
          icon: MessageSquare,
          color: "text-green-600",
          bgColor: "bg-green-50",
        }
      default:
        return {
          label: "Unknown",
          icon: MessageSquare,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        }
    }
  }

  const nodeInfo = getNodeTypeInfo()
  const IconComponent = nodeInfo.icon

  return (
    <div className="h-full flex flex-col">
      {/* Panel header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-auto">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900">Settings Panel</h2>
        </div>

        {/* Node type indicator */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${nodeInfo.bgColor}`}>
            <IconComponent className={`w-5 h-5 ${nodeInfo.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{nodeInfo.label}</h3>
            <p className="text-xs text-gray-600">Node ID: {node.id}</p>
          </div>
        </div>
      </div>

      {/* Settings content */}
      <div className="flex-1 p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Node Configuration</h4>

        {renderNodeSettings()}
      </div>

      {/* Save changes button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Button className="w-full bg-transparent" onClick={onClose} variant="outline">
          Save Changes
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">Changes are saved automatically</p>
      </div>
    </div>
  )
}
