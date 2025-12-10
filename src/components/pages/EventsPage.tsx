import { EventsHub } from "../EventsHub";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Users, MapPin, Zap } from "lucide-react";

interface EventsPageProps {
  onNavigate?: (page: string) => void;
  user?: any;
}

const eventStats = [
  {
    title: "Upcoming Events",
    value: "127",
    change: "+18 this week",
    icon: Calendar
  },
  {
    title: "Total Participants",
    value: "3,456",
    change: "+234 this month",
    icon: Users
  },
  {
    title: "Cities Hosting",
    value: "89",
    change: "+7 new cities",
    icon: MapPin
  },
  {
    title: "Events This Month",
    value: "45",
    change: "+12 from last month",
    icon: Zap
  }
];

export function EventsPage({ onNavigate, user }: EventsPageProps) {
  return (
    <div className="pt-8">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Community Events
            </Badge>
            <h1 className="text-4xl lg:text-6xl mb-6">
              Connect Through <span className="text-primary">Events</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join climate action events in your area. From happy hours to symposiums, 
              from protest marches to workshops - find your community and take action together.
            </p>
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventStats.map((stat, index) => {
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
            })}
          </div>
        </div>
      </section>

      {/* Events Hub */}
      <EventsHub user={user} onNavigate={onNavigate} />

      {/* Event Types Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Types of Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Diverse opportunities to connect with the climate community and take action together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="text-4xl mb-3">🍻</div>
              <h3 className="font-semibold mb-2">Happy Hours</h3>
              <p className="text-sm text-muted-foreground">
                Casual networking over drinks
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-semibold mb-2">Symposiums</h3>
              <p className="text-sm text-muted-foreground">
                Academic discussions and research
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="font-semibold mb-2">Conferences</h3>
              <p className="text-sm text-muted-foreground">
                Large-scale climate gatherings
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-semibold mb-2">Gatherings</h3>
              <p className="text-sm text-muted-foreground">
                Community meetups and socials
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl mb-3">📢</div>
              <h3 className="font-semibold mb-2">Protest Marches</h3>
              <p className="text-sm text-muted-foreground">
                Organized climate activism
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-semibold mb-2">Workshops</h3>
              <p className="text-sm text-muted-foreground">
                Hands-on learning sessions
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl mb-3">🧹</div>
              <h3 className="font-semibold mb-2">Cleanup Events</h3>
              <p className="text-sm text-muted-foreground">
                Environmental restoration
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-semibold mb-2">Other Events</h3>
              <p className="text-sm text-muted-foreground">
                Custom climate actions
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
