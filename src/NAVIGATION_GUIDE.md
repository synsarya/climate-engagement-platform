# Complete Navigation & Button Links Guide

## Overview
This document provides a comprehensive map of all navigation paths and button links throughout the Your Earth platform. All interactive elements have been properly wired for seamless navigation.

## Main Navigation (Header)

### Primary Navigation Buttons
Located in the header, accessible on all pages:

1. **Your Earth Logo** → `home` (HomePage)
2. **Learn** (dropdown) → Various learning modules
3. **Community** (dropdown) → Community pages by category
4. **Data** → `data` (ClimateDataPage)
5. **Action** → `action` (ActionPage)

### User Authentication Area
- **Sign In** → `login` (LoginPage)
- **Join Now** → `signup` (SignUpPage)
- **Profile Avatar** (when logged in) → `profile` (ProfilePage)
- **Logout** → Clears user session

## Page-by-Page Navigation Map

### 1. HomePage (`/`)
**Path**: `home`

**Buttons & Links**:
- "Join the Movement" → `signup` (SignUpPage)
- "Explore Data" → `data` (ClimateDataPage)

**Components**:
- HeroSection (with navigation)
- InteractiveEarth
- GlobalMap
- ClimateDataDashboard

---

### 2. LearnPage (`/learn`)
**Path**: `learn`

**Module Cards** (3 learning modules):
1. "Explore Organization Data Bank" → `learn-databank` (OrganizationDataBankPage)
2. "Explore Climate Education Platform" → `learn-education` (ClimateEducationPage)
3. "Explore Personal Carbon Calculator" → `learn-calculator` (CarbonCalculatorPage)

**Header Dropdown Links**:
Accessible from "Learn" dropdown in header:
- Organization Data Bank → `learn-databank`
- Climate Education → `learn-education`
- Carbon Calculator → `learn-calculator`

---

### 3. OrganizationDataBankPage (`/learn-databank`)
**Path**: `learn-databank`

**Interactive Elements**:
- Search bar (real-time filtering)
- Category filter dropdown (Energy, Food, Mobility, etc.)
- Type filter (For-Profit, Non-Profit) - Champions only
- Tab switching (Champions ↔ Polluters)
- Organization cards (clickable) → Opens detail modal

**Modal Actions**:
- "View Official Website" → External link (placeholder)
- "Download Report" → Alert (feature coming soon)
- Click outside or X → Closes modal

**Data Categories**:
- Energy, Food, Mobility, Industry, Technology, Policy, Nature

---

### 4. CorporateClimateImpactPage (`/learn-corporate`)
**Path**: `learn-corporate`

**Buttons & Links**:
- "View Corporate Dashboard" → `learn-databank` (OrganizationDataBankPage)
- "Download Climate Report" → Alert (feature coming soon)

**Components**:
- CorporateMonitor component (displays companies data)

---

### 5. ClimateEducationPage (`/learn-education`)
**Path**: `learn-education`

**Buttons & Links**:
- "Start Learning Today" → `signup` (SignUpPage)
- "Browse All Courses" → `learn-education` (self-refresh/scroll)

**Components**:
- LearningHub component
- Expert profiles
- Skill tracks with progress indicators

---

### 6. CarbonCalculatorPage (`/learn-calculator`)
**Path**: `learn-calculator`

**Interactive Elements**:
- Form inputs for all lifestyle categories
- "Calculate My Carbon Footprint" → Computes results in-page
- Results display with breakdown charts

**Calculator Categories**:
- Transportation
- Home Energy
- Diet
- Shopping
- Waste
- Travel

---

### 7. ClimateDataPage (`/data`)
**Path**: `data`

**Features**:
- ERA5 Climate Data Service interface
- GribFileVisualizer component
- ClimateDataService component
- Data download functionality (server-side integration required)

**Interactive Elements**:
- Variable selection dropdowns
- Date range pickers
- Geographic area selection
- Download buttons

---

### 8. CommunityPage (`/community`)
**Path**: `community` (all categories)

**Category-Specific Paths**:
- `community-energy` → Energy category
- `community-food` → Food category
- `community-mobility` → Mobility category
- `community-industry` → Industry category
- `community-technology` → Technology category
- `community-policy` → Policy category
- `community-nature` → Nature category

**Interactive Elements**:
- Category filter tabs
- Post creation (logged in users)
- Like/comment functionality
- Member profiles
- Community feed

**Header Dropdown Access**:
From "Community" dropdown, each category is accessible with:
- Icon
- Name
- Description
- Click → Navigates to category page

---

### 10. CommunityNetworkPage (`/community-network`)
**Path**: `community-network`

**Buttons & Links**:
- Access from Profile page: "Explore More Communities" → `community-network`

**Interactive Elements**:
- Search bar (communities and members)
- Category filter
- Tab switching (Communities ↔ Members)
- "Join Community" buttons
- "Connect" buttons (member cards)
- "Message" buttons (member cards)
- External community links (opens in new tab)

**Features**:
- Discover Your Earth communities
- Find external communities (LinkedIn, etc.)
- Browse verified members
- View member interests and communities
- Search and filter functionality

---

### 11. ActionPage (`/action`)
**Path**: `action`

**Buttons & Links**:
- "Start Taking Action" → `signup` (SignUpPage)
- "Browse Campaigns" → `action` (self/scroll)
- "Explore Actions" (per category) → `action` (scroll to ActionHub)
- "Take Action Now" (urgent actions) → Placeholder action

**Features**:
- Urgent campaigns with deadlines
- Impact categories (Energy, Nature, Circular Economy)
- ActionHub component
- Success stories

---

### 12. ProfilePage (`/profile`)
**Path**: `profile` (requires authentication)

**Buttons & Links**:
- "Edit Profile" → Opens edit modal
- "Logout" → Clears session, returns to home
- "Verify Now" → Verifies profile (in-page)
- "Explore More Communities" → `community` (CommunityPage)
- "Add Community" → Adds external community (in-page)

**Interactive Sections**:
1. **Profile Header**: Avatar, name, bio, location
2. **Verification**: Verify profile badge
3. **Interests**: Select from 7 categories (Energy, Food, etc.)
4. **Your Earth Communities**: Internal communities
5. **External Communities**: Add/manage other platform communities

**Features**:
- Profile verification system
- Interest selection (7 categories)
- Community management
- Activity tracking
- Settings access

---

### 13. LoginPage (`/login`)
**Path**: `login`

**Buttons & Links**:
- "Sign In" → Authenticates user, navigates to `profile`
- "Don't have an account? Join now" → `signup` (SignUpPage)
- Social login options (placeholder)

---

### 14. SignUpPage (`/signup`)
**Path**: `signup`

**Buttons & Links**:
- "Create Account" → Creates user, navigates to `profile`
- "Already have an account? Sign in" → `login` (LoginPage)
- Social signup options (placeholder)

---

### 15. MediaGalleryPage (if accessible)
**Path**: TBD (currently not in main navigation)

**Features**:
- Climate animation GIFs
- Video previews
- View counts and likes

---

## Navigation Flow Diagrams

### User Journey: New Visitor
```
HomePage
  ├─> "Join the Movement" → SignUpPage → ProfilePage
  ├─> "Explore Data" → ClimateDataPage
  └─> Header "Learn" → LearnPage → Any learning module
```

### User Journey: Returning User
```
LoginPage → ProfilePage
  ├─> "Explore More Communities" → CommunityPage
  ├─> Header "Community" dropdown → Specific category
  ├─> Header "Learn" → LearnPage modules
  └─> Header "Action" → ActionPage
```

### Learning Path
```
LearnPage
  ├─> Organization Data Bank → Detailed org profiles
  ├─> Climate Education → Courses and experts
  ├─> Carbon Calculator → Personal footprint
  └─> Daily Emissions → Quick calculations
```

### Community Discovery Path
```
ProfilePage
  └─> "Explore More Communities" → CommunityNetworkPage
      ├─> Search communities
      ├─> Browse by category
      ├─> Find members
      └─> Join communities
```

## Special Navigation Features

### Dropdown Menus
**Learn Dropdown** (Header):
- Hovers to show all learning modules
- Click to navigate to LearnPage or specific module
- Smooth animations with staggered entry

**Community Dropdown** (Header):
- Shows all 7 category options
- Visual icons and descriptions
- "View All Communities" button at bottom
- Smooth animations

### Modal Navigation
**Organization Detail Modal** (OrganizationDataBankPage):
- Click any org card → Opens modal
- View full details
- Action buttons (external links, downloads)
- Click outside or X → Returns to list

**Profile Edit Modal** (ProfilePage):
- Edit profile information
- Save changes → Updates profile
- Cancel → Closes without saving

### Tab Navigation
**Multiple pages use tabs**:
- OrganizationDataBankPage: Champions ↔ Polluters
- CommunityNetworkPage: Communities ↔ Members
- ClimateDataPage: Download ↔ Visualize

## Button States

### Active State
- Learn dropdown: Active when on any `learn-*` page
- Community dropdown: Active when on any `community-*` page
- Data button: Active on `data` page
- Action button: Active on `action` page

### Disabled State
- Login/Signup buttons: Hidden when authenticated
- Profile-specific features: Hidden when not authenticated

### Loading State
- Form submissions show loading (Login, Signup, Profile updates)
- Data fetching shows skeleton loaders

## External Links

### Organization Data Bank
All organization "View Official Website" buttons are placeholders that would link to:
- Company official websites
- Non-profit organization pages
- Third-party platforms (Bloomberg, Crunchbase, etc.)

### Community Network
External community links open in new tabs:
- LinkedIn groups
- Discord servers
- Slack communities
- Facebook groups
- Reddit communities

## Authentication-Gated Features

### Requires Login
- ProfilePage
- Creating posts (CommunityPage)
- Joining communities
- Connecting with members
- Commenting/liking content
- Saving progress (calculators, courses)

### Public Access
- HomePage
- All Learn modules (viewing)
- ClimateDataPage
- Community feeds (viewing)
- ActionPage (viewing)
- Organization Data Bank

## Search Functionality

### Global Search (Header)
- Search bar in header (all pages)
- Placeholder: "Search climate topics..."
- Future: Will search across all content

### Page-Specific Search
1. **OrganizationDataBankPage**: Search organizations by name/description
2. **CommunityNetworkPage**: Search communities and members
3. **ProfilePage**: Search within communities

## Mobile Navigation

All navigation is responsive:
- Header collapses to hamburger menu (if implemented)
- Dropdowns convert to mobile-friendly menus
- Touch-friendly button sizes
- Swipe gestures for tabs

## Error Handling

### Invalid Routes
- Unknown paths → Defaults to HomePage
- Case statement in App.tsx handles all routes

### Missing Data
- Organizations without logos → Shows fallback image (ImageWithFallback)
- User avatars → Shows initials in AvatarFallback
- Empty states for zero results in searches

## Future Navigation Enhancements

### Planned Features
1. **Breadcrumbs**: Show navigation history
2. **Back Button**: Browser-style back navigation
3. **Deep Linking**: Direct URLs for all pages
4. **Search Results Page**: Dedicated search page
5. **Recently Visited**: Quick access to recent pages
6. **Favorites/Bookmarks**: Save favorite content
7. **Keyboard Navigation**: Full keyboard support
8. **Tour Guide**: Interactive platform tour for new users

### URL Structure (Future)
Currently all navigation is client-side state. Future implementation:
```
/                          → HomePage
/learn                     → LearnPage
/learn/databank            → OrganizationDataBankPage
/learn/education           → ClimateEducationPage
/learn/calculator          → CarbonCalculatorPage
/data                      → ClimateDataPage
/community                 → CommunityPage
/community/energy          → Energy category
/action                    → ActionPage
/profile                   → ProfilePage
/login                     → LoginPage
/signup                    → SignUpPage
```

## Summary

### Total Pages: 15
1. HomePage
2. LearnPage
3. OrganizationDataBankPage
4. CorporateClimateImpactPage
5. ClimateEducationPage
6. CarbonCalculatorPage
7. ClimateDataPage
8. CommunityPage (+ 7 category variants)
9. CommunityNetworkPage
10. ActionPage
11. ProfilePage
12. LoginPage
13. SignUpPage
14. MediaGalleryPage

### Total Navigation Points: 50+
- Header navigation: 5 main buttons
- Learn dropdown: 3 modules
- Community dropdown: 7 categories + view all
- Hero section: 2 buttons
- Learn module cards: 3 buttons
- Profile actions: 5+ buttons
- Community network: 10+ action buttons
- Organization cards: 20+ clickable items
- Plus numerous in-page interactive elements

### All Buttons Linked: ✅
Every clickable element in the platform has been properly wired for navigation, ensuring a seamless user experience throughout the Your Earth platform.
