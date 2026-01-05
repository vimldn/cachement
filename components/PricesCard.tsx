import type { PriceData } from '@/lib/prices'

interface Props {
  prices: PriceData | null
  postcode: string
}

export function PricesCard({ prices, postcode }: Props) {
  if (!prices) {
    return (
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">House prices nearby</h3>
        <p className="text-sm text-gray-600">
          Price data not available for this area.
        </p>
      </div>
    )
  }
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">House prices nearby</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Average price</span>
          <span className="font-medium">£{prices.avg.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Median price</span>
          <span className="font-medium">£{prices.median.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Price range</span>
          <span className="font-medium text-right">
            £{formatCompact(prices.min)} - £{formatCompact(prices.max)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Sales (3 yrs)</span>
          <span className="font-medium">{prices.count}</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        Within 1km of school. Source: Land Registry.
      </p>
      
      <a 
        href={`/schools-near/${postcode.replace(' ', '')}`}
        className="block mt-4 text-center text-sm text-blue-600 hover:underline"
      >
        View all schools near {postcode}
      </a>
    </div>
  )
}

function formatCompact(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}m`
  }
  return `${Math.round(price / 1000)}k`
}
