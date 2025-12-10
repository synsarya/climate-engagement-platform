import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { toast } from "sonner@2.0.3";
import { updateProfile, getUserProfile } from "../../utils/api";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Edit, 
  Award, 
  Users, 
  Activity,
  Settings,
  BarChart3,
  Target,
  Globe,
  Zap,
  Heart,
  CheckCircle,
  Shield,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
  Linkedin,
  UtensilsCrossed,
  Car,
  Factory,
  Laptop,
  Scale,
  TreePine,
  Building2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";

interface ProfilePageProps {
  user: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const INTEREST_CATEGORIES = [
  { id: 'energy', name: 'Energy', icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-950' },
  { id: 'food', name: 'Food', icon: UtensilsCrossed, color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-950' },
  { id: 'mobility', name: 'Mobility', icon: Car, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950' },
  { id: 'industry', name: 'Industry', icon: Factory, color: 'text-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-950' },
  { id: 'technology', name: 'Technology', icon: Laptop, color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950' },
  { id: 'policy', name: 'Policy', icon: Scale, color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-950' },
  { id: 'nature', name: 'Nature', icon: TreePine, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-950' }
];

export function ProfilePage({ user, onNavigate, onLogout }: ProfilePageProps) {
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  
  const displayUser = viewingUser || user;
  
  const [isVerified, setIsVerified] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [externalCommunities, setExternalCommunities] = useState<any[]>([]);
  const [showAddCommunity, setShowAddCommunity] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', platform: '', url: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: '',
    location: '',
    organization: ''
  });

  // Initialize state when displayUser changes
  useEffect(() => {
    if (displayUser) {
      setIsVerified(displayUser.verified || false);
      setSelectedInterests(displayUser.interests || []);
      setExternalCommunities(displayUser.externalCommunities || []);
      setProfileData({
        bio: displayUser.bio || '',
        location: displayUser.location || '',
        organization: displayUser.organization || ''
      });
    }
  }, [displayUser]);

  // Load other user's profile if viewing someone else
  useEffect(() => {
    let isMounted = true;
    
    const loadOtherUserProfile = async () => {
      const userId = localStorage.getItem('viewingUserId');
      if (userId && userId !== user?.id) {
        if (isMounted) setIsLoadingProfile(true);
        if (isMounted) setViewingUserId(userId);
        if (isMounted) setIsOwnProfile(false);
        try {
          const { profile } = await getUserProfile(userId);
          if (isMounted) {
            setViewingUser(profile);
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          if (isMounted) {
            toast.error('Failed to load user profile');
            // Clear the viewing user ID and go back to own profile
            localStorage.removeItem('viewingUserId');
            setIsOwnProfile(true);
            setViewingUser(null);
          }
        } finally {
          if (isMounted) setIsLoadingProfile(false);
        }
      } else {
        // Viewing own profile
        localStorage.removeItem('viewingUserId');
        if (isMounted) {
          setIsOwnProfile(true);
          setViewingUser(null);
          setIsLoadingProfile(false);
        }
      }
    };

    loadOtherUserProfile();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Show loading while checking profile
  if (isLoadingProfile) {
    return (
      <div className="pt-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not logged in and not viewing someone else
  if (!user && !viewingUser) {
    onNavigate('login');
    return null;
  }

  if (!displayUser) {
    return (
      <div className="pt-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Profile not found</p>
          <Button 
            className="mt-4" 
            onClick={() => {
              localStorage.removeItem('viewingUserId');
              onNavigate('community');
            }}
          >
            Back to Community
          </Button>
        </div>
      </div>
    );
  }

  const toggleInterest = async (interestId: string) => {
    const newInterests = selectedInterests.includes(interestId) 
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    
    setSelectedInterests(newInterests);
    
    // Save to backend
    try {
      await updateProfile({ interests: newInterests });
      toast.success("Interests updated");
    } catch (error) {
      console.error('Update interests error:', error);
      toast.error("Failed to update interests");
      // Revert on error
      setSelectedInterests(selectedInterests);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        bio: profileData.bio,
        location: profileData.location,
        organization: profileData.organization,
        interests: selectedInterests
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Save profile error:', error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const addExternalCommunity = () => {
    if (newCommunity.name && newCommunity.platform) {
      setExternalCommunities([...externalCommunities, { ...newCommunity, id: Date.now() }]);
      setNewCommunity({ name: '', platform: '', url: '' });
      setShowAddCommunity(false);
    }
  };

  const removeCommunity = (id: number) => {
    setExternalCommunities(externalCommunities.filter(c => c.id !== id));
  };

  const activityData = [
    { date: "Today", action: "Posted in Climate Science Discussion", points: 15 },
    { date: "Yesterday", action: "Joined Solar Energy Community", points: 25 },
    { date: "2 days ago", action: "Completed Carbon Footprint Course", points: 50 },
    { date: "3 days ago", action: "Shared research article", points: 10 },
    { date: "1 week ago", action: "Started Ocean Conservation project", points: 100 }
  ];

  const achievements = [
    { name: "Climate Champion", description: "Active for 30+ days", icon: "🏆" },
    { name: "Knowledge Seeker", description: "Completed 5 courses", icon: "📚" },
    { name: "Community Builder", description: "Helped 50+ members", icon: "🤝" },
    { name: "Action Taker", description: "Joined 10+ campaigns", icon: "⚡" },
    { name: "Global Connector", description: "Connected with 100+ members", icon: "🌍" }
  ];

  const impactStats = [
    { label: "CO₂ Reduced", value: "2.3", unit: "tons", icon: Globe, color: "text-green-600" },
    { label: "Trees Planted", value: "47", unit: "trees", icon: Heart, color: "text-green-500" },
    { label: "Energy Saved", value: "890", unit: "kWh", icon: Zap, color: "text-blue-500" },
    { label: "People Reached", value: "234", unit: "contacts", icon: Users, color: "text-purple-500" }
  ];

  return (
    <div className="pt-8">
      {/* Profile Header */}
      <section className="py-8 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {!isOwnProfile && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4"
                onClick={() => {
                  localStorage.removeItem('viewingUserId');
                  window.location.reload();
                }}
              >
                ← Back to My Profile
              </Button>
            )}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={displayUser?.avatar} alt={displayUser?.name} />
                <AvatarFallback className="text-2xl">
                  {displayUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl">{displayUser?.name || 'Unknown User'}</h1>
                      {isVerified && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                      {displayUser?.expertise && (
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{displayUser.expertise}</span>
                        </div>
                      )}
                      {displayUser?.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{displayUser.location}</span>
                        </div>
                      )}
                      {displayUser?.joinDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date(displayUser.joinDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    {displayUser?.bio && (
                      <p className="text-muted-foreground max-w-2xl">{displayUser.bio}</p>
                    )}
                  </div>
                  
                  {isOwnProfile && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" size="sm" onClick={onLogout}>
                        <Settings className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                  {!isOwnProfile && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => {
                          if (!user) {
                            onNavigate('login');
                            return;
                          }
                          toast.success(`Connection request sent to ${displayUser.name}`);
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          if (!user) {
                            onNavigate('login');
                            return;
                          }
                          // In a real app, this would open a messaging interface
                          toast.success(`Message feature coming soon! Opening chat with ${displayUser.name}...`);
                        }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">{displayUser.contributions || 0}</div>
                  <div className="text-sm text-muted-foreground">Contributions</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">{selectedInterests.length}</div>
                  <div className="text-sm text-muted-foreground">Interests</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">{(displayUser.communities || []).length}</div>
                  <div className="text-sm text-muted-foreground">Communities</div>
                </CardContent>
              </Card>
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-2xl font-bold text-primary">Level 7</div>
                  <div className="text-sm text-muted-foreground">Climate Advocate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className={`grid w-full ${isOwnProfile ? 'grid-cols-5' : 'grid-cols-4'}`}>
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="interests" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Interests</span>
                </TabsTrigger>
                <TabsTrigger value="communities" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Communities</span>
                </TabsTrigger>
                <TabsTrigger value="impact" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Impact</span>
                </TabsTrigger>
                {isOwnProfile && (
                  <TabsTrigger value="settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Verification Status */}
                {!isVerified && isOwnProfile && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>Verify your profile</strong> to unlock full community features and build trust with other members.
                        </div>
                        <Button size="sm" onClick={() => setIsVerified(true)}>
                          Verify Now
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="h-5 w-5" />
                        <span>Recent Activity</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {activityData.slice(0, 4).map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{activity.action}</div>
                            <div className="text-xs text-muted-foreground">{activity.date}</div>
                          </div>
                          <Badge variant="secondary">+{activity.points} XP</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Achievements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5" />
                        <span>Achievements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {achievements.slice(0, 4).map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{achievement.name}</div>
                            <div className="text-xs text-muted-foreground">{achievement.description}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Climate Action Progress</CardTitle>
                    <CardDescription>Your journey toward becoming a climate leader</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Climate Advocate Level 7</span>
                        <span>2,340 / 3,000 XP</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                      <div>
                        <div className="font-medium">78%</div>
                        <div className="text-muted-foreground">to next level</div>
                      </div>
                      <div>
                        <div className="font-medium">12</div>
                        <div className="text-muted-foreground">courses completed</div>
                      </div>
                      <div>
                        <div className="font-medium">45</div>
                        <div className="text-muted-foreground">actions taken</div>
                      </div>
                      <div>
                        <div className="font-medium">156</div>
                        <div className="text-muted-foreground">connections made</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="interests" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{isOwnProfile ? 'Select Your Climate Interests' : `${displayUser.name}'s Climate Interests`}</CardTitle>
                    <CardDescription>
                      {isOwnProfile 
                        ? 'Choose areas you\'re passionate about to connect with like-minded community members and discover relevant content'
                        : `Areas of focus and passion for ${displayUser.name}`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {INTEREST_CATEGORIES.map((category) => {
                        const IconComponent = category.icon;
                        const isSelected = selectedInterests.includes(category.id);
                        return (
                          <div
                            key={category.id}
                            onClick={() => isOwnProfile && toggleInterest(category.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isSelected 
                                ? 'border-primary bg-primary/5' 
                                : 'border-muted'
                            } ${isOwnProfile ? 'cursor-pointer hover:border-primary/50' : 'cursor-default'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                                  <IconComponent className={`h-5 w-5 ${category.color}`} />
                                </div>
                                <div>
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {isSelected ? 'Following' : (isOwnProfile ? 'Click to follow' : 'Not following')}
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {selectedInterests.length > 0 && (
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Your Selected Interests</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              You're following {selectedInterests.length} climate categories
                            </div>
                          </div>
                          <Button>Save Interests</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {selectedInterests.map(id => {
                            const category = INTEREST_CATEGORIES.find(c => c.id === id);
                            if (!category) return null;
                            const IconComponent = category.icon;
                            return (
                              <Badge key={id} variant="secondary" className="px-3 py-1">
                                <IconComponent className="h-3 w-3 mr-1" />
                                {category.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Your Earth Communities</span>
                      <Badge variant="secondary">{(user.communities || []).length} joined</Badge>
                    </CardTitle>
                    <CardDescription>
                      Communities you've joined on Your Earth platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(user.communities || ['Climate Scientists Network', 'Renewable Energy Enthusiasts', 'Youth Climate Activists']).map((community: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{community}</div>
                            <div className="text-xs text-muted-foreground">Active member • 234 connections</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => onNavigate('community')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Explore More Communities
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>External Communities</span>
                      <Badge variant="secondary">{externalCommunities.length} linked</Badge>
                    </CardTitle>
                    <CardDescription>
                      Communities from other platforms you're part of (LinkedIn, Slack, Discord, etc.)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {externalCommunities.map((community) => (
                      <div key={community.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{community.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              {community.platform}
                              {community.url && (
                                <>
                                  <span>•</span>
                                  <a href={community.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                    Visit <ExternalLink className="h-3 w-3" />
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeCommunity(community.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {!showAddCommunity ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowAddCommunity(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add External Community
                      </Button>
                    ) : (
                      <Card className="border-dashed">
                        <CardContent className="pt-6 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="community-name">Community Name</Label>
                            <Input
                              id="community-name"
                              placeholder="e.g., Climate Tech Innovators"
                              value={newCommunity.name}
                              onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="platform">Platform</Label>
                            <Input
                              id="platform"
                              placeholder="e.g., LinkedIn, Slack, Discord"
                              value={newCommunity.platform}
                              onChange={(e) => setNewCommunity({ ...newCommunity, platform: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="url">URL (optional)</Label>
                            <Input
                              id="url"
                              placeholder="https://..."
                              value={newCommunity.url}
                              onChange={(e) => setNewCommunity({ ...newCommunity, url: e.target.value })}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={addExternalCommunity} className="flex-1">
                              Add Community
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setShowAddCommunity(false);
                                setNewCommunity({ name: '', platform: '', url: '' });
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Why add external communities?</strong> Help others discover relevant climate groups across platforms and expand the network of climate action.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="impact" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {impactStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <Card key={index}>
                        <CardContent className="p-6 text-center">
                          <IconComponent className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.unit}</div>
                          <div className="text-sm font-medium mt-1">{stat.label}</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Impact Timeline</CardTitle>
                    <CardDescription>Your environmental contributions over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Impact chart visualization would go here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={user.name} disabled />
                        <p className="text-xs text-muted-foreground">Contact support to change your name</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user.email} disabled />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          placeholder="e.g., San Francisco, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <Input 
                          id="organization" 
                          value={profileData.organization}
                          onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                          placeholder="e.g., Climate Action Network"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          placeholder="Tell us about yourself and your climate journey..."
                        />
                      </div>
                      <Button onClick={saveProfile} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Profile Verification
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {isVerified ? 'Your profile is verified' : 'Verify your identity'}
                            </div>
                          </div>
                          {isVerified ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Verified
                            </Badge>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => setIsVerified(true)}>
                              Verify
                            </Button>
                          )}
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Profile Visibility</div>
                            <div className="text-sm text-muted-foreground">Control who can see your profile</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Show Interests Publicly</div>
                            <div className="text-sm text-muted-foreground">Let others see your climate interests</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Show Communities</div>
                            <div className="text-sm text-muted-foreground">Display your community memberships</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Email Notifications</div>
                            <div className="text-sm text-muted-foreground">Receive updates about community activity</div>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}
