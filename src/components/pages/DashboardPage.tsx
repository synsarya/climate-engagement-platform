import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  Target, 
  Users, 
  BookOpen,
  Leaf,
  Zap,
  Calendar,
  Award,
  BarChart3,
  ArrowUpRight
} from "lucide-react";

interface DashboardPageProps {
  user?: any;
  onNavigate?: (page: string) => void;
}

export function DashboardPage({ user, onNavigate }: DashboardPageProps) {
  const stats = [
    {
      title: "Carbon Footprint",
      value: "2.4 tons",
      change: "-12%",
      trend: "down",
      icon: Leaf,
      description: "CO2e this month"
    },
    {
      title: "Learning Progress",
      value: "65%",
      change: "+8%",
      trend: "up",
      icon: BookOpen,
      description: "3 courses in progress"
    },
    {
      title: "Community Impact",
      value: "487",
      change: "+23%",
      trend: "up",
      icon: Users,
      description: "People reached"
    },
    {
      title: "Actions Taken",
      value: "42",
      change: "+5",
      trend: "up",
      icon: Target,
      description: "This month"
    }
  ];

  const activities = [
    {
      title: "Completed course: Climate Science Fundamentals",
      time: "2 hours ago",
      icon: BookOpen,
      color: "text-blue-500"
    },
    {
      title: "Joined Energy community",
      time: "5 hours ago",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Calculated carbon footprint",
      time: "1 day ago",
      icon: Activity,
      color: "text-purple-500"
    },
    {
      title: "Shared petition: Renewable Energy Now",
      time: "2 days ago",
      icon: Target,
      color: "text-orange-500"
    }
  ];

  const goals = [
    {
      title: "Reduce carbon footprint by 20%",
      progress: 60,
      deadline: "End of year",
      status: "on-track"
    },
    {
      title: "Complete Climate Action Track",
      progress: 75,
      deadline: "2 weeks",
      status: "on-track"
    },
    {
      title: "Join 5 climate communities",
      progress: 40,
      deadline: "1 month",
      status: "at-risk"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">
            Welcome back, {user?.name || "Climate Champion"}!
          </h1>
          <p className="text-muted-foreground">
            Here's your climate impact dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{stat.value}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    {stat.trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm text-green-500">{stat.change}</span>
                    <span className="text-sm text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Goals */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Climate Goals</CardTitle>
                    <CardDescription>Track your progress towards sustainability</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onNavigate?.('action')}>
                    <Target className="h-4 w-4 mr-2" />
                    New Goal
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{goal.title}</span>
                        <Badge variant={goal.status === "on-track" ? "default" : "destructive"}>
                          {goal.status === "on-track" ? "On Track" : "At Risk"}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{goal.deadline}</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Impact Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint Trend</CardTitle>
                <CardDescription>Your monthly emissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Chart visualization coming soon
                    </p>
                    <Button variant="outline" size="sm" onClick={() => onNavigate?.('learn-calculator')}>
                      Calculate Footprint
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`mt-1 ${activity.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate?.('learn-calculator')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Calculate Carbon Footprint
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate?.('learn')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate?.('community')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Explore Communities
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate?.('action')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Join Action Campaign
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm">Climate Scholar</p>
                    <p className="text-xs text-muted-foreground">Completed 3 courses</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm">Carbon Reducer</p>
                    <p className="text-xs text-muted-foreground">10% footprint reduction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
