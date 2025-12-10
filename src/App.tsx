import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToTop } from "./components/ScrollToTop";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { HomePage } from "./components/pages/HomePage";
import { LearnPage } from "./components/pages/LearnPage";
import { CorporateClimateImpactPage } from "./components/pages/CorporateClimateImpactPage";
import { OrganizationDataBankPage } from "./components/pages/OrganizationDataBankPage";
import { ClimateEducationPage } from "./components/pages/ClimateEducationPage";
import { CarbonCalculatorPage } from "./components/pages/CarbonCalculatorPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { SettingsPage } from "./components/pages/SettingsPage";

import { CommunityPage } from "./components/pages/CommunityPage";
import { CommunityNetworkPage } from "./components/pages/CommunityNetworkPage";
import { ActionPage } from "./components/pages/ActionPage";
import { EventsPage } from "./components/pages/EventsPage";
import { CampaignDetailPage } from "./components/pages/CampaignDetailPage";
import { AllCampaignsPage } from "./components/pages/AllCampaignsPage";
import { ImpactReportPage } from "./components/pages/ImpactReportPage";
import { AchievementsPage } from "./components/pages/AchievementsPage";
import { QuickActionPage } from "./components/pages/QuickActionPage";
import { JobsPage } from "./components/pages/JobsPage";
import { MarketplacePage } from "./components/pages/MarketplacePage";
import { LoginPage } from "./components/pages/LoginPage";
import { SignUpPage } from "./components/pages/SignUpPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { getCurrentSession, getProfile } from "./utils/api";
import { Toaster } from "./components/ui/sonner";
import { updatePageTitle } from "./utils/pageTitle";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
    updatePageTitle(currentPage);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const session = await getCurrentSession();
      
      if (session) {
        const { profile } = await getProfile();
        
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: profile.name,
          location: profile.location || "",
          bio: profile.bio || "",
          organization: profile.organization || "",
          interests: profile.interests || [],
          verified: profile.verified || false,
          communities: profile.communities || [],
          connections: profile.connections || [],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
        };
        
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    updatePageTitle(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    const { signOut } = await import('./utils/api');
    await signOut();
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'learn':
        return <LearnPage onNavigate={handleNavigate} user={user} />;
      case 'learn-databank':
        return <OrganizationDataBankPage onNavigate={handleNavigate} />;
      case 'learn-corporate':
        return <CorporateClimateImpactPage onNavigate={handleNavigate} />;
      case 'learn-education':
        return <ClimateEducationPage onNavigate={handleNavigate} />;
      case 'learn-calculator':
        return <CarbonCalculatorPage />;
      case 'community':
        return <CommunityPage onNavigate={handleNavigate} />;
      case 'community-network':
        return <CommunityNetworkPage onNavigate={handleNavigate} />;
      case 'community-energy':
        return <CommunityPage category="energy" onNavigate={handleNavigate} />;
      case 'community-food':
        return <CommunityPage category="food" onNavigate={handleNavigate} />;
      case 'community-mobility':
        return <CommunityPage category="mobility" onNavigate={handleNavigate} />;
      case 'community-industry':
        return <CommunityPage category="industry" onNavigate={handleNavigate} />;
      case 'community-technology':
        return <CommunityPage category="technology" onNavigate={handleNavigate} />;
      case 'community-policy':
        return <CommunityPage category="policy" onNavigate={handleNavigate} />;
      case 'community-nature':
        return <CommunityPage category="nature" onNavigate={handleNavigate} />;
      case 'action':
        return <ActionPage onNavigate={handleNavigate} user={user} />;
      case 'events':
        return <EventsPage onNavigate={handleNavigate} user={user} />;
      case 'campaign-detail':
        return <CampaignDetailPage onNavigate={handleNavigate} user={user} />;
      case 'all-campaigns':
        return <AllCampaignsPage onNavigate={handleNavigate} user={user} />;
      case 'impact-report':
        return <ImpactReportPage onNavigate={handleNavigate} user={user} />;
      case 'achievements':
        return <AchievementsPage onNavigate={handleNavigate} user={user} />;
      case 'quick-action':
        return <QuickActionPage onNavigate={handleNavigate} user={user} />;
      case 'jobs':
        return <JobsPage onNavigate={handleNavigate} user={user} />;
      case 'marketplace':
        return <MarketplacePage onNavigate={handleNavigate} user={user} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
      case 'signup':
        return <SignUpPage onNavigate={handleNavigate} onAuthSuccess={handleAuthSuccess} />;
      case 'profile':
        return <ProfilePage user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage user={user} onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} user={user} />;
    }
  };
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Your Earth...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Toaster />
        <ScrollToTop />
        <KeyboardShortcuts onNavigate={handleNavigate} user={user} />
        <Header 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          user={user}
          onLogout={handleLogout}
        />
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      
      <footer className="bg-muted/50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium">Your Earth</h3>
              <p className="text-sm text-muted-foreground">
                Empowering global climate action through community, knowledge, and technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Learn</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('learn-education')}>Climate Science</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('learn')}>Renewable Energy</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('learn')}>Policy & Advocacy</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('learn-calculator')}>Carbon Calculator</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('community')}>Communities</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('community-network')}>Network</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('community')}>Forums</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('action')}>Events</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Act</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('all-campaigns')}>Campaigns</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('quick-action')}>Quick Actions</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => handleNavigate('home')}>Climate Data</li>
                <li className="cursor-pointer hover:text-foreground transition-colors" onClick={() => user ? handleNavigate('impact-report') : handleNavigate('signup')}>Impact Tracking</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 Your Earth. Built with climate urgency and technological optimism.
          </div>
        </div>
      </footer>
      </div>
    </ErrorBoundary>
  );
}