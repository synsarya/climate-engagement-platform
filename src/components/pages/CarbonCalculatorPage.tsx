import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Calculator, Car, Plane, UtensilsCrossed, Recycle, TreePine, Zap, BarChart3, TrendingUp, TrendingDown, Leaf, ArrowRight, Lightbulb } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Emission factors (kg CO2 per unit)
const EMISSION_FACTORS = {
  transport: {
    gasolineCar: 0.404, // kg CO2 per mile
    electricCar: 0.150, // kg CO2 per mile (varies by grid mix)
    bus: 0.089,
    train: 0.045,
    bicycle: 0,
    walking: 0
  },
  flights: {
    domestic: 0.255, // kg CO2 per mile
    international: 0.298,
    shortHaul: 0.285, // < 1500 miles
    longHaul: 0.298 // > 1500 miles
  },
  diet: {
    beef: 27, // kg CO2 per kg food
    lamb: 24,
    pork: 12,
    chicken: 6.9,
    fish: 6.1,
    vegetables: 2,
    fruits: 1.1,
    grains: 2.5,
    dairy: 17
  },
  energy: {
    coal: 0.82, // kg CO2 per kWh
    naturalGas: 0.35,
    oil: 0.74,
    nuclear: 0.012,
    solar: 0.041,
    wind: 0.011,
    hydro: 0.024,
    renewable: 0.02
  },
  plastic: {
    bottle: 0.82, // kg CO2 per bottle
    bag: 0.04,
    packaging: 6 // kg CO2 per kg plastic
  },
  trees: {
    sequestration: -21.77 // kg CO2 absorbed per tree per year
  }
};

const GRID_MIX = {
  'USA': { coal: 0.2, gas: 0.4, nuclear: 0.2, renewable: 0.2 },
  'Germany': { coal: 0.3, gas: 0.15, nuclear: 0.13, renewable: 0.42 },
  'China': { coal: 0.64, gas: 0.03, nuclear: 0.05, renewable: 0.28 },
  'India': { coal: 0.7, gas: 0.05, nuclear: 0.03, renewable: 0.22 },
  'France': { coal: 0.03, gas: 0.07, nuclear: 0.67, renewable: 0.23 },
  'Brazil': { coal: 0.04, gas: 0.09, nuclear: 0.02, renewable: 0.85 },
  'Canada': { coal: 0.07, gas: 0.09, nuclear: 0.15, renewable: 0.69 },
  'Japan': { coal: 0.32, gas: 0.37, nuclear: 0.06, renewable: 0.25 },
  'UK': { coal: 0.02, gas: 0.39, nuclear: 0.16, renewable: 0.43 },
  'Australia': { coal: 0.54, gas: 0.20, nuclear: 0, renewable: 0.26 }
};

export function CarbonCalculatorPage() {
  const [calculations, setCalculations] = useState({
    transport: {
      vehicle: 'gasolineCar',
      miles: '',
      fuelEfficiency: '25'
    },
    flights: {
      departure: '',
      destination: '',
      distance: '',
      flightType: 'domestic',
      roundTrip: true
    },
    diet: {
      beefServings: '',
      chickenServings: '',
      fishServings: '',
      vegetableServings: '',
      dairyServings: ''
    },
    energy: {
      monthlyKwh: '',
      country: 'USA',
      renewablePercent: '0'
    },
    plastic: {
      bottlesPerWeek: '',
      plasticBagsPerWeek: ''
    },
    trees: {
      treesPlanted: ''
    }
  });

  const [results, setResults] = useState({
    transport: 0,
    flights: 0,
    diet: 0,
    energy: 0,
    plastic: 0,
    trees: 0,
    total: 0
  });

  const calculateTransportEmissions = () => {
    const { vehicle, miles, fuelEfficiency } = calculations.transport;
    const distance = parseFloat(miles) || 0;
    let emissions = 0;

    if (vehicle === 'gasolineCar') {
      emissions = distance * EMISSION_FACTORS.transport.gasolineCar;
    } else if (vehicle === 'electricCar') {
      const country = calculations.energy.country;
      const gridMix = GRID_MIX[country as keyof typeof GRID_MIX] || GRID_MIX.USA;
      const gridEmissionFactor = 
        gridMix.coal * EMISSION_FACTORS.energy.coal +
        gridMix.gas * EMISSION_FACTORS.energy.naturalGas +
        gridMix.nuclear * EMISSION_FACTORS.energy.nuclear +
        gridMix.renewable * EMISSION_FACTORS.energy.renewable;
      
      const kwhPer100Miles = 30; // Average EV efficiency
      emissions = distance * (kwhPer100Miles / 100) * gridEmissionFactor;
    } else {
      emissions = distance * EMISSION_FACTORS.transport[vehicle as keyof typeof EMISSION_FACTORS.transport];
    }

    return emissions;
  };

  const calculateFlightEmissions = () => {
    const { distance, flightType, roundTrip } = calculations.flights;
    const dist = parseFloat(distance) || 0;
    const factor = EMISSION_FACTORS.flights[flightType as keyof typeof EMISSION_FACTORS.flights];
    return dist * factor * (roundTrip ? 2 : 1);
  };

  const calculateDietEmissions = () => {
    const { beefServings, chickenServings, fishServings, vegetableServings, dairyServings } = calculations.diet;
    
    const beef = (parseFloat(beefServings) || 0) * 0.25 * EMISSION_FACTORS.diet.beef; // 0.25kg per serving
    const chicken = (parseFloat(chickenServings) || 0) * 0.15 * EMISSION_FACTORS.diet.chicken;
    const fish = (parseFloat(fishServings) || 0) * 0.15 * EMISSION_FACTORS.diet.fish;
    const vegetables = (parseFloat(vegetableServings) || 0) * 0.1 * EMISSION_FACTORS.diet.vegetables;
    const dairy = (parseFloat(dairyServings) || 0) * 0.25 * EMISSION_FACTORS.diet.dairy;
    
    return (beef + chicken + fish + vegetables + dairy) * 52; // Annual emissions
  };

  const calculateEnergyEmissions = () => {
    const { monthlyKwh, country, renewablePercent } = calculations.energy;
    const kwh = (parseFloat(monthlyKwh) || 0) * 12; // Annual consumption
    const renewable = parseFloat(renewablePercent) || 0;
    
    const gridMix = GRID_MIX[country as keyof typeof GRID_MIX] || GRID_MIX.USA;
    
    const gridEmissionFactor = 
      gridMix.coal * EMISSION_FACTORS.energy.coal +
      gridMix.gas * EMISSION_FACTORS.energy.naturalGas +
      gridMix.nuclear * EMISSION_FACTORS.energy.nuclear +
      gridMix.renewable * EMISSION_FACTORS.energy.renewable;
    
    const renewableEmissionFactor = EMISSION_FACTORS.energy.renewable;
    
    const currentEmissions = kwh * gridEmissionFactor;
    const renewableEmissions = kwh * (renewable / 100) * renewableEmissionFactor;
    const remainingEmissions = kwh * ((100 - renewable) / 100) * gridEmissionFactor;
    
    return remainingEmissions + renewableEmissions;
  };

  const calculatePlasticEmissions = () => {
    const { bottlesPerWeek, plasticBagsPerWeek } = calculations.plastic;
    const bottles = (parseFloat(bottlesPerWeek) || 0) * 52 * EMISSION_FACTORS.plastic.bottle;
    const bags = (parseFloat(plasticBagsPerWeek) || 0) * 52 * EMISSION_FACTORS.plastic.bag;
    return bottles + bags;
  };

  const calculateTreeBenefit = () => {
    const trees = parseFloat(calculations.trees.treesPlanted) || 0;
    return trees * EMISSION_FACTORS.trees.sequestration;
  };

  const calculateTotal = () => {
    const transport = calculateTransportEmissions();
    const flights = calculateFlightEmissions();
    const diet = calculateDietEmissions();
    const energy = calculateEnergyEmissions();
    const plastic = calculatePlasticEmissions();
    const trees = calculateTreeBenefit();
    
    const newResults = {
      transport,
      flights,
      diet,
      energy,
      plastic,
      trees,
      total: transport + flights + diet + energy + plastic + trees
    };
    
    setResults(newResults);
  };

  const updateCalculation = (category: string, field: string, value: string) => {
    setCalculations(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const chartData = [
    { name: 'Transportation', value: Math.abs(results.transport), color: '#ef4444' },
    { name: 'Flights', value: Math.abs(results.flights), color: '#f97316' },
    { name: 'Diet', value: Math.abs(results.diet), color: '#eab308' },
    { name: 'Energy', value: Math.abs(results.energy), color: '#3b82f6' },
    { name: 'Plastic', value: Math.abs(results.plastic), color: '#8b5cf6' },
    { name: 'Trees (Offset)', value: Math.abs(results.trees), color: '#22c55e' }
  ];

  const totalAbsolute = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Calculator className="h-4 w-4 mr-2" />
              Personal Carbon Calculator
            </Badge>
            <h1 className="text-4xl lg:text-6xl mb-6">
              Calculate Your <span className="text-primary">Carbon Footprint</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Understand your personal climate impact across transportation, diet, energy use, and lifestyle choices. 
              Get actionable insights to reduce your carbon footprint and track your progress over time.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Interface */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Panels */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>Lifestyle Carbon Calculator</span>
                  </CardTitle>
                  <CardDescription>
                    Input your lifestyle parameters to calculate your annual carbon footprint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="transport" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="transport" className="flex items-center space-x-1">
                        <Car className="h-4 w-4" />
                        <span className="hidden sm:inline">Transport</span>
                      </TabsTrigger>
                      <TabsTrigger value="flights" className="flex items-center space-x-1">
                        <Plane className="h-4 w-4" />
                        <span className="hidden sm:inline">Flights</span>
                      </TabsTrigger>
                      <TabsTrigger value="diet" className="flex items-center space-x-1">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span className="hidden sm:inline">Diet</span>
                      </TabsTrigger>
                      <TabsTrigger value="energy" className="flex items-center space-x-1">
                        <Zap className="h-4 w-4" />
                        <span className="hidden sm:inline">Energy</span>
                      </TabsTrigger>
                      <TabsTrigger value="plastic" className="flex items-center space-x-1">
                        <Recycle className="h-4 w-4" />
                        <span className="hidden sm:inline">Plastic</span>
                      </TabsTrigger>
                      <TabsTrigger value="trees" className="flex items-center space-x-1">
                        <TreePine className="h-4 w-4" />
                        <span className="hidden sm:inline">Trees</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Transportation Tab */}
                    <TabsContent value="transport" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="vehicle">Vehicle Type</Label>
                          <Select value={calculations.transport.vehicle} onValueChange={(value) => updateCalculation('transport', 'vehicle', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gasolineCar">Gasoline Car</SelectItem>
                              <SelectItem value="electricCar">Electric Car</SelectItem>
                              <SelectItem value="bus">Public Bus</SelectItem>
                              <SelectItem value="train">Train</SelectItem>
                              <SelectItem value="bicycle">Bicycle</SelectItem>
                              <SelectItem value="walking">Walking</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="miles">Annual Miles Driven</Label>
                          <Input
                            id="miles"
                            type="number"
                            placeholder="e.g., 12000"
                            value={calculations.transport.miles}
                            onChange={(e) => updateCalculation('transport', 'miles', e.target.value)}
                          />
                        </div>

                        {calculations.transport.vehicle === 'gasolineCar' && (
                          <div>
                            <Label htmlFor="efficiency">Fuel Efficiency (MPG)</Label>
                            <Input
                              id="efficiency"
                              type="number"
                              placeholder="e.g., 25"
                              value={calculations.transport.fuelEfficiency}
                              onChange={(e) => updateCalculation('transport', 'fuelEfficiency', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Flights Tab */}
                    <TabsContent value="flights" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="flightType">Flight Type</Label>
                          <Select value={calculations.flights.flightType} onValueChange={(value) => updateCalculation('flights', 'flightType', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select flight type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="domestic">Domestic</SelectItem>
                              <SelectItem value="shortHaul">Short Haul (&lt; 1500 miles)</SelectItem>
                              <SelectItem value="longHaul">Long Haul (&gt; 1500 miles)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="departure">Departure City</Label>
                            <Input
                              id="departure"
                              placeholder="e.g., New York"
                              value={calculations.flights.departure}
                              onChange={(e) => updateCalculation('flights', 'departure', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="destination">Destination City</Label>
                            <Input
                              id="destination"
                              placeholder="e.g., Los Angeles"
                              value={calculations.flights.destination}
                              onChange={(e) => updateCalculation('flights', 'destination', e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="distance">Flight Distance (miles)</Label>
                          <Input
                            id="distance"
                            type="number"
                            placeholder="e.g., 2400"
                            value={calculations.flights.distance}
                            onChange={(e) => updateCalculation('flights', 'distance', e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Diet Tab */}
                    <TabsContent value="diet" className="space-y-6">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Average servings per week:</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="beef">Beef Servings/Week</Label>
                            <Input
                              id="beef"
                              type="number"
                              placeholder="e.g., 3"
                              value={calculations.diet.beefServings}
                              onChange={(e) => updateCalculation('diet', 'beefServings', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="chicken">Chicken Servings/Week</Label>
                            <Input
                              id="chicken"
                              type="number"
                              placeholder="e.g., 4"
                              value={calculations.diet.chickenServings}
                              onChange={(e) => updateCalculation('diet', 'chickenServings', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="fish">Fish Servings/Week</Label>
                            <Input
                              id="fish"
                              type="number"
                              placeholder="e.g., 2"
                              value={calculations.diet.fishServings}
                              onChange={(e) => updateCalculation('diet', 'fishServings', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vegetables">Vegetable Servings/Week</Label>
                            <Input
                              id="vegetables"
                              type="number"
                              placeholder="e.g., 21"
                              value={calculations.diet.vegetableServings}
                              onChange={(e) => updateCalculation('diet', 'vegetableServings', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="dairy">Dairy Servings/Week</Label>
                            <Input
                              id="dairy"
                              type="number"
                              placeholder="e.g., 7"
                              value={calculations.diet.dairyServings}
                              onChange={(e) => updateCalculation('diet', 'dairyServings', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Energy Tab */}
                    <TabsContent value="energy" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="country">Country/Grid Mix</Label>
                          <Select value={calculations.energy.country} onValueChange={(value) => updateCalculation('energy', 'country', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(GRID_MIX).map(country => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="kwh">Monthly kWh Usage</Label>
                          <Input
                            id="kwh"
                            type="number"
                            placeholder="e.g., 850"
                            value={calculations.energy.monthlyKwh}
                            onChange={(e) => updateCalculation('energy', 'monthlyKwh', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="renewable">Renewable Energy % (if applicable)</Label>
                          <Input
                            id="renewable"
                            type="number"
                            placeholder="e.g., 0"
                            min="0"
                            max="100"
                            value={calculations.energy.renewablePercent}
                            onChange={(e) => updateCalculation('energy', 'renewablePercent', e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Plastic Tab */}
                    <TabsContent value="plastic" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bottles">Plastic Bottles per Week</Label>
                          <Input
                            id="bottles"
                            type="number"
                            placeholder="e.g., 5"
                            value={calculations.plastic.bottlesPerWeek}
                            onChange={(e) => updateCalculation('plastic', 'bottlesPerWeek', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="bags">Plastic Bags per Week</Label>
                          <Input
                            id="bags"
                            type="number"
                            placeholder="e.g., 10"
                            value={calculations.plastic.plasticBagsPerWeek}
                            onChange={(e) => updateCalculation('plastic', 'plasticBagsPerWeek', e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Trees Tab */}
                    <TabsContent value="trees" className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="treesPlanted">Trees Planted This Year</Label>
                          <Input
                            id="treesPlanted"
                            type="number"
                            placeholder="e.g., 5"
                            value={calculations.trees.treesPlanted}
                            onChange={(e) => updateCalculation('trees', 'treesPlanted', e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Each tree absorbs approximately 48 lbs (22 kg) of CO2 per year
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator className="my-6" />
                  
                  <Button onClick={calculateTotal} className="w-full" size="lg">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate My Carbon Footprint
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Your Carbon Footprint</span>
                  </CardTitle>
                  <CardDescription>
                    Annual CO2 emissions in metric tons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Total Emissions */}
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary">
                      {(results.total / 1000).toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">tons CO2 per year</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Global average: 4.8 tons
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Breakdown by Category</h4>
                    
                    {chartData.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-sm font-medium">
                            {item.name === 'Trees (Offset)' ? '-' : ''}{(item.value / 1000).toFixed(2)}t
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${totalAbsolute > 0 ? (item.value / totalAbsolute) * 100 : 0}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Impact Comparison */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Climate Impact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>vs Global Average</span>
                        <Badge variant={results.total / 1000 > 4.8 ? "destructive" : "secondary"}>
                          {results.total / 1000 > 4.8 ? 
                            <TrendingUp className="h-3 w-3 mr-1" /> : 
                            <TrendingDown className="h-3 w-3 mr-1" />
                          }
                          {((results.total / 1000 / 4.8 - 1) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>vs US Average (16t)</span>
                        <Badge variant={results.total / 1000 > 16 ? "destructive" : "secondary"}>
                          {results.total / 1000 > 16 ? 
                            <TrendingUp className="h-3 w-3 mr-1" /> : 
                            <TrendingDown className="h-3 w-3 mr-1" />
                          }
                          {((results.total / 1000 / 16 - 1) * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Quick Reduction Tips</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span>Switch to renewable energy</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span>Use public transportation</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-md">
                        <UtensilsCrossed className="h-4 w-4 text-orange-600" />
                        <span>Reduce meat consumption</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Get Personalized Action Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Insights & Comparisons */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Understanding Your Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare your carbon footprint with global averages and discover impactful ways to reduce emissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg mb-2">Transportation Impact</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Transportation accounts for 29% of US greenhouse gas emissions. Switching to electric or public transport can reduce this significantly.
              </p>
              <Badge variant="secondary">-75% with EV switch</Badge>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg mb-2">Diet Choices</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Food production generates 24% of global emissions. Plant-based diets can reduce food-related emissions by up to 73%.
              </p>
              <Badge variant="secondary">-73% plant-based</Badge>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg mb-2">Energy Source</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Electricity generation produces 25% of global emissions. Renewable energy can cut household emissions by 50%.
              </p>
              <Badge variant="secondary">-90% renewable</Badge>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}