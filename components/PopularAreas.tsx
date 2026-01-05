import Link from 'next/link'
import { getLondonBoroughs, AREAS } from '@/lib/areas'

export function PopularAreas() {
  const londonBoroughs = getLondonBoroughs().slice(0, 8)
  const cities = AREAS.filter(a => a.type === 'city').slice(0, 8)
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="font-semibold mb-4">London boroughs</h3>
        <div className="grid grid-cols-2 gap-2">
          {londonBoroughs.map(area => (
            <Link 
              key={area.slug}
              href={`/area/${area.slug}`}
              className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
            >
              {area.name}
            </Link>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-4">Major cities</h3>
        <div className="grid grid-cols-2 gap-2">
          {cities.map(area => (
            <Link 
              key={area.slug}
              href={`/area/${area.slug}`}
              className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
            >
              {area.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
