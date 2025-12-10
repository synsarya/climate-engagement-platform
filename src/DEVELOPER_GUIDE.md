# Developer Guide - Your Earth Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Deno runtime
- Supabase account
- Basic knowledge of React and TypeScript

### Environment Setup

Create environment variables (already configured in Supabase):
```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=your-database-url
```

### Running the Application

The application is deployed on Supabase and runs automatically. No local setup required.

## 📁 Project Structure

```
/
├── App.tsx                    # Main application component
├── components/
│   ├── pages/                 # All page components
│   │   ├── HomePage.tsx
│   │   ├── ActionPage.tsx
│   │   ├── CommunityPage.tsx
│   │   └── ...
│   ├── ui/                    # Shadcn UI components
│   ├── ActionHub.tsx          # Action hub component
│   ├── Header.tsx             # Main navigation
│   ├── ErrorBoundary.tsx      # Error handling
│   └── ScrollToTop.tsx        # UX enhancement
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx      # Edge function server
│           └── kv_store.tsx   # Database utilities
├── utils/
│   ├── api.tsx                # Frontend API client
│   ├── pageTitle.tsx          # Page title helper
│   └── supabase/              # Supabase client
└── styles/
    └── globals.css            # Global styles
```

## 🔧 Key Technologies

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion** - Animations
- **Shadcn/ui** - Component library

### Backend
- **Supabase** - BaaS platform
- **Hono** - Web framework
- **Deno** - Runtime environment

## 🎨 Adding New Pages

### 1. Create Page Component

```tsx
// components/pages/NewPage.tsx
import { Button } from "../ui/button";

interface NewPageProps {
  onNavigate: (page: string) => void;
  user?: any;
}

export function NewPage({ onNavigate, user }: NewPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1>New Page</h1>
      <Button onClick={() => onNavigate('home')}>
        Go Home
      </Button>
    </div>
  );
}
```

### 2. Add Route in App.tsx

```tsx
// Import the component
import { NewPage } from "./components/pages/NewPage";

// Add case in renderPage()
case 'new-page':
  return <NewPage onNavigate={handleNavigate} user={user} />;
```

### 3. Add Navigation Link

```tsx
// In any component
<Button onClick={() => onNavigate('new-page')}>
  Go to New Page
</Button>
```

### 4. Add Page Title

```tsx
// utils/pageTitle.tsx
'new-page': 'New Page - Your Earth',
```

## 🗄️ Working with Data

### Frontend API Calls

```tsx
import { apiRequest } from './utils/api';

// GET request
const data = await apiRequest('/api/communities');

// POST request
const result = await apiRequest('/api/communities', {
  method: 'POST',
  body: { name: 'New Community', category: 'energy' }
});
```

### Backend Routes

```tsx
// supabase/functions/server/index.tsx

app.get('/make-server-73b87161/api/endpoint', async (c) => {
  // Your logic here
  return c.json({ data: 'response' });
});

app.post('/make-server-73b87161/api/endpoint', async (c) => {
  const body = await c.req.json();
  // Your logic here
  return c.json({ success: true });
});
```

### Using Key-Value Store

```tsx
import * as kv from './kv_store.tsx';

// Set a value
await kv.set('user:123', { name: 'John', email: 'john@example.com' });

// Get a value
const user = await kv.get('user:123');

// Get multiple values
const users = await kv.mget(['user:123', 'user:456']);

// Get by prefix
const allUsers = await kv.getByPrefix('user:');

// Delete a value
await kv.del('user:123');
```

## 🎭 Using UI Components

### Shadcn Components

All Shadcn components are pre-installed in `/components/ui/`:

```tsx
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";

// Use them
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="Enter text" />
    <Button>Submit</Button>
    <Badge>New</Badge>
  </CardContent>
</Card>
```

### Toast Notifications

```tsx
import { toast } from "sonner@2.0.3";

// Success
toast.success("Action completed!");

// Error
toast.error("Something went wrong");

// Info
toast.info("Here's some information");

// Custom
toast("Custom message", {
  description: "With a description",
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

### Icons

```tsx
import { Heart, Star, Users } from "lucide-react";

<Heart className="h-5 w-5 text-red-500" />
<Star className="h-4 w-4" />
<Users className="h-6 w-6" />
```

## 🔐 Authentication

### Checking Auth Status

```tsx
// User is available via props
interface PageProps {
  user?: any; // null if not logged in
}

// In component
if (!user) {
  // Show login prompt
  onNavigate('login');
} else {
  // User is authenticated
  console.log(user.name);
}
```

### Sign Up

```tsx
import { signUp } from './utils/api';

const result = await signUp(
  email,
  password,
  name,
  location,
  organization,
  interests
);

if (result.user) {
  onAuthSuccess(result.user);
}
```

### Sign In

```tsx
import { signIn } from './utils/api';

const result = await signIn(email, password);

if (result.user) {
  onAuthSuccess(result.user);
}
```

### Sign Out

```tsx
import { signOut } from './utils/api';

await signOut();
setUser(null);
onNavigate('home');
```

## 🎨 Styling Guidelines

### Tailwind Classes

```tsx
// Use semantic color tokens
<div className="bg-background text-foreground">
  <div className="bg-primary text-primary-foreground">Primary</div>
  <div className="bg-muted text-muted-foreground">Muted</div>
  <div className="bg-destructive text-destructive-foreground">Error</div>
</div>

// Spacing
<div className="p-4 m-2 space-y-4">
  <div className="mt-8 mb-4">Content</div>
</div>

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

### Custom Styles

Edit `/styles/globals.css` for global styles and design tokens.

## 🔄 State Management

Currently using React's built-in `useState` and `useEffect`. For complex state:

```tsx
const [data, setData] = useState<DataType[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function loadData() {
    setIsLoading(true);
    try {
      const result = await apiRequest('/api/data');
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  loadData();
}, []);
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Test as guest user
- [ ] Test sign up flow
- [ ] Test login flow
- [ ] Test all navigation links
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Test all forms
- [ ] Test error states
- [ ] Test loading states
- [ ] Verify toast notifications

## 🐛 Debugging

### Common Issues

**1. API calls failing**
- Check network tab in DevTools
- Verify endpoint URL includes `/make-server-73b87161/`
- Check server logs in Supabase dashboard

**2. Authentication issues**
- Check session in localStorage
- Verify Supabase keys are correct
- Check server logs for auth errors

**3. Styling not working**
- Clear browser cache
- Check Tailwind class names are valid
- Verify `globals.css` is imported

### Debug Tools

```tsx
// Console logging
console.log('User:', user);
console.error('Error:', error);

// Toast for debugging
toast.info(`Debug: ${JSON.stringify(data)}`);

// React DevTools
// Install React DevTools browser extension
```

## 📦 Adding Dependencies

Import packages directly in your code:

```tsx
// Most packages
import { something } from 'package-name';

// Specific versions (when required)
import { toast } from 'sonner@2.0.3';
import { useForm } from 'react-hook-form@7.55.0';
```

## 🚀 Deployment

The platform is automatically deployed on Supabase. Any changes pushed will trigger a deployment.

### Environment Variables

Set in Supabase Dashboard → Settings → Edge Functions

## 🔒 Security Best Practices

1. **Never expose service role key** - Only use in server code
2. **Validate user input** - Always sanitize before storing
3. **Use environment variables** - For API keys and secrets
4. **Implement rate limiting** - For API endpoints (future)
5. **Use HTTPS** - Always (handled by Supabase)

## 📊 Performance Tips

1. **Lazy loading** - Use React.lazy for code splitting
2. **Image optimization** - Use ImageWithFallback component
3. **Debounce search** - Don't search on every keystroke
4. **Pagination** - Don't load all data at once
5. **Caching** - Store frequently accessed data

## 🎯 Best Practices

### Component Organization

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from './ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  prop: string;
}

// 3. Component
export function Component({ prop }: ComponentProps) {
  // 4. State
  const [state, setState] = useState('');
  
  // 5. Effects
  useEffect(() => {}, []);
  
  // 6. Handlers
  const handleClick = () => {};
  
  // 7. Render
  return <div>Content</div>;
}
```

### Error Handling

```tsx
try {
  const result = await apiRequest('/endpoint');
  toast.success("Success!");
  // Handle success
} catch (error: any) {
  console.error('Error:', error);
  toast.error(error.message || "An error occurred");
  // Handle error
}
```

### Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

if (isLoading) {
  return <div>Loading...</div>;
}

return <Content />;
```

## 📚 Further Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [Hono Documentation](https://hono.dev)
- [Motion Documentation](https://motion.dev)

## 🤝 Contributing

When adding features:
1. Create component in appropriate folder
2. Add to App.tsx routing
3. Update navigation where needed
4. Test thoroughly
5. Update documentation
6. Deploy and verify

---

**Happy Coding!** 🌍💚
