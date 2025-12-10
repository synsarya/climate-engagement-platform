import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Bell, Search, Globe, Users, BookOpen, Target, User, Settings, LogOut, BarChart3, Zap, UtensilsCrossed, Car, Factory, Laptop, Scale, TreePine, ChevronDown, Calculator, Calendar, Briefcase, ShoppingBag } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { NotificationsPanel } from "./NotificationsPanel";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: any;
  onLogout?: () => void;
}

export function Header({ currentPage, onNavigate, user, onLogout }: HeaderProps) {
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [showLearningDropdown, setShowLearningDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const communityCategories = [
    { name: "Energy", icon: Zap, description: "Renewable energy & sustainability", slug: "energy" },
    { name: "Food", icon: UtensilsCrossed, description: "Sustainable agriculture & nutrition", slug: "food" },
    { name: "Mobility", icon: Car, description: "Clean transportation solutions", slug: "mobility" },
    { name: "Industry", icon: Factory, description: "Green manufacturing & business", slug: "industry" },
    { name: "Technology", icon: Laptop, description: "Climate tech & innovation", slug: "technology" },
    { name: "Policy", icon: Scale, description: "Climate policy & governance", slug: "policy" },
    { name: "Nature", icon: TreePine, description: "Conservation & biodiversity", slug: "nature" }
  ];

  const learningCategories = [
    { name: "Corporate Climate Impact", icon: BarChart3, description: "Track companies & emissions data", slug: "corporate" },
    { name: "Climate Education", icon: BookOpen, description: "Courses, experts & certifications", slug: "education" },
    { name: "Carbon Calculator", icon: Calculator, description: "Calculate personal CO2 footprint", slug: "calculator" }
  ];

  const handleCommunityNavigate = (slug?: string) => {
    if (slug) {
      onNavigate(`community-${slug}`);
    } else {
      onNavigate('community');
    }
    setShowCommunityDropdown(false);
  };

  const handleLearningNavigate = (slug?: string) => {
    if (slug) {
      onNavigate(`learn-${slug}`);
    } else {
      onNavigate('learn');
    }
    setShowLearningDropdown(false);
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <Globe className="h-6 w-6 text-primary" />
            <span className="font-semibold">Your Earth</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Button 
                variant={currentPage.startsWith('learn') ? 'default' : 'ghost'} 
                size="sm" 
                className="flex items-center space-x-2"
                onMouseEnter={() => setShowLearningDropdown(true)}
                onMouseLeave={() => setShowLearningDropdown(false)}
                onClick={() => handleLearningNavigate()}
              >
                <BookOpen className="h-4 w-4" />
                <span>Learn</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showLearningDropdown ? 'rotate-180' : ''}`} />
              </Button>

              <AnimatePresence>
                {showLearningDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-80 bg-popover border rounded-lg shadow-lg z-50"
                    onMouseEnter={() => setShowLearningDropdown(true)}
                    onMouseLeave={() => setShowLearningDropdown(false)}
                  >
                    <div className="p-4">
                      <div className="text-sm font-medium text-foreground mb-3">
                        Learning Modules
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {learningCategories.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <motion.div
                              key={category.slug}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                duration: 0.2, 
                                delay: learningCategories.indexOf(category) * 0.05 
                              }}
                              className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors duration-200"
                              onClick={() => handleLearningNavigate(category.slug)}
                            >
                              <div className="flex-shrink-0">
                                <IconComponent className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground">
                                  {category.name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {category.description}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleLearningNavigate()}
                        >
                          View All Learning
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <Button 
                variant={currentPage.startsWith('community') ? 'default' : 'ghost'} 
                size="sm" 
                className="flex items-center space-x-2"
                onMouseEnter={() => setShowCommunityDropdown(true)}
                onMouseLeave={() => setShowCommunityDropdown(false)}
                onClick={() => handleCommunityNavigate()}
              >
                <Users className="h-4 w-4" />
                <span>Community</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${showCommunityDropdown ? 'rotate-180' : ''}`} />
              </Button>

              <AnimatePresence>
                {showCommunityDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-80 bg-popover border rounded-lg shadow-lg z-50"
                    onMouseEnter={() => setShowCommunityDropdown(true)}
                    onMouseLeave={() => setShowCommunityDropdown(false)}
                  >
                    <div className="p-4">
                      <div className="text-sm font-medium text-foreground mb-3">
                        Explore Communities
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {communityCategories.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <motion.div
                              key={category.slug}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ 
                                duration: 0.2, 
                                delay: communityCategories.indexOf(category) * 0.05 
                              }}
                              className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors duration-200"
                              onClick={() => handleCommunityNavigate(category.slug)}
                            >
                              <div className="flex-shrink-0">
                                <IconComponent className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground">
                                  {category.name}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {category.description}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleCommunityNavigate()}
                        >
                          View All Communities
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <Button 
                variant={currentPage === 'action' || currentPage === 'events' ? 'default' : 'ghost'} 
                size="sm" 
                className="flex items-center space-x-2"
                onMouseEnter={() => setShowActionDropdown(true)}
                onMouseLeave={() => setShowActionDropdown(false)}
                onClick={() => onNavigate('action')}
              >
                <Target className="h-4 w-4" />
                <span>Action</span>
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
              <AnimatePresence>
                {showActionDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-popover rounded-md shadow-lg border z-50"
                    onMouseEnter={() => setShowActionDropdown(true)}
                    onMouseLeave={() => setShowActionDropdown(false)}
                  >
                    <div className="p-4">
                      <div className="text-sm font-medium text-foreground mb-3">
                        Take Action
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            onNavigate('action');
                            setShowActionDropdown(false);
                          }}
                        >
                          <div className="flex-shrink-0">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              Campaigns & Actions
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              Join campaigns and complete quick actions
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.05 }}
                          className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            onNavigate('events');
                            setShowActionDropdown(false);
                          }}
                        >
                          <div className="flex-shrink-0">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              Events & Gatherings
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              Connect through local and virtual events
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            onNavigate('jobs');
                            setShowActionDropdown(false);
                          }}
                        >
                          <div className="flex-shrink-0">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              Climate Jobs
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              Find careers in the clean industry
                            </div>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.15 }}
                          className="flex items-center space-x-3 p-3 rounded-md hover:bg-accent cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            onNavigate('marketplace');
                            setShowActionDropdown(false);
                          }}
                        >
                          <div className="flex-shrink-0">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">
                              Green Marketplace
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              Shop sustainable products
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search climate topics..."
              className="pl-8 w-[200px] lg:w-[300px]"
            />
          </div>
          
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-8 w-8 rounded-full border-0 bg-transparent p-0 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onNavigate('login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => onNavigate('signup')}>
                Join Now
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)}
        onNavigate={onNavigate}
      />
    </header>
  );
}