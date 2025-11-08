import { useState } from 'react';
import { Navigation } from './components/navigation';
import { Footer } from './components/footer';
import { HomePage } from './components/home-page';
import { DirectoryPage } from './components/directory-page';
import { BecomePartner } from './components/become-partner';
import { BusinessDashboard } from './components/business-dashboard';
import { DistributionPartner } from './components/distribution-partner';
import { ListingDetail } from './components/listing-detail';
import { UserAuth } from './components/user-auth';
import { SavedDeals } from './components/saved-deals';
import { UserDashboard } from './components/user-dashboard';
import { TermsOfService } from './components/terms-of-service';
import { PrivacyPolicy } from './components/privacy-policy';
import { CookiePolicy } from './components/cookie-policy';
import { AboutUs } from './components/about-us';
import { HelpCenter } from './components/help-center';
import { PricingPlans } from './components/pricing-plans';
import { CookieConsent } from './components/cookie-consent';
import { Settings } from './components/settings';
import { ContactUs } from './components/contact-us';
import { ListYourBusiness } from './components/list-your-business';
import { ManageYourListing } from './components/manage-your-listing';
import { PartnerDashboardLogin } from './components/partner-dashboard-login';
import { mockBusinesses } from './components/mock-data';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'directory' | 'become-partner' | 'dashboard' | 'distribution-partner' | 'listing-detail' | 'login' | 'saved-deals' | 'user-dashboard' | 'terms' | 'privacy' | 'cookies' | 'about' | 'help' | 'pricing' | 'settings' | 'contact-us' | 'list-your-business' | 'manage-your-listing' | 'partner-dashboard-login';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isBusinessLoggedIn, setIsBusinessLoggedIn] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  
  // User account state
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [savedDeals, setSavedDeals] = useState<string[]>([]);
  const [userType, setUserType] = useState<'user' | 'partner' | 'distribution' | 'admin'>('user');
  
  // Listing detail state
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  
  // Category navigation state
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  // Location navigation state
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  
  // Cookie consent state
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  
  // Business login default tab state
  const [businessLoginTab, setBusinessLoginTab] = useState<'login' | 'signup'>('login');
  
  // Partner login default tab state
  const [partnerLoginTab, setPartnerLoginTab] = useState<'login' | 'signup'>('login');
  
  // Track previous page for back navigation
  const [previousPage, setPreviousPage] = useState<Page>('home');
  
  // Theme state - removed, no longer using dark mode

  const handleBusinessSignup = (id: string) => {
    setBusinessId(id);
    setIsBusinessLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleUserLogin = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    setIsUserLoggedIn(true);
    setCurrentPage('directory');
  };

  const handleUserLogout = () => {
    setIsUserLoggedIn(false);
    setUserName('');
    setUserEmail('');
    setSavedDeals([]);
    setCurrentPage('directory');
  };

  const handleViewListing = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setCurrentPage('listing-detail');
  };

  const handleToggleSaveDeal = (businessId: string) => {
    setSavedDeals(prev => {
      if (prev.includes(businessId)) {
        return prev.filter(id => id !== businessId);
      } else {
        return [...prev, businessId];
      }
    });
  };

  const handleLoginRequired = () => {
    setCurrentPage('login');
  };

  const handleNavigate = (page: Page, category?: string, location?: string) => {
    setCurrentPage(page);
    if (page === 'directory') {
      setSelectedCategory(category);
      setSelectedLocation(location);
    }
    // Reset business login tab to login when navigating to manage-your-listing from footer/other places
    if (page === 'manage-your-listing') {
      setBusinessLoginTab('login');
    }
    // Reset partner login tab to login when navigating to partner-dashboard-login from footer (Partner Dashboard button)
    if (page === 'partner-dashboard-login') {
      setPartnerLoginTab('login');
    }
  };

  const handleCookieAccept = () => {
    setShowCookieConsent(false);
    // Cookie accepted logic
  };

  const handleCookieDecline = () => {
    setShowCookieConsent(false);
    // Cookie declined logic
  };

  const handleDashboardTypeChange = (type: 'user' | 'partner' | 'distribution' | 'admin') => {
    setUserType(type);
  };

  const handleToggleTheme = () => {
    // No longer using dark mode
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        isLoggedIn={isBusinessLoggedIn}
        isUserLoggedIn={isUserLoggedIn}
        userName={userName}
        onLogout={handleUserLogout}
        isDarkMode={false}
        onToggleTheme={handleToggleTheme}
      />
      
      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} onViewListing={handleViewListing} />
      )}
      {currentPage === 'directory' && (
        <DirectoryPage onViewListing={handleViewListing} initialCategory={selectedCategory} initialLocation={selectedLocation} />
      )}
      {currentPage === 'become-partner' && (
        <BecomePartner 
          onSignupComplete={handleBusinessSignup}
          onBack={isUserLoggedIn && userType === 'partner' ? () => setCurrentPage('user-dashboard') : undefined}
        />
      )}
      {currentPage === 'dashboard' && (
        <BusinessDashboard 
          businessId={businessId}
          onNavigate={(page) => {
            setPreviousPage('dashboard');
            setCurrentPage(page);
          }}
        />
      )}
      {currentPage === 'distribution-partner' && (
        <DistributionPartner onGetStarted={() => {
          setPartnerLoginTab('signup');
          setCurrentPage('partner-dashboard-login');
        }} />
      )}
      {currentPage === 'listing-detail' && selectedBusinessId && (
        <ListingDetail
          businessId={selectedBusinessId}
          businesses={mockBusinesses}
          onBack={() => setCurrentPage('directory')}
          isUserLoggedIn={isUserLoggedIn}
          onLoginRequired={handleLoginRequired}
          savedDeals={savedDeals}
          onToggleSave={handleToggleSaveDeal}
        />
      )}
      {currentPage === 'login' && (
        <UserAuth
          onLogin={handleUserLogin}
          onCancel={() => setCurrentPage('directory')}
          businessLoginTab={businessLoginTab}
          setBusinessLoginTab={setBusinessLoginTab}
        />
      )}
      {currentPage === 'saved-deals' && (
        <SavedDeals
          savedDealIds={savedDeals}
          businesses={mockBusinesses}
          onRemoveDeal={handleToggleSaveDeal}
          onViewListing={handleViewListing}
          onBack={() => setCurrentPage('user-dashboard')}
        />
      )}
      {currentPage === 'user-dashboard' && (
        <UserDashboard
          userType={userType}
          userName={userName}
          savedDeals={savedDeals}
          onNavigate={handleNavigate}
          onDashboardTypeChange={handleDashboardTypeChange}
          isUserLoggedIn={isUserLoggedIn}
          onToggleSave={handleToggleSaveDeal}
        />
      )}
      {currentPage === 'settings' && (
        <Settings
          onBack={() => setCurrentPage('user-dashboard')}
          userName={userName}
          userEmail={userEmail}
          isDarkMode={false}
          onToggleTheme={handleToggleTheme}
          userType={userType === 'distribution' ? 'distribution' : userType === 'partner' ? 'business' : 'regular'}
          hasWhiteLabel={userType === 'distribution'}
        />
      )}
      {currentPage === 'terms' && (
        <TermsOfService onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'privacy' && (
        <PrivacyPolicy onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'cookies' && (
        <CookiePolicy onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'about' && (
        <AboutUs onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'help' && (
        <HelpCenter onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'pricing' && (
        <PricingPlans onBack={() => setCurrentPage(previousPage)} />
      )}
      {currentPage === 'contact-us' && (
        <ContactUs onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'list-your-business' && (
        <ListYourBusiness 
          onBack={() => setCurrentPage('home')} 
          onGetStarted={() => {
            setBusinessLoginTab('signup');
            setCurrentPage('manage-your-listing');
          }}
        />
      )}
      {currentPage === 'manage-your-listing' && (
        <ManageYourListing 
          onBack={() => setCurrentPage('directory')} 
          onLogin={() => setCurrentPage('dashboard')}
          defaultTab={businessLoginTab}
        />
      )}
      {currentPage === 'partner-dashboard-login' && (
        <PartnerDashboardLogin 
          onBack={() => setCurrentPage('directory')} 
          onDistributionLogin={() => setCurrentPage('user-dashboard')}
          defaultTab={partnerLoginTab}
        />
      )}
      
      <Footer onNavigate={(page) => handleNavigate(page)} />
      <Toaster />
      {showCookieConsent && (
        <CookieConsent 
          onAccept={handleCookieAccept} 
          onDecline={handleCookieDecline}
          onViewPolicy={() => handleNavigate('cookies')}
        />
      )}
    </div>
  );
}