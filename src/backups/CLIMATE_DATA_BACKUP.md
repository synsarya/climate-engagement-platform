# Climate Data Section Backup

This file contains backups of all climate data-related components that were removed from the main application.
These can be restored if needed in the future.

## Files Backed Up

1. `/components/ClimateDataDashboard.tsx` - Dashboard with live climate statistics
2. `/components/ClimateDataService.tsx` - ERA5 data download service interface
3. `/components/pages/ClimateDataPage.tsx` - Full climate data page with tabs

## Restoration Instructions

To restore these components:

1. Copy the component code from the sections below back to their respective files
2. In `/App.tsx`, add the import:
   ```typescript
   import { ClimateDataPage } from "./components/pages/ClimateDataPage";
   ```
3. In `/App.tsx`, add the case in the renderPage function:
   ```typescript
   case 'data':
     return <ClimateDataPage />;
   ```
4. In `/components/pages/HomePage.tsx`, add the import:
   ```typescript
   import { ClimateDataDashboard } from "../ClimateDataDashboard";
   ```
5. In `/components/pages/HomePage.tsx`, add the component to the page:
   ```tsx
   <ClimateDataDashboard />
   ```

## Component Code

### ClimateDataDashboard.tsx

Location: `/components/ClimateDataDashboard.tsx`

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Thermometer, Droplets, Wind, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const temperatureData = [
  { year: "2020", temp: 14.9 },
  { year: "2021", temp: 15.1 },
  { year: "2022", temp: 15.3 },
  { year: "2023", temp: 15.6 },
  { year: "2024", temp: 15.8 },
];

const energyData = [
  { source: "Solar", percentage: 35, color: "#f59e0b" },
  { source: "Wind", percentage: 28, color: "#10b981" },
  { source: "Hydro", percentage: 20, color: "#3b82f6" },
  { source: "Nuclear", percentage: 12, color: "#8b5cf6" },
  { source: "Other", percentage: 5, color: "#6b7280" },
];

const carbonData = [
  { month: "Jan", emissions: 420 },
  { month: "Feb", emissions: 415 },
  { month: "Mar", emissions: 418 },
  { month: "Apr", emissions: 422 },
  { month: "May", emissions: 425 },
  { month: "Jun", emissions: 423 },
];

export function ClimateDataDashboard() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Live Climate Intelligence</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time data and insights from satellite monitoring, research institutions, 
            and environmental sensors worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Global Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">+1.2°C</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-red-500" />
                <span>+0.1°C from last year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">CO₂ Levels</CardTitle>
              <Wind className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">421 ppm</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-orange-500" />
                <span>+2.1 ppm from last year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Renewable Energy</CardTitle>
              <Zap className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">68%</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+5% from last year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Sea Level</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">+3.4mm</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-blue-500" />
                <span>Annual rise rate</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Global Temperature Trend</CardTitle>
              <CardDescription>Average temperature anomaly over the past 5 years</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Renewable Energy Mix</CardTitle>
              <CardDescription>Current global renewable energy distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={energyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="percentage"
                    label={({ source, percentage }) => `${source}: ${percentage}%`}
                  >
                    {energyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Carbon Emissions Tracking</CardTitle>
              <CardDescription>Global CO₂ emissions by month (in PPM)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={carbonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="emissions" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Badge variant="outline" className="text-xs">
            Data sourced from NASA, NOAA, and IEA • Updated every 6 hours
          </Badge>
        </div>
      </div>
    </section>
  );
}
```

---

Due to the length of the other components (ClimateDataService.tsx has 563 lines and ClimateDataPage.tsx has 233 lines), 
please refer to the original files in git history or the backup files created in this directory.

The complete source code is available at:
- ClimateDataService.tsx.backup
- ClimateDataPage.tsx.backup

## Features Included

### ClimateDataDashboard
- Live climate statistics cards (Temperature, CO2, Renewable Energy, Sea Level)
- Temperature trend line chart
- Renewable energy mix pie chart
- Carbon emissions bar chart

### ClimateDataService
- Copernicus Climate Data Store (CDS) API integration
- ERA5 reanalysis data download interface
- Multiple climate variables (temperature, precipitation, wind, pressure, humidity, radiation)
- Geographic area selection
- Date range selection
- Data format selection (NetCDF, GRIB)
- Download queue management
- Generated CDS API code

### ClimateDataPage
- Full-page climate data interface
- Tabbed navigation (Download Data, Visualize GRIB)
- GRIB file visualizer integration
- ERA5 data specifications
- Integration guide for developers

## Dependencies

These components require:
- recharts (for charts)
- lucide-react (for icons)
- shadcn/ui components (Card, Badge, Button, Tabs, etc.)
- GribFileVisualizer component
