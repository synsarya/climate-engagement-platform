import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase clients
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return { user: null, error: 'No authorization header' };
  
  const token = authHeader.split(' ')[1];
  if (!token) return { user: null, error: 'No token provided' };
  
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  return { user, error };
}

// Health check endpoint
app.get("/make-server-73b87161/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTH ROUTES =====

// Sign up new user
app.post("/make-server-73b87161/auth/signup", async (c) => {
  try {
    const { email, password, name, interests = [] } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since no email server configured
      user_metadata: { name }
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Create user profile in KV store
    const userProfile = {
      id: authData.user.id,
      email,
      name,
      interests,
      verified: false,
      bio: '',
      location: '',
      organization: '',
      communities: [],
      connections: [],
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${authData.user.id}`, userProfile);

    return c.json({ 
      user: authData.user,
      profile: userProfile,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get current user profile
app.get("/make-server-73b87161/auth/profile", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const profile = await kv.get(`user:${user.id}`);
  
  if (!profile) {
    return c.json({ error: 'Profile not found' }, 404);
  }

  return c.json({ profile });
});

// Update user profile
app.put("/make-server-73b87161/auth/profile", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`);
    
    if (!currentProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id, // Ensure ID doesn't change
      email: currentProfile.email, // Ensure email doesn't change
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get user profile by ID (for viewing other users)
app.get("/make-server-73b87161/users/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    console.log(`Fetching user profile for userId: ${userId}`);
    
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      console.log(`User not found for userId: ${userId}`);
      return c.json({ error: 'User not found' }, 404);
    }

    console.log(`Successfully found profile for: ${profile.name}`);

    // Return public profile info (exclude sensitive data)
    const publicProfile = {
      id: profile.id,
      name: profile.name,
      bio: profile.bio,
      location: profile.location,
      organization: profile.organization,
      avatar: profile.avatar,
      expertise: profile.expertise,
      verified: profile.verified,
      interests: profile.interests,
      communities: profile.communities,
      contributions: profile.contributions,
      joinDate: profile.createdAt,
      externalCommunities: profile.externalCommunities || [],
    };

    return c.json({ profile: publicProfile });
  } catch (error) {
    console.error('Get user profile error:', error);
    return c.json({ error: `Failed to fetch user profile: ${error.message}` }, 500);
  }
});

// Seed dummy users for demo (this runs on server startup)
async function seedDummyUsers() {
  const dummyUsers = [
    {
      id: 'dummy-user-sarah-chen',
      email: 'sarah.chen@example.com',
      name: 'Sarah Chen',
      bio: 'Climate scientist researching ocean acidification and marine ecosystems. PhD from Stanford. Passionate about translating complex climate data into actionable insights.',
      location: 'San Francisco, CA',
      organization: 'Pacific Climate Research Institute',
      avatar: 'https://images.unsplash.com/photo-1740153204804-200310378f2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU4NTk0MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      expertise: 'Climate Scientist',
      verified: true,
      interests: ['nature', 'technology', 'policy'],
      communities: ['Climate Scientists Network', 'Ocean Conservation Alliance', 'Data for Climate'],
      contributions: 287,
      createdAt: '2023-01-15T08:00:00.000Z'
    },
    {
      id: 'dummy-user-marcus-johnson',
      email: 'marcus.johnson@example.com',
      name: 'Marcus Johnson',
      bio: 'Building community power through local climate action. Former city council member turned full-time organizer. Believer in grassroots solutions and renewable energy cooperatives.',
      location: 'Austin, TX',
      organization: 'Texas Solar Cooperative',
      avatar: 'https://images.unsplash.com/photo-1621905252472-943afaa20e20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYW1lcmljYW4lMjBlbmdpbmVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODY5NjkwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      expertise: 'Community Organizer',
      verified: true,
      interests: ['energy', 'policy', 'mobility'],
      communities: ['Renewable Energy Enthusiasts', 'Local Climate Action', 'Energy Justice Coalition'],
      contributions: 423,
      createdAt: '2022-08-22T10:30:00.000Z'
    },
    {
      id: 'dummy-user-emma-rodriguez',
      email: 'emma.rodriguez@example.com',
      name: 'Emma Rodriguez',
      bio: 'Climate policy advocate working at the intersection of science and legislation. Focused on international climate agreements and carbon pricing mechanisms. Let\'s make COP count!',
      location: 'Barcelona, Spain',
      organization: 'European Climate Policy Network',
      avatar: 'https://images.unsplash.com/photo-1618053448748-b7251851d014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXNwYW5pYyUyMHdvbWFuJTIwc2NpZW50aXN0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc1ODY5NjkxMnww&ixlib=rb-4.1.0&q=80&w=1080',
      expertise: 'Policy Advocate',
      verified: true,
      interests: ['policy', 'industry', 'technology'],
      communities: ['Climate Policy Network', 'Youth Climate Activists', 'International Climate Action'],
      contributions: 356,
      createdAt: '2023-03-10T14:20:00.000Z'
    }
  ];

  for (const user of dummyUsers) {
    const existing = await kv.get(`user:${user.id}`);
    if (!existing) {
      await kv.set(`user:${user.id}`, user);
      console.log(`Seeded dummy user: ${user.name}`);
    }
  }
}

// Seed dummy events
async function seedDummyEvents() {
  const today = new Date();
  const dummyEvents = [
    {
      id: 'dummy-event-solar-workshop',
      title: 'Community Solar Panel Installation Workshop',
      description: 'Join us for a hands-on workshop where we\'ll learn the basics of solar panel installation. Perfect for homeowners, students, and anyone interested in renewable energy. We\'ll cover site assessment, mounting systems, electrical connections, and maintenance. Refreshments provided!',
      type: 'workshop',
      location: 'Austin Community Center, 2800 Webberville Rd, Austin, TX 78702',
      latitude: 30.2672,
      longitude: -97.7431,
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '14:00',
      endDate: null,
      endTime: '17:00',
      creatorId: 'dummy-user-marcus-johnson',
      organizerName: 'Marcus Johnson',
      organizerOrganization: 'Texas Solar Cooperative',
      attendees: ['dummy-user-marcus-johnson', 'dummy-user-sarah-chen'],
      attendeeCount: 2,
      maxAttendees: 30,
      image: null,
      tags: ['solar', 'renewable-energy', 'hands-on'],
      interests: ['energy', 'technology'],
      isVirtual: false,
      virtualLink: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-climate-happy-hour',
      title: 'Climate Action Happy Hour',
      description: 'Network with fellow climate enthusiasts over drinks! Whether you\'re a researcher, activist, entrepreneur, or just curious about climate action, join us for casual conversations about sustainability. Great opportunity to share ideas and make connections in the climate community.',
      type: 'happy-hour',
      location: 'The Green Room Bar, 501 Studer St, San Francisco, CA 94134',
      latitude: 37.7749,
      longitude: -122.4194,
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '18:00',
      endDate: null,
      endTime: '21:00',
      creatorId: 'dummy-user-sarah-chen',
      organizerName: 'Sarah Chen',
      organizerOrganization: 'Pacific Climate Research Institute',
      attendees: ['dummy-user-sarah-chen', 'dummy-user-emma-rodriguez'],
      attendeeCount: 2,
      maxAttendees: 50,
      image: null,
      tags: ['networking', 'social', 'community'],
      interests: ['nature', 'policy', 'technology'],
      isVirtual: false,
      virtualLink: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-climate-symposium',
      title: 'Global Climate Policy Symposium 2025',
      description: 'A full-day virtual symposium bringing together climate policy experts from around the world. Topics include carbon pricing mechanisms, international climate agreements, just transition policies, and climate finance. Featuring keynote speakers from the UN, World Bank, and leading climate research institutions.',
      type: 'symposium',
      location: null,
      latitude: null,
      longitude: null,
      date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '09:00',
      endDate: null,
      endTime: '17:00',
      creatorId: 'dummy-user-emma-rodriguez',
      organizerName: 'Emma Rodriguez',
      organizerOrganization: 'European Climate Policy Network',
      attendees: ['dummy-user-emma-rodriguez', 'dummy-user-sarah-chen', 'dummy-user-marcus-johnson'],
      attendeeCount: 3,
      maxAttendees: null,
      image: null,
      tags: ['policy', 'international', 'research'],
      interests: ['policy', 'industry', 'technology'],
      isVirtual: true,
      virtualLink: 'https://zoom.us/j/example',
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-beach-cleanup',
      title: 'Ocean Beach Cleanup & Picnic',
      description: 'Help protect our oceans by participating in a beach cleanup! We\'ll provide all supplies including gloves, bags, and grabbers. After the cleanup, join us for a zero-waste picnic. Learn about marine conservation and the impact of plastic pollution. Families welcome!',
      type: 'cleanup',
      location: 'Ocean Beach, San Francisco, CA 94121',
      latitude: 37.7694,
      longitude: -122.5107,
      date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00',
      endDate: null,
      endTime: '13:00',
      creatorId: 'dummy-user-sarah-chen',
      organizerName: 'Sarah Chen',
      organizerOrganization: 'Pacific Climate Research Institute',
      attendees: ['dummy-user-sarah-chen'],
      attendeeCount: 1,
      maxAttendees: 100,
      image: null,
      tags: ['cleanup', 'ocean', 'conservation'],
      interests: ['nature'],
      isVirtual: false,
      virtualLink: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-climate-march',
      title: 'March for Climate Justice',
      description: 'Join thousands in demanding urgent climate action from our elected officials! We march for a green new deal, environmental justice, and a livable future for all. Rally starts at City Hall with speakers from Indigenous communities, youth activists, and labor organizers. Family-friendly event.',
      type: 'protest-march',
      location: 'City Hall, Austin, TX 78701',
      latitude: 30.2747,
      longitude: -97.7404,
      date: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '11:00',
      endDate: null,
      endTime: '15:00',
      creatorId: 'dummy-user-marcus-johnson',
      organizerName: 'Marcus Johnson',
      organizerOrganization: 'Texas Solar Cooperative',
      attendees: ['dummy-user-marcus-johnson', 'dummy-user-emma-rodriguez'],
      attendeeCount: 2,
      maxAttendees: null,
      image: null,
      tags: ['activism', 'justice', 'community'],
      interests: ['policy', 'nature'],
      isVirtual: false,
      virtualLink: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-sustainable-food',
      title: 'Urban Farming & Sustainable Food Systems Workshop',
      description: 'Learn practical techniques for growing your own food in urban spaces! Topics include container gardening, vertical farming, composting, and water conservation. We\'ll tour a successful urban farm and discuss building resilient local food systems. Seeds and starter plants available.',
      type: 'workshop',
      location: 'Urban Roots Farm, 2414 Santa Maria St, Austin, TX 78702',
      latitude: 30.2693,
      longitude: -97.7212,
      date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '09:00',
      endDate: null,
      endTime: '12:00',
      creatorId: 'dummy-user-marcus-johnson',
      organizerName: 'Marcus Johnson',
      organizerOrganization: 'Texas Solar Cooperative',
      attendees: ['dummy-user-marcus-johnson'],
      attendeeCount: 1,
      maxAttendees: 25,
      image: null,
      tags: ['food', 'farming', 'sustainability'],
      interests: ['food', 'nature'],
      isVirtual: false,
      virtualLink: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-ev-showcase',
      title: 'Electric Vehicle Showcase & Test Drive Event',
      description: 'Explore the future of transportation! Test drive the latest electric vehicles from leading manufacturers. Learn about EV incentives, charging infrastructure, and the environmental benefits of electric mobility. Representatives from local utilities will discuss home charging solutions.',
      type: 'gathering',
      location: 'Circuit of The Americas, 9201 Circuit of The Americas Blvd, Austin, TX 78617',
      latitude: 30.1328,
      longitude: -97.6411,
      date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00',
      endDate: null,
      endTime: '16:00',
      creatorId: 'dummy-user-marcus-johnson',
      organizerName: 'Marcus Johnson',
      organizerOrganization: 'Texas Solar Cooperative',
      attendees: ['dummy-user-marcus-johnson', 'dummy-user-emma-rodriguez', 'dummy-user-sarah-chen'],
      attendeeCount: 3,
      maxAttendees: 200,
      image: null,
      tags: ['transportation', 'electric-vehicles', 'technology'],
      interests: ['mobility', 'technology'],
      isVirtual: false,
      virtualLink: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-climate-tech-conference',
      title: 'Climate Tech Innovation Conference',
      description: 'Two-day conference showcasing breakthrough climate technologies. Sessions on carbon capture, green hydrogen, battery storage, and climate modeling. Pitch competition for climate tech startups with $50k in prizes. Networking opportunities with investors, researchers, and entrepreneurs.',
      type: 'conference',
      location: 'Moscone Center, 747 Howard St, San Francisco, CA 94103',
      latitude: 37.7842,
      longitude: -122.4016,
      date: new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '08:00',
      endDate: new Date(today.getTime() + 36 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endTime: '18:00',
      creatorId: 'dummy-user-sarah-chen',
      organizerName: 'Sarah Chen',
      organizerOrganization: 'Pacific Climate Research Institute',
      attendees: ['dummy-user-sarah-chen', 'dummy-user-marcus-johnson'],
      attendeeCount: 2,
      maxAttendees: 500,
      image: null,
      tags: ['technology', 'innovation', 'startups'],
      interests: ['technology', 'industry', 'energy'],
      isVirtual: false,
      virtualLink: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-green-building',
      title: 'Green Building & Sustainable Architecture Tour',
      description: 'Guided tour of LEED Platinum certified buildings and innovative sustainable architecture projects. Learn about passive solar design, green roofs, rainwater harvesting, and net-zero energy buildings. Q&A with architects and building owners.',
      type: 'gathering',
      location: 'Downtown San Francisco (meeting point TBA)',
      latitude: 37.7749,
      longitude: -122.4194,
      date: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '13:00',
      endDate: null,
      endTime: '16:00',
      creatorId: 'dummy-user-sarah-chen',
      organizerName: 'Sarah Chen',
      organizerOrganization: 'Pacific Climate Research Institute',
      attendees: ['dummy-user-sarah-chen'],
      attendeeCount: 1,
      maxAttendees: 20,
      image: null,
      tags: ['architecture', 'building', 'sustainability'],
      interests: ['technology', 'industry'],
      isVirtual: false,
      virtualLink: null,
      createdAt: new Date().toISOString()
    },
    {
      id: 'dummy-event-youth-climate-summit',
      title: 'Youth Climate Leadership Summit (Virtual)',
      description: 'Empowering the next generation of climate leaders! Virtual summit for students and young professionals featuring workshops on climate advocacy, storytelling, organizing, and career pathways in sustainability. Mentorship sessions with established climate leaders.',
      type: 'conference',
      location: null,
      latitude: null,
      longitude: null,
      date: new Date(today.getTime() + 24 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00',
      endDate: null,
      endTime: '16:00',
      creatorId: 'dummy-user-emma-rodriguez',
      organizerName: 'Emma Rodriguez',
      organizerOrganization: 'European Climate Policy Network',
      attendees: ['dummy-user-emma-rodriguez'],
      attendeeCount: 1,
      maxAttendees: null,
      image: null,
      tags: ['youth', 'leadership', 'education'],
      interests: ['policy', 'technology', 'nature'],
      isVirtual: true,
      virtualLink: 'https://zoom.us/j/example-youth',
      createdAt: new Date().toISOString()
    }
  ];

  for (const event of dummyEvents) {
    const existing = await kv.get(`event:${event.id}`);
    if (!existing) {
      await kv.set(`event:${event.id}`, event);
      console.log(`Seeded dummy event: ${event.title}`);
    }
  }
}

// Seed dummy users and events on startup
console.log('Starting to seed dummy users...');
seedDummyUsers()
  .then(() => {
    console.log('Dummy users seeding completed');
    console.log('Starting to seed dummy events...');
    return seedDummyEvents();
  })
  .then(() => console.log('Dummy events seeding completed'))
  .catch((error) => {
    console.error('Error seeding dummy data:', error);
  });

// ===== COMMUNITY ROUTES =====

// Get all communities
app.get("/make-server-73b87161/communities", async (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    
    const allCommunities = await kv.getByPrefix('community:');
    let communities = allCommunities || [];

    // Filter by category if provided
    if (category && category !== 'all') {
      communities = communities.filter(comm => comm.category === category);
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      communities = communities.filter(comm => 
        comm.name.toLowerCase().includes(searchLower) ||
        comm.description.toLowerCase().includes(searchLower)
      );
    }

    return c.json({ communities });
  } catch (error) {
    console.error('Get communities error:', error);
    return c.json({ error: 'Failed to fetch communities' }, 500);
  }
});

// Get single community
app.get("/make-server-73b87161/communities/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const community = await kv.get(`community:${id}`);
    
    if (!community) {
      return c.json({ error: 'Community not found' }, 404);
    }

    return c.json({ community });
  } catch (error) {
    console.error('Get community error:', error);
    return c.json({ error: 'Failed to fetch community' }, 500);
  }
});

// Create new community
app.post("/make-server-73b87161/communities", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { name, description, category, isPublic = true } = await c.req.json();
    
    if (!name || !description || !category) {
      return c.json({ error: 'Name, description, and category are required' }, 400);
    }

    const communityId = crypto.randomUUID();
    const community = {
      id: communityId,
      name,
      description,
      category,
      isPublic,
      creatorId: user.id,
      members: [user.id],
      memberCount: 1,
      createdAt: new Date().toISOString()
    };

    await kv.set(`community:${communityId}`, community);

    // Update user's communities list
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile) {
      userProfile.communities = [...(userProfile.communities || []), communityId];
      await kv.set(`user:${user.id}`, userProfile);
    }

    return c.json({ community });
  } catch (error) {
    console.error('Create community error:', error);
    return c.json({ error: 'Failed to create community' }, 500);
  }
});

// Join community
app.post("/make-server-73b87161/communities/:id/join", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const id = c.req.param('id');
    const community = await kv.get(`community:${id}`);
    
    if (!community) {
      return c.json({ error: 'Community not found' }, 404);
    }

    // Check if already a member
    if (community.members.includes(user.id)) {
      return c.json({ error: 'Already a member' }, 400);
    }

    // Add user to community
    community.members.push(user.id);
    community.memberCount = community.members.length;
    await kv.set(`community:${id}`, community);

    // Update user's communities list
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile) {
      userProfile.communities = [...(userProfile.communities || []), id];
      await kv.set(`user:${user.id}`, userProfile);
    }

    return c.json({ community, message: 'Successfully joined community' });
  } catch (error) {
    console.error('Join community error:', error);
    return c.json({ error: 'Failed to join community' }, 500);
  }
});

// ===== DISCUSSION ROUTES =====

// Get discussions
app.get("/make-server-73b87161/discussions", async (c) => {
  try {
    const communityId = c.req.query('communityId');
    const category = c.req.query('category');
    
    const allDiscussions = await kv.getByPrefix('discussion:');
    let discussions = allDiscussions || [];

    // Filter by community if provided
    if (communityId) {
      discussions = discussions.filter(disc => disc.communityId === communityId);
    }

    // Filter by category if provided
    if (category && category !== 'all') {
      discussions = discussions.filter(disc => disc.category === category);
    }

    // Sort by creation date (newest first)
    discussions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ discussions });
  } catch (error) {
    console.error('Get discussions error:', error);
    return c.json({ error: 'Failed to fetch discussions' }, 500);
  }
});

// Create discussion
app.post("/make-server-73b87161/discussions", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { title, content, category, communityId } = await c.req.json();
    
    if (!title || !content) {
      return c.json({ error: 'Title and content are required' }, 400);
    }

    // Get user profile for author info
    const userProfile = await kv.get(`user:${user.id}`);

    const discussionId = crypto.randomUUID();
    const discussion = {
      id: discussionId,
      title,
      content,
      category: category || 'general',
      communityId: communityId || null,
      authorId: user.id,
      authorName: userProfile?.name || 'Unknown User',
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };

    await kv.set(`discussion:${discussionId}`, discussion);

    return c.json({ discussion });
  } catch (error) {
    console.error('Create discussion error:', error);
    return c.json({ error: 'Failed to create discussion' }, 500);
  }
});

// ===== CONNECTION ROUTES =====

// Send connection request
app.post("/make-server-73b87161/connections/request", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { targetUserId, message } = await c.req.json();
    
    if (!targetUserId) {
      return c.json({ error: 'Target user ID is required' }, 400);
    }

    const requestId = crypto.randomUUID();
    const connectionRequest = {
      id: requestId,
      fromUserId: user.id,
      toUserId: targetUserId,
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`connection:${requestId}`, connectionRequest);

    // Create notification for target user
    const notificationId = crypto.randomUUID();
    const notification = {
      id: notificationId,
      userId: targetUserId,
      type: 'connection_request',
      fromUserId: user.id,
      message: `sent you a connection request`,
      read: false,
      createdAt: new Date().toISOString()
    };
    await kv.set(`notification:${notificationId}`, notification);

    return c.json({ connectionRequest, message: 'Connection request sent' });
  } catch (error) {
    console.error('Send connection request error:', error);
    return c.json({ error: 'Failed to send connection request' }, 500);
  }
});

// Get user connections
app.get("/make-server-73b87161/connections", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const allConnections = await kv.getByPrefix('connection:');
    const userConnections = (allConnections || []).filter(conn => 
      (conn.fromUserId === user.id || conn.toUserId === user.id) &&
      conn.status === 'accepted'
    );

    return c.json({ connections: userConnections });
  } catch (error) {
    console.error('Get connections error:', error);
    return c.json({ error: 'Failed to fetch connections' }, 500);
  }
});

// ===== MESSAGE ROUTES =====

// Send message
app.post("/make-server-73b87161/messages", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { recipientId, subject, content } = await c.req.json();
    
    if (!recipientId || !content) {
      return c.json({ error: 'Recipient and content are required' }, 400);
    }

    const messageId = crypto.randomUUID();
    const message = {
      id: messageId,
      fromUserId: user.id,
      toUserId: recipientId,
      subject: subject || '',
      content,
      read: false,
      createdAt: new Date().toISOString()
    };

    await kv.set(`message:${messageId}`, message);

    // Create notification for recipient
    const notificationId = crypto.randomUUID();
    const notification = {
      id: notificationId,
      userId: recipientId,
      type: 'message',
      fromUserId: user.id,
      message: `sent you a message`,
      read: false,
      createdAt: new Date().toISOString()
    };
    await kv.set(`notification:${notificationId}`, notification);

    return c.json({ message: message, status: 'Message sent successfully' });
  } catch (error) {
    console.error('Send message error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// Get user messages
app.get("/make-server-73b87161/messages", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const allMessages = await kv.getByPrefix('message:');
    const userMessages = (allMessages || []).filter(msg => 
      msg.toUserId === user.id || msg.fromUserId === user.id
    );

    // Sort by creation date (newest first)
    userMessages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ messages: userMessages });
  } catch (error) {
    console.error('Get messages error:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

// ===== NOTIFICATION ROUTES =====

// Get user notifications
app.get("/make-server-73b87161/notifications", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const allNotifications = await kv.getByPrefix('notification:');
    const userNotifications = (allNotifications || []).filter(notif => 
      notif.userId === user.id
    );

    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ notifications: userNotifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Mark notification as read
app.put("/make-server-73b87161/notifications/:id/read", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const id = c.req.param('id');
    const notification = await kv.get(`notification:${id}`);
    
    if (!notification) {
      return c.json({ error: 'Notification not found' }, 404);
    }

    if (notification.userId !== user.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    notification.read = true;
    await kv.set(`notification:${id}`, notification);

    return c.json({ notification });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return c.json({ error: 'Failed to update notification' }, 500);
  }
});

// ===== SEARCH ROUTES =====

// Search users
app.get("/make-server-73b87161/search/users", async (c) => {
  try {
    const query = c.req.query('q');
    const interest = c.req.query('interest');
    
    const allUsers = await kv.getByPrefix('user:');
    let users = allUsers || [];

    // Filter by search query
    if (query) {
      const queryLower = query.toLowerCase();
      users = users.filter(user => 
        user.name?.toLowerCase().includes(queryLower) ||
        user.email?.toLowerCase().includes(queryLower) ||
        user.organization?.toLowerCase().includes(queryLower)
      );
    }

    // Filter by interest
    if (interest) {
      users = users.filter(user => 
        user.interests && user.interests.includes(interest)
      );
    }

    // Don't return sensitive info
    users = users.map(user => ({
      id: user.id,
      name: user.name,
      bio: user.bio,
      location: user.location,
      organization: user.organization,
      interests: user.interests,
      verified: user.verified
    }));

    return c.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    return c.json({ error: 'Failed to search users' }, 500);
  }
});

// ===== EVENT ROUTES =====

// Get all events
app.get("/make-server-73b87161/events", async (c) => {
  try {
    const type = c.req.query('type');
    const location = c.req.query('location');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');
    const search = c.req.query('search');
    
    const allEvents = await kv.getByPrefix('event:');
    let events = allEvents || [];

    // Filter by type if provided
    if (type && type !== 'all') {
      events = events.filter(event => event.type === type);
    }

    // Filter by location if provided (simple contains match)
    if (location) {
      const locationLower = location.toLowerCase();
      events = events.filter(event => 
        event.location?.toLowerCase().includes(locationLower)
      );
    }

    // Filter by date range if provided
    if (startDate) {
      events = events.filter(event => 
        new Date(event.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      events = events.filter(event => 
        new Date(event.date) <= new Date(endDate)
      );
    }

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(event => 
        event.title?.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.organizerName?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (earliest first)
    events.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return c.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// Get single event
app.get("/make-server-73b87161/events/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const event = await kv.get(`event:${id}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    return c.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    return c.json({ error: 'Failed to fetch event' }, 500);
  }
});

// Create new event
app.post("/make-server-73b87161/events", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { 
      title, 
      description, 
      type, 
      location, 
      latitude,
      longitude,
      date, 
      endDate,
      time,
      endTime,
      maxAttendees,
      image,
      tags,
      isVirtual,
      virtualLink
    } = await c.req.json();
    
    if (!title || !description || !type || !date) {
      return c.json({ error: 'Title, description, type, and date are required' }, 400);
    }

    if (!isVirtual && !location) {
      return c.json({ error: 'Location is required for in-person events' }, 400);
    }

    // Get user profile for organizer info
    const userProfile = await kv.get(`user:${user.id}`);

    const eventId = crypto.randomUUID();
    const event = {
      id: eventId,
      title,
      description,
      type,
      location: location || null,
      latitude: latitude || null,
      longitude: longitude || null,
      date,
      endDate: endDate || null,
      time: time || null,
      endTime: endTime || null,
      creatorId: user.id,
      organizerName: userProfile?.name || 'Unknown',
      organizerOrganization: userProfile?.organization || null,
      attendees: [user.id],
      attendeeCount: 1,
      maxAttendees: maxAttendees || null,
      image: image || null,
      tags: tags || [],
      isVirtual: isVirtual || false,
      virtualLink: virtualLink || null,
      createdAt: new Date().toISOString()
    };

    await kv.set(`event:${eventId}`, event);

    return c.json({ event, message: 'Event created successfully' });
  } catch (error) {
    console.error('Create event error:', error);
    return c.json({ error: 'Failed to create event' }, 500);
  }
});

// Join event
app.post("/make-server-73b87161/events/:id/join", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const id = c.req.param('id');
    const event = await kv.get(`event:${id}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    // Check if already attending
    if (event.attendees.includes(user.id)) {
      return c.json({ error: 'Already registered for this event' }, 400);
    }

    // Check if event is full
    if (event.maxAttendees && event.attendeeCount >= event.maxAttendees) {
      return c.json({ error: 'Event is full' }, 400);
    }

    // Add user to event
    event.attendees.push(user.id);
    event.attendeeCount = event.attendees.length;
    await kv.set(`event:${id}`, event);

    return c.json({ event, message: 'Successfully registered for event' });
  } catch (error) {
    console.error('Join event error:', error);
    return c.json({ error: 'Failed to join event' }, 500);
  }
});

// Leave event
app.post("/make-server-73b87161/events/:id/leave", async (c) => {
  const { user, error } = await verifyUser(c.req.header('Authorization'));
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const id = c.req.param('id');
    const event = await kv.get(`event:${id}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    // Check if user is the creator
    if (event.creatorId === user.id) {
      return c.json({ error: 'Event creator cannot leave the event' }, 400);
    }

    // Check if user is attending
    if (!event.attendees.includes(user.id)) {
      return c.json({ error: 'Not registered for this event' }, 400);
    }

    // Remove user from event
    event.attendees = event.attendees.filter(id => id !== user.id);
    event.attendeeCount = event.attendees.length;
    await kv.set(`event:${id}`, event);

    return c.json({ event, message: 'Successfully left event' });
  } catch (error) {
    console.error('Leave event error:', error);
    return c.json({ error: 'Failed to leave event' }, 500);
  }
});

// Get event attendees
app.get("/make-server-73b87161/events/:id/attendees", async (c) => {
  try {
    const id = c.req.param('id');
    const event = await kv.get(`event:${id}`);
    
    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    // Get all attendee profiles
    const attendeeProfiles = await Promise.all(
      event.attendees.map(async (userId) => {
        const profile = await kv.get(`user:${userId}`);
        if (!profile) return null;
        
        return {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatar,
          organization: profile.organization,
          verified: profile.verified
        };
      })
    );

    // Filter out null values
    const validAttendees = attendeeProfiles.filter(profile => profile !== null);

    return c.json({ attendees: validAttendees });
  } catch (error) {
    console.error('Get event attendees error:', error);
    return c.json({ error: 'Failed to fetch event attendees' }, 500);
  }
});

Deno.serve(app.fetch);
