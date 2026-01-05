/**
 * Process schools data from gov.uk
 * 
 * Download the Establishment fields CSV from:
 * https://get-information-schools.service.gov.uk/Downloads
 * 
 * Save as data/raw/establishments.csv
 */

import { parse } from 'csv-parse/sync'
import fs from 'fs'

const INPUT_FILE = './data/raw/establishments.csv'
const OUTPUT_FILE = './data/processed/schools.json'

// Slugify school name
function slugify(name, urn) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${slug}-${urn}`
}

// Map Ofsted rating text to number
function parseOfstedRating(rating) {
  const map = {
    'Outstanding': 1,
    'Good': 2,
    'Requires improvement': 3,
    'Requires Improvement': 3,
    'Inadequate': 4,
    'Serious Weaknesses': 4,
    'Special Measures': 4
  }
  return map[rating] || null
}

async function processSchools() {
  console.log('Reading establishments data...')
  
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`)
    console.log('Download from: https://get-information-schools.service.gov.uk/Downloads')
    process.exit(1)
  }
  
  const raw = fs.readFileSync(INPUT_FILE, 'utf-8')
  const records = parse(raw, { 
    columns: true,
    skip_empty_lines: true
  })
  
  console.log(`Processing ${records.length} records...`)
  
  const schools = records
    .filter(r => {
      // Only open schools
      if (r.EstablishmentStatus !== 'Open') return false
      
      // Only primary, secondary, all-through
      const validPhases = ['Primary', 'Secondary', 'All-through', '16 plus']
      if (!validPhases.includes(r.PhaseOfEducation)) return false
      
      // Must have coordinates
      if (!r.Latitude || !r.Longitude) return false
      
      return true
    })
    .map(r => ({
      urn: r.URN,
      name: r.EstablishmentName,
      slug: slugify(r.EstablishmentName, r.URN),
      phase: r.PhaseOfEducation.toLowerCase().replace(' ', '-'),
      type: r.TypeOfEstablishment,
      street: r.Street || '',
      town: r.Town || '',
      postcode: r.Postcode || '',
      lat: parseFloat(r.Latitude),
      lng: parseFloat(r.Longitude),
      ofsted_rating: parseOfstedRating(r.OfstedRating),
      ofsted_date: r.OfstedLastInsp || null,
      pupils: parseInt(r.NumberOfPupils) || null,
      age_low: parseInt(r.StatutoryLowAge) || 4,
      age_high: parseInt(r.StatutoryHighAge) || 18,
      website: r.SchoolWebsite || null
    }))
  
  console.log(`Processed ${schools.length} schools`)
  
  // Stats
  const stats = {
    total: schools.length,
    primary: schools.filter(s => s.phase === 'primary').length,
    secondary: schools.filter(s => s.phase === 'secondary').length,
    outstanding: schools.filter(s => s.ofsted_rating === 1).length,
    good: schools.filter(s => s.ofsted_rating === 2).length,
    withOfsted: schools.filter(s => s.ofsted_rating !== null).length
  }
  
  console.log('Stats:', stats)
  
  // Write output
  fs.mkdirSync('./data/processed', { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(schools, null, 2))
  
  console.log(`Output written to ${OUTPUT_FILE}`)
}

processSchools().catch(console.error)
