"use client"
import { Check, ChevronDown } from "lucide-react"
import * as Select from "@radix-ui/react-select"
import { LIFE_STAGES } from "@/lib/data"
import type { LifeStageId } from "@/lib/types"

interface LifeStageSelectorProps {
  currentStageId: LifeStageId
  onStageChange: (id: LifeStageId) => void
}

export function LifeStageSelector({ currentStageId, onStageChange }: LifeStageSelectorProps) {
  return (
    <div className="w-full max-w-xs mx-auto mb-8 relative z-50">
      <label className="block text-sm font-medium text-primary-200 mb-2 text-center uppercase tracking-wider">
        Select Your Season of Life
      </label>

      <Select.Root value={currentStageId} onValueChange={(val) => onStageChange(val as LifeStageId)}>
        <Select.Trigger className="flex items-center justify-between w-full px-4 py-3 text-sm text-white glass-input rounded-xl hover:bg-white/10 transition-colors">
          <Select.Value placeholder="Select life stage" />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="overflow-hidden bg-[#4c1d95]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl w-[var(--radix-select-trigger-width)] z-50 animate-fade-in"
            position="popper"
            sideOffset={5}
          >
            <Select.Viewport className="p-1">
              {LIFE_STAGES.map((stage) => (
                <Select.Item
                  key={stage.id}
                  value={stage.id}
                  className="relative flex items-center px-8 py-2 text-sm text-primary-100 rounded-lg cursor-pointer hover:bg-white/10 hover:text-white outline-none select-none data-[highlighted]:bg-white/10 data-[highlighted]:text-white transition-colors"
                >
                  <Select.ItemText>
                    <div className="flex flex-col text-left">
                      <span className="font-medium">{stage.label}</span>
                    </div>
                  </Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
