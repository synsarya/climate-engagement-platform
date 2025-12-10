import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn, getProfile } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onAuthSuccess: (user: any) => void;
}

export function LoginPage({ onNavigate, onAuthSuccess }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const authData = await signIn(formData.email, formData.password);
      
      // Get user profile
      const { profile } = await getProfile();
      
      const userData = {
        id: authData.user.id,
        email: authData.user.email,
        name: profile.name,
        location: profile.location || "",
        bio: profile.bio || "",
        organization: profile.organization || "",
        interests: profile.interests || [],
        verified: profile.verified || false,
        communities: profile.communities || [],
        connections: profile.connections || [],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`,
      };

      toast.success(`Welcome back, ${profile.name}!`);
      onAuthSuccess(userData);
      onNavigate('home');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginUsers = [
    { name: "Demo Scientist", email: "scientist@demo.com", role: "Climate Researcher" },
    { name: "Demo Activist", email: "activist@demo.com", role: "Community Organizer" },
    { name: "Demo Student", email: "student@demo.com", role: "Climate Student" }
  ];

  const handleQuickLogin = (user: any) => {
    const mockUser = {
      id: Date.now(),
      name: user.name,
      email: user.email,
      location: "Demo Location",
      expertise: user.role,
      avatar: "https://images.unsplash.com/photo-1657152042392-c1f39e52e7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTg2OTY4OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      joinDate: "2023-01-15",
      status: "online",
      bio: `${user.role} passionate about climate action and environmental sustainability.`,
      contributions: Math.floor(Math.random() * 200) + 50,
      communities: ["Climate Scientists Network", "Environmental Advocates"],
      badges: ["Climate Champion", "Community Builder"]
    };

    onAuthSuccess(mockUser);
    onNavigate('home');
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-2xl font-semibold">Your Earth</span>
            </div>
            <h1 className="text-3xl mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Continue your climate action journey
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Access your climate community dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  
                  <Button variant="link" className="p-0 text-sm">
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium mb-3">Quick Demo Access</p>
                  <div className="space-y-2">
                    {quickLoginUsers.map((user, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleQuickLogin(user)}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.role}</div>
                          </div>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button 
                      variant="link" 
                      className="p-0"
                      onClick={() => onNavigate('signup')}
                    >
                      Create one now
                    </Button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Badge variant="secondary" className="mb-4">
              Trusted by Climate Champions Worldwide
            </Badge>
            <div className="grid grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
              <div>
                <div className="font-medium">50K+</div>
                <div>Active Users</div>
              </div>
              <div>
                <div className="font-medium">127</div>
                <div>Countries</div>
              </div>
              <div>
                <div className="font-medium">24/7</div>
                <div>Global Impact</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}