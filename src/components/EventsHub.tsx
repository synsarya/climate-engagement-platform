import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar as CalendarIcon, MapPin, Users, Clock, Video, Plus, Search, Filter, Loader2, Map, List, CalendarDays, Zap, UtensilsCrossed, Car, Factory, Laptop, Scale, TreePine, X } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getEvents, createEvent, joinEvent } from "../utils/api";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";

const EVENT_TYPES = [
  { value: "happy-hour", label: "Happy Hour" },
  { value: "symposium", label: "Symposium" },
  { value: "conference", label: "Conference" },
  { value: "gathering", label: "Gathering" },
  { value: "protest-march", label: "Protest March" },
  { value: "workshop", label: "Workshop" },
  { value: "cleanup", label: "Cleanup Event" },
  { value: "other", label: "Other" }
];

const INTEREST_CATEGORIES = [
  { value: "energy", label: "Energy", icon: Zap },
  { value: "food", label: "Food", icon: UtensilsCrossed },
  { value: "mobility", label: "Mobility", icon: Car },
  { value: "industry", label: "Industry", icon: Factory },
  { value: "technology", label: "Technology", icon: Laptop },
  { value: "policy", label: "Policy", icon: Scale },
  { value: "nature", label: "Nature", icon: TreePine }
];

interface Event {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string | null;
  date: string;
  time: string | null;
  endDate: string | null;
  endTime: string | null;
  organizerName: string;
  organizerOrganization: string | null;
  attendeeCount: number;
  maxAttendees: number | null;
  image: string | null;
  isVirtual: boolean;
  virtualLink: string | null;
  attendees: string[];
  interests?: string[];
  latitude?: number;
  longitude?: number;
}

interface EventsHubProps {
  user?: any;
  onNavigate?: (page: string) => void;
}

export function EventsHub({ user, onNavigate }: EventsHubProps = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "map">("list");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showFilters, setShowFilters] = useState(false);
  const [virtualFilter, setVirtualFilter] = useState<"all" | "virtual" | "in-person">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Create event form state
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "gathering",
    location: "",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    maxAttendees: "",
    isVirtual: false,
    virtualLink: ""
  });

  useEffect(() => {
    loadEvents();
  }, [filterType, searchQuery, locationFilter, selectedInterests, dateRange, virtualFilter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      
      if (filterType !== "all") filters.type = filterType;
      if (searchQuery) filters.search = searchQuery;
      if (locationFilter) filters.location = locationFilter;

      const { events: fetchedEvents } = await getEvents(filters);
      setEvents(fetchedEvents || []);
    } catch (error) {
      console.error("Failed to load events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!user) {
      onNavigate?.('login');
      return;
    }

    try {
      if (!newEvent.title || !newEvent.description || !newEvent.date) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!newEvent.isVirtual && !newEvent.location) {
        toast.error("Location is required for in-person events");
        return;
      }

      const eventData: any = {
        title: newEvent.title,
        description: newEvent.description,
        type: newEvent.type,
        date: newEvent.date,
        time: newEvent.time || null,
        endDate: newEvent.endDate || null,
        endTime: newEvent.endTime || null,
        isVirtual: newEvent.isVirtual,
      };

      if (newEvent.isVirtual) {
        eventData.virtualLink = newEvent.virtualLink;
      } else {
        eventData.location = newEvent.location;
      }

      if (newEvent.maxAttendees) {
        eventData.maxAttendees = parseInt(newEvent.maxAttendees);
      }

      const { event } = await createEvent(eventData);
      toast.success("Event created successfully!");
      
      setIsCreateDialogOpen(false);
      setNewEvent({
        title: "",
        description: "",
        type: "gathering",
        location: "",
        date: "",
        time: "",
        endDate: "",
        endTime: "",
        maxAttendees: "",
        isVirtual: false,
        virtualLink: ""
      });
      
      loadEvents();
    } catch (error: any) {
      console.error("Failed to create event:", error);
      toast.error(error.message || "Failed to create event");
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      onNavigate?.('login');
      return;
    }

    try {
      setJoiningEventId(eventId);
      await joinEvent(eventId);
      toast.success("Successfully registered for event!");
      loadEvents();
    } catch (error: any) {
      console.error("Failed to join event:", error);
      toast.error(error.message || "Failed to join event");
    } finally {
      setJoiningEventId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      "happy-hour": "bg-purple-100 text-purple-800",
      "symposium": "bg-blue-100 text-blue-800",
      "conference": "bg-indigo-100 text-indigo-800",
      "gathering": "bg-green-100 text-green-800",
      "protest-march": "bg-red-100 text-red-800",
      "workshop": "bg-yellow-100 text-yellow-800",
      "cleanup": "bg-teal-100 text-teal-800",
      "other": "bg-gray-100 text-gray-800"
    };
    return colors[type] || colors.other;
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const clearAllFilters = () => {
    setFilterType("all");
    setSearchQuery("");
    setLocationFilter("");
    setSelectedInterests([]);
    setDateRange({});
    setVirtualFilter("all");
  };

  const getFilteredEvents = () => {
    return events.filter(event => {
      // Interest filter
      if (selectedInterests.length > 0) {
        const hasMatchingInterest = event.interests?.some(interest => 
          selectedInterests.includes(interest)
        );
        if (!hasMatchingInterest) return false;
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const eventDate = new Date(event.date);
        if (dateRange.from && eventDate < dateRange.from) return false;
        if (dateRange.to && eventDate > dateRange.to) return false;
      }

      // Virtual filter
      if (virtualFilter === "virtual" && !event.isVirtual) return false;
      if (virtualFilter === "in-person" && event.isVirtual) return false;

      return true;
    });
  };

  const getEventsForDate = (date: Date) => {
    const filteredEvents = getFilteredEvents();
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const hasEventsOnDate = (date: Date) => {
    return getEventsForDate(date).length > 0;
  };

  const filteredEvents = getFilteredEvents();
  const activeFiltersCount = 
    (filterType !== "all" ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (locationFilter ? 1 : 0) +
    selectedInterests.length +
    (dateRange.from || dateRange.to ? 1 : 0) +
    (virtualFilter !== "all" ? 1 : 0);

  const EventCard = ({ event }: { event: Event }) => {
    const isAttending = user && event.attendees.includes(user.id);
    const isFull = event.maxAttendees && event.attendeeCount >= event.maxAttendees;
    
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {event.image && (
          <div className="aspect-video relative">
            <ImageWithFallback
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <Badge className={`absolute top-4 left-4 ${getEventTypeBadgeColor(event.type)}`}>
              {EVENT_TYPES.find(t => t.value === event.type)?.label || event.type}
            </Badge>
          </div>
        )}
        
        <CardHeader>
          {!event.image && (
            <Badge className={`w-fit mb-2 ${getEventTypeBadgeColor(event.type)}`}>
              {EVENT_TYPES.find(t => t.value === event.type)?.label || event.type}
            </Badge>
          )}
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {event.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {formatDate(event.date)}
                {event.time && ` at ${event.time}`}
              </span>
            </div>
            
            {event.isVirtual ? (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Video className="h-4 w-4" />
                <span>Virtual Event</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {event.attendeeCount} attending
                {event.maxAttendees && ` (max ${event.maxAttendees})`}
              </span>
            </div>

            {event.interests && event.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {event.interests.map((interest) => {
                  const category = INTEREST_CATEGORIES.find(c => c.value === interest);
                  const Icon = category?.icon;
                  return (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {Icon && <Icon className="h-3 w-3 mr-1" />}
                      {category?.label || interest}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Organized by <span className="font-medium">{event.organizerName}</span>
              {event.organizerOrganization && ` • ${event.organizerOrganization}`}
            </p>
            
            {isAttending ? (
              <Badge variant="secondary" className="w-full justify-center py-2">
                ✓ You're Attending
              </Badge>
            ) : (
              <Button 
                className="w-full"
                onClick={() => handleJoinEvent(event.id)}
                disabled={isFull || joiningEventId === event.id}
              >
                {joiningEventId === event.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : isFull ? (
                  "Event Full"
                ) : user ? (
                  "Join Event"
                ) : (
                  "Sign in to Join"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Climate Events & Gatherings</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with the community through events, workshops, and gatherings. 
            Create or join events near you to take collective climate action.
          </p>
        </div>

        {/* View Mode Tabs & Create Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <Tabs value={viewMode} onValueChange={(v: any) => setViewMode(v)} className="w-full lg:w-auto">
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Organize a climate action event and invite the community to join.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., Community Solar Panel Workshop"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Describe your event..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Event Type *</Label>
                  <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isVirtual"
                    checked={newEvent.isVirtual}
                    onChange={(e) => setNewEvent({ ...newEvent, isVirtual: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isVirtual" className="cursor-pointer">
                    This is a virtual event
                  </Label>
                </div>

                {newEvent.isVirtual ? (
                  <div>
                    <Label htmlFor="virtualLink">Virtual Meeting Link</Label>
                    <Input
                      id="virtualLink"
                      value={newEvent.virtualLink}
                      onChange={(e) => setNewEvent({ ...newEvent, virtualLink: e.target.value })}
                      placeholder="https://zoom.us/..."
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="e.g., Central Park, New York, NY"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Start Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Start Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxAttendees">Maximum Attendees (Optional)</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-full sm:w-[200px]">
              <Input
                placeholder="Location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <Button 
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Card className="p-6 mt-4">
                  <div className="space-y-6">
                    {/* Interest Categories */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium">Interest Categories</Label>
                        {selectedInterests.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInterests([])}
                            className="h-auto p-0 text-xs"
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {INTEREST_CATEGORIES.map((category) => {
                          const Icon = category.icon;
                          const isSelected = selectedInterests.includes(category.value);
                          return (
                            <Button
                              key={category.value}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleInterest(category.value)}
                              className="flex items-center gap-2"
                            >
                              <Icon className="h-3 w-3" />
                              {category.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Date Range</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? (
                              dateRange.to ? (
                                <>
                                  {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                                </>
                              ) : (
                                dateRange.from.toLocaleDateString()
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range: any) => setDateRange(range || {})}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Virtual/In-Person */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Event Format</Label>
                      <div className="flex gap-2">
                        <Button
                          variant={virtualFilter === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setVirtualFilter("all")}
                        >
                          All
                        </Button>
                        <Button
                          variant={virtualFilter === "virtual" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setVirtualFilter("virtual")}
                          className="flex items-center gap-2"
                        >
                          <Video className="h-3 w-3" />
                          Virtual
                        </Button>
                        <Button
                          variant={virtualFilter === "in-person" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setVirtualFilter("in-person")}
                          className="flex items-center gap-2"
                        >
                          <MapPin className="h-3 w-3" />
                          In-Person
                        </Button>
                      </div>
                    </div>

                    {/* Clear All */}
                    {activeFiltersCount > 0 && (
                      <div className="pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={clearAllFilters}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear All Filters ({activeFiltersCount})
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* List View */}
            {viewMode === "list" && (
              <>
                {filteredEvents.length === 0 ? (
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No events found matching your criteria.</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create the First Event
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Calendar View */}
            {viewMode === "calendar" && (
              <Card className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      modifiers={{
                        hasEvents: (date) => hasEventsOnDate(date)
                      }}
                      modifiersClassNames={{
                        hasEvents: "font-bold bg-primary/10"
                      }}
                    />
                    <div className="mt-4 p-4 bg-muted/50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Dates in <span className="font-bold">bold</span> have events scheduled.
                        Select a date to view events.
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    {selectedDate ? (
                      <>
                        <h3 className="text-xl font-semibold mb-4">
                          Events on {selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </h3>
                        {getEventsForDate(selectedDate).length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            No events scheduled for this date.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {getEventsForDate(selectedDate).map((event) => (
                              <EventCard key={event.id} event={event} />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        Select a date from the calendar to view events
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Map View */}
            {viewMode === "map" && (
              <Card className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                      <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Interactive Map View</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        The interactive map displays all event locations. Click on markers to view event details and join events near you.
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{filteredEvents.filter(e => !e.isVirtual).length}</div>
                          <div className="text-sm text-muted-foreground">In-Person Events</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{filteredEvents.filter(e => e.isVirtual).length}</div>
                          <div className="text-sm text-muted-foreground">Virtual Events</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <h3 className="font-semibold mb-4">Nearby Events</h3>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredEvents.filter(e => !e.isVirtual).map((event) => (
                        <Card key={event.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium line-clamp-1">{event.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">{event.location}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(event.date)}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {filteredEvents.filter(e => !e.isVirtual).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No in-person events with locations to display on map
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </section>
  );
}
