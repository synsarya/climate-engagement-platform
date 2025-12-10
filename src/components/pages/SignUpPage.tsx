import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Globe, Mail, Lock, User, MapPin, Briefcase, Eye, EyeOff } from "lucide-react";
import { signUp, signIn, getProfile } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface SignUpPageProps {
  onNavigate: (page: string) => void;
  onAuthSuccess: (user: any) => void;
}

export function SignUpPage({ onNavigate, onAuthSuccess }: SignUpPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    expertise: "",
    interests: [] as string[],
    termsAccepted: false
  });

  const expertiseAreas = [
    "Climate Science",
    "Renewable Energy", 
    "Environmental Policy",
    "Sustainable Agriculture",
    "Green Technology",
    "Ocean Conservation",
    "Forest Conservation",
    "Urban Planning",
    "Climate Education",
    "Environmental Law",
    "Clean Transportation",
    "Carbon Management"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const interests = formData.expertise ? [formData.expertise.toLowerCase().replace(/\s+/g, '-')] : [];
      
      // Create account
      await signUp(formData.email, formData.password, fullName, interests);
      
      // Automatically sign in
      const authData = await signIn(formData.email, formData.password);
      
      // Get profile
      const { profile } = await getProfile();
      
      const userData = {
        id: authData.user.id,
        email: authData.user.email,
        name: profile.name,
        location: formData.location || "",
        bio: "",
        organization: "",
        interests: profile.interests || [],
        verified: false,
        communities: [],
        connections: [],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.id}`,
      };

      toast.success(`Welcome to Your Earth, ${formData.firstName}!`);
      onAuthSuccess(userData);
      onNavigate('home');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl mb-2">Join the Movement</h1>
            <p className="text-muted-foreground">
              Connect with climate champions worldwide and amplify your impact
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>
                Start your journey toward climate action today
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="Alex"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Chen"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="City, Country"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Area of Expertise</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Select onValueChange={(value) => handleInputChange("expertise", value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select your expertise area" />
                      </SelectTrigger>
                      <SelectContent>
                        {expertiseAreas.map((area) => (
                          <SelectItem key={area} value={area.toLowerCase().replace(/\s+/g, '-')}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <span className="text-primary underline cursor-pointer">Terms of Service</span>
                    {" "}and{" "}
                    <span className="text-primary underline cursor-pointer">Privacy Policy</span>
                  </Label>
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Button 
                    variant="link" 
                    className="p-0"
                    onClick={() => onNavigate('login')}
                  >
                    Sign in here
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Badge variant="secondary" className="mb-4">
              Join 50,000+ Climate Champions
            </Badge>
            <div className="grid grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
              <div>
                <div className="font-medium">127</div>
                <div>Countries</div>
              </div>
              <div>
                <div className="font-medium">1,234</div>
                <div>Active Projects</div>
              </div>
              <div>
                <div className="font-medium">89%</div>
                <div>Daily Engagement</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}