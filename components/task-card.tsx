"use client"

import { motion } from "framer-motion"
import { Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface TaskCardProps {
  task: Task
  onComplete: () => void
  onDelete: () => void
  isActive: boolean
}

export default function TaskCard({ task, onComplete, onDelete, isActive }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border",
        task.completed
          ? "bg-gray-50 border-gray-200"
          : isActive
            ? "bg-purple-50 border-purple-200"
            : "bg-white border-gray-200",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
            task.completed ? "bg-green-100" : isActive ? "bg-purple-100" : "bg-gray-100",
          )}
        >
          {task.completed && <Check className="h-3 w-3 text-green-600" />}
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            task.completed ? "text-gray-400 line-through" : isActive ? "text-purple-900" : "text-gray-700",
          )}
        >
          {task.text}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {!task.completed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-green-600 hover:bg-green-50"
            onClick={onComplete}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}