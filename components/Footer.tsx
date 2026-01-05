import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Catchment Check</h3>
            <p className="text-sm text-gray-600">
              Find the right school for your family. Compare Ofsted ratings, exam results, 
              and local house prices.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Popular Areas</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/area/islington" className="hover:text-gray-900">Islington</Link></li>
              <li><Link href="/area/camden" className="hover:text-gray-900">Camden</Link></li>
              <li><Link href="/area/hackney" className="hover:text-gray-900">Hackney</Link></li>
              <li><Link href="/area/wandsworth" className="hover:text-gray-900">Wandsworth</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Cities</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/area/manchester" className="hover:text-gray-900">Manchester</Link></li>
              <li><Link href="/area/birmingham" className="hover:text-gray-900">Birmingham</Link></li>
              <li><Link href="/area/bristol" className="hover:text-gray-900">Bristol</Link></li>
              <li><Link href="/area/cambridge" className="hover:text-gray-900">Cambridge</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Data Sources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a 
                  href="https://get-information-schools.service.gov.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-900"
                >
                  Get Information About Schools
                </a>
              </li>
              <li>
                <a 
                  href="https://reports.ofsted.gov.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-900"
                >
                  Ofsted
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gov.uk/government/collections/price-paid-data" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gray-900"
                >
                  Land Registry
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-sm text-gray-500 text-center">
          <p>© {new Date().getFullYear()} Catchment Check. All rights reserved.</p>
          <p className="mt-2">
            School data from Department for Education. House prices from HM Land Registry. 
            Contains public sector information licensed under the Open Government Licence v3.0.
          </p>
        </div>
      </div>
    </footer>
  )
}
