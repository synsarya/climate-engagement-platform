import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { BookOpen, BarChart3, TrendingUp, Users, GraduationCap, Building2, Globe, Factory, Leaf, Award, Target, ArrowRight, Calculator } from "lucide-react";
import { CO2Timeline } from "../CO2Timeline";

const learningStats = [
  {
    title: "Active Learners",
    value: "47,234",
    change: "+23% this month",
    icon: Users
  },
  {
    title: "Companies Tracked",
    value: "2,847",
    change: "+156 new companies",
    icon: Building2
  },
  {
    title: "Courses Available",
    value: "324",
    change: "+18 new courses",
    icon: BookOpen
  },
  {
    title: "Certificates Issued",
    value: "12,456",
    change: "+34% completion rate",
    icon: Award
  }
];

const learningModules = [
  {
    title: "Organization Data Bank",
    description: "Bloomberg-style database of climate champions and polluters. Access comprehensive financial, sustainability, and emissions data for informed decision-making.",
    icon: Building2,
    slug: "databank",
    features: [
      "Climate champions & polluters database",
      "Financial & ESG metrics",
      "Bloomberg-style visualizations",
      "Category-based organization"
    ],
    stats: {
      organizations: "5,000+",
      updates: "Daily",
      coverage: "Global"
    },
    color: "blue"
  },
  {
    title: "Climate Education Platform", 
    description: "Access world-class climate science education from leading experts with interactive courses, certifications, and skill assessments.",
    icon: GraduationCap,
    slug: "education",
    features: [
      "324+ expert-led courses",
      "Interactive learning modules",
      "Professional certifications",
      "Skill progress tracking"
    ],
    stats: {
      courses: "324",
      experts: "150+",
      students: "47K+"
    },
    color: "green"
  },
  {
    title: "Personal Carbon Calculator",
    description: "Calculate your individual carbon footprint across transportation, diet, energy, and lifestyle choices with actionable reduction insights.",
    icon: Calculator,
    slug: "calculator",
    features: [
      "Comprehensive lifestyle tracking",
      "Real-time emission calculations", 
      "Personalized reduction tips",
      "Global impact comparisons"
    ],
    stats: {
      categories: "6+",
      factors: "Real-time",
      insights: "Personal"
    },
    color: "purple"
  }
];

interface LearnPageProps {
  onNavigate?: (page: string) => void;
  user?: any;
}

export function LearnPage({ onNavigate, user }: LearnPageProps) {
  // Calculate user's birth year if available
  const userBirthYear = user?.birthYear || undefined;

  return (
    <div className="pt-8">
      {/* CO2 Timeline - Interactive Climate Journey */}
      <CO2Timeline userBirthYear={userBirthYear} />

      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="h-4 w-4 mr-2" />
              Climate Learning Hub
            </Badge>
            <h1 className="text-4xl lg:text-6xl mb-6">
              Climate <span className="text-primary">Knowledge & Impact</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your comprehensive platform for climate education and corporate accountability. 
              Access expert-led courses and track real-world climate impact data from companies worldwide.
            </p>
          </div>

          {/* Platform Stats */}
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
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span>{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Modules */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Choose Your Learning Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our two specialized learning modules designed to provide comprehensive 
              climate knowledge and actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {learningModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className={`h-2 bg-gradient-to-r ${
                    module.color === 'blue' ? 'from-blue-500 to-blue-600' : 
                    module.color === 'green' ? 'from-green-500 to-green-600' :
                    module.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    'from-amber-500 to-amber-600'
                  }`} />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg ${
                        module.color === 'blue' ? 'bg-blue-500/10' : 
                        module.color === 'green' ? 'bg-green-500/10' :
                        module.color === 'purple' ? 'bg-purple-500/10' :
                        'bg-amber-500/10'
                      } flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 ${
                          module.color === 'blue' ? 'text-blue-500' : 
                          module.color === 'green' ? 'text-green-500' :
                          module.color === 'purple' ? 'text-purple-500' :
                          'text-amber-500'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{module.title}</CardTitle>
                        <div className="flex items-center space-x-4 mt-1">
                          {Object.entries(module.stats).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {value} {key}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                      {module.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Key Features:</h4>
                      <ul className="space-y-1">
                        {module.features.map((feature, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              module.color === 'blue' ? 'bg-blue-500' : 
                              module.color === 'green' ? 'bg-green-500' :
                              module.color === 'purple' ? 'bg-purple-500' :
                              'bg-amber-500'
                            }`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full group" 
                      onClick={() => onNavigate && onNavigate(`learn-${module.slug}`)}
                    >
                      <span>Explore {module.title}</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Why Choose Your Earth Learning?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The most comprehensive platform combining climate education with real-world impact tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg mb-2">Global Coverage</h3>
              <p className="text-muted-foreground text-sm">
                Access data and insights from companies and experts across 150+ countries worldwide.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg mb-2">Real-Time Data</h3>
              <p className="text-muted-foreground text-sm">
                Live tracking of corporate emissions, investments, and climate commitments updated daily.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg mb-2">Expert-Led Content</h3>
              <p className="text-muted-foreground text-sm">
                Learn from leading climate scientists, researchers, and sustainability professionals.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}