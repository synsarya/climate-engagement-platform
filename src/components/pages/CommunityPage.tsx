import { useState } from "react";
import { CommunityFeed } from "../CommunityFeed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Users, MessageCircle, Calendar, MapPin, TrendingUp, Heart, Share2, Zap, UtensilsCrossed, Car, Factory, Laptop, Scale, TreePine, ArrowLeft, Target } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { JoinCommunityDialog, CreateDiscussionDialog } from "../CommunityDialogs";

interface CommunityPageProps {
  category?: string;
  onNavigate?: (page: string) => void;
}

const communityStats = [
  {
    title: "Active Members",
    value: "52,847",
    change: "+2,341 this week",
    icon: Users
  },
  {
    title: "Discussion Posts",
    value: "8,923",
    change: "+456 today",
    icon: MessageCircle
  },
  {
    title: "Events This Month",
    value: "127",
    change: "15 happening today",
    icon: Calendar
  },
  {
    title: "Countries Active",
    value: "89",
    change: "+3 new regions",
    icon: MapPin
  }
];

const trendingTopics = [
  {
    title: "COP29 Climate Summit",
    posts: 234,
    trend: "+45%",
    participants: 1893
  },
  {
    title: "Solar Panel Installation",
    posts: 189,
    trend: "+32%",
    participants: 1456
  },
  {
    title: "Electric Vehicle Adoption",
    posts: 156,
    trend: "+28%",
    participants: 1234
  },
  {
    title: "Carbon Footprint Tracking",
    posts: 134,
    trend: "+23%",
    participants: 1089
  }
];

const featuredCommunities = [
  {
    name: "Climate Scientists Network",
    members: 8934,
    description: "Professional network for climate researchers and academics",
    category: "Professional",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwZWFydGglMjBlbnZpcm9ubWVudHxlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    recentActivity: "New research on Arctic ice melting"
  },
  {
    name: "Renewable Energy Enthusiasts",
    members: 15623,
    description: "Community for clean energy advocates and professionals",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1638068110878-c412de93e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHdpbmR8ZW58MXx8fHwxNzU4NjIwNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    recentActivity: "Solar panel group buy for community"
  },
  {
    name: "Youth Climate Activists",
    members: 12847,
    description: "Empowering young people to lead climate action",
    category: "Activism",
    image: "https://images.unsplash.com/photo-1591025294860-c830b21298b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBhY3RpdmlzbSUyMHByb3Rlc3QlMjBtYXJjaHxlbnwxfHx8fDE3NTg2OTIxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    recentActivity: "Planning school climate strike"
  }
];

export function CommunityPage({ category, onNavigate }: CommunityPageProps) {
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [discussionDialogOpen, setDiscussionDialogOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const categoryData = {
    energy: {
      name: "Energy",
      icon: Zap,
      description: "Renewable energy solutions and sustainable power systems",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      members: "15,623",
      posts: "3,247",
      projects: "89"
    },
    food: {
      name: "Food",
      icon: UtensilsCrossed,
      description: "Sustainable agriculture, nutrition, and food security",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      members: "12,847",
      posts: "2,891",
      projects: "67"
    },
    mobility: {
      name: "Mobility",
      icon: Car,
      description: "Clean transportation and sustainable mobility solutions",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      members: "9,234",
      posts: "1,756",
      projects: "45"
    },
    industry: {
      name: "Industry",
      icon: Factory,
      description: "Green manufacturing and sustainable business practices",
      color: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-950",
      members: "8,567",
      posts: "1,432",
      projects: "38"
    },
    technology: {
      name: "Technology",
      icon: Laptop,
      description: "Climate tech innovation and digital solutions",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      members: "11,289",
      posts: "2,103",
      projects: "72"
    },
    policy: {
      name: "Policy",
      icon: Scale,
      description: "Climate policy, governance, and advocacy",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      members: "7,856",
      posts: "1,689",
      projects: "34"
    },
    nature: {
      name: "Nature",
      icon: TreePine,
      description: "Conservation, biodiversity, and ecosystem protection",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      members: "13,492",
      posts: "2,567",
      projects: "56"
    }
  };

  const currentCategory = category ? categoryData[category as keyof typeof categoryData] : null;
  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className={`py-16 ${currentCategory ? currentCategory.bgColor : 'bg-gradient-to-br from-background to-muted/20'}`}>
        <div className="container mx-auto px-4">
          {currentCategory && onNavigate && (
            <Button 
              variant="ghost" 
              className="mb-6"
              onClick={() => onNavigate('community')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Communities
            </Button>
          )}
          
          <div className="text-center mb-12">
            {currentCategory ? (
              <>
                <div className="flex items-center justify-center mb-4">
                  <currentCategory.icon className={`h-12 w-12 mr-3 ${currentCategory.color}`} />
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {currentCategory.name} Community
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-6xl mb-6">
                  {currentCategory.name} <span className="text-primary">Community</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  {currentCategory.description}. Connect with experts, share knowledge, and collaborate on impactful projects.
                </p>
              </>
            ) : (
              <>
                <Badge variant="secondary" className="mb-4">
                  Global Climate Community
                </Badge>
                <h1 className="text-4xl lg:text-6xl mb-6">
                  Connect with Climate <span className="text-primary">Champions</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Join a global network of climate advocates, scientists, activists, and innovators. 
                  Share knowledge, collaborate on projects, and amplify your impact together.
                </p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => {
                  setSelectedCommunity(currentCategory ? `${currentCategory.name} Community` : 'Climate Community');
                  setJoinDialogOpen(true);
                }}
              >
                {currentCategory ? `Join ${currentCategory.name} Community` : 'Join the Community'}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => onNavigate && onNavigate('community-network')}
              >
                {currentCategory ? 'Browse Projects' : 'Discover Communities & Members'}
              </Button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {currentCategory ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentCategory.members}</div>
                    <p className="text-xs text-muted-foreground">+234 this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Discussion Posts</CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentCategory.posts}</div>
                    <p className="text-xs text-muted-foreground">+87 today</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentCategory.projects}</div>
                    <p className="text-xs text-muted-foreground">12 launched this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">67</div>
                    <p className="text-xs text-muted-foreground">countries active</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              communityStats.map((stat, index) => {
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
              })
            )}
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Trending Discussions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join the most active conversations happening in our climate community right now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {trendingTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {topic.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{topic.posts} posts</span>
                      <span>{topic.participants} participants</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-auto"
                      onClick={() => {
                        setSelectedTopic(topic.title);
                        setDiscussionDialogOpen(true);
                      }}
                    >
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Featured Communities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover specialized communities focused on different aspects of climate action and science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {featuredCommunities.map((community, index) => (
              <Card key={index} className="overflow-hidden flex flex-col">
                <div className="h-48 relative">
                  <ImageWithFallback
                    src={community.image}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4" variant="secondary">
                    {community.category}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{community.name}</CardTitle>
                  <CardDescription>{community.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{community.members.toLocaleString()} members</span>
                    </div>
                  </div>
                  
                  <div className="text-sm flex-1">
                    <strong>Recent:</strong> {community.recentActivity}
                  </div>
                  
                  <Button 
                    className="w-full mt-auto"
                    onClick={() => {
                      setSelectedCommunity(community.name);
                      setJoinDialogOpen(true);
                    }}
                  >
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Community Feed */}
      <CommunityFeed onNavigate={onNavigate} />

      {/* Community Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">What Our Community Says</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from climate advocates, scientists, and activists from around the world about their experience with ClimateConnect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1758598304332-94b40ce7c7b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU4NjkzNjkyfDA&ixlib=rb-4.1.0&q=80&w=1080" />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Dr. Raj Kamal</h4>
                    <p className="text-sm text-muted-foreground">Climate Researcher, Delhi</p>
                  </div>
                </div>
                <p className="text-sm">
                  "ClimateConnect has revolutionized how I collaborate with researchers globally. The knowledge sharing here is incredible."
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1618316224214-a5bac0651def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTg2MzAyNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080" />
                    <AvatarFallback>TM</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Tomás Mendez</h4>
                    <p className="text-sm text-muted-foreground">Student Activist, Mexico City</p>
                  </div>
                </div>
                <p className="text-sm">
                  "As a young activist, this platform connected me with mentors and campaigns that amplified my voice for climate justice."
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1667996112410-a2210601f54a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFjdGl2aXN0JTIwcG9ydHJhaXQlMjBlbnZpcm9ubWVudGFsfGVufDF8fHx8MTc1ODY5NjkwM3ww&ixlib=rb-4.1.0&q=80&w=1080" />
                    <AvatarFallback>KE</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">Keiko Nakamura</h4>
                    <p className="text-sm text-muted-foreground">Environmental Engineer, Tokyo</p>
                  </div>
                </div>
                <p className="text-sm">
                  "The technical discussions and collaborative projects here have helped advance my sustainable technology research significantly."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">Community Guidelines</CardTitle>
                <CardDescription className="text-lg">
                  Help us maintain a respectful, inclusive, and productive climate community
                </CardDescription>
              </CardHeader>
              
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium">🌱 Stay Climate-Focused</h4>
                  <p className="text-sm text-muted-foreground">
                    Keep discussions relevant to climate science, environmental action, and sustainability topics.
                  </p>
                  
                  <h4 className="font-medium">🤝 Be Respectful</h4>
                  <p className="text-sm text-muted-foreground">
                    Engage constructively with diverse perspectives and avoid personal attacks or harassment.
                  </p>
                  
                  <h4 className="font-medium">📚 Share Knowledge</h4>
                  <p className="text-sm text-muted-foreground">
                    Cite sources for scientific claims and help others learn from your expertise.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">🌍 Think Globally</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider the global impact of climate issues and respect cultural differences in approaches.
                  </p>
                  
                  <h4 className="font-medium">⚡ Take Action</h4>
                  <p className="text-sm text-muted-foreground">
                    Move beyond discussion to real-world climate action and support others in their efforts.
                  </p>
                  
                  <h4 className="font-medium">🔬 Value Science</h4>
                  <p className="text-sm text-muted-foreground">
                    Base discussions on scientific evidence and peer-reviewed research when possible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <JoinCommunityDialog 
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        communityName={selectedCommunity}
        communityCategory={category}
      />
      
      <CreateDiscussionDialog 
        open={discussionDialogOpen}
        onOpenChange={setDiscussionDialogOpen}
        topicTitle={selectedTopic}
        category={category}
      />
    </div>
  );
}