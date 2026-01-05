-- School Catchment Database Schema
-- For use with Supabase (PostgreSQL)

-- Enable PostGIS for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;

-- ============================================
-- SCHOOLS TABLE
-- ============================================
CREATE TABLE schools (
  urn TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phase TEXT CHECK (phase IN ('primary', 'secondary', 'all-through', '16-plus')),
  type TEXT,
  street TEXT,
  town TEXT,
  postcode TEXT,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  ofsted_rating INT CHECK (ofsted_rating BETWEEN 1 AND 4),
  ofsted_date DATE,
  pupils INT,
  age_low INT,
  age_high INT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX schools_phase_idx ON schools(phase);
CREATE INDEX schools_ofsted_idx ON schools(ofsted_rating);
CREATE INDEX schools_town_idx ON schools(town);
CREATE INDEX schools_postcode_idx ON schools(postcode);

-- Spatial index for distance queries
CREATE INDEX schools_geo_idx ON schools 
  USING gist (ll_to_earth(lat, lng));

-- ============================================
-- KS2 RESULTS (PRIMARY)
-- ============================================
CREATE TABLE ks2_results (
  urn TEXT REFERENCES schools(urn) ON DELETE CASCADE,
  year INT NOT NULL,
  reading_expected INT,
  writing_expected INT,
  maths_expected INT,
  combined_expected INT,
  reading_higher INT,
  writing_higher INT,
  maths_higher INT,
  progress_reading DECIMAL(4,2),
  progress_writing DECIMAL(4,2),
  progress_maths DECIMAL(4,2),
  PRIMARY KEY (urn, year)
);

CREATE INDEX ks2_year_idx ON ks2_results(year);

-- ============================================
-- KS4 RESULTS (SECONDARY/GCSE)
-- ============================================
CREATE TABLE ks4_results (
  urn TEXT REFERENCES schools(urn) ON DELETE CASCADE,
  year INT NOT NULL,
  attainment8 DECIMAL(4,1),
  progress8 DECIMAL(4,2),
  basics_9_4 INT,
  basics_9_5 INT,
  ebacc_entry INT,
  ebacc_avg_points DECIMAL(4,2),
  staying_education INT,
  PRIMARY KEY (urn, year)
);

CREATE INDEX ks4_year_idx ON ks4_results(year);
CREATE INDEX ks4_att8_idx ON ks4_results(attainment8);
CREATE INDEX ks4_prog8_idx ON ks4_results(progress8);

-- ============================================
-- ADMISSIONS DATA (THE KEY DIFFERENTIATOR)
-- ============================================
CREATE TABLE admissions (
  urn TEXT REFERENCES schools(urn) ON DELETE CASCADE,
  year INT NOT NULL,
  pan INT,  -- Published Admission Number
  applications INT,
  offers INT,
  last_distance_metres INT,  -- THE GOLD: furthest distance admitted
  offers_looked_after INT,
  offers_siblings INT,
  offers_distance INT,
  offers_other INT,
  appeals INT,
  appeals_successful INT,
  source TEXT,
  source_url TEXT,
  PRIMARY KEY (urn, year)
);

CREATE INDEX admissions_year_idx ON admissions(year);
CREATE INDEX admissions_distance_idx ON admissions(last_distance_metres);

-- ============================================
-- HOUSE PRICES BY POSTCODE
-- ============================================
CREATE TABLE postcode_prices (
  postcode TEXT PRIMARY KEY,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  median_price INT,
  avg_price INT,
  min_price INT,
  max_price INT,
  sales_count INT,
  last_updated DATE
);

CREATE INDEX prices_geo_idx ON postcode_prices 
  USING gist (ll_to_earth(lat, lng));

-- ============================================
-- INDIVIDUAL SALES (OPTIONAL, FOR DETAILED VIEWS)
-- ============================================
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  postcode TEXT,
  price INT,
  sale_date DATE,
  property_type TEXT CHECK (property_type IN ('D', 'S', 'T', 'F', 'O')),
  new_build BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX sales_postcode_idx ON sales(postcode);
CREATE INDEX sales_date_idx ON sales(sale_date);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Find schools within X km of a point
CREATE OR REPLACE FUNCTION nearby_schools(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_km DECIMAL DEFAULT 3
)
RETURNS TABLE (
  urn TEXT,
  name TEXT,
  slug TEXT,
  phase TEXT,
  type TEXT,
  street TEXT,
  town TEXT,
  postcode TEXT,
  lat DECIMAL,
  lng DECIMAL,
  ofsted_rating INT,
  ofsted_date DATE,
  pupils INT,
  age_low INT,
  age_high INT,
  website TEXT,
  distance_km DECIMAL
) AS $$
  SELECT 
    s.urn, s.name, s.slug, s.phase, s.type,
    s.street, s.town, s.postcode, s.lat, s.lng,
    s.ofsted_rating, s.ofsted_date, s.pupils,
    s.age_low, s.age_high, s.website,
    (earth_distance(
      ll_to_earth(s.lat, s.lng),
      ll_to_earth(search_lat, search_lng)
    ) / 1000)::DECIMAL(5,2) as distance_km
  FROM schools s
  WHERE earth_box(ll_to_earth(search_lat, search_lng), radius_km * 1000) 
    @> ll_to_earth(s.lat, s.lng)
  ORDER BY distance_km;
$$ LANGUAGE SQL;


-- Find similar schools (same phase, nearby, similar Ofsted)
CREATE OR REPLACE FUNCTION similar_schools(
  target_urn TEXT,
  target_lat DECIMAL,
  target_lng DECIMAL,
  target_phase TEXT,
  radius_km DECIMAL DEFAULT 5,
  limit_count INT DEFAULT 5
)
RETURNS TABLE (
  urn TEXT,
  name TEXT,
  slug TEXT,
  phase TEXT,
  ofsted_rating INT,
  distance_km DECIMAL
) AS $$
  SELECT 
    s.urn, s.name, s.slug, s.phase, s.ofsted_rating,
    (earth_distance(
      ll_to_earth(s.lat, s.lng),
      ll_to_earth(target_lat, target_lng)
    ) / 1000)::DECIMAL(5,2) as distance_km
  FROM schools s
  WHERE s.phase = target_phase
    AND s.urn != target_urn
    AND earth_box(ll_to_earth(target_lat, target_lng), radius_km * 1000) 
      @> ll_to_earth(s.lat, s.lng)
  ORDER BY 
    ABS(COALESCE(s.ofsted_rating, 3) - (
      SELECT COALESCE(ofsted_rating, 3) FROM schools WHERE urn = target_urn
    )),
    distance_km
  LIMIT limit_count;
$$ LANGUAGE SQL;


-- Aggregate prices near a location
CREATE OR REPLACE FUNCTION nearby_prices(
  search_lat DECIMAL,
  search_lng DECIMAL,
  radius_km DECIMAL DEFAULT 1
)
RETURNS TABLE (
  avg INT,
  median INT,
  min INT,
  max INT,
  count INT
) AS $$
  WITH nearby AS (
    SELECT avg_price, median_price, min_price, max_price, sales_count
    FROM postcode_prices
    WHERE earth_box(ll_to_earth(search_lat, search_lng), radius_km * 1000) 
      @> ll_to_earth(lat, lng)
  )
  SELECT 
    ROUND(AVG(avg_price))::INT as avg,
    ROUND(AVG(median_price))::INT as median,
    MIN(min_price) as min,
    MAX(max_price) as max,
    SUM(sales_count)::INT as count
  FROM nearby;
$$ LANGUAGE SQL;


-- ============================================
-- ROW LEVEL SECURITY (Optional)
-- ============================================

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ks2_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ks4_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE postcode_prices ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON schools FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ks2_results FOR SELECT USING (true);
CREATE POLICY "Public read access" ON ks4_results FOR SELECT USING (true);
CREATE POLICY "Public read access" ON admissions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON postcode_prices FOR SELECT USING (true);
