/**
 * Process admissions/catchment data from council booklets
 * 
 * This is the most valuable data - "last distance offered" from each council.
 * 
 * Data sources (examples):
 * - Camden: https://www.camden.gov.uk/school-admissions
 * - Islington: https://www.islington.gov.uk/children-and-families/schools/apply-for-a-school-place
 * - Most councils publish PDF booklets with admissions data
 * 
 * This script processes a standardized CSV format that you create
 * by extracting data from council PDFs/websites.
 * 
 * Expected CSV format:
 * urn,year,pan,applications,offers,last_distance_metres,offers_looked_after,offers_siblings,offers_distance,offers_other,appeals,appeals_successful,source,source_url
 */

import { parse } from 'csv-parse/sync'
import fs from 'fs'

const INPUT_FILE = './data/raw/admissions.csv'
const OUTPUT_FILE = './data/processed/admissions.json'

// Common distance formats and conversions
function parseDistance(distanceStr) {
  if (!distanceStr || distanceStr === 'N/A' || distanceStr === '-') {
    return null
  }
  
  // Remove whitespace
  const str = distanceStr.trim().toLowerCase()
  
  // Try miles first (e.g., "0.234 miles", "0.5m")
  const milesMatch = str.match(/^([\d.]+)\s*(?:miles?|mi?)$/)
  if (milesMatch) {
    const miles = parseFloat(milesMatch[1])
    return Math.round(miles * 1609.34) // Convert to metres
  }
  
  // Try metres (e.g., "234m", "1.2km")
  const metresMatch = str.match(/^([\d.]+)\s*(?:metres?|m)$/)
  if (metresMatch) {
    return Math.round(parseFloat(metresMatch[1]))
  }
  
  // Try km
  const kmMatch = str.match(/^([\d.]+)\s*(?:km|kilometres?)$/)
  if (kmMatch) {
    return Math.round(parseFloat(kmMatch[1]) * 1000)
  }
  
  // Try just a number (assume metres)
  const numMatch = str.match(/^[\d.]+$/)
  if (numMatch) {
    return Math.round(parseFloat(str))
  }
  
  console.warn(`Could not parse distance: "${distanceStr}"`)
  return null
}

async function processAdmissions() {
  console.log('Processing admissions data...')
  
  if (!fs.existsSync(INPUT_FILE)) {
    console.log(`Input file not found: ${INPUT_FILE}`)
    console.log('')
    console.log('Create a CSV file with the following columns:')
    console.log('urn,year,pan,applications,offers,last_distance,offers_looked_after,offers_siblings,offers_distance,offers_other,appeals,appeals_successful,source,source_url')
    console.log('')
    console.log('Data sources to scrape:')
    console.log('- Council admissions booklets (PDFs)')
    console.log('- School websites')
    console.log('- FOI requests to councils')
    console.log('')
    
    // Create example file
    const exampleData = `urn,year,pan,applications,offers,last_distance,offers_looked_after,offers_siblings,offers_distance,offers_other,appeals,appeals_successful,source,source_url
100000,2024,90,187,90,0.432 miles,2,35,53,0,12,3,Camden Council Admissions Booklet 2024,https://www.camden.gov.uk/documents/admissions-2024.pdf
100001,2024,60,245,60,312m,1,28,31,0,8,1,Islington Council Secondary Admissions 2024,https://www.islington.gov.uk/admissions`
    
    fs.writeFileSync('./data/raw/admissions_example.csv', exampleData)
    console.log('Created example file: data/raw/admissions_example.csv')
    
    process.exit(0)
  }
  
  const raw = fs.readFileSync(INPUT_FILE, 'utf-8')
  const records = parse(raw, { 
    columns: true,
    skip_empty_lines: true
  })
  
  console.log(`Processing ${records.length} records...`)
  
  const admissions = {}
  let validCount = 0
  let distanceCount = 0
  
  for (const r of records) {
    const urn = r.urn
    if (!urn) continue
    
    const year = parseInt(r.year)
    if (isNaN(year)) continue
    
    const record = {
      urn,
      year,
      pan: parseInt(r.pan) || null,
      applications: parseInt(r.applications) || null,
      offers: parseInt(r.offers) || null,
      lastDistanceMetres: parseDistance(r.last_distance),
      offersLookedAfter: parseInt(r.offers_looked_after) || null,
      offersSiblings: parseInt(r.offers_siblings) || null,
      offersDistance: parseInt(r.offers_distance) || null,
      offersOther: parseInt(r.offers_other) || null,
      appeals: parseInt(r.appeals) || null,
      appealsSuccessful: parseInt(r.appeals_successful) || null,
      source: r.source || '',
      sourceUrl: r.source_url || null
    }
    
    // Skip if no meaningful data
    if (!record.pan && !record.applications && !record.lastDistanceMetres) {
      continue
    }
    
    if (!admissions[urn]) {
      admissions[urn] = []
    }
    
    admissions[urn].push(record)
    validCount++
    
    if (record.lastDistanceMetres) {
      distanceCount++
    }
  }
  
  // Sort by year (most recent first)
  for (const urn of Object.keys(admissions)) {
    admissions[urn].sort((a, b) => b.year - a.year)
  }
  
  console.log(`Processed:`)
  console.log(`  ${Object.keys(admissions).length} schools`)
  console.log(`  ${validCount} total records`)
  console.log(`  ${distanceCount} with distance data`)
  
  // Stats on distances
  const distances = Object.values(admissions)
    .flat()
    .filter(a => a.lastDistanceMetres)
    .map(a => a.lastDistanceMetres)
  
  if (distances.length > 0) {
    const sorted = distances.sort((a, b) => a - b)
    const avg = distances.reduce((a, b) => a + b, 0) / distances.length
    console.log(`  Distance stats:`)
    console.log(`    Min: ${sorted[0]}m`)
    console.log(`    Max: ${sorted[sorted.length - 1]}m`)
    console.log(`    Avg: ${Math.round(avg)}m (${(avg / 1609.34).toFixed(2)} miles)`)
  }
  
  fs.mkdirSync('./data/processed', { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(admissions, null, 2))
  
  console.log(`Output written to ${OUTPUT_FILE}`)
}

processAdmissions().catch(console.error)
