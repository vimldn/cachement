import type { PriceData } from '@/lib/prices'

interface Props {
  prices: PriceData
  className?: string
}

export function PricesSummary({ prices, className = '' }: Props) {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <span className="text-gray-600">Avg house price: </span>
          <span className="font-semibold">£{prices.avg.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-gray-600">Range: </span>
          <span className="font-medium">
            £{formatCompact(prices.min)} - £{formatCompact(prices.max)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Sales (3yr): </span>
          <span className="font-medium">{prices.count}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Source: Land Registry price paid data
      </p>
    </div>
  )
}

function formatCompact(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}m`
  }
  return `${Math.round(price / 1000)}k`
}
