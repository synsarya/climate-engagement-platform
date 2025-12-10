# Organization Data Bank - Implementation Guide

## Overview
The Organization Data Bank is a comprehensive, Bloomberg/Crunchbase-style database that tracks climate-related organizations including both champions (companies/nonprofits doing good for climate) and polluters (major CO₂ emitters). It provides financial, sustainability, and operational data with professional visualizations.

## Key Features

### 1. Dual Database System

#### Climate Champions Database
Organizations actively working to combat climate change:

**For-Profit Companies**:
- Renewable energy developers (solar, wind, hydro)
- Climate tech innovators (carbon capture, battery tech)
- Sustainable food providers (plant-based, regenerative agriculture)
- Electric vehicle manufacturers
- Green technology companies
- Clean energy infrastructure

**Non-Profit Organizations**:
- Environmental conservation groups
- Climate advocacy organizations
- Research institutions
- Educational foundations
- Land protection trusts
- Carbon offset programs

**Categories** (aligned with platform interests):
1. **Energy** - Renewable energy companies, grid solutions
2. **Food** - Sustainable agriculture, plant-based food
3. **Mobility** - EVs, public transportation, clean logistics
4. **Industry** - Green manufacturing, circular economy
5. **Technology** - Climate tech, carbon capture, AI for climate
6. **Policy** - Think tanks, advocacy groups, policy institutes
7. **Nature** - Conservation, reforestation, biodiversity

#### Climate Polluters Database
Major CO₂ emitting organizations:

**Industries Tracked**:
- Oil & Gas companies
- Coal mining and power generation
- Natural gas producers
- Steel and cement manufacturers
- Chemical production
- Heavy industry

**Ranking System**:
- Ranked by total CO₂ emissions (tons/year)
- Scope 1 (direct emissions)
- Scope 3 (value chain emissions)
- Industry-specific metrics

### 2. Bloomberg-Style Data Visualization

#### Financial Metrics
**For-Profit Companies**:
- Market Capitalization
- Annual Revenue
- Year-over-Year Growth
- Net Profit/Loss
- R&D Spending
- Capital Expenditures

**Non-Profit Organizations**:
- Total Assets
- Annual Donations
- Program Spending %
- Impact Investment
- Grant Distribution
- Operational Efficiency

#### ESG Scores
- Comprehensive 0-100 scoring
- Visual progress bars with color coding:
  - Green (70-100): Leaders
  - Yellow (40-69): Moderate
  - Red (0-39): Poor performers
- Real-time updates from disclosed data

#### Climate Impact Metrics

**Champions**:
- CO₂ Avoided (tons/year)
- Renewable Energy Capacity (GW)
- Carbon Neutral Status
- Land Protected (acres/hectares)
- Water Saved (liters/gallons)
- Clean Energy Generated (kWh)

**Polluters**:
- Total CO₂ Emissions (tons/year)
- Scope 1 & 3 Emissions
- Methane Leaks
- Production Volumes (oil/coal/gas)
- Pollution Ranking
- Emission Trends (↑↓)

### 3. Search & Discovery Features

#### Advanced Search
- Real-time text search across:
  - Organization names
  - Descriptions
  - Industries
  - Categories
  
#### Multi-Filter System
- **Category Filter**: Energy, Food, Mobility, Industry, Technology, Policy, Nature
- **Type Filter** (Champions only): For-Profit, Non-Profit
- **Combined Filtering**: Search + Category + Type simultaneously

#### Organization Cards
Compact view showing:
- Logo/Brand Identity
- Organization Name & Verification Badge
- Description
- Country & Founded Date
- Key Metrics (3 top KPIs)
- ESG Score with Progress Bar
- Pollution Rank (for polluters)

### 4. Detailed Organization Profiles

#### Modal View
Click any organization for detailed Bloomberg-style profile:

**Header Section**:
- Large logo
- Full name with verification
- Detailed description
- Category, location, founding year
- Employee count

**Financial Overview**:
- 4-card grid with key financials
- Market cap/Revenue
- Growth rate
- Profit/Donations
- ESG Score

**Climate Impact Section**:
- Color-coded impact cards
  - Green for champions (positive impact)
  - Red for polluters (negative impact)
- Specific metrics per organization type
- Trend indicators

**Key Performance Metrics**:
- Industry-specific KPIs
- Trend arrows (up/down/stable)
- Production volumes
- Capacity metrics
- Geographic reach

**Action Buttons**:
- View Official Website
- Download Full Report
- Export Data (future)

## Data Structure

### Champion Organization Schema
```typescript
{
  id: number;
  name: string;
  category: 'energy' | 'food' | 'mobility' | 'industry' | 'technology' | 'policy' | 'nature';
  type: 'for-profit' | 'non-profit';
  description: string;
  country: string;
  founded: string;
  employees: string;
  marketCap?: string;        // For-profit
  assets?: string;           // Non-profit
  revenue: string;
  esgScore: number;          // 0-100
  climateImpact: {
    co2Avoided?: string;
    renewableEnergy?: string;
    carbonNeutral?: boolean;
    landProtected?: string;
    waterSaved?: string;
    // Custom metrics per organization
  };
  financials: {
    revenue: number;
    growth: string;
    profit?: string;
    funding?: string;
    rnd?: string;
    donations?: number;      // Non-profit
    programSpend?: string;   // Non-profit
  };
  metrics: Array<{
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  logo: string;
  verified: boolean;
}
```

### Polluter Organization Schema
```typescript
{
  id: number;
  name: string;
  category: string;
  industry: string;
  description: string;
  country: string;
  founded: string;
  employees: string;
  marketCap: string;
  revenue: string;
  esgScore: number;          // 0-100 (typically low)
  climateImpact: {
    co2Emissions: string;    // Total emissions
    scope1?: string;
    scope3?: string;
    methaneLeaks?: string;
    production?: string;     // Industry-specific
  };
  financials: {
    revenue: number;
    growth: string;
    profit: string;
    assets?: string;
    dividends?: string;
  };
  metrics: Array<{
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  logo: string;
  verified: boolean;
  pollutionRank: number;     // Global pollution ranking
}
```

## Sample Organizations Included

### Climate Champions

1. **Tesla Inc.** (Mobility)
   - EVs and clean energy
   - $789B market cap
   - 45.2M tons CO₂ avoided/year
   - ESG Score: 89

2. **Ørsted** (Energy)
   - Offshore wind leader
   - 100% renewable energy
   - 16.4M tons CO₂ avoided/year
   - ESG Score: 95

3. **Impossible Foods** (Food)
   - Plant-based meat
   - 3.5M tons CO₂ avoided/year
   - ESG Score: 87

4. **The Nature Conservancy** (Nature - Non-Profit)
   - 125M acres protected
   - 25M tons carbon sequestered/year
   - ESG Score: 98

5. **Climeworks** (Technology)
   - Direct air capture
   - 900K tons CO₂ capacity
   - ESG Score: 92

### Climate Polluters

1. **Saudi Aramco** (Oil & Gas)
   - #1 global polluter
   - 1,590M tons CO₂/year
   - ESG Score: 15

2. **China Energy Investment** (Coal)
   - #2 global polluter
   - 1,280M tons CO₂/year
   - ESG Score: 12

3. **Gazprom** (Natural Gas)
   - #3 global polluter
   - 780M tons CO₂/year
   - ESG Score: 18

4. **ExxonMobil** (Oil & Gas)
   - #4 global polluter
   - 720M tons CO₂/year
   - ESG Score: 22

5. **Coal India Limited** (Coal Mining)
   - #5 global polluter
   - 650M tons CO₂/year
   - ESG Score: 16

## Integration with Platform

### Learn Module
- Replaced "Corporate Climate Impact" with comprehensive "Organization Data Bank"
- Streamlined to avoid redundancy
- Single source of truth for organizational climate data

### Navigation
- Access via Learn → Organization Data Bank
- Direct route: `/learn-databank`

### Visual Design
- Bloomberg-inspired professional layout
- Clean card-based UI
- Color-coded impact indicators
- Responsive grid layouts
- Modal-based detail views

## Future Enhancements

### Data Integration
- Real-time API connections to financial databases
- Live ESG score updates
- Automated emission tracking
- SEC filing integration
- Sustainability report parsing

### Advanced Features
- **Comparison Tool**: Side-by-side organization comparison
- **Portfolio Tracking**: Follow specific organizations
- **Alerts**: Notification for ESG score changes
- **Historical Data**: Time-series charts for all metrics
- **Industry Benchmarking**: Compare within sectors
- **Investment Scores**: Climate-aligned investment ratings

### Visualization Enhancements
- Interactive charts (revenue, emissions over time)
- Geographic heat maps
- Supply chain visualization
- Carbon footprint breakdowns
- Interactive ESG dashboards

### Data Export
- PDF reports
- CSV data downloads
- API access for researchers
- Custom report builder

### Community Features
- User ratings and reviews
- Impact discussions
- Organization follow/tracking
- Share insights
- Collaborative research

## Technical Implementation

### Components
- `OrganizationDataBankPage.tsx` - Main page component
- `OrganizationCard` - Compact card view
- `OrganizationDetail` - Modal detail view

### Data Management
- Mock data in component (ready for API integration)
- Client-side filtering and search
- Optimized re-renders with React best practices

### Styling
- Tailwind CSS for responsive design
- shadcn/ui components for consistency
- Color-coded ESG scores
- Professional Bloomberg-inspired aesthetics

## Usage Guide

### For Users

**Discovering Organizations**:
1. Navigate to Learn → Organization Data Bank
2. Use search bar for specific organizations
3. Filter by category (Energy, Food, etc.)
4. Toggle between Champions and Polluters
5. For Champions, filter by For-Profit/Non-Profit

**Viewing Details**:
1. Click any organization card
2. Review financial overview
3. Check climate impact metrics
4. See key performance indicators
5. Access external links

**Making Informed Decisions**:
- Compare ESG scores across similar organizations
- Track emission trends (polluters)
- Identify investment opportunities (champions)
- Research climate leaders in specific sectors
- Monitor corporate accountability

### For Developers

**Adding Organizations**:
```typescript
// Add to CLIMATE_CHAMPIONS or CLIMATE_POLLUTERS array
{
  id: nextId,
  name: "Organization Name",
  category: "energy",
  type: "for-profit",
  // ... fill in all required fields
}
```

**Customizing Metrics**:
- Each organization can have unique metrics
- Flexible climateImpact object
- Custom financial fields per type

**API Integration**:
- Replace mock data with API calls
- Add loading states
- Implement error handling
- Cache frequently accessed data

## Best Practices

### Data Quality
- Verify all financial data from official sources
- Cross-reference emission data with scientific reports
- Update quarterly at minimum
- Mark data freshness with timestamps

### User Experience
- Fast search with debouncing
- Smooth modal animations
- Accessible keyboard navigation
- Mobile-responsive design

### Performance
- Lazy load organization details
- Image optimization
- Efficient filtering algorithms
- Pagination for large datasets

## Comparison with Existing Platforms

### vs. Bloomberg Terminal
- **Similar**: Professional financial metrics, ESG scores, real-time data
- **Different**: Climate-focused, includes non-profits, free access

### vs. Crunchbase
- **Similar**: Company profiles, funding data, employee counts
- **Different**: Environmental focus, emission tracking, climate impact

### vs. PitchBook
- **Similar**: For-profit/non-profit distinction, financial tracking
- **Different**: Public environmental data, pollution rankings, free access

## Summary

The Organization Data Bank transforms Your Earth into a comprehensive climate finance and accountability platform by providing:

1. **Dual Database**: Champions and polluters in one place
2. **Financial Transparency**: Bloomberg-style metrics
3. **Climate Accountability**: Emission tracking and ESG scores
4. **Category Organization**: Aligned with platform interests
5. **Professional UI**: Clean, data-rich visualizations
6. **Actionable Insights**: Support informed investment and advocacy

This feature positions Your Earth as the go-to platform for climate-conscious decision making, combining education, data, and community action.
