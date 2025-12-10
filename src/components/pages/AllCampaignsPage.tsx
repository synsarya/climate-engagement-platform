import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Search, Filter, ArrowLeft, MapPin, Calendar, Users, 
  Target, Clock, ArrowRight, TrendingUp, Zap, Leaf, 
  Droplets, Wind, Factory, Globe
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";

interface AllCampaignsPageProps {
  onNavigate: (page: string) => void;
  user?: any;
}

export function AllCampaignsPage({ onNavigate, user }: AllCampaignsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const categories = [
    { id: "all", name: "All Categories", icon: Globe },
    { id: "energy", name: "Energy", icon: Zap },
    { id: "nature", name: "Nature", icon: Leaf },
    { id: "water", name: "Water", icon: Droplets },
    { id: "air", name: "Air Quality", icon: Wind },
    { id: "industry", name: "Industry", icon: Factory },
  ];

  const campaigns = [
    {
      id: 1,
      title: "Solar Schools Initiative",
      description: "Help install solar panels in 100 schools across underserved communities",
      image: "https://images.unsplash.com/photo-1638068110878-c412de93e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHdpbmR8ZW58MXx8fHwxNzU4NjIwNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      goal: 100,
      current: 67,
      deadline: "Dec 2024",
      participants: 2340,
      category: "energy",
      categoryName: "Energy",
      impact: "500,000 students impacted",
      difficulty: "Medium",
      timeCommitment: "2-4 hours/week",
      location: "Nationwide, USA",
      trending: true
    },
    {
      id: 2,
      title: "Urban Forest Restoration",
      description: "Plant 10,000 native trees in urban areas to improve air quality and biodiversity",
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwZWFydGglMjBlbnZpcm9ubWVudHxlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      goal: 10000,
      current: 8234,
      deadline: "Spring 2025",
      participants: 1850,
      category: "nature",
      categoryName: "Nature",
      impact: "2,400 tons CO₂ offset annually",
      difficulty: "Easy",
      timeCommitment: "1-2 hours/week",
      location: "Major Cities",
      trending: false
    },
    {
      id: 3,
      title: "Clean Energy Policy Advocacy",
      description: "Advocate for renewable energy legislation in your local government",
      image: "https://images.unsplash.com/photo-1591025294860-c830b21298b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBhY3RpdmlzbSUyMHByb3Rlc3QlMjBtYXJjaHxlbnwxfHx8fDE3NTg2OTIxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      goal: 50,
      current: 23,
      deadline: "Nov 2024",
      participants: 890,
      category: "energy",
      categoryName: "Policy",
      impact: "State-wide policy change",
      difficulty: "Hard",
      timeCommitment: "5+ hours/week",
      location: "State Capitals",
      trending: true
    },
    {
      id: 4,
      title: "Ocean Cleanup Drive",
      description: "Remove plastic waste from coastlines and protect marine ecosystems",
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwZWFydGglMjBlbnZpcm9ubWVudHxlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      goal: 1000,
      current: 567,
      deadline: "Summer 2025",
      participants: 3240,
      category: "water",
      categoryName: "Water",
      impact: "50 tons plastic removed",
      difficulty: "Easy",
      timeCommitment: "2-3 hours/week",
      location: "Coastal Areas",
      trending: true
    },
    {
      id: 5,
      title: "Green Building Initiative",
      description: "Promote sustainable architecture and net-zero buildings in your community",
      image: "https://images.unsplash.com/photo-1638068110878-c412de93e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHdpbmR8ZW58MXx8fHwxNzU4NjIwNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      goal: 30,
      current: 12,
      deadline: "Dec 2025",
      participants: 456,
      category: "industry",
      categoryName: "Industry",
      impact: "30% energy reduction",
      difficulty: "Hard",
      timeCommitment: "4-6 hours/week",
      location: "Urban Areas",
      trending: false
    },
    {
      id: 6,
      title: "Community Solar Gardens",
      description: "Establish shared solar installations for apartment dwellers and renters",
      image: "https://images.unsplash.com/photo-1638068110878-c412de93e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHdpbmR8ZW58MXx8fHwxNzU4NjIwNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      goal: 20,
      current: 8,
      deadline: "Fall 2024",
      participants: 678,
      category: "energy",
      categoryName: "Energy",
      impact: "1,200 households powered",
      difficulty: "Medium",
      timeCommitment: "3-5 hours/week",
      location: "Metropolitan Areas",
      trending: false
    }
  ];

  // Filter campaigns based on search and filters
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || campaign.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || campaign.difficulty.toLowerCase() === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const trendingCampaigns = campaigns.filter(c => c.trending);
  const urgentCampaigns = campaigns.filter(c => {
    const progress = (c.current / c.goal) * 100;
    return progress < 50 || c.deadline.includes("2024");
  });

  const CampaignCard = ({ campaign }: { campaign: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative">
        <ImageWithFallback
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        {campaign.trending && (
          <Badge className="absolute top-4 left-4 bg-orange-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        )}
        <Badge className="absolute top-4 right-4" variant="secondary">
          {campaign.categoryName}
        </Badge>
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{campaign.difficulty}</Badge>
        </div>
        <CardTitle className="text-lg">{campaign.title}</CardTitle>
        <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">{campaign.current}/{campaign.goal}</span>
          </div>
          <Progress value={(campaign.current / campaign.goal) * 100} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{campaign.deadline}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{campaign.participants.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{campaign.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{campaign.timeCommitment}</span>
          </div>
        </div>
        
        <div className="text-xs bg-muted/50 p-2 rounded">
          <Target className="h-3 w-3 inline mr-1" />
          <span className="font-medium">Impact:</span> {campaign.impact}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            className="flex-1"
            onClick={() => {
              if (!user) {
                onNavigate('login');
              } else {
                onNavigate('campaign-detail');
              }
            }}
          >
            {user ? 'Join Campaign' : 'Sign in to Join'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => onNavigate('campaign-detail')}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pt-8">
      {/* Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => onNavigate('action')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Action Hub
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl mb-4">All Climate Campaigns</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Discover and join campaigns that align with your climate action goals. 
              Every contribution makes a difference.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="air">Air Quality</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </div>
        </div>
      </section>

      {/* Campaign Lists */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="space-y-8">
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
              {filteredCampaigns.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No campaigns found matching your filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedDifficulty("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="urgent" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {urgentCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
