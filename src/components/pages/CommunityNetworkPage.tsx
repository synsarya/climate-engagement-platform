import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Search, 
  Users, 
  MapPin,
  Briefcase,
  Building2,
  ExternalLink,
  Filter,
  Zap,
  UtensilsCrossed,
  Car,
  Factory,
  Laptop,
  Scale,
  TreePine,
  CheckCircle,
  UserPlus,
  MessageCircle,
  Globe,
  TrendingUp,
  Star
} from "lucide-react";
import { Separator } from "../ui/separator";
import { JoinCommunityDialog, CreateCommunityDialog, ConnectMemberDialog, MessageMemberDialog } from "../CommunityDialogs";

interface CommunityNetworkPageProps {
  onNavigate?: (page: string) => void;
}

const INTEREST_CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: Globe },
  { id: 'energy', name: 'Energy', icon: Zap, color: 'text-yellow-600' },
  { id: 'food', name: 'Food', icon: UtensilsCrossed, color: 'text-green-600' },
  { id: 'mobility', name: 'Mobility', icon: Car, color: 'text-blue-600' },
  { id: 'industry', name: 'Industry', icon: Factory, color: 'text-gray-600' },
  { id: 'technology', name: 'Technology', icon: Laptop, color: 'text-purple-600' },
  { id: 'policy', name: 'Policy', icon: Scale, color: 'text-red-600' },
  { id: 'nature', name: 'Nature', icon: TreePine, color: 'text-emerald-600' }
];

const MOCK_COMMUNITIES = [
  {
    id: 1,
    name: "Climate Scientists Network",
    description: "Professional network for climate researchers and academics worldwide",
    category: "technology",
    members: 8934,
    platform: "Your Earth",
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    tags: ["Research", "Science", "Academia"],
    recentActivity: "Active today"
  },
  {
    id: 2,
    name: "Renewable Energy Enthusiasts",
    description: "Community for clean energy advocates and solar/wind professionals",
    category: "energy",
    members: 15623,
    platform: "Your Earth",
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
    tags: ["Solar", "Wind", "Clean Energy"],
    recentActivity: "Active today"
  },
  {
    id: 3,
    name: "Sustainable Food Systems",
    description: "Exploring regenerative agriculture and sustainable food production",
    category: "food",
    members: 6847,
    platform: "Your Earth",
    verified: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
    tags: ["Agriculture", "Nutrition", "Food Security"],
    recentActivity: "Active 2h ago"
  },
  {
    id: 4,
    name: "Electric Mobility Alliance",
    description: "Accelerating the transition to electric and sustainable transportation",
    category: "mobility",
    members: 12456,
    platform: "LinkedIn",
    verified: false,
    featured: false,
    externalUrl: "https://linkedin.com/groups/electric-mobility",
    tags: ["EVs", "Transportation", "Infrastructure"],
    recentActivity: "Active today"
  },
  {
    id: 5,
    name: "Green Manufacturing Coalition",
    description: "Industrial professionals working towards sustainable production",
    category: "industry",
    members: 4532,
    platform: "Slack",
    verified: false,
    featured: false,
    externalUrl: "https://green-manufacturing.slack.com",
    tags: ["Manufacturing", "Sustainability", "Circular Economy"],
    recentActivity: "Active 5h ago"
  },
  {
    id: 6,
    name: "Climate Policy Action Network",
    description: "Advocating for effective climate policies and governance",
    category: "policy",
    members: 9234,
    platform: "Your Earth",
    verified: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400",
    tags: ["Policy", "Advocacy", "Governance"],
    recentActivity: "Active today"
  }
];

const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Climate Scientist",
    location: "San Francisco, CA",
    interests: ["technology", "policy"],
    communities: ["Climate Scientists Network", "Climate Policy Action Network"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    verified: true,
    connections: 456
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Renewable Energy Engineer",
    location: "Austin, TX",
    interests: ["energy", "technology"],
    communities: ["Renewable Energy Enthusiasts", "Electric Mobility Alliance"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    verified: true,
    connections: 823
  },
  {
    id: 3,
    name: "Priya Sharma",
    title: "Sustainable Agriculture Specialist",
    location: "Mumbai, India",
    interests: ["food", "nature"],
    communities: ["Sustainable Food Systems"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    verified: true,
    connections: 234
  },
  {
    id: 4,
    name: "Alex Rivera",
    title: "EV Infrastructure Developer",
    location: "Barcelona, Spain",
    interests: ["mobility", "technology"],
    communities: ["Electric Mobility Alliance", "Renewable Energy Enthusiasts"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    verified: false,
    connections: 567
  },
  {
    id: 5,
    name: "Dr. Kenji Tanaka",
    title: "Environmental Policy Advisor",
    location: "Tokyo, Japan",
    interests: ["policy", "technology"],
    communities: ["Climate Policy Action Network", "Climate Scientists Network"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    verified: true,
    connections: 1234
  },
  {
    id: 6,
    name: "Emma Wilson",
    title: "Green Manufacturing Consultant",
    location: "London, UK",
    interests: ["industry", "technology"],
    communities: ["Green Manufacturing Coalition"],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    verified: true,
    connections: 689
  }
];

export function CommunityNetworkPage({ onNavigate }: CommunityNetworkPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("communities");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createCommunityDialogOpen, setCreateCommunityDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<typeof MOCK_MEMBERS[0] | null>(null);

  const filteredCommunities = MOCK_COMMUNITIES.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredMembers = MOCK_MEMBERS.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           member.interests.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-8">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Platform of Platforms
            </Badge>
            <h1 className="text-4xl lg:text-6xl mb-6">
              Discover Climate <span className="text-primary">Communities</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find communities, connect with climate champions, and expand your network across multiple platforms.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search communities, members, or topics..."
                  className="pl-12 pr-4 h-14 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {INTEREST_CATEGORIES.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="communities" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Communities ({filteredCommunities.length})
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Members ({filteredMembers.length})
                </TabsTrigger>
              </TabsList>

              {/* Communities Tab */}
              <TabsContent value="communities" className="space-y-6">
                {/* Featured Communities */}
                {filteredCommunities.some(c => c.featured) && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <h2 className="text-2xl">Featured Communities</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {filteredCommunities.filter(c => c.featured).map((community) => (
                        <CommunityCard 
                          key={community.id} 
                          community={community}
                          onJoinClick={(name) => {
                            setSelectedCommunity(name);
                            setJoinDialogOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Communities */}
                <div>
                  <h2 className="text-2xl mb-4">All Communities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommunities.filter(c => !c.featured).map((community) => (
                      <CommunityCard 
                        key={community.id} 
                        community={community}
                        onJoinClick={(name) => {
                          setSelectedCommunity(name);
                          setJoinDialogOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {filteredCommunities.length === 0 && (
                  <Card className="p-12 text-center">
                    <CardContent>
                      <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl mb-2">No communities found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMembers.map((member) => (
                    <MemberCard 
                      key={member.id} 
                      member={member}
                      onConnectClick={(m) => {
                        setSelectedMember(m);
                        setConnectDialogOpen(true);
                      }}
                      onMessageClick={(m) => {
                        setSelectedMember(m);
                        setMessageDialogOpen(true);
                      }}
                    />
                  ))}
                </div>

                {filteredMembers.length === 0 && (
                  <Card className="p-12 text-center">
                    <CardContent>
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl mb-2">No members found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filters
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl mb-4">Create Your Community</h2>
            <p className="text-muted-foreground mb-8">
              Don't see a community that fits? Start your own and bring together climate champions around your cause.
            </p>
            <Button 
              size="lg"
              onClick={() => setCreateCommunityDialogOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Community
            </Button>
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <JoinCommunityDialog 
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
        communityName={selectedCommunity}
      />
      
      <CreateCommunityDialog 
        open={createCommunityDialogOpen}
        onOpenChange={setCreateCommunityDialogOpen}
      />
      
      <ConnectMemberDialog 
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        memberName={selectedMember?.name || ""}
        memberAvatar={selectedMember?.avatar}
        memberTitle={selectedMember?.title}
      />
      
      <MessageMemberDialog 
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        memberName={selectedMember?.name || ""}
        memberAvatar={selectedMember?.avatar}
        memberTitle={selectedMember?.title}
      />
    </div>
  );
}

interface CommunityCardProps {
  community: typeof MOCK_COMMUNITIES[0];
  onJoinClick: (communityName: string) => void;
}

function CommunityCard({ community, onJoinClick }: CommunityCardProps) {
  const categoryInfo = INTEREST_CATEGORIES.find(c => c.id === community.category);
  const CategoryIcon = categoryInfo?.icon || Building2;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group">
      {community.image && (
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img 
            src={community.image} 
            alt={community.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {community.platform !== "Your Earth" && (
            <Badge className="absolute top-3 right-3" variant="secondary">
              <ExternalLink className="h-3 w-3 mr-1" />
              {community.platform}
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {community.name}
              {community.verified && (
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              )}
            </CardTitle>
            <CardDescription className="mt-2">{community.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{community.members.toLocaleString()} members</span>
          </div>
          <div className="flex items-center gap-1">
            <CategoryIcon className={`h-4 w-4 ${categoryInfo?.color || ''}`} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {community.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {community.recentActivity}
        </div>

        <Separator />

        <div className="flex gap-2">
          {community.externalUrl ? (
            <Button variant="outline" className="flex-1" asChild>
              <a href={community.externalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit
              </a>
            </Button>
          ) : (
            <Button 
              className="flex-1"
              onClick={() => onJoinClick(community.name)}
            >
              Join Community
            </Button>
          )}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onJoinClick(community.name)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MemberCard({ member }: { member: typeof MOCK_MEMBERS[0] }) {
  const memberInterests = INTEREST_CATEGORIES.filter(cat => 
    member.interests.includes(cat.id) && cat.id !== 'all'
  );

  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-muted">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {member.name}
                  {member.verified && (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Briefcase className="h-3 w-3" />
                  {member.title}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  {member.location}
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            {/* Interests */}
            <div className="mb-3">
              <div className="text-xs text-muted-foreground mb-2">Interests</div>
              <div className="flex flex-wrap gap-1">
                {memberInterests.map((interest) => {
                  const IconComponent = interest.icon;
                  return (
                    <Badge key={interest.id} variant="secondary" className="text-xs">
                      <IconComponent className="h-3 w-3 mr-1" />
                      {interest.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Communities */}
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2">Communities ({member.communities.length})</div>
              <div className="text-sm">
                {member.communities.slice(0, 2).map((community, index) => (
                  <div key={index} className="text-muted-foreground">
                    • {community}
                  </div>
                ))}
                {member.communities.length > 2 && (
                  <div className="text-xs text-primary">
                    +{member.communities.length - 2} more
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {member.connections} connections
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Connect
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
