import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Checkbox } from "./ui/checkbox";
import { 
  Users, 
  MessageCircle, 
  UserPlus, 
  Check,
  Zap,
  UtensilsCrossed,
  Car,
  Factory,
  Laptop,
  Scale,
  TreePine,
  Globe,
  Image,
  Link as LinkIcon,
  Sparkles
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { 
  joinCommunity as joinCommunityAPI, 
  createCommunity as createCommunityAPI,
  createDiscussion as createDiscussionAPI,
  sendConnectionRequest,
  sendMessage
} from "../utils/api";

interface JoinCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityName?: string;
  communityCategory?: string;
  communityId?: string;
}

export function JoinCommunityDialog({ open, onOpenChange, communityName, communityCategory, communityId }: JoinCommunityDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleJoin = async () => {
    if (!communityId) {
      toast.error("Community ID is missing");
      return;
    }

    setIsLoading(true);
    
    try {
      await joinCommunityAPI(communityId);
      toast.success(`Successfully joined ${communityName || 'the community'}!`, {
        description: "You'll now receive updates and can participate in discussions."
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Join community error:', error);
      toast.error(error.message || "Failed to join community");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Join {communityName || 'Community'}
          </DialogTitle>
          <DialogDescription>
            Connect with like-minded climate advocates and start collaborating on impactful projects.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">What you'll get:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Access to exclusive community discussions
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Collaborate on climate action projects
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Connect with experts and advocates
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Receive updates on events and opportunities
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intro">Introduce yourself (optional)</Label>
            <Textarea 
              id="intro" 
              placeholder="Tell the community a bit about yourself and your climate interests..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={isLoading}>
            <Users className="h-4 w-4 mr-2" />
            {isLoading ? "Joining..." : "Join Community"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CreateDiscussionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicTitle?: string;
  category?: string;
}

export function CreateDiscussionDialog({ open, onOpenChange, topicTitle, category }: CreateDiscussionDialogProps) {
  const [title, setTitle] = useState(topicTitle || "");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "general");
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      await createDiscussionAPI({
        title,
        content,
        category: selectedCategory
      });
      
      toast.success("Discussion posted successfully!", {
        description: "Your post is now live in the community feed."
      });
      setTitle("");
      setContent("");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Create discussion error:', error);
      toast.error(error.message || "Failed to create discussion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            {topicTitle ? `Join Discussion: ${topicTitle}` : 'Start a New Discussion'}
          </DialogTitle>
          <DialogDescription>
            Share your thoughts, questions, or insights with the community.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!topicTitle && (
            <>
              <div className="space-y-2">
                <Label htmlFor="title">Discussion Title *</Label>
                <Input 
                  id="title" 
                  placeholder="What's your topic about?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Discussion</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="mobility">Mobility</SelectItem>
                    <SelectItem value="industry">Industry</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Your Post *</Label>
            <Textarea 
              id="content" 
              placeholder={topicTitle ? "Add your thoughts to this discussion..." : "Share your ideas, questions, or insights..."}
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button">
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            <Button variant="outline" size="sm" type="button">
              <LinkIcon className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handlePost} disabled={isLoading}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {isLoading ? "Posting..." : "Post Discussion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INTEREST_ICONS = {
  energy: Zap,
  food: UtensilsCrossed,
  mobility: Car,
  industry: Factory,
  technology: Laptop,
  policy: Scale,
  nature: TreePine,
  general: Globe
};

export function CreateCommunityDialog({ open, onOpenChange }: CreateCommunityDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await createCommunityAPI({
        name,
        description,
        category,
        isPublic
      });
      
      toast.success("Community created successfully!", {
        description: "Your new community is now live. Start inviting members!"
      });
      setName("");
      setDescription("");
      setCategory("general");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Create community error:', error);
      toast.error(error.message || "Failed to create community");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Community
          </DialogTitle>
          <DialogDescription>
            Start a new community to bring together climate champions around your cause.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name *</Label>
            <Input 
              id="name" 
              placeholder="e.g., Urban Renewable Energy Network"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the purpose and focus of your community..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Primary Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="mobility">Mobility</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="policy">Policy</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="public" 
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
            />
            <Label 
              htmlFor="public" 
              className="text-sm font-normal cursor-pointer"
            >
              Make this community public (anyone can join)
            </Label>
          </div>

          <div className="rounded-lg border p-4 bg-muted/50">
            <h4 className="font-medium mb-2">Community Preview</h4>
            <div className="flex items-start gap-3">
              {(() => {
                const IconComponent = INTEREST_ICONS[category as keyof typeof INTEREST_ICONS] || Globe;
                return <IconComponent className="h-8 w-8 text-primary mt-1" />;
              })()}
              <div className="flex-1">
                <h3 className="font-semibold">
                  {name || "Your Community Name"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {description || "Your community description will appear here..."}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Create Community"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConnectMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  memberAvatar?: string;
  memberTitle?: string;
  memberId?: string;
}

export function ConnectMemberDialog({ open, onOpenChange, memberName, memberAvatar, memberTitle, memberId }: ConnectMemberDialogProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!memberId) {
      toast.error("Member ID is missing");
      return;
    }

    setIsLoading(true);

    try {
      await sendConnectionRequest(memberId, message);
      toast.success(`Connection request sent to ${memberName}!`, {
        description: "You'll be notified when they accept."
      });
      setMessage("");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Send connection request error:', error);
      toast.error(error.message || "Failed to send connection request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Connect with {memberName}
          </DialogTitle>
          <DialogDescription>
            Send a connection request to expand your network
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="h-12 w-12">
              <AvatarImage src={memberAvatar} />
              <AvatarFallback>
                {memberName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{memberName}</h4>
              {memberTitle && (
                <p className="text-sm text-muted-foreground">{memberTitle}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="connect-message">Add a note (optional)</Label>
            <Textarea 
              id="connect-message" 
              placeholder="Introduce yourself and explain why you'd like to connect..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={isLoading}>
            <UserPlus className="h-4 w-4 mr-2" />
            {isLoading ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface MessageMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  memberAvatar?: string;
  memberTitle?: string;
  memberId?: string;
}

export function MessageMemberDialog({ open, onOpenChange, memberName, memberAvatar, memberTitle, memberId }: MessageMemberDialogProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please write a message");
      return;
    }

    if (!memberId) {
      toast.error("Member ID is missing");
      return;
    }

    setIsLoading(true);

    try {
      await sendMessage(memberId, message, subject);
      toast.success(`Message sent to ${memberName}!`, {
        description: "They'll receive a notification about your message."
      });
      setSubject("");
      setMessage("");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Send message error:', error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Message {memberName}
          </DialogTitle>
          <DialogDescription>
            Send a direct message to this community member
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="h-12 w-12">
              <AvatarImage src={memberAvatar} />
              <AvatarFallback>
                {memberName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{memberName}</h4>
              {memberTitle && (
                <p className="text-sm text-muted-foreground">{memberTitle}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject (optional)</Label>
            <Input 
              id="subject" 
              placeholder="What's this message about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea 
              id="message" 
              placeholder="Write your message here..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isLoading}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
