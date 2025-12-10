import { CorporateMonitor } from "../CorporateMonitor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Building2, TrendingUp, AlertTriangle, Award, BarChart3, Globe, Factory, Leaf } from "lucide-react";

const impactStats = [
  {
    title: "Companies Tracked",
    value: "2,847",
    change: "+156 this month",
    icon: Building2
  },
  {
    title: "CO₂ Emissions Monitored",
    value: "15.2B tons",
    change: "+2.3% from last year",
    icon: Factory
  },
  {
    title: "Clean Energy Leaders",
    value: "428",
    change: "+67 new companies",
    icon: Leaf
  },
  {
    title: "ESG Score Average",
    value: "64/100",
    change: "+4 points improvement",
    icon: Award
  }
];

const keyInsights = [
  {
    title: "Top Polluting Industries",
    items: ["Oil & Gas (34%)", "Coal Mining (28%)", "Steel Production (18%)", "Chemicals (12%)", "Cement (8%)"],
    trend: "up",
    color: "red"
  },
  {
    title: "Leading Clean Sectors",  
    items: ["Solar Energy (42%)", "Wind Power (31%)", "Electric Vehicles (15%)", "Hydroelectric (8%)", "Bioenergy (4%)"],
    trend: "up",
    color: "green"
  },
  {
    title: "ESG Improvements",
    items: ["Tesla (+12 points)", "Vestas (+9 points)", "Ørsted (+8 points)", "NextEra (+7 points)", "Iberdrola (+6 points)"],
    trend: "up", 
    color: "blue"
  },
  {
    title: "Emission Reductions",
    items: ["Unilever (-15%)", "Microsoft (-12%)", "IKEA (-10%)", "Google (-8%)", "Apple (-7%)"],
    trend: "down",
    color: "green"
  }
];

interface CorporateClimateImpactPageProps {
  onNavigate?: (page: string) => void;
}

export function CorporateClimateImpactPage({ onNavigate }: CorporateClimateImpactPageProps) {
  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <BarChart3 className="h-4 w-4 mr-2" />
              Corporate Climate Impact
            </Badge>
            <h1 className="text-4xl lg:text-6xl mb-6">
              Track Corporate <span className="text-primary">Climate Accountability</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Monitor the world's largest companies and their climate impact. Access real-time data on emissions, 
              renewable investments, ESG scores, and sustainability commitments across industries and countries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => onNavigate && onNavigate('learn-databank')}>
                View Corporate Dashboard
              </Button>
              <Button variant="outline" size="lg" onClick={() => alert('Report download feature coming soon!')}>
                Download Climate Report
              </Button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span>{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Corporate Climate Insights</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key trends and insights from global corporate climate data analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {keyInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{insight.title}</span>
                    {insight.trend === 'up' ? (
                      <TrendingUp className={`h-4 w-4 text-${insight.color}-500`} />
                    ) : (
                      <TrendingUp className={`h-4 w-4 text-${insight.color}-500 rotate-180`} />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {insight.items.map((item, i) => (
                    <div key={i} className="text-sm flex justify-between items-center">
                      <span>{item.split(' (')[0]}</span>
                      <Badge variant="outline" className="text-xs">
                        {item.includes('(') ? item.match(/\(([^)]+)\)/)?.[1] : ''}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Corporate Monitor */}
      <CorporateMonitor />

      {/* Tools & Resources */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Corporate Accountability Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access professional tools for corporate climate analysis and accountability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl">Polluter Tracker</h3>
                <p className="text-muted-foreground">
                  Monitor the world's largest corporate polluters with real-time emissions data and trends.
                </p>
                <Button className="w-full">
                  Track Polluters
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto">
                  <Leaf className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl">Clean Leaders</h3>
                <p className="text-muted-foreground">
                  Discover companies leading the transition to renewable energy and sustainable practices.
                </p>
                <Button className="w-full">
                  Explore Leaders
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto">
                  <Globe className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl">Global Analysis</h3>
                <p className="text-muted-foreground">
                  Compare corporate climate performance across countries, industries, and regions.
                </p>
                <Button className="w-full">
                  View Global Data
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}