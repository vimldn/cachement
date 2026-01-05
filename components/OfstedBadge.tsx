const OFSTED_CONFIG: Record<number, { text: string; bg: string; icon: string }> = {
  1: { text: 'Outstanding', bg: 'bg-green-600', icon: '★' },
  2: { text: 'Good', bg: 'bg-blue-600', icon: '●' },
  3: { text: 'Requires Improvement', bg: 'bg-yellow-500', icon: '◐' },
  4: { text: 'Inadequate', bg: 'bg-red-600', icon: '○' }
}

interface Props {
  rating: number
  date?: string | null
  size?: 'sm' | 'md' | 'lg'
}

export function OfstedBadge({ rating, date, size = 'md' }: Props) {
  const config = OFSTED_CONFIG[rating]
  if (!config) return null
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }
  
  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }
  
  return (
    <div className={`${config.bg} text-white ${sizeClasses[size]} rounded-lg text-center`}>
      <div className={iconSizes[size]}>{config.icon}</div>
      <div className="font-semibold">{config.text}</div>
      {date && (
        <div className="text-xs opacity-80 mt-1">
          {formatDate(date)}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { 
    month: 'short', 
    year: 'numeric' 
  })
}
