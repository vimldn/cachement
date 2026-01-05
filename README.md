# School Catchment Check

A UK school search platform that helps parents find schools near any address, with Ofsted ratings, exam results, **catchment distances**, and local house prices.

## Key Differentiator: Catchment Data

The real value is in the **"last distance offered"** data - compiled from council admissions booklets. This tells parents the furthest distance from which a child was admitted in previous years, giving them realistic expectations about their chances.

## Features

- 🔍 Search schools by postcode
- 📊 View Ofsted ratings and inspection history
- 📈 Exam results (SATs for primary, GCSEs for secondary)
- 📍 **Catchment distances** - last distance admitted per school
- 🏠 Local house prices from Land Registry
- 🗺️ Interactive maps
- 📱 Mobile responsive

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + PostGIS)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Data Sources**:
  - Schools: [Get Information About Schools](https://get-information-schools.service.gov.uk)
  - Results: [Compare School Performance](https://www.find-school-performance.service.gov.uk)
  - Prices: [Land Registry Price Paid](https://www.gov.uk/government/collections/price-paid-data)
  - Admissions: Council PDFs (manual compilation)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project
2. Run the schema from `database/schema.sql`
3. Copy your credentials

### 3. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Download and process data

```bash
# Download schools data from gov.uk
# Save to data/raw/establishments.csv

# Download price paid data from Land Registry
# Save to data/raw/pp-2024.csv, pp-2023.csv, etc.

# Download KS2/KS4 results
# Save to data/raw/ks2_2023.csv, ks4_2023.csv

# Process all data
npm run process:all
```

### 5. Import to Supabase

Use the Supabase dashboard or CLI to import the processed JSON files.

### 6. Run development server

```bash
npm run dev
```

## Data Pipeline

### Schools

Source: `https://get-information-schools.service.gov.uk/Downloads`

Download "Establishment fields" CSV → includes URN, name, address, coordinates, Ofsted rating.

### Exam Results

Source: `https://www.find-school-performance.service.gov.uk/download-data`

- KS2 (primary): SATs results, progress scores
- KS4 (secondary): Attainment 8, Progress 8, GCSE grades

### House Prices

Source: `https://www.gov.uk/government/collections/price-paid-data`

Download yearly CSV files. Process to aggregate by postcode.

### Admissions Data (The Moat)

This is the most valuable and hardest-to-get data. Sources:

1. **Council admissions booklets** - Most councils publish annual PDFs with:
   - Published Admission Number (PAN)
   - Total applications
   - Last distance offered
   - Breakdown by priority group

2. **School websites** - Some schools publish their own stats

3. **FOI requests** - Councils must respond to Freedom of Information requests

#### Example councils to scrape:

| Council | URL |
|---------|-----|
| Camden | https://www.camden.gov.uk/school-admissions |
| Islington | https://www.islington.gov.uk/children-and-families/schools |
| Hackney | https://education.hackney.gov.uk/admissions |
| Westminster | https://www.westminster.gov.uk/schools-and-education |

Create a CSV file `data/raw/admissions.csv` with columns:
```
urn,year,pan,applications,offers,last_distance,offers_looked_after,offers_siblings,offers_distance,offers_other,appeals,appeals_successful,source,source_url
```

## Project Structure

```
/app
  /page.tsx                    # Homepage with search
  /schools-near/[postcode]     # Search results
  /school/[slug]               # Individual school profile
  /area/[town]                 # Area landing pages (SEO)

/components
  /PostcodeSearch.tsx          # Search input
  /SchoolCard.tsx              # School list item
  /AdmissionsSection.tsx       # Catchment data display
  /ResultsSection.tsx          # Exam results tables
  /PricesCard.tsx              # House prices sidebar

/lib
  /schools.ts                  # School queries
  /admissions.ts               # Catchment data
  /results.ts                  # Exam results
  /prices.ts                   # House prices
  /postcodes.ts                # Postcode API

/scripts
  /process-schools.js          # Parse gov.uk data
  /process-results.js          # Parse KS2/KS4 data
  /process-prices.js           # Parse Land Registry
  /process-admissions.js       # Parse council data

/database
  /schema.sql                  # PostgreSQL + PostGIS schema
```

## SEO Pages

Programmatic pages for organic traffic:

- `/schools-near/[postcode]` - "Schools near SW1A 1AA"
- `/school/[slug]` - "Hampstead School"
- `/area/[town]` - "Schools in Camden"

## Monetization Options

1. **Lead gen to estate agents** - Families actively searching for homes near good schools
2. **Affiliate to conveyancers/mortgage brokers** - High-intent property buyers
3. **Premium reports** - Detailed catchment analysis
4. **Property portal partnerships** - White-label catchment data

## Roadmap

- [ ] MVP: Search + school profiles
- [ ] Add catchment distance data (manual first)
- [ ] House prices integration
- [ ] Saved searches + email alerts
- [ ] Lead capture forms
- [ ] Premium subscription tier

## License

MIT
