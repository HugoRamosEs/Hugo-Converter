interface StatusMessageProps {
  type: 'success' | 'error' | null
  message: string
}

export default function StatusMessage({ type, message }: StatusMessageProps) {
  if (!type) return null
  
  return (
    <div
      className={`
        w-full p-5 rounded-lg border animate-slide-up
        ${type === 'success' 
          ? 'bg-green-500/10 border-green-500/30 text-green-400' 
          : 'bg-red-500/10 border-red-500/30 text-red-400'
        }
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
          type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          <svg className={`w-5 h-5 ${type === 'success' ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base mb-1">
            {type === 'success' ? 'Conversión exitosa' : 'Error en la conversión'}
          </h3>
          <p className="text-base leading-relaxed opacity-90 break-words">{message}</p>
        </div>
      </div>
    </div>
  )
}
