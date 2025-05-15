"use client"

import { Button } from "@/components/ui/button"
import { Circle, Underline, Undo } from "lucide-react"

interface TextAnnotationToolsProps {
  onCircleClick: () => void
  onUnderlineClick: () => void
  onUndoClick: () => void
  activeMode: string | null
}

export function TextAnnotationTools({
  onCircleClick,
  onUnderlineClick,
  onUndoClick,
  activeMode,
}: TextAnnotationToolsProps) {
  return (
    <div className="flex items-center space-x-2 mb-4 p-2 border rounded-md bg-white dark:bg-gray-800">
      <span className="text-sm font-medium mr-2">Annotation Tools:</span>
      <Button
        variant={activeMode === "circle" ? "default" : "outline"}
        size="sm"
        onClick={onCircleClick}
        className={
          activeMode === "circle" ? "bg-red-600 hover:bg-red-700" : "text-red-600 border-red-600 hover:bg-red-50"
        }
      >
        <Circle className="h-4 w-4 mr-1" />
        Circle
      </Button>
      <Button
        variant={activeMode === "underline" ? "default" : "outline"}
        size="sm"
        onClick={onUnderlineClick}
        className={
          activeMode === "underline" ? "bg-red-600 hover:bg-red-700" : "text-red-600 border-red-600 hover:bg-red-50"
        }
      >
        <Underline className="h-4 w-4 mr-1" />
        Underline
      </Button>
      <Button variant="outline" size="sm" onClick={onUndoClick}>
        <Undo className="h-4 w-4 mr-1" />
        Undo
      </Button>
    </div>
  )
}
