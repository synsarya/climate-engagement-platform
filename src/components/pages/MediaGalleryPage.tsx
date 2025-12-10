import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Video, 
  Play,
  Eye,
  Heart,
  Globe,
  Leaf,
  Zap,
  Waves
} from "lucide-react";

// Mock GIF data - in a real app, these would be actual GIF URLs
const climateGIFs = [
  {
    id: 1,
    title: "Arctic Ice Melting",
    description: "Time-lapse showing Arctic sea ice reduction over decades",
    category: "Climate Change",
    thumbnail: "https://images.unsplash.com/photo-1690312959930-a9e98ef429eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIwY2hhbmdlJTIwYXJjdGljJTIwaWNlfGVufDF8fHx8MTc1OTQ0Njg4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    icon: Globe,
    views: 2450,
    likes: 89
  },
  {
    id: 2,
    title: "Ocean Current Patterns",
    description: "Global ocean circulation and climate regulation",
    category: "Ocean Science",
    thumbnail: "https://images.unsplash.com/photo-1759043937434-cd264464f052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwY2xpbWF0ZXxlbnwxfHx8fDE3NTk0NDY4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: Waves,
    views: 1876,
    likes: 67
  },
  {
    id: 3,
    title: "Renewable Energy Growth",
    description: "Wind and solar installation animation worldwide",
    category: "Clean Energy",
    thumbnail: "https://images.unsplash.com/photo-1638068110878-c412de93e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxyZW5ld2FibGUlMjBlbmVyZ3klMjB3aW5kJTIwc29sYXJ8ZW58MXx8fHwxNzU5NDE0NzQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: Zap,
    views: 3201,
    likes: 134
  },
  {
    id: 4,
    title: "Forest Ecosystem Cycles",
    description: "Seasonal changes in forest ecosystems and carbon absorption",
    category: "Nature",
    thumbnail: "https://images.unsplash.com/photo-1614022837662-e74b0b53dcf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlcyUyMG5hdHVyZXxlbnwxfHx8fDE3NTkzNDY4ODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    icon: Leaf,
    views: 1654,
    likes: 78
  }
];

export function MediaGalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Video className="h-4 w-4 mr-2" />
              Climate Animations
            </Badge>
            <h1 className="text-4xl md:text-5xl mb-4">
              Visual Climate Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore animated visualizations that bring climate science to life through 
              compelling short films and data animations
            </p>
          </div>
        </div>
      </section>

      {/* GIF Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {climateGIFs.map((gif) => {
              const IconComponent = gif.icon;
              return (
                <Card key={gif.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {/* Placeholder for actual GIF - in real implementation, this would be the GIF */}
                    <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${gif.thumbnail})` }}
                    >
                      {/* Animated overlay to simulate GIF effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                      
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 rounded-full p-4">
                          <Play className="h-8 w-8 text-black ml-1" />
                        </div>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
                          <IconComponent className="h-3 w-3 mr-1" />
                          {gif.category}
                        </Badge>
                      </div>

                      {/* GIF indicator */}
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                          GIF
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl mb-2">{gif.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {gif.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{gif.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{gif.likes}</span>
                        </span>
                      </div>
                      
                      <Badge variant="outline">
                        Looping Animation
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl mb-6">About These Animations</h2>
            <p className="text-lg text-muted-foreground mb-8">
              These short, looping animations help visualize complex climate processes and data. 
              Each GIF tells a story about our changing planet, making climate science more 
              accessible and engaging for everyone.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-3 text-blue-500" />
                <h4 className="font-medium mb-2">Climate Data</h4>
                <p className="text-sm text-muted-foreground">
                  Scientific visualizations of global climate patterns
                </p>
              </div>
              
              <div className="text-center">
                <Waves className="h-12 w-12 mx-auto mb-3 text-cyan-500" />
                <h4 className="font-medium mb-2">Ocean Systems</h4>
                <p className="text-sm text-muted-foreground">
                  Marine processes and ocean-climate interactions
                </p>
              </div>
              
              <div className="text-center">
                <Zap className="h-12 w-12 mx-auto mb-3 text-yellow-500" />
                <h4 className="font-medium mb-2">Clean Energy</h4>
                <p className="text-sm text-muted-foreground">
                  Renewable energy growth and technology adoption
                </p>
              </div>
              
              <div className="text-center">
                <Leaf className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <h4 className="font-medium mb-2">Ecosystems</h4>
                <p className="text-sm text-muted-foreground">
                  Natural cycles and environmental changes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl mb-6">How Climate Animations Work</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium mb-2">Looping Visualizations</h4>
                    <p className="text-sm text-muted-foreground">
                      GIF animations automatically loop, showing continuous processes like 
                      ocean currents, weather patterns, and seasonal changes
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <Play className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium mb-2">No Controls Needed</h4>
                    <p className="text-sm text-muted-foreground">
                      Unlike videos, GIFs play automatically and continuously, 
                      making complex data patterns easy to observe and understand
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium mb-2">Educational Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Visual storytelling helps communicate climate science more effectively 
                      than static images or text alone
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}