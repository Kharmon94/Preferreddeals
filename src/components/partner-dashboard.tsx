import { useState } from 'react';
import { Store, Plus, Eye, Edit, TrendingUp, Phone, Mail, MapPin, Clock, Star, BarChart3, Globe, Tag, Upload, X, GripVertical, ChevronLeft, ChevronRight, DollarSign, Check, CheckCircle, CreditCard, Sparkles, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import {ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface PartnerDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function PartnerDashboard({ userName, onNavigate, onLogout }: PartnerDashboardProps) {
  const [viewListingId, setViewListingId] = useState<string | null>(null);
  const [editListingId, setEditListingId] = useState<string | null>(null);
  const [showCreateDeal, setShowCreateDeal] = useState(false);
  const [showNewBusiness, setShowNewBusiness] = useState(false);
  const [editAmenities, setEditAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [editPhotos, setEditPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('listings');
  const [selectedPlan, setSelectedPlan] = useState('1-month');
  const [newBusinessStep, setNewBusinessStep] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradingBusinessId, setUpgradingBusinessId] = useState<string | null>(null);
  const [listingMarketplaceOptIn, setListingMarketplaceOptIn] = useState<Record<string, boolean>>({
    '1': true,
    '2': false,
  });
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true); // Show welcome modal on first visit
  
  // Payment confirmation state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [useExistingCard, setUseExistingCard] = useState(true);
  const [paymentCardData, setPaymentCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true,
    },
  ]);
  
  const myBusinesses = [
    { 
      id: '1', 
      name: 'Fresh Bistro Downtown', 
      category: 'Restaurant', 
      status: 'Active',
      plan: 'Premium',
      views: 1234,
      clicks: 342,
      contactClicks: 215,
      deals: 3,
      rating: 4.8,
      description: 'Authentic Italian cuisine with a modern twist. Family-owned bistro serving fresh, locally-sourced ingredients.',
      address: '123 Main Street, Downtown',
      phone: '(555) 123-4567',
      email: 'info@freshbistro.com',
      website: 'www.freshbistro.com',
      photos: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
      ],
      hours: {
        monday: '11:00 AM - 10:00 PM',
        tuesday: '11:00 AM - 10:00 PM',
        wednesday: '11:00 AM - 10:00 PM',
        thursday: '11:00 AM - 10:00 PM',
        friday: '11:00 AM - 11:00 PM',
        saturday: '11:00 AM - 11:00 PM',
        sunday: '12:00 PM - 9:00 PM',
      },
      amenities: ['Outdoor Seating', 'Wheelchair Accessible', 'Free Wi-Fi', 'Parking Available'],
    },
    { 
      id: '2', 
      name: 'Fresh Bistro Uptown', 
      category: 'Restaurant', 
      status: 'Active',
      plan: 'Basic',
      views: 856,
      clicks: 189,
      contactClicks: 127,
      deals: 2,
      rating: 4.6,
      description: 'Second location of our popular Fresh Bistro serving the same great Italian dishes in a cozy uptown atmosphere.',
      address: '456 Oak Avenue, Uptown',
      phone: '(555) 234-5678',
      email: 'uptown@freshbistro.com',
      website: 'www.freshbistro.com',
      photos: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      ],
      hours: {
        monday: '11:00 AM - 10:00 PM',
        tuesday: '11:00 AM - 10:00 PM',
        wednesday: '11:00 AM - 10:00 PM',
        thursday: '11:00 AM - 10:00 PM',
        friday: '11:00 AM - 11:00 PM',
        saturday: '11:00 AM - 11:00 PM',
        sunday: '12:00 PM - 9:00 PM',
      },
      amenities: ['Outdoor Seating', 'Free Wi-Fi'],
    },
  ];

  // Premium plans
  const premiumPlans = [
    {
      id: '1-month',
      name: '1 Month Premium',
      price: 49,
      duration: '1 month',
      savings: null,
      features: [
        'Featured business badge',
        'Priority in search results',
        'Unlimited photos',
        'Post unlimited deals',
        'Basic analytics dashboard',
        'Business Marketplace visibility'
      ],
    },
    {
      id: '3-month',
      name: '3 Month Premium',
      price: 99,
      pricePerMonth: 33,
      duration: '3 months',
      savings: 'Save $48',
      features: [
        'All 1 Month features',
        'Save $48 over monthly',
        'Advanced analytics',
        'Priority customer support'
      ],
    },
    {
      id: '1-year',
      name: '1 Year Premium',
      price: 299,
      pricePerMonth: 25,
      duration: '1 year',
      savings: 'Save $289',
      popular: true,
      features: [
        'All 3 Month features',
        'Save $289 over monthly',
        'Dedicated account manager',
        'Custom marketing support'
      ],
    },
  ];

  // Check if user has active premium subscription
  const hasPremiumSubscription = myBusinesses.some(business => business.plan === 'Premium' || business.plan === 'Featured');

  const viewsData = [
    { date: 'Mon', views: 145 },
    { date: 'Tue', views: 168 },
    { date: 'Wed', views: 192 },
    { date: 'Thu', views: 176 },
    { date: 'Fri', views: 234 },
    { date: 'Sat', views: 312 },
    { date: 'Sun', views: 287 },
  ];

  const clicksData = [
    { date: 'Mon', clicks: 32 },
    { date: 'Tue', clicks: 41 },
    { date: 'Wed', clicks: 38 },
    { date: 'Thu', clicks: 45 },
    { date: 'Fri', clicks: 62 },
    { date: 'Sat', clicks: 78 },
    { date: 'Sun', clicks: 65 },
  ];

  const totalStats = myBusinesses.reduce((acc, business) => ({
    views: acc.views + business.views,
    clicks: acc.clicks + business.clicks,
    deals: acc.deals + business.deals,
  }), { views: 0, clicks: 0, deals: 0 });

  const selectedListing = myBusinesses.find(b => b.id === viewListingId);
  const editingListing = myBusinesses.find(b => b.id === editListingId);
  
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  // Initialize edit state when modal opens
  const handleEditOpen = (businessId: string) => {
    const business = myBusinesses.find(b => b.id === businessId);
    if (business) {
      setEditAmenities([...business.amenities]);
      setEditPhotos([...business.photos]);
      setEditListingId(businessId);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setEditAmenities([...editAmenities, newAmenity.trim()]);
      setNewAmenity('');
      toast.success('Amenity added');
    }
  };

  const removeAmenity = (index: number) => {
    setEditAmenities(editAmenities.filter((_, i) => i !== index));
    toast.success('Amenity removed');
  };

  const movePhoto = (fromIndex: number, direction: 'left' | 'right') => {
    const newPhotos = [...editPhotos];
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex >= 0 && toIndex < newPhotos.length) {
      [newPhotos[fromIndex], newPhotos[toIndex]] = [newPhotos[toIndex], newPhotos[fromIndex]];
      setEditPhotos(newPhotos);
    }
  };

  const removePhoto = (index: number) => {
    if (editPhotos.length > 1) {
      setEditPhotos(editPhotos.filter((_, i) => i !== index));
      toast.success('Photo removed');
    } else {
      toast.error('You must have at least one photo');
    }
  };

  const handleOpenUpgradeModal = (businessId: string) => {
    setUpgradingBusinessId(businessId);
    setShowUpgradeModal(true);
  };

  const handleUpgradeToPremium = () => {
    // Close upgrade modal and open payment dialog
    setShowUpgradeModal(false);
    setShowPaymentDialog(true);
    // Set default to use existing card if available
    setUseExistingCard(paymentMethods.length > 0);
  };

  const handleConfirmPayment = () => {
    // Validate payment method
    if (!useExistingCard) {
      if (!paymentCardData.cardNumber || !paymentCardData.expiry || !paymentCardData.cvc || !paymentCardData.name) {
        toast.error('Please fill in all card details.');
        return;
      }
      
      // Add the new card
      const last4 = paymentCardData.cardNumber.slice(-4);
      const cardType = paymentCardData.cardNumber.startsWith('4') ? 'Visa' : 
                       paymentCardData.cardNumber.startsWith('5') ? 'Mastercard' : 'Card';
      
      const newPaymentMethod = {
        id: String(paymentMethods.length + 1),
        type: cardType,
        last4,
        expiry: paymentCardData.expiry,
        isDefault: paymentMethods.length === 0,
      };

      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      setPaymentCardData({ cardNumber: '', expiry: '', cvc: '', name: '' });
    }

    if (upgradingBusinessId) {
      const business = myBusinesses.find(b => b.id === upgradingBusinessId);
      const plan = premiumPlans.find(p => p.id === selectedPlan);
      
      if (business && plan) {
        // In a real app, this would process the payment and update the backend
        toast.success(`"${business.name}" upgraded to ${plan.name}!`);
        setShowPaymentDialog(false);
        setUpgradingBusinessId(null);
        setPaymentCardData({ cardNumber: '', expiry: '', cvc: '', name: '' });
      }
    }
  };

  const handlePaymentCardChange = (field: string, value: string) => {
    setPaymentCardData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="mb-2 text-[20px]">My Business Listings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your business presence and track performance</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setShowNewBusiness(true)} className="flex-1 sm:flex-initial">
            <Plus className="w-4 h-4 mr-2" />
            Add New Business
          </Button>
          {onLogout && (
            <Button variant="outline" onClick={onLogout} className="flex-1 sm:flex-initial">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Store className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Businesses</p>
            <p className="text-2xl sm:text-3xl">{myBusinesses.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Views</p>
            <p className="text-2xl sm:text-3xl">{totalStats.views.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Clicks</p>
            <p className="text-2xl sm:text-3xl">{totalStats.clicks}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Active Deals</p>
            <p className="text-2xl sm:text-3xl">{totalStats.deals}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        {/* Slider Navigation */}
        <div className="space-y-3 sm:space-y-4">
          {/* Tab Name with Arrows */}
          <div className="relative text-center">
            <h2 className="text-xl sm:text-2xl capitalize">
              {activeTab === 'listings' ? 'My Listings' : activeTab}
            </h2>
            
            {/* Navigation Arrows */}
            <button
              onClick={() => {
                const tabs = ['listings', 'analytics', 'deals', 'billing'];
                const currentIndex = tabs.indexOf(activeTab);
                const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
                setActiveTab(tabs[prevIndex]);
              }}
              className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 size-8 sm:size-10 rounded-full bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-900 flex items-center justify-center shadow-sm transition-all"
              aria-label="Previous section"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <button
              onClick={() => {
                const tabs = ['listings', 'analytics', 'deals', 'billing'];
                const currentIndex = tabs.indexOf(activeTab);
                const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
                setActiveTab(tabs[nextIndex]);
              }}
              className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 size-8 sm:size-10 rounded-full bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-900 flex items-center justify-center shadow-sm transition-all"
              aria-label="Next section"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Carousel Indicators (Dots) */}
          <div className="flex justify-center gap-2">
            {['listings', 'analytics', 'deals', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-2 rounded-full transition-all ${
                  tab === activeTab 
                    ? 'w-8 bg-black' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to ${tab === 'listings' ? 'My Listings' : tab}`}
              />
            ))}
          </div>
        </div>

        <TabsContent value="listings" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6">
            {myBusinesses.map((business) => (
              <Card key={business.id}>
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <CardTitle className="text-base sm:text-lg">{business.name}</CardTitle>
                        <Badge variant={business.plan === 'Premium' ? 'default' : 'secondary'} className="text-xs">
                          {business.plan}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{business.status}</Badge>
                      </div>
                      <CardDescription className="text-xs sm:text-sm">{business.category}</CardDescription>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" onClick={() => setViewListingId(business.id)} className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditOpen(business.id)} className="flex-1 sm:flex-none text-xs sm:text-sm">
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      {business.plan === 'Basic' && (
                        <Button size="sm" onClick={() => handleOpenUpgradeModal(business.id)} className="flex-1 sm:flex-none text-xs sm:text-sm bg-black hover:bg-gray-800">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Upgrade</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Views</p>
                        <p className="text-sm sm:text-lg">{business.views.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="text-sm sm:text-lg">{business.clicks}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contact</p>
                        <p className="text-sm sm:text-lg">{business.contactClicks}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Deals</p>
                        <p className="text-sm sm:text-lg">{business.deals}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <p className="text-sm sm:text-lg">{business.rating}</p>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Management */}
                  <div className="mt-4 border-t pt-4">
                    <div className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 flex-1">
                          <div className="p-1.5 bg-gray-900 rounded flex-shrink-0">
                            <CreditCard className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-xs sm:text-sm">Subscription</h4>
                              <Badge variant={business.plan === 'Premium' ? 'default' : 'secondary'} className="text-xs">
                                {business.plan}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              {business.plan === 'Premium' 
                                ? 'Premium listing with all features' 
                                : 'Free basic listing'}
                            </p>
                          </div>
                        </div>
                        {business.plan === 'Premium' && (
                          <div className="text-right">
                            <p className="text-sm sm:text-base">$49</p>
                            <p className="text-xs text-gray-500">per month</p>
                          </div>
                        )}
                      </div>

                      {business.plan === 'Premium' ? (
                        <div className="space-y-2">
                          <div className="p-2 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="space-y-1.5 text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                <span>Featured business badge</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                <span>Priority in search results</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                <span>Business Marketplace visibility</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to cancel the premium subscription for "${business.name}"? This will downgrade your listing to Basic.`)) {
                                toast.success(`Premium subscription cancelled for "${business.name}". Your listing will remain Premium until the end of the current billing period.`);
                              }
                            }}
                          >
                            Cancel Premium Subscription
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleOpenUpgradeModal(business.id)}
                          className="w-full text-xs sm:text-sm bg-black hover:bg-gray-800"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Upgrade to Premium - $49/month
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Business Marketplace - Premium Only */}
                  {business.plan === 'Premium' && (
                    <div className="mt-4 border-t pt-4">
                      <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-gray-900 rounded flex-shrink-0">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-xs sm:text-sm">Business Marketplace</h4>
                              <Badge className="bg-black text-white text-xs">Premium</Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              Appear in white-label partner directories
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 sm:p-3 bg-white border rounded-lg">
                          <div className="space-y-0.5">
                            <Label className="text-xs">Marketplace Visibility</Label>
                            <p className="text-xs text-gray-500">
                              {listingMarketplaceOptIn[business.id]
                                ? 'Visible to distribution partners'
                                : 'Hidden from marketplace'}
                            </p>
                          </div>
                          <Switch
                            checked={listingMarketplaceOptIn[business.id] || false}
                            onCheckedChange={(checked) => {
                              setListingMarketplaceOptIn({
                                ...listingMarketplaceOptIn,
                                [business.id]: checked,
                              });
                              toast(
                                checked
                                  ? `"${business.name}" is now visible in the Business Marketplace!`
                                  : `"${business.name}" has been removed from the Business Marketplace.`
                              );
                            }}
                          />
                        </div>

                        {listingMarketplaceOptIn[business.id] && (
                          <div className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs text-green-900 mb-0.5">
                                  This listing is in the marketplace!
                                </p>
                                <p className="text-xs text-green-800">
                                  Distribution partners can add this business to their directories.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}

        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Views Over Time</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Total profile views for the past week</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#000000" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Click Activity</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Contact clicks for the past week</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={clicksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance by Listing */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Performance by Listing</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Compare your business listings</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Business Name</TableHead>
                    <TableHead className="text-xs sm:text-sm">Views</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Clicks</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Contact</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Conv. Rate</TableHead>
                    <TableHead className="text-xs sm:text-sm">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="text-xs sm:text-sm">{business.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{business.views.toLocaleString()}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{business.clicks}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden md:table-cell">{business.contactClicks}</TableCell>
                      <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{((business.clicks / business.views) * 100).toFixed(1)}%</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                          {business.rating}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deals">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-base sm:text-lg">Manage Deals</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Create and manage your promotional offers</CardDescription>
                </div>
                <Button onClick={() => setShowCreateDeal(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Deal
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-muted-foreground text-sm">No active deals. Create your first deal to attract more customers!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4 sm:space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Payment Methods</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="border rounded-lg p-3 sm:p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs sm:text-sm">Visa ending in 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/26</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">Default</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm" onClick={() => setShowAddPayment(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Listing Modal */}
      <Dialog open={!!viewListingId} onOpenChange={(open) => !open && setViewListingId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="view-listing-description">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">{selectedListing?.name || 'Business Listing'}</DialogTitle>
            <DialogDescription id="view-listing-description" className="text-xs sm:text-sm">Preview how your listing appears to customers</DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <>

              <div className="space-y-4 sm:space-y-6">
                {/* Image */}
                <div className="relative rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={selectedListing.photos[0]}
                    alt={selectedListing.name}
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-black hover:bg-gray-900 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    {selectedListing.plan}
                  </Badge>
                </div>

                {/* Business Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">{selectedListing.category}</Badge>
                    <Badge variant="outline" className="text-xs">{selectedListing.status}</Badge>
                    <div className="flex items-center gap-1 text-gray-900">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{selectedListing.rating}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">{selectedListing.description}</p>

                  {selectedListing.amenities && selectedListing.amenities.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm sm:text-base">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedListing.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="mb-3 text-sm sm:text-base">Contact Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-600 text-xs sm:text-sm">{selectedListing.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 text-xs sm:text-sm">{selectedListing.phone}</span>
                    </div>
                    {selectedListing.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600 text-xs sm:text-sm">{selectedListing.email}</span>
                      </div>
                    )}
                    {selectedListing.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                        <span className="text-gray-600 text-xs sm:text-sm">{selectedListing.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Business Hours */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <h3 className="text-sm sm:text-base">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {daysOfWeek.map(day => (
                      <div
                        key={day}
                        className={`flex justify-between text-xs sm:text-sm ${
                          day === today ? 'font-semibold text-gray-900' : 'text-gray-600'
                        }`}
                      >
                        <span className="capitalize">{day}</span>
                        <span>{selectedListing.hours[day as keyof typeof selectedListing.hours]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div>
                  <h3 className="mb-3 text-sm sm:text-base">Performance Stats</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Views</p>
                      <p className="text-xl sm:text-2xl">{selectedListing.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                      <p className="text-xl sm:text-2xl">{selectedListing.clicks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contact Clicks</p>
                      <p className="text-xl sm:text-2xl">{selectedListing.contactClicks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Deals</p>
                      <p className="text-xl sm:text-2xl">{selectedListing.deals}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setViewListingId(null)} className="w-full">
                  Close Preview
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Listing Modal */}
      <Dialog open={!!editListingId} onOpenChange={(open) => {
        if (!open) {
          setEditListingId(null);
          setNewAmenity('');
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="edit-listing-description">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Edit Listing</DialogTitle>
            <DialogDescription id="edit-listing-description" className="text-xs sm:text-sm">Update your business information</DialogDescription>
          </DialogHeader>
          {editingListing && (
            <>

              <div className="space-y-4 sm:space-y-6">
                {/* Business Photos */}
                <div>
                  <Label className="text-sm sm:text-base">Business Photos</Label>
                  <p className="text-xs text-muted-foreground mb-3">Drag to reorder. First photo is your cover image.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {editPhotos.map((photo, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-gray-200">
                        <ImageWithFallback
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 sm:h-40 object-cover"
                        />
                        {index === 0 && (
                          <Badge className="absolute top-2 left-2 bg-black text-white text-xs">
                            Cover
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 w-7 p-0"
                            onClick={() => movePhoto(index, 'left')}
                            disabled={index === 0}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 w-7 p-0"
                            onClick={() => movePhoto(index, 'right')}
                            disabled={index === editPhotos.length - 1}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 w-7 p-0"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <button className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors h-32 sm:h-40 flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                      <div className="text-center text-gray-500">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm">Add Photo</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="edit-name" className="text-sm">Business Name</Label>
                    <Input id="edit-name" defaultValue={editingListing.name} className="text-sm" />
                  </div>
                  <div>
                    <Label htmlFor="edit-category" className="text-sm">Category</Label>
                    <Select defaultValue={editingListing.category}>
                      <SelectTrigger id="edit-category" className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Beauty">Beauty & Self Care</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description" className="text-sm">Description</Label>
                  <Textarea
                    id="edit-description"
                    defaultValue={editingListing.description}
                    rows={4}
                    placeholder="Tell customers about your business..."
                    className="text-sm"
                  />
                </div>

                <Separator />

                {/* Contact Information */}
                <div>
                  <h3 className="mb-3 text-sm sm:text-base">Contact Information</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label htmlFor="edit-address" className="text-sm">Address</Label>
                      <Input id="edit-address" defaultValue={editingListing.address} className="text-sm" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label htmlFor="edit-phone" className="text-sm">Phone</Label>
                        <Input id="edit-phone" defaultValue={editingListing.phone} className="text-sm" />
                      </div>
                      <div>
                        <Label htmlFor="edit-email" className="text-sm">Email</Label>
                        <Input id="edit-email" type="email" defaultValue={editingListing.email} className="text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-website" className="text-sm">Website</Label>
                      <Input id="edit-website" defaultValue={editingListing.website} placeholder="www.yourbusiness.com" className="text-sm" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Business Hours */}
                <div>
                  <h3 className="mb-3 text-sm sm:text-base">Business Hours</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {daysOfWeek.map(day => (
                      <div key={day} className="grid grid-cols-3 gap-2 sm:gap-3 items-center">
                        <Label className="capitalize text-xs sm:text-sm">{day}</Label>
                        <Input 
                          defaultValue={editingListing.hours[day as keyof typeof editingListing.hours]}
                          placeholder="9:00 AM - 5:00 PM"
                          className="col-span-2 text-xs sm:text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Amenities */}
                <div>
                  <Label className="text-sm sm:text-base">Amenities</Label>
                  <div className="mt-3 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {editAmenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs sm:text-sm pr-1">
                          {amenity}
                          <button
                            onClick={() => removeAmenity(index)}
                            className="ml-1 hover:text-red-500 transition-colors p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        placeholder="Add amenity..."
                        className="text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAmenity();
                          }
                        }}
                      />
                      <Button onClick={addAmenity} size="sm" type="button">
                        <Plus className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      toast.success('Listing updated successfully!');
                      setEditListingId(null);
                      setNewAmenity('');
                    }}
                  >
                    Save Changes
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => {
                    setEditListingId(null);
                    setNewAmenity('');
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Deal Modal */}
      <Dialog open={showCreateDeal} onOpenChange={setShowCreateDeal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="create-deal-description">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Create New Deal</DialogTitle>
            <DialogDescription id="create-deal-description" className="text-xs sm:text-sm">Create a promotional offer to attract more customers</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="deal-business" className="text-sm">Select Business</Label>
              <Select>
                <SelectTrigger id="deal-business" className="text-sm">
                  <SelectValue placeholder="Choose a business" />
                </SelectTrigger>
                <SelectContent>
                  {myBusinesses.map(business => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deal-title" className="text-sm">Deal Title</Label>
              <Input 
                id="deal-title" 
                placeholder="e.g., 20% off all entrees"
                className="text-sm"
              />
            </div>

            <div>
              <Label htmlFor="deal-description" className="text-sm">Deal Description</Label>
              <Textarea
                id="deal-description"
                rows={3}
                placeholder="Describe your promotional offer in detail..."
                className="text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="deal-start" className="text-sm">Start Date</Label>
                <Input id="deal-start" type="date" className="text-sm" />
              </div>
              <div>
                <Label htmlFor="deal-end" className="text-sm">End Date</Label>
                <Input id="deal-end" type="date" className="text-sm" />
              </div>
            </div>

            <div>
              <Label htmlFor="deal-terms" className="text-sm">Terms & Conditions</Label>
              <Textarea
                id="deal-terms"
                rows={2}
                placeholder="Any restrictions or special conditions..."
                className="text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex gap-2">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm text-blue-900">
                    <strong>Tip:</strong> Clear, specific deals perform better! Include the discount percentage or value, and any time restrictions.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                className="flex-1"
                onClick={() => {
                  toast.success('Deal created successfully!');
                  setShowCreateDeal(false);
                }}
              >
                Create Deal
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateDeal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Business Listing Modal - Multi-Step */}
      <Dialog open={showNewBusiness} onOpenChange={(open) => {
        setShowNewBusiness(open);
        if (!open) setNewBusinessStep(1);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="new-business-description">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Add New Business</DialogTitle>
            <DialogDescription id="new-business-description" className="text-xs sm:text-sm">
              Step {newBusinessStep} of 4: {
                newBusinessStep === 1 ? 'Select Plan' :
                newBusinessStep === 2 ? 'Business Details' :
                newBusinessStep === 3 ? 'Contact Information' :
                'Business Hours'
              }
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1">
                <div className={`h-2 rounded-full transition-all ${
                  step <= newBusinessStep ? 'bg-black' : 'bg-gray-200'
                }`} />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {/* Step 1: Select Plan */}
            {newBusinessStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2">Choose Your Plan</h3>
                  <p className="text-sm text-muted-foreground mb-6">Select the plan that works best for your business</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Free Plan */}
                  <button 
                    className={`p-6 border-2 rounded-lg text-left transition-all hover:border-gray-400 ${
                      selectedPlan === 'free' ? 'border-black bg-gray-50' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('free')}
                  >
                    <h4 className="mb-2">Free</h4>
                    <p className="text-3xl mb-2">$0</p>
                    <p className="text-sm text-muted-foreground">Basic listing features</p>
                  </button>
                  
                  {/* 1 Month */}
                  <button 
                    className={`p-6 border-2 rounded-lg text-left transition-all hover:border-gray-400 ${
                      selectedPlan === '1-month' ? 'border-black bg-gray-50' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('1-month')}
                  >
                    <h4 className="mb-2">1 Month</h4>
                    <p className="text-3xl mb-2">$49</p>
                    <p className="text-sm text-muted-foreground">Premium listing for one month</p>
                  </button>
                  
                  {/* 3 Months */}
                  <button 
                    className={`p-6 border-2 rounded-lg text-left transition-all hover:border-gray-400 relative ${
                      selectedPlan === '3-months' ? 'border-black bg-gray-50' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('3-months')}
                  >
                    <Badge className="absolute top-3 right-3">Best Value</Badge>
                    <h4 className="mb-2">3 Months</h4>
                    <p className="text-3xl mb-2">$99</p>
                    <p className="text-sm text-muted-foreground">Save $48 - $33/month</p>
                  </button>
                  
                  {/* 1 Year */}
                  <button 
                    className={`p-6 border-2 rounded-lg text-left transition-all hover:border-gray-400 ${
                      selectedPlan === '1-year' ? 'border-black bg-gray-50' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('1-year')}
                  >
                    <h4 className="mb-2">1 Year</h4>
                    <p className="text-3xl mb-2">$299</p>
                    <p className="text-sm text-muted-foreground">Save $289 - $25/month</p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {newBusinessStep === 2 && (
              <div className="space-y-6">
                {/* Business Photos */}
                <div>
                  <Label className="text-base">Business Photos</Label>
                  <p className="text-xs text-muted-foreground mb-3">Upload at least one photo. First photo will be your cover image.</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    <button className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors aspect-square flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                      <div className="text-center text-gray-500">
                        <Upload className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-xs">Add Photo</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-name">Business Name *</Label>
                    <Input id="new-name" placeholder="Enter business name" />
                  </div>
                  <div>
                    <Label htmlFor="new-category">Category *</Label>
                    <Select>
                      <SelectTrigger id="new-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Restaurant">Restaurant</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Beauty">Beauty & Self Care</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-description">Description *</Label>
                    <Textarea
                      id="new-description"
                      rows={4}
                      placeholder="Tell customers about your business..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {newBusinessStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="mb-4">Contact Information</h3>
                </div>
                <div>
                  <Label htmlFor="new-address">Address *</Label>
                  <Input id="new-address" placeholder="123 Main St, City, State ZIP" />
                </div>
                <div>
                  <Label htmlFor="new-phone">Phone *</Label>
                  <Input id="new-phone" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="new-email">Email *</Label>
                  <Input id="new-email" type="email" placeholder="contact@business.com" />
                </div>
                <div>
                  <Label htmlFor="new-website">Website</Label>
                  <Input id="new-website" placeholder="www.yourbusiness.com" />
                </div>
              </div>
            )}

            {/* Step 4: Business Hours */}
            {newBusinessStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="mb-4">Business Hours</h3>
                  <p className="text-sm text-muted-foreground mb-4">Set your operating hours for each day</p>
                </div>
                <div className="space-y-3">
                  {daysOfWeek.map(day => (
                    <div key={day} className="grid grid-cols-[120px_1fr] gap-4 items-center">
                      <Label className="capitalize">{day}</Label>
                      <Input 
                        placeholder="9:00 AM - 5:00 PM"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <Separator />
            <div className="flex gap-3">
              {newBusinessStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => setNewBusinessStep(newBusinessStep - 1)}
                  className="flex-1"
                >
                  Previous
                </Button>
              )}
              {newBusinessStep < 4 ? (
                <Button 
                  onClick={() => setNewBusinessStep(newBusinessStep + 1)}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    toast.success('Business listing created successfully!');
                    setShowNewBusiness(false);
                    setNewBusinessStep(1);
                  }}
                  className="flex-1"
                >
                  Create Listing
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewBusiness(false);
                  setNewBusinessStep(1);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade to Premium Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-2xl" aria-describedby="upgrade-premium-description">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription id="upgrade-premium-description">
              Choose the perfect plan for your business
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              {premiumPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'relative' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-black text-white">Most Popular</Badge>
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{plan.name}</h3>
                      {plan.savings && (
                        <p className="text-sm text-green-600 mt-1">{plan.savings}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl">${plan.price}</p>
                      {plan.pricePerMonth && (
                        <p className="text-sm text-gray-500">${plan.pricePerMonth}/month</p>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpgradeToPremium}>
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade for ${premiumPlans.find(p => p.id === selectedPlan)?.price}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
        <DialogContent className="max-w-md" aria-describedby="add-payment-description">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription id="add-payment-description">
              Add a new credit or debit card to your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input 
                id="card-number" 
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input 
                  id="expiry" 
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv" 
                  type="password"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardholder-name">Cardholder Name</Label>
              <Input 
                id="cardholder-name" 
                placeholder="John Doe"
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="billing-address">Billing Address</Label>
              <Input 
                id="billing-address" 
                placeholder="123 Main St"
                className="mb-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  placeholder="New York"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  placeholder="NY"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input 
                id="zip" 
                placeholder="10001"
                maxLength={10}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddPayment(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast.success('Payment method added successfully!');
                setShowAddPayment(false);
              }}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md" aria-describedby="payment-dialog-description">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription id="payment-dialog-description">
              Complete your payment to upgrade to {premiumPlans.find(p => p.id === selectedPlan)?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Plan Summary */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{premiumPlans.find(p => p.id === selectedPlan)?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {myBusinesses.find(b => b.id === upgradingBusinessId)?.name}
                  </p>
                </div>
                <p className="text-2xl">${premiumPlans.find(p => p.id === selectedPlan)?.price}</p>
              </div>
              {premiumPlans.find(p => p.id === selectedPlan)?.savings && (
                <Badge variant="secondary" className="mt-2">
                  {premiumPlans.find(p => p.id === selectedPlan)?.savings}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Payment Method</Label>
              
              {paymentMethods.length > 0 && (
                <div className="space-y-2">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      useExistingCard ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={() => setUseExistingCard(true)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          useExistingCard ? 'border-primary' : 'border-muted-foreground'
                        }`}>
                          {useExistingCard && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{paymentMethods[0].type} •••• {paymentMethods[0].last4}</p>
                          <p className="text-sm text-muted-foreground">Expires {paymentMethods[0].expiry}</p>
                        </div>
                      </div>
                      {paymentMethods[0].isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  !useExistingCard ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                }`}
                onClick={() => setUseExistingCard(false)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    !useExistingCard ? 'border-primary' : 'border-muted-foreground'
                  }`}>
                    {!useExistingCard && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <Plus className="w-5 h-5 text-muted-foreground" />
                  <p className="font-medium">Add new payment method</p>
                </div>
              </div>

              {/* New Card Form */}
              {!useExistingCard && (
                <div className="space-y-3 pt-3 border-t">
                  <div>
                    <Label htmlFor="payment-card-number">Card Number</Label>
                    <Input
                      id="payment-card-number"
                      placeholder="1234 5678 9012 3456"
                      value={paymentCardData.cardNumber}
                      onChange={(e) => handlePaymentCardChange('cardNumber', e.target.value)}
                      maxLength={16}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="payment-expiry">Expiry (MM/YY)</Label>
                      <Input
                        id="payment-expiry"
                        placeholder="12/26"
                        value={paymentCardData.expiry}
                        onChange={(e) => handlePaymentCardChange('expiry', e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="payment-cvc">CVC</Label>
                      <Input
                        id="payment-cvc"
                        placeholder="123"
                        value={paymentCardData.cvc}
                        onChange={(e) => handlePaymentCardChange('cvc', e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payment-cardholder">Cardholder Name</Label>
                    <Input
                      id="payment-cardholder"
                      placeholder="John Doe"
                      value={paymentCardData.name}
                      onChange={(e) => handlePaymentCardChange('name', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPaymentDialog(false);
                setShowUpgradeModal(true);
              }}
            >
              Back
            </Button>
            <Button onClick={handleConfirmPayment}>
              <Check className="w-4 h-4 mr-2" />
              Confirm Payment - ${premiumPlans.find(p => p.id === selectedPlan)?.price}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Welcome Modal */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-2xl" aria-describedby="welcome-modal-description">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Congratulations!</DialogTitle>
            <DialogDescription id="welcome-modal-description" className="text-center text-base">
              Your listing has been created successfully. Here's how to get the most out of your dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Edit Your Listing */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Edit className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Edit Your Listing</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Edit" button on any listing card to update your business information, add photos, set your hours, and manage your deals.
                </p>
              </div>
            </div>

            {/* View Analytics */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">View Business Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the "Analytics" tab to see detailed insights about your listing performance, including views, clicks, and engagement metrics.
                </p>
              </div>
            </div>

            {/* Upgrade to Premium */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock featured homepage placement, unlimited deals, and advanced analytics by upgrading to a Premium listing in the "Billing" tab.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowWelcomeModal(false)} className="w-full">
              Got it, Let's Get Started!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
