import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { 
  Factory, 
  Zap, 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Leaf, 
  AlertTriangle,
  Award,
  Filter,
  Globe,
  ThumbsUp,
  Heart,
  Star,
  Users,
  Trophy
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

const pollutingCompanies = [
  {
    id: 1,
    name: "PetroGlobal Corp",
    country: "United States",
    countryCode: "US",
    industry: "Oil & Gas",
    co2Emissions: "187.5M",
    emissionsChange: "+2.3%",
    marketCap: "$245B",
    esgScore: 23,
    status: "high-polluter",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMG9mZmljZSUyMGNvcnBvcmF0ZXxlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "CoalPower Industries",
    country: "China",
    countryCode: "CN",
    industry: "Coal Mining",
    co2Emissions: "234.7M",
    emissionsChange: "+1.8%",
    marketCap: "$156B",
    esgScore: 18,
    status: "high-polluter",
    logo: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    name: "SteelMax Corporation",
    country: "India",
    countryCode: "IN",
    industry: "Steel Production",
    co2Emissions: "89.2M",
    emissionsChange: "-0.5%",
    marketCap: "$78B",
    esgScore: 31,
    status: "moderate-polluter",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    name: "ChemGiant Ltd",
    country: "Germany",
    countryCode: "DE",
    industry: "Chemicals",
    co2Emissions: "56.8M",
    emissionsChange: "+3.1%",
    marketCap: "$89B",
    esgScore: 28,
    status: "moderate-polluter",
    logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 5,
    name: "BrasOil Enterprises",
    country: "Brazil",
    countryCode: "BR",
    industry: "Oil & Gas",
    co2Emissions: "123.4M",
    emissionsChange: "+4.2%",
    marketCap: "$67B",
    esgScore: 25,
    status: "high-polluter",
    logo: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const cleanCompanies = [
  {
    id: 1,
    name: "SolarTech Solutions",
    country: "Denmark",
    countryCode: "DK",
    industry: "Solar Energy",
    renewableCapacity: "12.5 GW",
    capacityChange: "+18.7%",
    marketCap: "$89B",
    esgScore: 94,
    status: "leading-clean",
    logo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVsc3xlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 2,
    name: "WindForce Global",
    country: "Norway",
    countryCode: "NO",
    industry: "Wind Energy",
    renewableCapacity: "8.9 GW",
    capacityChange: "+22.1%",
    marketCap: "$76B",
    esgScore: 91,
    status: "leading-clean",
    logo: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kJTIwdHVyYmluZXN8ZW58MXx8fHwxNzU4NjIwNjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 3,
    name: "Tesla Inc",
    country: "United States",
    countryCode: "US",
    industry: "Electric Vehicles",
    renewableCapacity: "6.2 GW",
    capacityChange: "+15.3%",
    marketCap: "$847B",
    esgScore: 87,
    status: "leading-clean",
    logo: "https://images.unsplash.com/photo-1617788138017-80ad40651399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGNhciUyMGNoYXJnaW5nfGVufDF8fHx8MTc1ODYyMDY0OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 4,
    name: "GreenHydro Power",
    country: "Canada",
    countryCode: "CA",
    industry: "Hydroelectric",
    renewableCapacity: "15.7 GW",
    capacityChange: "+8.9%",
    marketCap: "$54B",
    esgScore: 89,
    status: "leading-clean",
    logo: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoeWRyb2VsZWN0cmljJTIwZGFtfGVufDF8fHx8MTc1ODYyMDY0OXww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: 5,
    name: "BioFuels Innovations",
    country: "Sweden",
    countryCode: "SE",
    industry: "Bioenergy",
    renewableCapacity: "4.3 GW",
    capacityChange: "+26.4%",
    marketCap: "$23B",
    esgScore: 92,
    status: "leading-clean",
    logo: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9mdWVscyUyMGZhY3Rvcnl8ZW58MXx8fHwxNzU4NjIwNjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const countryStats = [
  { country: "United States", polluters: 47, cleaners: 23, ratio: 2.04 },
  { country: "China", polluters: 62, cleaners: 18, ratio: 3.44 },
  { country: "India", polluters: 34, cleaners: 12, ratio: 2.83 },
  { country: "Germany", polluters: 18, cleaners: 31, ratio: 0.58 },
  { country: "Norway", polluters: 3, cleaners: 42, ratio: 0.07 },
  { country: "Denmark", polluters: 2, cleaners: 38, ratio: 0.05 },
];

export function CorporateMonitor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [mainView, setMainView] = useState<"companies" | "countries">("companies");
  const [supportedCompanies, setSupportedCompanies] = useState<number[]>([]);

  // Initialize with some default supported companies
  const [companySupportCounts, setCompanySupportCounts] = useState<Record<number, number>>({
    1: 12453,  // SolarTech Solutions
    2: 9876,   // WindForce Global
    3: 25432,  // Tesla
    4: 6543,   // GreenHydro Power
    5: 4321,   // BioFuels Innovations
  });

  const toggleSupport = (companyId: number, companyName: string) => {
    setSupportedCompanies((prev) => {
      if (prev.includes(companyId)) {
        setCompanySupportCounts((counts) => ({
          ...counts,
          [companyId]: (counts[companyId] || 0) - 1,
        }));
        toast.success(`Removed support from ${companyName}`);
        return prev.filter((id) => id !== companyId);
      } else {
        setCompanySupportCounts((counts) => ({
          ...counts,
          [companyId]: (counts[companyId] || 0) + 1,
        }));
        toast.success(`You're now supporting ${companyName}! 🌱`, {
          description: "Your support helps highlight climate leaders",
        });
        return [...prev, companyId];
      }
    });
  };

  const getStatusColor = (status: string, score?: number) => {
    if (status === "high-polluter") return "text-red-500 bg-red-50 dark:bg-red-950";
    if (status === "moderate-polluter") return "text-orange-500 bg-orange-50 dark:bg-orange-950";
    if (status === "leading-clean") return "text-green-500 bg-green-50 dark:bg-green-950";
    return "text-gray-500 bg-gray-50 dark:bg-gray-950";
  };

  const getStatusIcon = (status: string) => {
    if (status === "high-polluter") return <AlertTriangle className="h-4 w-4" />;
    if (status === "moderate-polluter") return <Factory className="h-4 w-4" />;
    if (status === "leading-clean") return <Award className="h-4 w-4" />;
    return <Building2 className="h-4 w-4" />;
  };

  const filteredPolluters = pollutingCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || selectedCountry === "all" || company.country === selectedCountry;
    const matchesIndustry = !selectedIndustry || selectedIndustry === "all" || company.industry.includes(selectedIndustry);
    return matchesSearch && matchesCountry && matchesIndustry;
  });

  const filteredCleaners = cleanCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !selectedCountry || selectedCountry === "all" || company.country === selectedCountry;
    const matchesIndustry = !selectedIndustry || selectedIndustry === "all" || company.industry.includes(selectedIndustry);
    return matchesSearch && matchesCountry && matchesIndustry;
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Globe className="h-4 w-4 mr-2" />
            Corporate Climate Monitor
          </Badge>
          <h2 className="text-3xl mb-4">Track Corporate Climate Impact</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Monitor the world's largest polluters and leading clean energy companies. 
            Track emissions, investments, and ESG performance by country and industry.
          </p>
        </div>

        {/* Main View Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg border bg-background p-1">
            <Button
              variant={mainView === "companies" ? "default" : "ghost"}
              onClick={() => setMainView("companies")}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              Companies
            </Button>
            <Button
              variant={mainView === "countries" ? "default" : "ghost"}
              onClick={() => setMainView("countries")}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              Countries
            </Button>
          </div>
        </div>

        {/* Companies View */}
        {mainView === "companies" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Filter Controls */}
            <div className="mb-8">
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Norway">Norway</SelectItem>
                      <SelectItem value="Denmark">Denmark</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Sweden">Sweden</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                      <SelectItem value="Coal">Coal</SelectItem>
                      <SelectItem value="Steel">Steel</SelectItem>
                      <SelectItem value="Solar">Solar Energy</SelectItem>
                      <SelectItem value="Wind">Wind Energy</SelectItem>
                      <SelectItem value="Electric">Electric Vehicles</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Advanced Filters</span>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Company Tabs */}
            <Tabs defaultValue="cleaners" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cleaners" className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Clean Energy Leaders ({filteredCleaners.length})</span>
                </TabsTrigger>
                <TabsTrigger value="polluters" className="flex items-center space-x-2">
                  <Factory className="h-4 w-4" />
                  <span>Major Polluters ({filteredPolluters.length})</span>
                </TabsTrigger>
              </TabsList>

              {/* Clean Companies with Support Feature */}
              <TabsContent value="cleaners" className="space-y-6">
                {/* Top Supporters Banner */}
                {supportedCompanies.length > 0 && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500 rounded-full p-3">
                            <Heart className="h-5 w-5 text-white fill-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">You're supporting {supportedCompanies.length} climate leader{supportedCompanies.length > 1 ? 's' : ''}!</h4>
                            <p className="text-sm text-muted-foreground">Your voice helps amplify companies doing great climate work</p>
                          </div>
                        </div>
                        <Trophy className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCleaners.map((company) => {
                    const isSupported = supportedCompanies.includes(company.id);
                    const supportCount = companySupportCounts[company.id] || 0;
                    
                    return (
                      <motion.div
                        key={company.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isSupported ? 'ring-2 ring-green-500' : ''}`}>
                          <div className="aspect-video relative">
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-full h-full object-cover"
                            />
                            <Badge className={`absolute top-4 right-4 ${getStatusColor(company.status)}`}>
                              {getStatusIcon(company.status)}
                              <span className="ml-1">Clean Leader</span>
                            </Badge>
                            {isSupported && (
                              <div className="absolute top-4 left-4 bg-green-500 rounded-full p-2">
                                <Heart className="h-4 w-4 text-white fill-white" />
                              </div>
                            )}
                          </div>
                          
                          <CardHeader>
                            <CardTitle className="text-lg">{company.name}</CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{company.country} • {company.industry}</span>
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Renewable Capacity</span>
                                <div className="flex items-center space-x-1">
                                  <span className="font-bold text-green-500">{company.renewableCapacity}</span>
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Market Cap</span>
                                <div className="font-bold">{company.marketCap}</div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>ESG Score</span>
                                <span>{company.esgScore}/100</span>
                              </div>
                              <Progress value={company.esgScore} className="h-2" />
                            </div>

                            {/* Support Stats */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{supportCount.toLocaleString()} supporters</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant={isSupported ? "default" : "outline"}
                                size="sm"
                                className="flex-1 gap-2"
                                onClick={() => toggleSupport(company.id, company.name)}
                              >
                                {isSupported ? (
                                  <>
                                    <Heart className="h-4 w-4 fill-current" />
                                    Supporting
                                  </>
                                ) : (
                                  <>
                                    <ThumbsUp className="h-4 w-4" />
                                    Support
                                  </>
                                )}
                              </Button>
                              <Badge variant="outline" className="text-green-500">
                                {company.capacityChange}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Polluters Tab */}
              <TabsContent value="polluters" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPolluters.map((company) => (
                    <Card key={company.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-4 right-4 ${getStatusColor(company.status)}`}>
                          {getStatusIcon(company.status)}
                          <span className="ml-1">High Polluter</span>
                        </Badge>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{company.country} • {company.industry}</span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">CO₂ Emissions</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-bold text-red-500">{company.co2Emissions}</span>
                              <TrendingUp className="h-3 w-3 text-red-500" />
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Market Cap</span>
                            <div className="font-bold">{company.marketCap}</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>ESG Score</span>
                            <span>{company.esgScore}/100</span>
                          </div>
                          <Progress value={company.esgScore} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-red-500">
                            {company.emissionsChange} emissions
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Countries View */}
        {mainView === "countries" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-8">
              <h3 className="text-2xl mb-4">Global Corporate Climate Impact by Country</h3>
              <p className="text-muted-foreground max-w-2xl">
                Compare countries based on the number of major polluters vs clean energy companies. 
                Countries with more clean energy companies are leading the transition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countryStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center justify-between">
                        <span>{stat.country}</span>
                        <Badge variant={stat.ratio < 1 ? "default" : "destructive"} className="gap-1">
                          {stat.ratio < 1 ? (
                            <>
                              <Trophy className="h-3 w-3" />
                              Clean Leader
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3" />
                              High Polluter
                            </>
                          )}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Climate performance ratio: {stat.ratio.toFixed(2)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                          <Factory className="h-8 w-8 text-red-500 mx-auto mb-2" />
                          <div className="text-3xl font-bold text-red-500">{stat.polluters}</div>
                          <div className="text-sm text-muted-foreground mt-1">Polluters</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <Leaf className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <div className="text-3xl font-bold text-green-500">{stat.cleaners}</div>
                          <div className="text-sm text-muted-foreground mt-1">Clean Leaders</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Clean Energy Progress</span>
                          <span className="font-medium">{Math.round((stat.cleaners / (stat.polluters + stat.cleaners)) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(stat.cleaners / (stat.polluters + stat.cleaners)) * 100} 
                          className="h-3"
                        />
                      </div>

                      <div className="pt-2 flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Total Companies: </span>
                          <span className="font-medium">{stat.polluters + stat.cleaners}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Country Leaderboard */}
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Climate Leadership Ranking
                </CardTitle>
                <CardDescription>
                  Countries ranked by clean energy company ratio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...countryStats]
                    .sort((a, b) => a.ratio - b.ratio)
                    .map((stat, index) => (
                      <div key={stat.country} className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-muted'
                        }`}>
                          <span className="font-bold text-white">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{stat.country}</span>
                            <Badge variant={stat.ratio < 1 ? "default" : "secondary"}>
                              Ratio: {stat.ratio.toFixed(2)}
                            </Badge>
                          </div>
                          <Progress 
                            value={100 - (stat.ratio / 4 * 100)} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Call to Action */}
        <div className="mt-16">
          <Card className="p-8 text-center bg-gradient-to-br from-background to-muted/20">
            <CardHeader>
              <CardTitle className="text-2xl">Get Involved in Corporate Accountability</CardTitle>
              <CardDescription className="text-lg">
                Use this data to make informed investment decisions, support clean companies, 
                and advocate for corporate climate responsibility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  Download Full Report
                </Button>
                <Button variant="outline" size="lg">
                  Set Up Alerts
                </Button>
                <Button variant="outline" size="lg">
                  Share This Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}