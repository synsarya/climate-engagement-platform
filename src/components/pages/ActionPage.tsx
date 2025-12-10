import { ActionHub } from "../ActionHub";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Target, TrendingUp, Users, MapPin, Calendar, Zap, Leaf, Recycle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const actionStats = [
  {
    title: "Active Campaigns",
    value: "247",
    change: "+23 this month",
    icon: Target
  },
  {
    title: "Actions Completed",
    value: "89,432",
    change: "+1,234 today",
    icon: TrendingUp
  },
  {
    title: "People Mobilized",
    value: "156,789",
    change: "+5,678 this week",
    icon: Users
  },
  {
    title: "Cities Impacted",
    value: "445",
    change: "+12 new cities",
    icon: MapPin
  }
];

const impactCategories = [
  {
    title: "Energy Transition",
    description: "Accelerating renewable energy adoption",
    campaigns: 47,
    impact: "2.3M tons CO₂ prevented",
    icon: Zap,
    color: "bg-yellow-500"
  },
  {
    title: "Nature Conservation",
    description: "Protecting and restoring ecosystems",
    campaigns: 62,
    impact: "150K trees planted",
    icon: Leaf,
    color: "bg-green-500"
  },
  {
    title: "Circular Economy",
    description: "Reducing waste and promoting recycling",
    campaigns: 38,
    impact: "45K tons waste diverted",
    icon: Recycle,
    color: "bg-blue-500"
  }
];

const urgentActions = [
  {
    title: "Emergency Climate Fund",
    description: "Support communities affected by extreme weather events",
    deadline: "3 days left",
    progress: 78,
    goal: "$500,000",
    raised: "$390,000",
    supporters: 2847,
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwZWFydGglMjBlbnZpcm9ubWVudHxlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    title: "Stop Arctic Drilling",
    description: "Petition to prevent new oil exploration in protected Arctic areas",
    deadline: "1 week left",
    progress: 85,
    goal: "100,000 signatures",
    raised: "85,234 signatures",
    supporters: 85234,
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwZWFydGglMjBlbnZpcm9ubWVudHxlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

interface ActionPageProps {
  onNavigate?: (page: string) => void;
  user?: any;
}

export function ActionPage({ onNavigate, user }: ActionPageProps) {
  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Climate Action Platform
            </Badge>
            <h1 className="text-4xl lg:text-6xl mb-6">
              Turn Knowledge into <span className="text-primary">Action</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join global campaigns, complete personal climate actions, and track your environmental impact. 
              Every action counts in the fight against climate change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => {
                  if (user) {
                    // Scroll to action hub section
                    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                  } else {
                    onNavigate && onNavigate('signup');
                  }
                }}
              >
                {user ? 'View All Actions' : 'Start Taking Action'}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => onNavigate && onNavigate('campaign-detail')}
              >
                Browse Campaigns
              </Button>
            </div>
          </div>

          {/* Action Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {actionStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urgent Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Urgent Actions Needed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Time-sensitive campaigns that need immediate support to create meaningful climate impact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {urgentActions.map((action, index) => (
              <Card key={index} className="overflow-hidden border-destructive/20">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={action.image}
                    alt={action.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-destructive">
                    Urgent: {action.deadline}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress to goal</span>
                      <span className="font-medium">{action.raised} / {action.goal}</span>
                    </div>
                    <Progress value={action.progress} className="h-3" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{action.supporters.toLocaleString()} supporters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{action.deadline}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => onNavigate && onNavigate('campaign-detail')}
                  >
                    Take Action Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Categories */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Areas of Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the climate action areas that matter most to you and make a targeted impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {impactCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="text-center p-8">
                  <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold">{category.campaigns}</div>
                        <div className="text-muted-foreground">Active Campaigns</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{category.impact}</div>
                        <div className="text-muted-foreground">Total Impact</div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => onNavigate && onNavigate('campaign-detail')}
                    >
                      Explore Actions
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Action Hub */}
      <ActionHub user={user} onNavigate={onNavigate} />

      {/* Success Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real results from our community's climate actions around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Solar Schools Network</CardTitle>
                <Badge variant="secondary" className="w-fit">Completed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Successfully installed solar panels in 150 schools across 15 states, 
                  providing clean energy to 75,000 students.
                </p>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Energy Generated:</span>
                    <span className="font-semibold">2.8 GWh annually</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CO₂ Prevented:</span>
                    <span className="font-semibold">1,980 tons/year</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Money Saved:</span>
                    <span className="font-semibold">$420,000/year</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Urban Forest Initiative</CardTitle>
                <Badge variant="secondary" className="w-fit">Ongoing</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Community-led tree planting in urban areas to improve air quality 
                  and create green spaces.
                </p>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Trees Planted:</span>
                    <span className="font-semibold">45,678</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cities Involved:</span>
                    <span className="font-semibold">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volunteers:</span>
                    <span className="font-semibold">3,456</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plastic-Free Coastal Cleanup</CardTitle>
                <Badge variant="secondary" className="w-fit">Completed</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Global coordinated effort to remove plastic waste from coastlines 
                  and prevent ocean pollution.
                </p>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Waste Removed:</span>
                    <span className="font-semibold">127 tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coastline Cleaned:</span>
                    <span className="font-semibold">2,340 km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span className="font-semibold">15,689</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}