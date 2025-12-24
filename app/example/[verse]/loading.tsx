export default function Loading() {
  return (
    <div className="min-h-screen w-full islamic-gradient-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🌙</span>
          </div>
        </div>
        <p className="text-emerald-100/80">Loading Quranic wisdom...</p>
      </div>
    </div>
  )
}
