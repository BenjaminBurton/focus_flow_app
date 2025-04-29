"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Check, Clock, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import TaskCard from "@/components/task-card"
import { useToast } from "@/hooks/use-toast"

type Task = {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

export default function FocusApp() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("focusFlowTasks")
      return savedTasks ? JSON.parse(savedTasks) : []
    }
    return []
  })

  const [newTask, setNewTask] = useState("")
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const { toast } = useToast()

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("focusFlowTasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Set current task to the most recent incomplete task
  useEffect(() => {
    if (tasks.length > 0) {
      const incompleteTasks = tasks.filter((task) => !task.completed)
      if (incompleteTasks.length > 0) {
        // Sort by creation date and get the most recent
        const sortedTasks = [...incompleteTasks].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        setCurrentTask(sortedTasks[0])
      } else {
        setCurrentTask(null)
      }
    } else {
      setCurrentTask(null)
    }
  }, [tasks])

  const addTask = () => {
    if (newTask.trim() === "") return

    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      createdAt: new Date(),
    }

    setTasks([task, ...tasks])
    setNewTask("")

    toast({
      title: "Task added",
      description: "Your new focus task has been added",
    })
  }

  const completeTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: true } : task)))

    toast({
      title: "Task completed",
      description: "Great job staying focused!",
    })
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="w-full max-w-md">
      <Card className="bg-white shadow-xl border-0">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-purple-900">Focus Flow</h1>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="What do you need to focus on?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask()
                }}
                className="border-purple-200 focus-visible:ring-purple-500"
              />
              <Button onClick={addTask} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            {currentTask ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-white" />
                          <h2 className="text-lg font-semibold text-white">Current Focus</h2>
                        </div>
                      </div>

                      <motion.div
                        className="text-xl font-bold text-white break-words"
                        animate={{
                          scale: [1, 1.03, 1],
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          duration: 2,
                        }}
                      >
                        {currentTask.text}
                      </motion.div>

                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/40"
                          onClick={() => completeTask(currentTask.id)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="text-center py-6 text-gray-500">Add a task to get started with your focus session</div>
            )}

            <div className="space-y-3 mt-2">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Task List ({tasks.length})</h2>

              {tasks.length > 0 ? (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={() => completeTask(task.id)}
                      onDelete={() => deleteTask(task.id)}
                      isActive={currentTask?.id === task.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm">No tasks yet. Add one to get started!</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}