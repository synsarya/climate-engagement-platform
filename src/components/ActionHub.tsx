import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapPin, Calendar, Users, Target, Clock, ArrowRight, CheckCircle, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { EventsHub } from "./EventsHub";

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
    category: "Education",
    impact: "500,000 students impacted",
    difficulty: "Medium",
    timeCommitment: "2-4 hours/week"
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
    category: "Environment",
    impact: "2,400 tons CO₂ offset annually",
    difficulty: "Easy",
    timeCommitment: "1-2 hours/week"
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
    category: "Policy",
    impact: "State-wide policy change",
    difficulty: "Hard",
    timeCommitment: "5+ hours/week"
  }
];

const quickActions = [
  {
    title: "Switch to Renewable Energy",
    description: "Find clean energy providers in your area",
    icon: "⚡",
    time: "15 min",
    impact: "High",
    completed: false
  },
  {
    title: "Start Composting",
    description: "Reduce food waste with home composting",
    icon: "🌱",
    time: "30 min",
    impact: "Medium",
    completed: true
  },
  {
    title: "Contact Your Representative",
    description: "Advocate for climate-friendly policies",
    icon: "📞",
    time: "10 min",
    impact: "High",
    completed: false
  },
  {
    title: "Calculate Your Carbon Footprint",
    description: "Understand your environmental impact",
    icon: "📊",
    time: "20 min",
    impact: "Medium",
    completed: false
  }
];

const personalImpact = {
  carbonSaved: 2340,
  treesPlanted: 15,
  peopleMobilized: 89,
  actionsCompleted: 23
};

interface ActionHubProps {
  user?: any;
  onNavigate?: (page: string) => void;
}

export function ActionHub({ user, onNavigate }: ActionHubProps = {}) {
  const [activeView, setActiveView] = React.useState<string>("campaigns");

  const handleJoinCampaign = (campaignId: number) => {
    if (!user) {
      onNavigate?.('login');
    } else {
      // Navigate to campaign detail page to join
      onNavigate?.('campaign-detail');
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl mb-4">Climate Action Hub</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Turn knowledge into action. Join campaigns, complete personal actions, 
            and track your environmental impact as part of a global movement.
          </p>
          
          {/* View Selector */}
          <div className="flex justify-center">
            <Select value={activeView} onValueChange={setActiveView}>
              <SelectTrigger className="w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="campaigns">Campaigns & Quick Actions</SelectItem>
                <SelectItem value="events">Events & Gatherings</SelectItem>
                <SelectItem value="jobs">Climate Jobs</SelectItem>
                <SelectItem value="marketplace">Green Marketplace</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeView === "events" ? (
          <EventsHub user={user} onNavigate={onNavigate} />
        ) : activeView === "jobs" ? (
          <div className="text-center py-12">
            <h3 className="text-2xl mb-4">Climate Jobs & Careers</h3>
            <p className="text-muted-foreground mb-6">
              Browse opportunities in clean energy, sustainable agriculture, and green technology
            </p>
            <Button size="lg" onClick={() => onNavigate?.('jobs')}>
              View All Jobs
            </Button>
          </div>
        ) : activeView === "marketplace" ? (
          <div className="text-center py-12">
            <h3 className="text-2xl mb-4">Green Marketplace</h3>
            <p className="text-muted-foreground mb-6">
              Shop sustainable products from verified eco-friendly brands with carbon-neutral shipping
            </p>
            <Button size="lg" onClick={() => onNavigate?.('marketplace')}>
              Browse Products
            </Button>
          </div>
        ) : (
          <>
        <div className="text-center mb-12">
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Campaigns */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Active Campaigns</h3>
                <Button variant="outline" onClick={() => onNavigate?.('all-campaigns')}>
                  View All Campaigns
                </Button>
              </div>
              
              <div className="space-y-6">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      <div className="aspect-square md:aspect-auto">
                        <ImageWithFallback
                          src={campaign.image}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{campaign.category}</Badge>
                              <Badge variant="outline">{campaign.difficulty}</Badge>
                            </div>
                            <h4 className="text-lg font-medium">{campaign.title}</h4>
                            <p className="text-muted-foreground">{campaign.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>{campaign.current}/{campaign.goal}</span>
                            </div>
                            <Progress value={(campaign.current / campaign.goal) * 100} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Due {campaign.deadline}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{campaign.participants.toLocaleString()} participants</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Target className="h-4 w-4" />
                              <span>{campaign.impact}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{campaign.timeCommitment}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-3 pt-2">
                            <Button 
                              className="flex-1"
                              onClick={() => handleJoinCampaign(campaign.id)}
                            >
                              {user ? (
                                <>
                                  Join Campaign
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                              ) : (
                                'Sign in to Join'
                              )}
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => onNavigate?.('campaign-detail')}
                            >
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-xl mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card key={index} className={`relative ${action.completed ? 'bg-muted/50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{action.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{action.title}</h4>
                            {action.completed && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-4 text-xs text-muted-foreground">
                              <span>⏱️ {action.time}</span>
                              <span>📈 {action.impact} impact</span>
                            </div>
                            {!action.completed && (
                              <Button 
                                size="sm"
                                onClick={() => user ? onNavigate?.('quick-action') : onNavigate?.('login')}
                              >
                                {user ? 'Start' : 'Sign in'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Personal Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Impact</CardTitle>
                <CardDescription>Track your contribution to climate action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="text-center p-4 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => onNavigate?.('impact-report')}
                >
                  <div className="text-2xl font-bold text-primary">{personalImpact.carbonSaved}</div>
                  <div className="text-sm text-muted-foreground">kg CO₂ saved</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div 
                    className="p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onNavigate?.('impact-report')}
                  >
                    <div className="text-lg font-semibold">{personalImpact.treesPlanted}</div>
                    <div className="text-xs text-muted-foreground">Trees Planted</div>
                  </div>
                  <div 
                    className="p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onNavigate?.('impact-report')}
                  >
                    <div className="text-lg font-semibold">{personalImpact.peopleMobilized}</div>
                    <div className="text-xs text-muted-foreground">People Mobilized</div>
                  </div>
                </div>
                
                <div 
                  className="pt-2 border-t hover:bg-muted/30 p-2 rounded cursor-pointer transition-colors"
                  onClick={() => onNavigate?.('impact-report')}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span>Actions Completed</span>
                    <span className="font-semibold">{personalImpact.actionsCompleted}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate?.('impact-report')}
                >
                  View Full Impact Report
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onNavigate?.('achievements')}
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Climate Champion</div>
                    <div className="text-xs text-muted-foreground">Completed 20 actions</div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onNavigate?.('achievements')}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Tree Planter</div>
                    <div className="text-xs text-muted-foreground">Planted 15 trees</div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onNavigate?.('achievements')}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Community Builder</div>
                    <div className="text-xs text-muted-foreground">Mobilized 50+ people</div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full text-xs"
                  onClick={() => onNavigate?.('achievements')}
                >
                  View All Achievements
                </Button>
              </CardContent>
            </Card>

            {/* Suggested Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggested for You</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="font-medium">Join: Ocean Cleanup Drive</div>
                  <div className="text-muted-foreground text-xs">📍 2 miles away • This weekend</div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => onNavigate?.('campaign-detail')}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </>
        )}
      </div>
    </section>
  );
}