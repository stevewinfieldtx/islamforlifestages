"use client"

import React from "react"
import type { LifeStageId } from "@/lib/types"
import { lifeStages } from "@/lib/data/life-stages"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

interface LifeStageSelectorProps {
  selectedStage: LifeStageId | null
  onSelectStage: (stage: LifeStageId) => void
}

export function LifeStageSelector({ selectedStage, onSelectStage }: LifeStageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const currentStage = selectedStage ? lifeStages.find((s) => s.id === selectedStage) : null

  return (
    <div className="relative z-50 w-full max-w-md mx-auto mb-8">
      <div className="text-center mb-3">
        <label className="text-xs font-medium text-amber-300/80 uppercase tracking-[0.2em]">
          Select Your Life Stage
        </label>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ease-out",
          "glass-card stained-border",
          "text-amber-100 font-medium",
          isOpen ? "ring-2 ring-amber-500/30 scale-[1.02]" : "",
        )}
      >
        <span className="truncate">{currentStage ? currentStage.label : "Choose a life stage..."}</span>
        <ChevronDown
          className={cn("w-5 h-5 text-amber-400 transition-transform duration-300", isOpen ? "rotate-180" : "")}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl glass-card max-h-[60vh] overflow-y-auto animate-spring-in shadow-2xl shadow-black/50">
          <div className="space-y-1">
            {lifeStages.map((stage, idx) => (
              <button
                key={stage.id}
                onClick={() => {
                  onSelectStage(stage.id)
                  setIsOpen(false)
                }}
                style={{ animationDelay: `${idx * 50}ms` }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group",
                  "hover:bg-white/5 flex items-start gap-3",
                  "active:scale-[0.98] active:bg-white/10",
                  selectedStage === stage.id ? "bg-amber-500/10" : "",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all duration-300",
                    selectedStage === stage.id
                      ? "border-amber-400 bg-amber-400 text-slate-900 scale-110"
                      : "border-blue-400/30 group-hover:border-amber-400/50",
                  )}
                >
                  {selectedStage === stage.id && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <div
                    className={cn(
                      "font-medium transition-colors",
                      selectedStage === stage.id ? "text-amber-300" : "text-blue-100",
                    )}
                  >
                    {stage.label}
                  </div>
                  <div className="text-xs text-blue-300/50 mt-0.5 line-clamp-2">{stage.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
