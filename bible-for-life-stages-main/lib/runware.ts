// Using official @runware/sdk-js WebSocket SDK
// import { Runware } from "@runware/sdk-js"

const RUNWARE_MODEL_ID = process.env.RUNWARE_MODEL_ID || "runware:100@1"

// Only positive descriptions of what we WANT
const COMPOSITION_SUFFIX = `wide establishing shot, full body view from distance, environmental focus, landscape orientation, person small in frame, vast background scenery, architectural or natural setting fills 80% of image, documentary photography style, single subject only`

function getStylePrefix(lifeStage?: string): string {
  switch (lifeStage) {
    case "youth":
      return `Yu-Gi-Oh!-style anime, bold outlines, saturated colors, wide establishing shot, single character in vast colorful environment, adventure scene`
    case "teens":
      return `modern anime aesthetic, clean line art, cinematic wide shot, single figure in expansive setting, atmospheric background`
    default:
      return `ultra-realistic cinematic photography, wide angle lens, landscape composition, single person small in vast environment, National Geographic style`
  }
}

function enhancePrompt(prompt: string, lifeStage?: string): string {
  if (prompt.includes("artstation") || prompt.includes("cinematic") || prompt.length < 20) {
    return prompt
  }
  const stylePrefix = getStylePrefix(lifeStage)
  return `${stylePrefix}, ${prompt}, ${COMPOSITION_SUFFIX}`
}

// Singleton Runware instance for connection reuse
let runwareInstance: any | null = null

function getRunwareClient(): any {
  if (!runwareInstance) {
    runwareInstance = {} // Placeholder for Runware instance
  }
  return runwareInstance
}

export async function generateImageWithSDK(
  prompt: string,
  retries = 3,
  lifeStage?: string,
): Promise<string | undefined> {
  console.log("[v0] IMAGE GENERATION DISABLED - Returning placeholder")
  return "/placeholder.svg?height=1024&width=768"
}

export async function generateImagesParallel(
  prompts: string[],
  maxConcurrent = 10,
  lifeStage?: string,
): Promise<(string | undefined)[]> {
  console.log("[v0] IMAGE GENERATION DISABLED - Returning placeholders for", prompts.length, "images")
  return prompts.map(() => "/placeholder.svg?height=1024&width=768")
}

export async function generateMultipleImages(prompts: string[]): Promise<(string | undefined)[]> {
  return generateImagesParallel(prompts)
}

export async function generateImagesBatched(prompts: string[], batchSize = 10): Promise<(string | undefined)[]> {
  return generateImagesParallel(prompts, batchSize)
}

// IMAGE GENERATION IS DISABLED TO PREVENT COSTS
// All functions return placeholder images

export async function generateImage(
  prompt: string,
  options?: {
    width?: number
    height?: number
    lifeStage?: string
  },
): Promise<string> {
  console.log("[v0] IMAGE GENERATION DISABLED - returning placeholder")
  const width = options?.width || 1024
  const height = options?.height || 1024
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(prompt.slice(0, 50))}`
}

export async function generateImages(
  prompts: string[],
  options?: {
    width?: number
    height?: number
    lifeStage?: string
  },
): Promise<string[]> {
  console.log("[v0] IMAGE GENERATION DISABLED - returning placeholders for", prompts.length, "images")
  const width = options?.width || 1024
  const height = options?.height || 1024
  return prompts.map(
    (prompt) => `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(prompt.slice(0, 50))}`,
  )
}
