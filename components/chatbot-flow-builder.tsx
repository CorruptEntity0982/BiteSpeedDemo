"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { TextMessageNode } from "./nodes/text-message-node"
import { NodesPanel } from "./panels/nodes-panel"
import { SettingsPanel } from "./panels/settings-panel"
import { SaveButton } from "./save-button"
import { toast } from "@/hooks/use-toast"

// Define the node types for extensibility
const nodeTypes = {
  textMessage: TextMessageNode,
}

// Initial nodes for demo
const initialNodes: Node[] = [
  {
    id: "1",
    type: "textMessage",
    position: { x: 250, y: 250 },
    data: { text: "Hello! Welcome to our chatbot." },
  },
]

const initialEdges: Edge[] = []

export default function ChatbotFlowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // Ensure only one edge can originate from a source handle
      const existingEdge = edges.find(
        (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle,
      )

      if (existingEdge) {
        // Remove existing edge from the same source handle
        setEdges((eds) => eds.filter((edge) => edge.id !== existingEdge.id))
      }

      setEdges((eds) => addEdge(params, eds))
    },
    [edges, setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id)
  }, [])

  // Handle clicking on empty canvas to deselect
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  // Add new node to the flow
  const addNode = useCallback(
    (nodeType: string) => {
      const newNode: Node = {
        id: `${Date.now()}`,
        type: nodeType,
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        data: { text: "New message" },
      }
      setNodes((nds) => [...nds, newNode])
    },
    [setNodes],
  )

  // Update node data
  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) => nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)))
    },
    [setNodes],
  )

  // Validate flow before saving
  const validateFlow = useCallback(() => {
    if (nodes.length <= 1) {
      return { isValid: true, message: "" }
    }

    // Find nodes with no incoming edges (no target connections)
    const nodesWithoutTargets = nodes.filter((node) => {
      return !edges.some((edge) => edge.target === node.id)
    })

    // If more than one node has no target connections, it's invalid
    if (nodesWithoutTargets.length > 1) {
      return {
        isValid: false,
        message:
          "Error: More than one node has empty target handles. Please ensure all nodes except the starting node are connected.",
      }
    }

    return { isValid: true, message: "Flow saved successfully!" }
  }, [nodes, edges])

  // Save flow
  const saveFlow = useCallback(() => {
    const validation = validateFlow()

    if (validation.isValid) {
      // Here you would typically save to a backend
      console.log("Saving flow:", { nodes, edges })
      toast({
        title: "Success",
        description: validation.message,
      })
    } else {
      toast({
        title: "Validation Error",
        description: validation.message,
        variant: "destructive",
      })
    }
  }, [validateFlow, nodes, edges])

  // Get selected node data
  const selectedNode = useMemo(() => {
    return selectedNodeId ? nodes.find((node) => node.id === selectedNodeId) : null
  }, [selectedNodeId, nodes])

  return (
    <div className="h-full w-full flex">
      <ReactFlowProvider>
        {/* Main flow canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>

          {/* Save button positioned absolutely */}
          <div className="absolute top-4 right-4 z-10">
            <SaveButton onSave={saveFlow} />
          </div>
        </div>

        {/* Right sidebar - either nodes panel or settings panel */}
        <div className="w-80 border-l border-gray-200 bg-white">
          {selectedNode ? (
            <SettingsPanel node={selectedNode} onUpdateNode={updateNodeData} onClose={() => setSelectedNodeId(null)} />
          ) : (
            <NodesPanel onAddNode={addNode} />
          )}
        </div>
      </ReactFlowProvider>
    </div>
  )
}
