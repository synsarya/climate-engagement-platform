import { HeroSection } from "../HeroSection";
import { InteractiveEarth } from "../InteractiveEarth";
import { GlobalMap } from "../GlobalMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { 
  BookOpen, 
  Users, 
  Target, 
  Database, 
  Calculator,
  BarChart3,
  GraduationCap,
  Network,
  ArrowRight,
  Zap,
  UtensilsCrossed,
  Car,
  Factory,
  Laptop,
  Scale,
  TreePine
} from "lucide-react";

interface HomePageProps {
  onNavigate?: (page: string) => void;
  user?: any;
}

export function HomePage({ onNavigate, user }: HomePageProps) {
  const features = [
    {
      icon: BookOpen,
      title: "Learning Hub",
      description: "Master climate science through expert-designed courses",
      action: "Start Learning",
      page: "learn",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with climate activists across 7 interest areas",
      action: "Join Community",
      page: "community",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Target,
      title: "Action Hub",
      description: "Participate in campaigns and track your impact",
      action: "Take Action",
      page: "action",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      icon: Database,
      title: "Climate Data",
      description: "Access live climate data and visualizations",
      action: "Explore Data",
      page: "data",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Calculator,
      title: "Carbon Calculator",
      description: "Calculate and reduce your carbon footprint",
      action: "Calculate Now",
      page: "learn-calculator",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: BarChart3,
      title: "Corporate Monitor",
      description: "Track company emissions and climate commitments",
      action: "View Companies",
      page: "learn-corporate",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ];

  const communityCategories = [
    { icon: Zap, name: "Energy", slug: "energy" },
    { icon: UtensilsCrossed, name: "Food", slug: "food" },
    { icon: Car, name: "Mobility", slug: "mobility" },
    { icon: Factory, name: "Industry", slug: "industry" },
    { icon: Laptop, name: "Technology", slug: "technology" },
    { icon: Scale, name: "Policy", slug: "policy" },
    { icon: TreePine, name: "Nature", slug: "nature" }
  ];

  return (
    <>
      <HeroSection onNavigate={onNavigate} user={user} />
      <InteractiveEarth />
      <GlobalMap />
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Explore Your Earth Platform</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to learn, connect, and take action on climate change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => onNavigate?.(feature.page)}
                >
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      className="w-full group-hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate?.(feature.page);
                      }}
                    >
                      {feature.action}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Community Categories */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl mb-2">Climate Interest Categories</h3>
              <p className="text-muted-foreground">
                Find your community by climate focus area
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {communityCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card 
                    key={index} 
                    className="hover:shadow-md transition-all cursor-pointer group text-center"
                    onClick={() => onNavigate?.(`community-${category.slug}`)}
                  >
                    <CardContent className="pt-6 pb-6">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <p className="text-sm">{category.name}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-12 pb-12">
                <h3 className="text-2xl mb-4">Ready to Make an Impact?</h3>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Join thousands of climate champions working together to create a sustainable future
                </p>
                <div className="flex items-center justify-center space-x-4">
                  {user ? (
                    <>
                      <Button size="lg" onClick={() => onNavigate?.('community')}>
                        Explore Communities
                      </Button>
                      <Button variant="outline" size="lg" onClick={() => onNavigate?.('learn')}>
                        Continue Learning
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="lg" onClick={() => onNavigate?.('signup')}>
                        Join Now
                      </Button>
                      <Button variant="outline" size="lg" onClick={() => onNavigate?.('learn')}>
                        Learn More
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}