"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type ToastType = "default" | "success" | "destructive"

interface Toast {
  id: string
  title: string
  description?: string
  type?: ToastType
}

interface ToastContextType {
  toasts: Toast[]
  toast: (props: { title: string; description?: string; type?: ToastType }) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({
    title,
    description,
    type = "default",
  }: { title: string; description?: string; type?: ToastType }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, type }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`rounded-md border p-4 shadow-md ${
                t.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : t.type === "destructive"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{t.title}</h3>
                <button onClick={() => dismiss(t.id)} className="text-gray-500 hover:text-gray-700">
                  ×
                </button>
              </div>
              {t.description && <p className="mt-1 text-sm">{t.description}</p>}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function toast(props: { title: string; description?: string; type?: ToastType }) {
  const context = useContext(ToastContext)
  if (!context) {
    console.error("useToast must be used within a ToastProvider")
    return
  }
  context.toast(props)
}
