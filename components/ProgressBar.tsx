interface ProgressBarProps {
  progress: number
  platform: 'youtube' | 'soundcloud'
  message?: string
}

export default function ProgressBar({ progress, platform, message }: ProgressBarProps) {
  const gradientClass = platform === 'youtube' 
    ? 'bg-gradient-to-r from-red-500 to-red-600' 
    : 'bg-gradient-to-r from-orange-500 to-orange-600'
  
  const textColor = platform === 'youtube' ? 'text-red-500' : 'text-orange-500'
  
  return (
    <div className="w-full space-y-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Progreso</span>
        <span className={`text-sm font-semibold ${textColor}`}>
          {progress}%
        </span>
      </div>
      
      <div className="w-full h-2.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className={`h-full ${gradientClass} transition-all duration-300 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center gap-2 pt-1">
        <div className={`w-2 h-2 rounded-full ${
          platform === 'youtube' ? 'bg-red-500' : 'bg-orange-500'
        }`} />
        <p className="text-gray-300 text-base truncate">
          {message || 'Procesando...'}
        </p>
      </div>
    </div>
  )
}
