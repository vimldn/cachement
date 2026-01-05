import Link from 'next/link'
import type { School } from '@/lib/schools'
import { OFSTED_SHORT } from '@/lib/ofsted'

interface Props {
  schools: School[] | null
}

export function SimilarSchoolsCard({ schools }: Props) {
  if (!schools?.length) {
    return null
  }
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Similar schools nearby</h3>
      
      <div className="space-y-3">
        {schools.slice(0, 5).map(school => (
          <Link 
            key={school.urn}
            href={`/school/${school.slug}`}
            className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded transition"
          >
            <div className="font-medium text-sm">{school.name}</div>
            <div className="text-xs text-gray-600 flex gap-2">
              {school.distance_km && (
                <span>{school.distance_km.toFixed(1)}km</span>
              )}
              {school.ofsted_rating && (
                <>
                  <span>•</span>
                  <span>{OFSTED_SHORT[school.ofsted_rating]}</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
