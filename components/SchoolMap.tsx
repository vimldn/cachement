'use client'

interface Props {
  lat: number
  lng: number
  name: string
  catchmentRadius?: number | null
}

export function SchoolMap({ lat, lng, name, catchmentRadius }: Props) {
  // Using OpenStreetMap embed for simplicity
  // Could be replaced with Mapbox/Google Maps for more features
  
  const zoom = catchmentRadius ? 15 : 16
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`}
        title={`Map showing location of ${name}`}
      />
      <div className="p-2 bg-gray-50 text-xs text-gray-500 text-right">
        <a 
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          View larger map
        </a>
      </div>
    </div>
  )
}
