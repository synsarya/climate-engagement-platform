import { LearningHub } from "../LearningHub";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { BookOpen, Clock, Users, Star, TrendingUp, Award, Target, GraduationCap, Video, FileText, Headphones, Play } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const learningStats = [
  {
    title: "Courses Completed",
    value: "15,678",
    change: "+12%",
    icon: BookOpen
  },
  {
    title: "Hours Learned",
    value: "45,892",
    change: "+18%",
    icon: Clock
  },
  {
    title: "Certificates Earned",
    value: "8,234",
    change: "+25%",
    icon: Award
  },
  {
    title: "Skills Developed",
    value: "156",
    change: "+8%",
    icon: Target
  }
];

const featuredExperts = [
  {
    name: "Dr. Elena Rodriguez",
    title: "Climate Physics Professor",
    university: "MIT",
    expertise: "Atmospheric Science",
    courses: 12,
    rating: 4.9,
    students: 25600,
    image: "https://images.unsplash.com/photo-1618053448748-b7251d014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXNwYW5pYyUyMHdvbWFuJTIwc2NpZW50aXN0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODY5NjkxMnww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    name: "Prof. David Chen",
    title: "Renewable Energy Engineer",
    university: "Stanford",
    expertise: "Solar Technology",
    courses: 8,
    rating: 4.8,
    students: 18900,
    image: "https://images.unsplash.com/photo-1657152042392-c1f39e52e7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTg2OTY4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    name: "Dr. Amara Okafor",
    title: "Environmental Policy Expert",
    university: "Oxford",
    expertise: "Climate Policy",
    courses: 15,
    rating: 4.9,
    students: 31200,
    image: "https://images.unsplash.com/photo-1621905252472-943afaa20e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYW1lcmljYW4lMjBlbmdpbmVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODY5NjkwOHww&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

const learningFormats = [
  {
    title: "Interactive Courses",
    description: "Hands-on learning with simulations and virtual labs",
    icon: Play,
    count: "150+ courses",
    color: "blue"
  },
  {
    title: "Video Lectures",
    description: "Expert-led presentations from top universities",
    icon: Video,
    count: "500+ videos",
    color: "purple"
  },
  {
    title: "Research Papers",
    description: "Latest climate science research and publications",
    icon: FileText,
    count: "1,000+ papers",
    color: "green"
  },
  {
    title: "Podcasts",
    description: "Climate conversations with leading voices",
    icon: Headphones,
    count: "200+ episodes",
    color: "orange"
  }
];

const skillTracks = [
  {
    title: "Climate Science Fundamentals",
    progress: 85,
    modules: 12,
    duration: "6 weeks",
    level: "Beginner"
  },
  {
    title: "Renewable Energy Systems",
    progress: 72,
    modules: 15,
    duration: "8 weeks", 
    level: "Intermediate"
  },
  {
    title: "Environmental Policy & Economics",
    progress: 58,
    modules: 10,
    duration: "5 weeks",
    level: "Advanced"
  },
  {
    title: "Sustainable Business Practices",
    progress: 91,
    modules: 8,
    duration: "4 weeks",
    level: "Intermediate"
  }
];

interface ClimateEducationPageProps {
  onNavigate?: (page: string) => void;
}

export function ClimateEducationPage({ onNavigate }: ClimateEducationPageProps) {
  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <GraduationCap className="h-4 w-4 mr-2" />
              Climate Education Platform
            </Badge>
            <h1 className="text-4xl lg:text-6xl mb-6">
              Master Climate <span className="text-primary">Science & Action</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Access world-class climate education from leading scientists, researchers, and practitioners. 
              Build the knowledge and skills needed to drive meaningful environmental change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => onNavigate && onNavigate('signup')}>
                Start Learning Today
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate && onNavigate('learn-education')}>
                Browse All Courses
              </Button>
            </div>
          </div>

          {/* Learning Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {learningStats.map((stat, index) => {
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
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">{stat.change} from last month</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Formats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Multiple Learning Formats</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from various learning formats that suit your learning style and schedule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {learningFormats.map((format, index) => {
              const IconComponent = format.icon;
              return (
                <Card key={index} className="text-center p-6">
                  <div className={`w-16 h-16 bg-${format.color}-500/10 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`h-8 w-8 text-${format.color}-500`} />
                  </div>
                  <h3 className="text-lg mb-2">{format.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{format.description}</p>
                  <Badge variant="secondary">{format.count}</Badge>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Learn from Climate Experts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our courses are designed and taught by world-renowned climate scientists, 
              researchers, and practitioners from leading institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {featuredExperts.map((expert, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={expert.image}
                    alt={expert.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    {expert.expertise}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{expert.name}</CardTitle>
                  <CardDescription>
                    {expert.title} • {expert.university}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{expert.rating}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{expert.students.toLocaleString()} students</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {expert.courses} courses available
                  </div>
                  
                  <Button className="w-full">
                    View Courses
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Tracks */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Structured Learning Paths</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow guided learning paths designed to build comprehensive climate expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {skillTracks.map((track, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{track.title}</CardTitle>
                    <Badge variant={track.level === 'Beginner' ? 'secondary' : track.level === 'Intermediate' ? 'default' : 'destructive'}>
                      {track.level}
                    </Badge>
                  </div>
                  <CardDescription>
                    {track.modules} modules • {track.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{track.progress}% complete</span>
                    </div>
                    <Progress value={track.progress} className="h-2" />
                  </div>
                  <Button className="w-full" variant={track.progress > 0 ? "default" : "outline"}>
                    {track.progress > 0 ? "Continue Learning" : "Start Track"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Learning Hub */}
      <LearningHub />

      {/* Skill Assessment */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl mb-4">Assess Your Climate Knowledge</h3>
                  <p className="text-muted-foreground mb-6">
                    Take our comprehensive climate science assessment to understand your current knowledge level 
                    and get personalized learning recommendations.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Climate Science Fundamentals</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Renewable Energy Systems</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Environmental Policy</span>
                      <span className="text-sm font-medium">58%</span>
                    </div>
                    <Progress value={58} className="h-2" />
                  </div>
                  <Button className="mt-6">
                    Take Full Assessment
                  </Button>
                </div>
                
                <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Target className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">78%</div>
                    <div className="text-sm text-muted-foreground">Overall Knowledge Score</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}