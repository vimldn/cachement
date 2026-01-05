/**
 * Process Land Registry Price Paid data
 * 
 * Download yearly files from:
 * https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads
 * 
 * Files should be in format: pp-2024.csv, pp-2023.csv, etc.
 * Save to data/raw/
 */

import { parse } from 'csv-parse/sync'
import fs from 'fs'

const INPUT_DIR = './data/raw'
const OUTPUT_FILE = './data/processed/prices_by_postcode.json'

// Years to process (most recent 3-5 years)
const YEARS = [2024, 2023, 2022, 2021, 2020]

async function processPrices() {
  console.log('Processing house price data...')
  
  const pricesByPostcode = {}
  
  for (const year of YEARS) {
    const filename = `${INPUT_DIR}/pp-${year}.csv`
    
    if (!fs.existsSync(filename)) {
      console.log(`Skipping ${year} - file not found`)
      continue
    }
    
    console.log(`Processing ${year}...`)
    
    const raw = fs.readFileSync(filename, 'utf-8')
    
    // Land Registry CSV has no headers
    const records = parse(raw, {
      columns: [
        'id', 'price', 'date', 'postcode', 'propertyType', 
        'newBuild', 'duration', 'paon', 'saon', 'street',
        'locality', 'town', 'district', 'county', 'ppd', 'recordStatus'
      ],
      skip_empty_lines: true
    })
    
    console.log(`  ${records.length} sales`)
    
    for (const r of records) {
      if (!r.postcode) continue
      
      // Clean postcode (remove spaces, uppercase)
      const pc = r.postcode.replace(/\s/g, '').toUpperCase()
      const price = parseInt(r.price)
      
      if (isNaN(price) || price < 10000 || price > 50000000) continue
      
      if (!pricesByPostcode[pc]) {
        pricesByPostcode[pc] = []
      }
      
      pricesByPostcode[pc].push(price)
    }
  }
  
  console.log(`Aggregating ${Object.keys(pricesByPostcode).length} postcodes...`)
  
  // Calculate stats for each postcode
  const output = {}
  
  for (const [pc, prices] of Object.entries(pricesByPostcode)) {
    if (prices.length < 3) continue // Skip postcodes with too few sales
    
    const sorted = prices.sort((a, b) => a - b)
    const sum = sorted.reduce((a, b) => a + b, 0)
    
    output[pc] = {
      count: sorted.length,
      median: sorted[Math.floor(sorted.length / 2)],
      avg: Math.round(sum / sorted.length),
      min: sorted[0],
      max: sorted[sorted.length - 1]
    }
  }
  
  console.log(`Output: ${Object.keys(output).length} postcodes with sufficient data`)
  
  // Stats
  const allAvgs = Object.values(output).map(p => p.avg)
  const overallAvg = allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length
  console.log(`Overall average: £${Math.round(overallAvg).toLocaleString()}`)
  
  // Write output
  fs.mkdirSync('./data/processed', { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
  
  console.log(`Output written to ${OUTPUT_FILE}`)
}

processPrices().catch(console.error)
