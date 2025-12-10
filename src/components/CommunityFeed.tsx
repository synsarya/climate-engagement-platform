import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Calendar, Users, Lightbulb, BookmarkPlus, Flag, UserX } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner@2.0.3";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const posts = [
  {
    id: 1,
    user: {
      id: "dummy-user-sarah-chen",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU4NTk0MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      location: "San Francisco, CA",
      badge: "Climate Scientist"
    },
    content: "Just published new research on ocean acidification trends in the Pacific. The data is concerning but there are actionable solutions we can implement at scale. 🌊",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwZWFydGglMjBlbnZpcm9ubWVudHxlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    timestamp: "2 hours ago",
    likes: 142,
    comments: 23,
    shares: 15,
    type: "research"
  },
  {
    id: 2,
    user: {
      id: "dummy-user-marcus-johnson",
      name: "Marcus Johnson",
      avatar: "https://images.unsplash.com/photo-1621905252472-943afaa20e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYW1lcmljYW4lMjBlbmdpbmVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODY5NjkwOHww&ixlib=rb-4.1.0&q=80&w=1080",
      location: "Austin, TX",
      badge: "Community Organizer"
    },
    content: "Our neighborhood solar cooperative just hit 500 households! We're now generating 2.3 MW of clean energy. Community action works! 💪",
    timestamp: "4 hours ago",
    likes: 89,
    comments: 17,
    shares: 8,
    type: "success"
  },
  {
    id: 3,
    user: {
      id: "dummy-user-emma-rodriguez",
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1618053448748-b7251851d014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXNwYW5pYyUyMHdvbWFuJTIwc2NpZW50aXN0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODY5NjkxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      location: "Barcelona, Spain",
      badge: "Policy Advocate"
    },
    content: "Attending COP29 next week. What are the key policy asks you think we should prioritize? Drop your thoughts below! 🌍",
    timestamp: "6 hours ago",
    likes: 234,
    comments: 45,
    shares: 32,
    type: "discussion"
  }
];

const communities = [
  {
    name: "Renewable Energy",
    members: 12500,
    image: "https://images.unsplash.com/photo-1638068110878-c412de93e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjBzb2xhciUyMHdpbmR8ZW58MXx8fHwxNzU4NjIwNjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Solar, wind, and clean energy discussions"
  },
  {
    name: "Climate Policy",
    members: 8300,
    image: "https://images.unsplash.com/photo-1591025294860-c830b21298b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBhY3RpdmlzbSUyMHByb3Rlc3QlMjBtYXJjaHxlbnwxfHx8fDE3NTg2OTIxMzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Policy analysis and advocacy strategies"
  },
  {
    name: "Local Action",
    members: 15600,
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwZWFydGglMjBlbnZpcm9ubWVudHxlbnwxfHx8fDE3NTg2MjA2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Community-level climate initiatives"
  }
];

const upcomingEvents = [
  {
    title: "Climate Data Workshop",
    date: "Oct 15",
    time: "2:00 PM EST",
    attendees: 127
  },
  {
    title: "Solar Panel Installation Training",
    date: "Oct 18",
    time: "10:00 AM PST",
    attendees: 84
  },
  {
    title: "Climate Policy Webinar",
    date: "Oct 22",
    time: "7:00 PM EST",
    attendees: 203
  }
];

interface CommunityFeedProps {
  onNavigate?: (page: string) => void;
}

export function CommunityFeed({ onNavigate }: CommunityFeedProps = {}) {
  const [postInteractions, setPostInteractions] = useState<{[key: number]: {liked: boolean, likes: number, comments: number, shares: number}}>({});
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());
  const [rsvpEvents, setRsvpEvents] = useState<Set<number>>(new Set());

  const getPostInteraction = (postId: number) => {
    if (!postInteractions[postId]) {
      const post = posts.find(p => p.id === postId);
      return {
        liked: false,
        likes: post?.likes || 0,
        comments: post?.comments || 0,
        shares: post?.shares || 0
      };
    }
    return postInteractions[postId];
  };

  const handleLike = (postId: number) => {
    const current = getPostInteraction(postId);
    setPostInteractions({
      ...postInteractions,
      [postId]: {
        ...current,
        liked: !current.liked,
        likes: current.liked ? current.likes - 1 : current.likes + 1
      }
    });
    toast.success(current.liked ? "Like removed" : "Post liked!");
  };

  const handleComment = (postId: number) => {
    toast.info("Comment feature coming soon!");
  };

  const handleShare = (postId: number) => {
    const current = getPostInteraction(postId);
    setPostInteractions({
      ...postInteractions,
      [postId]: {
        ...current,
        shares: current.shares + 1
      }
    });
    toast.success("Post shared to your network!");
  };

  const handleJoinCommunity = (communityName: string) => {
    const newJoined = new Set(joinedCommunities);
    if (newJoined.has(communityName)) {
      newJoined.delete(communityName);
      toast.success(`Left ${communityName}`);
    } else {
      newJoined.add(communityName);
      toast.success(`Joined ${communityName}!`);
    }
    setJoinedCommunities(newJoined);
  };

  const handleRSVP = (eventIndex: number) => {
    const newRsvp = new Set(rsvpEvents);
    if (newRsvp.has(eventIndex)) {
      newRsvp.delete(eventIndex);
      toast.success("RSVP cancelled");
    } else {
      newRsvp.add(eventIndex);
      toast.success("RSVP confirmed!");
    }
    setRsvpEvents(newRsvp);
  };

  const handleViewProfile = (userId: string, userName: string) => {
    if (onNavigate) {
      // Store the user ID in localStorage so ProfilePage can load it
      localStorage.setItem('viewingUserId', userId);
      onNavigate('profile');
    } else {
      toast.info(`Viewing ${userName}'s profile`);
    }
  };

  const handleSavePost = () => {
    toast.success("Post saved to your collection!");
  };

  const handleReportPost = () => {
    toast.info("Post reported. Our team will review it.");
  };

  const handleHidePost = () => {
    toast.success("Post hidden from your feed");
  };

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Climate Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with climate champions worldwide. Share knowledge, collaborate on projects, 
            and amplify your impact through community action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => toast.info("Post creation coming soon!")}
                  >
                    Share your climate action...
                  </Button>
                </div>
              </div>
            </Card>

            {posts.map((post) => {
              const interaction = getPostInteraction(post.id);
              return (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleViewProfile(post.user.id, post.user.name)}
                    >
                      <Avatar>
                        <AvatarImage src={post.user.avatar} />
                        <AvatarFallback>{post.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{post.user.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {post.user.badge}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{post.user.location}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleSavePost}>
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Save post
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleHidePost}>
                          <UserX className="h-4 w-4 mr-2" />
                          Hide post
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleReportPost} className="text-destructive">
                          <Flag className="h-4 w-4 mr-2" />
                          Report post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p>{post.content}</p>
                  
                  {post.image && (
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={post.image}
                        alt="Post image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={interaction.liked ? "text-red-500" : "text-muted-foreground"}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${interaction.liked ? "fill-red-500" : ""}`} />
                        {interaction.likes}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={() => handleComment(post.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {interaction.comments}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground"
                        onClick={() => handleShare(post.id)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {interaction.shares}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Communities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Communities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communities.map((community, index) => {
                  const isJoined = joinedCommunities.has(community.name);
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => onNavigate?.('community')}
                      >
                        <ImageWithFallback
                          src={community.image}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div 
                        className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => onNavigate?.('community')}
                      >
                        <div className="font-medium">{community.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {community.members.toLocaleString()} members
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant={isJoined ? "default" : "outline"}
                        onClick={() => handleJoinCommunity(community.name)}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </Button>
                    </div>
                  );
                })}
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => toast.info("Explore all communities feature coming soon!")}
                >
                  Explore All Communities
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event, index) => {
                  const hasRSVP = rsvpEvents.has(index);
                  return (
                    <div key={index} className="space-y-2">
                      <div 
                        className="font-medium cursor-pointer hover:text-primary transition-colors"
                        onClick={() => onNavigate?.('action')}
                      >
                        {event.title}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{hasRSVP ? event.attendees + 1 : event.attendees} attending</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant={hasRSVP ? "default" : "outline"}
                          onClick={() => handleRSVP(index)}
                        >
                          {hasRSVP ? "Going" : "RSVP"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => toast.info("View all events feature coming soon!")}
                >
                  View All Events
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Daily Climate Tip</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Switching to LED bulbs can reduce your home's lighting energy consumption by up to 75%. 
                  Small changes add up to significant impact!
                </p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex-1"
                    onClick={() => toast.success("Tip saved to your collection!")}
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex-1"
                    onClick={() => toast.success("Tip shared!")}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-2 text-xs"
                  onClick={() => toast.info("More tips coming soon!")}
                >
                  Learn More Tips
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}