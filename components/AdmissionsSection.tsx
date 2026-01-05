import { 
  AdmissionsData, 
  formatDistance, 
  getCompetitivenessLabel, 
  getOversubscriptionRatio,
  metresToMiles 
} from '@/lib/admissions'

interface Props {
  admissions: AdmissionsData | null
  schoolName: string
  phase: string
}

export function AdmissionsSection({ admissions, schoolName, phase }: Props) {
  if (!admissions) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">Admissions</h2>
        <div className="border rounded-lg p-6 text-center">
          <p className="text-gray-600">
            Admissions data for this school isn't available yet. Check the school's 
            website or local council for the latest information.
          </p>
        </div>
      </section>
    )
  }
  
  const ratio = getOversubscriptionRatio(admissions)
  const competitiveness = getCompetitivenessLabel(ratio)
  
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Admissions & Catchment</h2>
      
      {/* Main catchment card */}
      <div className="border rounded-lg overflow-hidden">
        {/* Distance highlight */}
        {admissions.lastDistanceMetres && (
          <div className="bg-blue-50 p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-medium mb-1">
                  Last distance offered ({admissions.year})
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {formatDistance(admissions.lastDistanceMetres)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {metresToMiles(admissions.lastDistanceMetres).toFixed(2)} miles
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getCompetitivenessColor(ratio)}`}>
                  {competitiveness}
                </div>
                <div className="text-sm text-gray-500">
                  {ratio.toFixed(1)}x oversubscribed
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              This is the furthest distance from the school that a child was admitted 
              under the distance criteria in {admissions.year}. If you live within this 
              distance, you have a reasonable chance of getting a place.
            </p>
          </div>
        )}
        
        {/* Stats grid */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem 
              label="Places available" 
              value={admissions.pan.toString()} 
              subtext="PAN"
            />
            <StatItem 
              label="Applications" 
              value={admissions.applications.toString()} 
              subtext={`${admissions.year} intake`}
            />
            <StatItem 
              label="Offers made" 
              value={admissions.offers.toString()} 
            />
            {admissions.appeals !== undefined && (
              <StatItem 
                label="Appeals" 
                value={admissions.appeals.toString()} 
                subtext={admissions.appealsSuccessful ? `${admissions.appealsSuccessful} successful` : undefined}
              />
            )}
          </div>
          
          {/* Priority breakdown */}
          {(admissions.offersLookedAfter || admissions.offersSiblings || admissions.offersDistance) && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">How places were allocated</h4>
              <div className="space-y-2">
                {admissions.offersLookedAfter !== undefined && admissions.offersLookedAfter > 0 && (
                  <AllocationBar 
                    label="Looked after children" 
                    value={admissions.offersLookedAfter} 
                    total={admissions.offers}
                    color="bg-purple-500"
                  />
                )}
                {admissions.offersSiblings !== undefined && admissions.offersSiblings > 0 && (
                  <AllocationBar 
                    label="Siblings" 
                    value={admissions.offersSiblings} 
                    total={admissions.offers}
                    color="bg-green-500"
                  />
                )}
                {admissions.offersDistance !== undefined && admissions.offersDistance > 0 && (
                  <AllocationBar 
                    label="Distance" 
                    value={admissions.offersDistance} 
                    total={admissions.offers}
                    color="bg-blue-500"
                  />
                )}
                {admissions.offersOther !== undefined && admissions.offersOther > 0 && (
                  <AllocationBar 
                    label="Other criteria" 
                    value={admissions.offersOther} 
                    total={admissions.offers}
                    color="bg-gray-500"
                  />
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Source */}
        <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-500">
          Source: {admissions.source}
          {admissions.sourceUrl && (
            <>
              {' • '}
              <a 
                href={admissions.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View original →
              </a>
            </>
          )}
        </div>
      </div>
      
      {/* Explainer */}
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Important notes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Distance cutoffs vary each year based on applications and sibling numbers</li>
          <li>• Living within the last distance offered doesn't guarantee a place</li>
          <li>• Check the school's admission policy for full criteria details</li>
          <li>• Some schools use straight-line distance, others use walking routes</li>
        </ul>
      </div>
    </section>
  )
}

function StatItem({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
    </div>
  )
}

function AllocationBar({ 
  label, 
  value, 
  total, 
  color 
}: { 
  label: string
  value: number
  total: number
  color: string 
}) {
  const percentage = (value / total) * 100
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value} ({percentage.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function getCompetitivenessColor(ratio: number): string {
  if (ratio < 1) return 'text-green-600'
  if (ratio < 1.5) return 'text-yellow-600'
  if (ratio < 2) return 'text-orange-600'
  return 'text-red-600'
}
