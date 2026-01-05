import Link from 'next/link'
import type { School } from '@/lib/schools'
import { OFSTED_LABELS, OFSTED_COLORS } from '@/lib/ofsted'

interface Props {
  school: School
  showDistance?: boolean
}

export function SchoolCard({ school, showDistance = true }: Props) {
  const ofsted = school.ofsted_rating ? {
    label: OFSTED_LABELS[school.ofsted_rating],
    colors: OFSTED_COLORS[school.ofsted_rating]
  } : null
  
  return (
    <Link 
      href={`/school/${school.slug}`}
      className="block border rounded-lg p-4 hover:shadow-md transition bg-white"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{school.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {capitalise(school.phase)} • Ages {school.age_low}-{school.age_high}
            {school.pupils && ` • ${school.pupils.toLocaleString()} pupils`}
          </p>
          <p className="text-sm text-gray-500">
            {school.town}, {school.postcode}
          </p>
        </div>
        
        {showDistance && school.distance_km !== undefined && (
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
            {school.distance_km.toFixed(1)} km
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-3 mt-3">
        {ofsted && (
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${ofsted.colors.bg} text-white`}>
            {ofsted.label}
          </span>
        )}
        <span className="text-xs text-gray-500">
          {school.type}
        </span>
      </div>
    </Link>
  )
}

function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
