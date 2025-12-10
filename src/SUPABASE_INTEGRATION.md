# Supabase Integration Guide

## Overview

Your Earth platform is now fully integrated with Supabase, providing real authentication, database storage, and real-time features. The platform uses a three-tier architecture:

```
Frontend (React) → Server (Hono/Deno) → Database (Supabase KV Store)
```

## Features Implemented

### ✅ Authentication
- **Sign Up**: Create new accounts with email/password
- **Sign In**: Authenticate existing users
- **Session Management**: Automatic session restoration on page load
- **Sign Out**: Secure logout functionality

### ✅ User Profiles
- **Profile Management**: Update bio, location, organization
- **Interests**: Select from 7 climate categories (Energy, Food, Mobility, Industry, Technology, Policy, Nature)
- **Profile Data**: All user data persisted to Supabase
- **Verification Status**: Track verified profiles

### ✅ Community Features
- **Browse Communities**: Filter by category and search
- **Create Communities**: Users can create their own communities
- **Join Communities**: One-click community joining
- **Member Tracking**: Track community membership

### ✅ Discussions
- **Create Discussions**: Post new topics with categories
- **View Discussions**: Browse all discussions with filters
- **Community Discussions**: Link discussions to specific communities

### ✅ Social Features
- **Connection Requests**: Send and manage connection requests
- **Messaging**: Send direct messages to other users
- **Notifications**: Real-time notifications for connections and messages

### ✅ Search
- **User Search**: Find users by name, email, organization
- **Filter by Interest**: Discover users with shared climate interests

## Getting Started

### 1. First Time Setup

When you first load the application:

1. Click **"Create one now"** on the login page
2. Fill in your details:
   - First Name
   - Last Name
   - Email
   - Password
   - Location (optional)
   - Expertise area (optional)
3. Click **"Create Account"**
4. You'll be automatically signed in

### 2. Using the Platform

#### Profile Setup
1. Navigate to your profile (click your avatar in the header)
2. Go to the **Settings** tab
3. Update your:
   - Location
   - Organization
   - Bio
4. Click **"Save Changes"**

#### Managing Interests
1. Go to profile → **Interests** tab
2. Click on any of the 7 categories to toggle:
   - ⚡ Energy
   - 🍽️ Food
   - 🚗 Mobility
   - 🏭 Industry
   - 💻 Technology
   - ⚖️ Policy
   - 🌲 Nature
3. Interests are saved automatically

#### Creating Communities
1. Navigate to **Community** page
2. Click **"Create Community"** button
3. Fill in:
   - Community name
   - Description
   - Category
   - Public/Private setting
4. Click **"Create Community"**

#### Joining Communities
1. Browse communities on the **Community** page
2. Click **"Join"** on any community card
3. Confirm in the dialog

#### Starting Discussions
1. Go to **Community** page
2. Click **"New Discussion"**
3. Fill in title, content, and category
4. Click **"Post Discussion"**

#### Connecting with Users
1. Find users through search or community pages
2. Click **"Connect"** on their profile
3. Add an optional message
4. Wait for them to accept

#### Messaging
1. Go to a user's profile
2. Click **"Message"**
3. Write your message
4. Click **"Send Message"**

## Data Persistence

All data is automatically saved to Supabase:

- **User Profiles**: `/auth/profile` endpoint
- **Communities**: `/communities` endpoints
- **Discussions**: `/discussions` endpoints
- **Messages**: `/messages` endpoints
- **Notifications**: `/notifications` endpoints
- **Connections**: `/connections` endpoints

## Backend API Routes

### Authentication
- `POST /make-server-73b87161/auth/signup` - Create new user
- `GET /make-server-73b87161/auth/profile` - Get current user profile
- `PUT /make-server-73b87161/auth/profile` - Update user profile

### Communities
- `GET /make-server-73b87161/communities` - List all communities (with filters)
- `GET /make-server-73b87161/communities/:id` - Get single community
- `POST /make-server-73b87161/communities` - Create new community
- `POST /make-server-73b87161/communities/:id/join` - Join a community

### Discussions
- `GET /make-server-73b87161/discussions` - List discussions (with filters)
- `POST /make-server-73b87161/discussions` - Create new discussion

### Social
- `POST /make-server-73b87161/connections/request` - Send connection request
- `GET /make-server-73b87161/connections` - Get user connections
- `POST /make-server-73b87161/messages` - Send message
- `GET /make-server-73b87161/messages` - Get user messages

### Notifications
- `GET /make-server-73b87161/notifications` - Get user notifications
- `PUT /make-server-73b87161/notifications/:id/read` - Mark notification as read

### Search
- `GET /make-server-73b87161/search/users` - Search for users

## Technical Details

### Frontend API Client
Location: `/utils/api.tsx`

The API client handles:
- Authentication token management
- Request/response formatting
- Error handling
- Automatic token inclusion in requests

### Supabase Client
Location: `/utils/supabase/client.tsx`

Singleton Supabase client for:
- Authentication flows
- Session management

### Server
Location: `/supabase/functions/server/index.tsx`

Hono web server with:
- CORS enabled
- Request logging
- Authentication middleware
- Error handling

### Data Storage
Uses Supabase KV Store (key-value table):
- `user:{userId}` - User profiles
- `community:{communityId}` - Communities
- `discussion:{discussionId}` - Discussions
- `connection:{connectionId}` - Connection requests
- `message:{messageId}` - Direct messages
- `notification:{notificationId}` - User notifications

## Security

- **Password Encryption**: Handled automatically by Supabase Auth
- **Email Confirmation**: Auto-confirmed (no email server configured for demo)
- **Access Tokens**: JWT tokens for authenticated requests
- **Protected Routes**: Server validates tokens for sensitive operations
- **Service Role Key**: Never exposed to frontend

## Session Management

The app automatically:
1. Checks for existing session on page load
2. Restores user data if session is valid
3. Redirects to login if session expired
4. Stores auth token in localStorage

## Known Limitations

1. **No Email Server**: Email confirmation is auto-confirmed
2. **Basic KV Storage**: Using key-value store instead of relational database
3. **No Real-time Updates**: Manual refresh needed to see new data
4. **No File Upload**: Avatar images use placeholder service
5. **Demo Data**: Some features still show mock data (climate data, learning modules)

## Troubleshooting

### "Unauthorized" Errors
- Sign out and sign back in
- Check if session has expired
- Verify you're signed in before accessing protected features

### Data Not Saving
- Check browser console for errors
- Ensure you're signed in
- Verify network connection

### Can't Sign In
- Verify email and password are correct
- Make sure you created an account first
- Try signing up with a new account

## Next Steps

To extend the platform:

1. **Add Real-time Features**: Use Supabase Realtime for live updates
2. **File Upload**: Implement Supabase Storage for avatars and media
3. **Advanced Search**: Add full-text search capabilities
4. **Email Notifications**: Configure email server for notifications
5. **Analytics**: Track user engagement and platform metrics
6. **Social Login**: Add Google/GitHub OAuth (see server comments)

## Support

For issues or questions:
1. Check browser console for errors
2. Review this documentation
3. Check the server logs in Supabase dashboard
4. Verify API endpoints are accessible

---

**Status**: ✅ Fully Integrated and Operational
**Last Updated**: October 2025
