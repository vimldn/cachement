'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Props {
  currentPhase: string
  currentOfsted: number | null
  currentRadius: number
}

export function SchoolFilters({ currentPhase, currentOfsted, currentRadius }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all' || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }
  
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Phase filter */}
      <div>
        <label className="text-sm text-gray-600 block mb-1">School type</label>
        <select 
          value={currentPhase}
          onChange={(e) => updateFilter('phase', e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="all">All schools</option>
          <option value="primary">Primary only</option>
          <option value="secondary">Secondary only</option>
        </select>
      </div>
      
      {/* Ofsted filter */}
      <div>
        <label className="text-sm text-gray-600 block mb-1">Ofsted rating</label>
        <select 
          value={currentOfsted?.toString() || ''}
          onChange={(e) => updateFilter('ofsted', e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Any rating</option>
          <option value="1">Outstanding</option>
          <option value="2">Good</option>
          <option value="3">Requires Improvement</option>
        </select>
      </div>
      
      {/* Radius filter */}
      <div>
        <label className="text-sm text-gray-600 block mb-1">Distance</label>
        <select 
          value={currentRadius.toString()}
          onChange={(e) => updateFilter('radius', e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="1">Within 1km</option>
          <option value="2">Within 2km</option>
          <option value="3">Within 3km</option>
          <option value="5">Within 5km</option>
        </select>
      </div>
    </div>
  )
}
