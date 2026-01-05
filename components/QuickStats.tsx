import type { School } from '@/lib/schools'
import type { Results, KS2Results, KS4Results } from '@/lib/results'
import type { AdmissionsData } from '@/lib/admissions'
import { formatDistance, getCompetitivenessLabel, getOversubscriptionRatio } from '@/lib/admissions'
import { formatProgress } from '@/lib/results'

interface Props {
  school: School
  results: Results[] | null
  admissions?: AdmissionsData | null
}

export function QuickStats({ school, results, admissions }: Props) {
  const latestResults = results?.[0]
  const stats = school.phase === 'primary' 
    ? getPrimaryStats(latestResults as KS2Results | undefined, admissions)
    : getSecondaryStats(latestResults as KS4Results | undefined, admissions)
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(stat => (
        <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
          {stat.context && (
            <div className="text-xs text-gray-500 mt-1">{stat.context}</div>
          )}
        </div>
      ))}
    </div>
  )
}

interface Stat {
  label: string
  value: string
  context?: string
}

function getSecondaryStats(results?: KS4Results, admissions?: AdmissionsData | null): Stat[] {
  const stats: Stat[] = []
  
  if (results?.progress8 !== null && results?.progress8 !== undefined) {
    stats.push({
      label: 'Progress 8',
      value: formatProgress(results.progress8),
      context: results.progress8 > 0 ? 'Above average' : results.progress8 < 0 ? 'Below average' : 'Average'
    })
  }
  
  if (results?.attainment8) {
    stats.push({
      label: 'Attainment 8',
      value: results.attainment8.toString(),
      context: 'Avg score across 8 subjects'
    })
  }
  
  if (results?.basics95) {
    stats.push({
      label: 'English & Maths 9-5',
      value: `${results.basics95}%`,
      context: 'Strong pass in both'
    })
  }
  
  if (admissions?.lastDistanceMetres) {
    stats.push({
      label: 'Last distance',
      value: formatDistance(admissions.lastDistanceMetres),
      context: `${admissions.year} admissions`
    })
  } else if (results?.ebacc) {
    stats.push({
      label: 'EBacc entry',
      value: `${results.ebacc}%`,
      context: 'Taking academic subjects'
    })
  }
  
  return stats.slice(0, 4)
}

function getPrimaryStats(results?: KS2Results, admissions?: AdmissionsData | null): Stat[] {
  const stats: Stat[] = []
  
  if (results?.combinedExpected) {
    stats.push({
      label: 'Meeting expected',
      value: `${results.combinedExpected}%`,
      context: 'Reading, writing & maths'
    })
  }
  
  if (results?.progressReading !== null && results?.progressReading !== undefined) {
    stats.push({
      label: 'Reading progress',
      value: formatProgress(results.progressReading),
      context: results.progressReading > 0 ? 'Above average' : 'Below average'
    })
  }
  
  if (results?.progressMaths !== null && results?.progressMaths !== undefined) {
    stats.push({
      label: 'Maths progress',
      value: formatProgress(results.progressMaths),
      context: results.progressMaths > 0 ? 'Above average' : 'Below average'
    })
  }
  
  if (admissions?.lastDistanceMetres) {
    stats.push({
      label: 'Last distance',
      value: formatDistance(admissions.lastDistanceMetres),
      context: `${admissions.year} admissions`
    })
  } else if (results?.readingHigher) {
    stats.push({
      label: 'Higher standard',
      value: `${results.readingHigher}%`,
      context: 'Reading at higher level'
    })
  }
  
  return stats.slice(0, 4)
}
