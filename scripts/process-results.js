/**
 * Process school performance data
 * 
 * Download KS2 and KS4 data from:
 * https://www.find-school-performance.service.gov.uk/download-data
 * 
 * Save as:
 * - data/raw/ks2_2023.csv
 * - data/raw/ks4_2023.csv
 */

import { parse } from 'csv-parse/sync'
import fs from 'fs'

const INPUT_DIR = './data/raw'
const OUTPUT_KS2 = './data/processed/ks2_results.json'
const OUTPUT_KS4 = './data/processed/ks4_results.json'

// Parse percentage or suppress indicator
function parsePercent(val) {
  if (!val || val === 'SUPP' || val === 'NE' || val === 'NA' || val === 'NEW') {
    return null
  }
  const num = parseFloat(val)
  return isNaN(num) ? null : num
}

// Parse decimal (for progress scores)
function parseDecimal(val) {
  if (!val || val === 'SUPP' || val === 'NE' || val === 'NA' || val === 'NEW') {
    return null
  }
  const num = parseFloat(val)
  return isNaN(num) ? null : num
}

async function processKS4() {
  console.log('Processing KS4 (GCSE) results...')
  
  const years = [2023, 2022, 2019] // Skip 2020, 2021 (COVID)
  const results = {}
  
  for (const year of years) {
    const filename = `${INPUT_DIR}/ks4_${year}.csv`
    
    if (!fs.existsSync(filename)) {
      console.log(`  Skipping ${year} - file not found`)
      continue
    }
    
    console.log(`  Processing ${year}...`)
    
    const raw = fs.readFileSync(filename, 'utf-8')
    const records = parse(raw, { 
      columns: true,
      skip_empty_lines: true
    })
    
    console.log(`    ${records.length} schools`)
    
    for (const r of records) {
      const urn = r.URN
      if (!urn) continue
      
      // Skip if no valid attainment data
      const att8 = parseDecimal(r.ATT8SCR)
      if (att8 === null) continue
      
      if (!results[urn]) {
        results[urn] = []
      }
      
      results[urn].push({
        year,
        attainment8: att8,
        progress8: parseDecimal(r.P8MEA),
        basics94: parsePercent(r.PTL2BASICS_94),
        basics95: parsePercent(r.PTL2BASICS_95),
        ebacc: parsePercent(r.PTEBACC),
        ebaccAvgPoints: parseDecimal(r.EBACCAPS)
      })
    }
  }
  
  console.log(`  ${Object.keys(results).length} schools with KS4 data`)
  
  fs.mkdirSync('./data/processed', { recursive: true })
  fs.writeFileSync(OUTPUT_KS4, JSON.stringify(results, null, 2))
  console.log(`  Written to ${OUTPUT_KS4}`)
}

async function processKS2() {
  console.log('Processing KS2 (SATs) results...')
  
  const years = [2023, 2022, 2019]
  const results = {}
  
  for (const year of years) {
    const filename = `${INPUT_DIR}/ks2_${year}.csv`
    
    if (!fs.existsSync(filename)) {
      console.log(`  Skipping ${year} - file not found`)
      continue
    }
    
    console.log(`  Processing ${year}...`)
    
    const raw = fs.readFileSync(filename, 'utf-8')
    const records = parse(raw, { 
      columns: true,
      skip_empty_lines: true
    })
    
    console.log(`    ${records.length} schools`)
    
    for (const r of records) {
      const urn = r.URN
      if (!urn) continue
      
      // Check for valid data
      const combined = parsePercent(r.PTRWM_EXP)
      if (combined === null) continue
      
      if (!results[urn]) {
        results[urn] = []
      }
      
      results[urn].push({
        year,
        readingExpected: parsePercent(r.PTREAD_EXP),
        writingExpected: parsePercent(r.PTWRITTA_EXP),
        mathsExpected: parsePercent(r.PTMAT_EXP),
        combinedExpected: combined,
        readingHigher: parsePercent(r.PTREAD_HIGH),
        writingHigher: parsePercent(r.PTWRITTA_HIGH),
        mathsHigher: parsePercent(r.PTMAT_HIGH),
        progressReading: parseDecimal(r.READPROG),
        progressWriting: parseDecimal(r.WRITPROG),
        progressMaths: parseDecimal(r.MATPROG)
      })
    }
  }
  
  console.log(`  ${Object.keys(results).length} schools with KS2 data`)
  
  fs.writeFileSync(OUTPUT_KS2, JSON.stringify(results, null, 2))
  console.log(`  Written to ${OUTPUT_KS2}`)
}

async function main() {
  await processKS4()
  await processKS2()
  console.log('Done!')
}

main().catch(console.error)
