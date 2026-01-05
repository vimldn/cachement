import type { Results, KS2Results, KS4Results } from '@/lib/results'
import { formatProgress, NATIONAL_AVERAGES } from '@/lib/results'

interface Props {
  results: Results[] | null
  phase: string
}

export function ResultsSection({ results, phase }: Props) {
  if (!results || results.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {phase === 'primary' ? 'SATs Results' : 'GCSE Results'}
        </h2>
        <p className="text-gray-600">
          Performance data for this school isn't available yet.
        </p>
      </section>
    )
  }
  
  const latestYear = results[0]?.year
  
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        {phase === 'primary' ? 'SATs Results' : 'GCSE Results'}
      </h2>
      
      {phase === 'secondary' ? (
        <SecondaryResultsTable results={results as KS4Results[]} />
      ) : (
        <PrimaryResultsTable results={results as KS2Results[]} />
      )}
      
      <p className="text-sm text-gray-500 mt-4">
        Data from {latestYear}. Source: Department for Education.
      </p>
    </section>
  )
}

function SecondaryResultsTable({ results }: { results: KS4Results[] }) {
  const national = NATIONAL_AVERAGES.ks4
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Metric</th>
              {results.map(r => (
                <th key={r.year} className="text-right py-3 px-4 font-medium">{r.year}</th>
              ))}
              <th className="text-right py-3 px-4 font-medium text-gray-500">National</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <ResultRow 
              label="Progress 8" 
              tooltip="Progress compared to students with similar starting points"
              values={results.map(r => formatProgress(r.progress8))}
              national={formatProgress(national.progress8)}
            />
            <ResultRow 
              label="Attainment 8" 
              tooltip="Average grade across 8 qualifying subjects"
              values={results.map(r => r.attainment8?.toString() ?? 'N/A')}
              national={national.attainment8.toString()}
            />
            <ResultRow 
              label="English & Maths (9-5)" 
              tooltip="Percentage achieving grade 5+ in both"
              values={results.map(r => r.basics95 ? `${r.basics95}%` : 'N/A')}
              national={`${national.basics95}%`}
            />
            <ResultRow 
              label="English & Maths (9-4)" 
              tooltip="Percentage achieving grade 4+ in both"
              values={results.map(r => r.basics94 ? `${r.basics94}%` : 'N/A')}
              national={`${national.basics94}%`}
            />
            <ResultRow 
              label="EBacc entry" 
              tooltip="Percentage entering the English Baccalaureate"
              values={results.map(r => r.ebacc ? `${r.ebacc}%` : 'N/A')}
              national={`${national.ebacc}%`}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PrimaryResultsTable({ results }: { results: KS2Results[] }) {
  const national = NATIONAL_AVERAGES.ks2
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium">Metric</th>
              {results.map(r => (
                <th key={r.year} className="text-right py-3 px-4 font-medium">{r.year}</th>
              ))}
              <th className="text-right py-3 px-4 font-medium text-gray-500">National</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <ResultRow 
              label="Reading (expected)" 
              tooltip="Percentage meeting expected standard"
              values={results.map(r => r.readingExpected ? `${r.readingExpected}%` : 'N/A')}
              national={`${national.readingExpected}%`}
            />
            <ResultRow 
              label="Writing (expected)" 
              values={results.map(r => r.writingExpected ? `${r.writingExpected}%` : 'N/A')}
              national={`${national.writingExpected}%`}
            />
            <ResultRow 
              label="Maths (expected)" 
              values={results.map(r => r.mathsExpected ? `${r.mathsExpected}%` : 'N/A')}
              national={`${national.mathsExpected}%`}
            />
            <ResultRow 
              label="Combined (R+W+M)" 
              tooltip="Percentage meeting expected in all three"
              values={results.map(r => r.combinedExpected ? `${r.combinedExpected}%` : 'N/A')}
              national={`${national.combinedExpected}%`}
            />
            <ResultRow 
              label="Reading progress" 
              tooltip="Progress compared to similar students nationally"
              values={results.map(r => formatProgress(r.progressReading))}
              national={formatProgress(national.progressReading)}
            />
            <ResultRow 
              label="Maths progress" 
              values={results.map(r => formatProgress(r.progressMaths))}
              national={formatProgress(national.progressMaths)}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ResultRow({ 
  label, 
  tooltip, 
  values, 
  national 
}: { 
  label: string
  tooltip?: string
  values: string[]
  national: string 
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="py-3 px-4" title={tooltip}>
        {label}
        {tooltip && <span className="text-gray-400 ml-1">ⓘ</span>}
      </td>
      {values.map((v, i) => (
        <td key={i} className="text-right py-3 px-4 font-medium">{v}</td>
      ))}
      <td className="text-right py-3 px-4 text-gray-500">{national}</td>
    </tr>
  )
}
