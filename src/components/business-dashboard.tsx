import { useState } from 'react';
import { Edit, Eye, TrendingUp, Users, Phone, Mail, DollarSign, CreditCard, Download, Plus, Trash2, Check, CheckCircle, Store, ShoppingBag, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface BusinessDashboardProps {
  businessId: string | null;
  onNavigate?: (page: string) => void;
}

interface Listing {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  deal: string;
  hasDeal: boolean;
  isPremium: boolean;
  premiumPlan?: {
    name: string;
    price: number;
    duration: string;
    nextBilling: string;
    features: string[];
  };
  marketplaceOptIn: boolean;
}

// Mock analytics data
const viewsData = [
  { date: 'Mon', views: 45 },
  { date: 'Tue', views: 52 },
  { date: 'Wed', views: 61 },
  { date: 'Thu', views: 58 },
  { date: 'Fri', views: 73 },
  { date: 'Sat', views: 89 },
  { date: 'Sun', views: 67 },
];

const clicksData = [
  { date: 'Mon', clicks: 12 },
  { date: 'Tue', clicks: 15 },
  { date: 'Wed', clicks: 18 },
  { date: 'Thu', clicks: 14 },
  { date: 'Fri', clicks: 22 },
  { date: 'Sat', clicks: 28 },
  { date: 'Sun', clicks: 19 },
];

const mockPaymentMethods = [
  {
    id: '1',
    type: 'Visa',
    last4: '4242',
    expiry: '12/26',
    isDefault: true,
  },
];

const mockInvoices = [
  { id: 'INV-001', date: '2025-11-07', description: 'Featured Listing - Downtown Coffee Shop - 1 Month', amount: 49, status: 'paid' },
  { id: 'INV-002', date: '2025-10-07', description: 'Featured Listing - Downtown Coffee Shop - 1 Month', amount: 49, status: 'paid' },
  { id: 'INV-003', date: '2025-09-07', description: 'Featured Listing - Downtown Coffee Shop - 1 Month', amount: 49, status: 'paid' },
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

export function BusinessDashboard({ businessId, onNavigate }: BusinessDashboardProps) {
  // Multiple listings support - Updated with premium modal and $49 pricing
  const [listings, setListings] = useState<Listing[]>([
    {
      id: '1',
      name: 'Downtown Coffee Shop',
      description: 'A cozy coffee shop serving artisan coffee and fresh pastries',
      phone: '(555) 123-4567',
      email: 'contact@coffeeshop.com',
      address: '123 Main St, City, State 12345',
      deal: '20% off your first order',
      hasDeal: true,
      isPremium: true,
      premiumPlan: {
        name: '1 Month Premium',
        price: 49,
        duration: '1 month',
        nextBilling: '2025-12-07',
        features: ['Featured business badge', 'Priority in search results', 'Unlimited photos', 'Post unlimited deals', 'Basic analytics dashboard'],
      },
      marketplaceOptIn: true,
    },
    {
      id: '2',
      name: 'Pizza Palace',
      description: 'Authentic Italian pizza made with fresh ingredients',
      phone: '(555) 987-6543',
      email: 'info@pizzapalace.com',
      address: '456 Oak Ave, City, State 12345',
      deal: '',
      hasDeal: false,
      isPremium: false,
      marketplaceOptIn: false,
    },
  ]);

  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id || null);

  // Billing state
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [invoices] = useState(mockInvoices);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancellingListingId, setCancellingListingId] = useState<string | null>(null);
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    companyName: 'My Business LLC',
    email: 'billing@mybusiness.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
  });
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradingListingId, setUpgradingListingId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState(premiumPlans[0]);
  
  // Payment confirmation state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [useExistingCard, setUseExistingCard] = useState(true);
  const [paymentCardData, setPaymentCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  // Check if user has any active premium subscription
  const hasPremiumSubscription = listings.some(listing => listing.isPremium);

  const selectedListing = listings.find(l => l.id === selectedListingId);

  const handleSave = (listingId: string) => {
    setEditingListingId(null);
    toast('Success! Your listing has been updated.');
  };

  const handleListingChange = (listingId: string, field: keyof Listing, value: any) => {
    setListings(prev => prev.map(listing => 
      listing.id === listingId ? { ...listing, [field]: value } : listing
    ));
  };

  const handleMarketplaceToggle = (listingId: string, checked: boolean) => {
    handleListingChange(listingId, 'marketplaceOptIn', checked);
    const listing = listings.find(l => l.id === listingId);
    toast(checked 
      ? `"${listing?.name}" is now visible in the Business Marketplace!` 
      : `"${listing?.name}" has been removed from the Business Marketplace.`);
  };

  const handleBillingChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewCardChange = (field: string, value: string) => {
    setNewCard((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.expiry || !newCard.cvc || !newCard.name) {
      toast('Please fill in all card details.');
      return;
    }

    // In a real app, this would integrate with a payment processor like Stripe
    const last4 = newCard.cardNumber.slice(-4);
    const cardType = newCard.cardNumber.startsWith('4') ? 'Visa' : 
                     newCard.cardNumber.startsWith('5') ? 'Mastercard' : 'Card';
    
    const newPaymentMethod = {
      id: String(paymentMethods.length + 1),
      type: cardType,
      last4,
      expiry: newCard.expiry,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setNewCard({ cardNumber: '', expiry: '', cvc: '', name: '' });
    setShowAddCardDialog(false);
    toast('Success! Payment method added.');
  };

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    toast('Payment method removed.');
  };

  const handleSetDefaultCard = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    })));
    toast('Default payment method updated.');
  };

  const handleCancelSubscription = (listingId: string) => {
    setCancellingListingId(listingId);
    setShowCancelDialog(true);
  };

  const confirmCancelSubscription = () => {
    if (cancellingListingId) {
      setListings(prev => prev.map(listing => 
        listing.id === cancellingListingId 
          ? { ...listing, isPremium: false, premiumPlan: undefined, marketplaceOptIn: false } 
          : listing
      ));
      toast('Premium subscription cancelled successfully.');
      setCancellingListingId(null);
      setShowCancelDialog(false);
    }
  };

  const handleSaveBillingInfo = () => {
    setIsEditingBilling(false);
    toast('Billing information updated successfully.');
  };

  const handleOpenUpgradeModal = (listingId: string) => {
    setUpgradingListingId(listingId);
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
    }

    if (upgradingListingId) {
      const nextBillingDate = new Date();
      if (selectedPlan.id === '1-month') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (selectedPlan.id === '3-month') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
      } else {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }

      setListings(prev => prev.map(listing => 
        listing.id === upgradingListingId 
          ? { 
              ...listing, 
              isPremium: true, 
              premiumPlan: {
                name: selectedPlan.name,
                price: selectedPlan.price,
                duration: selectedPlan.duration,
                nextBilling: nextBillingDate.toISOString().split('T')[0],
                features: selectedPlan.features,
              },
              marketplaceOptIn: true 
            } 
          : listing
      ));
      toast.success(`Success! Your listing has been upgraded to ${selectedPlan.name}.`);
      setShowPaymentDialog(false);
      setUpgradingListingId(null);
      setPaymentCardData({ cardNumber: '', expiry: '', cvc: '', name: '' });
    }
  };

  const premiumListings = listings.filter(l => l.isPremium);
  
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Business Dashboard</h1>
        <p className="text-gray-600">Manage your listings and track performance</p>
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
                const tabs = ['analytics', 'listings', 'billing'];
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
                const tabs = ['analytics', 'listings', 'billing'];
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
            {['analytics', 'listings', 'billing'].map((tab) => (
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Total Views</CardTitle>
                <Eye className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">1,234</div>
                <p className="text-xs text-gray-600 mt-1">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Profile Clicks</CardTitle>
                <TrendingUp className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">342</div>
                <p className="text-xs text-gray-600 mt-1">+8% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Phone Clicks</CardTitle>
                <Phone className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">128</div>
                <p className="text-xs text-gray-600 mt-1">+15% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Email Clicks</CardTitle>
                <Mail className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">87</div>
                <p className="text-xs text-gray-600 mt-1">+5% from last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Views</CardTitle>
                <CardDescription>Total profile views over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#000000" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Click Activity</CardTitle>
                <CardDescription>Contact clicks over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clicksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Section */}
          {!hasPremiumSubscription && (
            <Card className="border-2 border-gray-300 bg-gray-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Upgrade to Featured Listing</CardTitle>
                    <CardDescription className="mt-2">
                      Boost your visibility and appear at the top of search results
                    </CardDescription>
                  </div>
                  <Badge className="bg-black hover:bg-gray-900 text-white">Premium</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Priority placement in search results
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    Featured badge on your listing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    3x more views on average
                  </li>
                </ul>
                <Button 
                  className="w-full md:w-auto"
                  onClick={() => {
                    const firstNonPremium = listings.find(l => !l.isPremium);
                    if (firstNonPremium) {
                      handleOpenUpgradeModal(firstNonPremium.id);
                    }
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* My Listings Tab */}
        <TabsContent value="listings" className="space-y-6">
          {listings.map((listing) => (
            <Card key={listing.id} className={listing.isPremium ? 'border-2 border-black' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{listing.name}</CardTitle>
                      {listing.isPremium && (
                        <Badge className="bg-black hover:bg-gray-900 text-white">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardDescription>Manage your business information and settings</CardDescription>
                  </div>
                  {editingListingId !== listing.id ? (
                    <Button onClick={() => setEditingListingId(listing.id)} variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(listing.id)}>Save Changes</Button>
                      <Button onClick={() => setEditingListingId(null)} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor={`name-${listing.id}`}>Business Name</Label>
                  <Input
                    id={`name-${listing.id}`}
                    value={listing.name}
                    onChange={(e) => handleListingChange(listing.id, 'name', e.target.value)}
                    disabled={editingListingId !== listing.id}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor={`description-${listing.id}`}>Description</Label>
                  <Textarea
                    id={`description-${listing.id}`}
                    value={listing.description}
                    onChange={(e) => handleListingChange(listing.id, 'description', e.target.value)}
                    disabled={editingListingId !== listing.id}
                    className="min-h-24"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`phone-${listing.id}`}>Phone</Label>
                    <Input
                      id={`phone-${listing.id}`}
                      value={listing.phone}
                      onChange={(e) => handleListingChange(listing.id, 'phone', e.target.value)}
                      disabled={editingListingId !== listing.id}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`email-${listing.id}`}>Email</Label>
                    <Input
                      id={`email-${listing.id}`}
                      type="email"
                      value={listing.email}
                      onChange={(e) => handleListingChange(listing.id, 'email', e.target.value)}
                      disabled={editingListingId !== listing.id}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor={`address-${listing.id}`}>Address</Label>
                  <Input
                    id={`address-${listing.id}`}
                    value={listing.address}
                    onChange={(e) => handleListingChange(listing.id, 'address', e.target.value)}
                    disabled={editingListingId !== listing.id}
                  />
                </div>

                {/* Deal Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Active Deal</Label>
                    <p className="text-sm text-gray-500">
                      Enable to add a special offer to your listing
                    </p>
                  </div>
                  <Switch
                    checked={listing.hasDeal}
                    onCheckedChange={(checked) => handleListingChange(listing.id, 'hasDeal', checked)}
                    disabled={editingListingId !== listing.id}
                  />
                </div>

                {listing.hasDeal && (
                  <div className="space-y-2">
                    <Label htmlFor={`deal-${listing.id}`}>Deal Description</Label>
                    <Textarea
                      id={`deal-${listing.id}`}
                      placeholder="e.g., 20% off for new customers"
                      value={listing.deal}
                      onChange={(e) => handleListingChange(listing.id, 'deal', e.target.value)}
                      disabled={editingListingId !== listing.id}
                    />
                  </div>
                )}

                {/* Premium Status */}
                {listing.isPremium && listing.premiumPlan && (
                  <div className="p-4 border-2 border-black rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3>Premium Listing Active</h3>
                          <Badge className="bg-black text-white">Active</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{listing.premiumPlan.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl">${listing.premiumPlan.price}</p>
                        <p className="text-sm text-gray-600">per {listing.premiumPlan.duration}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {listing.premiumPlan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        Next billing: {new Date(listing.premiumPlan.nextBilling).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCancelSubscription(listing.id)}
                      >
                        Cancel Premium
                      </Button>
                    </div>
                  </div>
                )}

                {!listing.isPremium && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Premium Listing</Label>
                        <p className="text-sm text-gray-500">
                          Upgrade to premium for featured placement
                        </p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleOpenUpgradeModal(listing.id)}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upgrade
                      </Button>
                    </div>
                  </div>
                )}

                {/* Marketplace Opt-In - Only for Premium Listings */}
                {listing.isPremium && (
                  <div className="border-2 border-gray-900 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-gray-900 rounded-lg flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3>Business Marketplace</h3>
                          <Badge className="bg-black text-white">Premium Feature</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Increase your exposure by appearing in white-label partner directories
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <p className="text-sm mb-3">
                        <span className="font-medium">NFC Powered Word Of Mouth Deal Network:</span> When you opt in, distribution partners can add your business to their white-label directories, giving you additional exposure across multiple communities!
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                          <span>Appear in multiple community directories</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                          <span>Reach new customers in different areas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                          <span>No additional cost - included with premium</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Marketplace Visibility</Label>
                        <p className="text-sm text-gray-500">
                          {listing.marketplaceOptIn 
                            ? 'This listing is visible to distribution partners' 
                            : 'This listing is hidden from the marketplace'}
                        </p>
                      </div>
                      <Switch
                        checked={listing.marketplaceOptIn}
                        onCheckedChange={(checked) => handleMarketplaceToggle(listing.id, checked)}
                      />
                    </div>

                    {listing.marketplaceOptIn && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-green-900 mb-1">
                              This listing is in the marketplace!
                            </p>
                            <p className="text-sm text-green-800">
                              Distribution partners can now discover and add this business to their white-label directories.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add New Listing Button */}
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Store className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="mb-2">Add Another Location</h3>
              <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
                Manage multiple business locations from one account
              </p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add New Listing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          {/* Active Subscriptions Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Subscriptions</CardTitle>
              <CardDescription>Overview of your active premium listings</CardDescription>
            </CardHeader>
            <CardContent>
              {premiumListings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No active premium listings</p>
                  <Button onClick={() => {
                    const firstNonPremium = listings.find(l => !l.isPremium);
                    if (firstNonPremium) {
                      handleOpenUpgradeModal(firstNonPremium.id);
                    }
                  }}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {premiumListings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Store className="w-5 h-5 text-gray-900" />
                        </div>
                        <div>
                          <p className="font-medium">{listing.name}</p>
                          <p className="text-sm text-gray-500">
                            ${listing.premiumPlan?.price}/{listing.premiumPlan?.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-black text-white">Active</Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Switch to listings tab and scroll to the listing
                            const tabTrigger = document.querySelector('[value="listings"]') as HTMLElement;
                            tabTrigger?.click();
                          }}
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods</CardDescription>
                </div>
                <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby="add-card-description">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription id="add-card-description">
                        Add a new credit or debit card to your account
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newCard.cardNumber}
                          onChange={(e) => handleNewCardChange('cardNumber', e.target.value)}
                          maxLength={16}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={newCard.expiry}
                            onChange={(e) => handleNewCardChange('expiry', e.target.value)}
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={newCard.cvc}
                            onChange={(e) => handleNewCardChange('cvc', e.target.value)}
                            maxLength={3}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={newCard.name}
                          onChange={(e) => handleNewCardChange('name', e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddCardDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCard}>Add Card</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {paymentMethods.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No payment methods</p>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {method.type} •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge variant="outline">Default</Badge>
                        )}
                        {!method.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefaultCard(method.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCard(method.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Update your billing details</CardDescription>
                </div>
                {!isEditingBilling ? (
                  <Button onClick={() => setIsEditingBilling(true)} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveBillingInfo} size="sm">Save</Button>
                    <Button onClick={() => setIsEditingBilling(false)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={billingInfo.companyName}
                  onChange={(e) => handleBillingChange('companyName', e.target.value)}
                  disabled={!isEditingBilling}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Email</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => handleBillingChange('email', e.target.value)}
                    disabled={!isEditingBilling}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingPhone">Phone</Label>
                  <Input
                    id="billingPhone"
                    value={billingInfo.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                    disabled={!isEditingBilling}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={billingInfo.address}
                  onChange={(e) => handleBillingChange('address', e.target.value)}
                  disabled={!isEditingBilling}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingInfo.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                    disabled={!isEditingBilling}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={billingInfo.state}
                    onChange={(e) => handleBillingChange('state', e.target.value)}
                    disabled={!isEditingBilling}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={billingInfo.zip}
                    onChange={(e) => handleBillingChange('zip', e.target.value)}
                    disabled={!isEditingBilling}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={billingInfo.country}
                  onChange={(e) => handleBillingChange('country', e.target.value)}
                  disabled={!isEditingBilling}
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice History */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>${invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade to Premium Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-2xl" aria-describedby="upgrade-description">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription id="upgrade-description">
              Choose the perfect plan for your business
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              {premiumPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPlan.id === plan.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'relative' : ''}`}
                  onClick={() => setSelectedPlan(plan)}
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
              Upgrade for ${selectedPlan.price}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md" aria-describedby="payment-description">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription id="payment-description">
              Complete your upgrade to {selectedPlan.name} for ${selectedPlan.price}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {paymentMethods.length > 0 ? (
              <>
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  
                  {/* Existing Card Option */}
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      useExistingCard ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setUseExistingCard(true)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5" />
                        <div>
                          <p className="font-medium">
                            {paymentMethods.find(pm => pm.isDefault)?.type} ••••{' '}
                            {paymentMethods.find(pm => pm.isDefault)?.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {paymentMethods.find(pm => pm.isDefault)?.expiry}
                          </p>
                        </div>
                      </div>
                      {useExistingCard && <CheckCircle className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Add New Card Option */}
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      !useExistingCard ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setUseExistingCard(false)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5" />
                        <p className="font-medium">Use a different card</p>
                      </div>
                      {!useExistingCard && <CheckCircle className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* New Card Form - Only show if "Use a different card" is selected */}
                {!useExistingCard && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <Label htmlFor="payment-card-number">Card Number</Label>
                      <Input
                        id="payment-card-number"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={paymentCardData.cardNumber}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, cardNumber: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="payment-expiry">Expiry</Label>
                        <Input
                          id="payment-expiry"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={paymentCardData.expiry}
                          onChange={(e) => setPaymentCardData({ ...paymentCardData, expiry: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="payment-cvc">CVC</Label>
                        <Input
                          id="payment-cvc"
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={paymentCardData.cvc}
                          onChange={(e) => setPaymentCardData({ ...paymentCardData, cvc: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="payment-name">Cardholder Name</Label>
                      <Input
                        id="payment-name"
                        placeholder="John Doe"
                        value={paymentCardData.name}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, name: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* No Card on File - Show Card Input Form */}
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900">
                      <strong>No payment method on file.</strong> Please add a card to complete your upgrade.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-card-number">Card Number</Label>
                    <Input
                      id="new-card-number"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={paymentCardData.cardNumber}
                      onChange={(e) => setPaymentCardData({ ...paymentCardData, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="new-expiry">Expiry Date</Label>
                      <Input
                        id="new-expiry"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={paymentCardData.expiry}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, expiry: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-cvc">CVC</Label>
                      <Input
                        id="new-cvc"
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={paymentCardData.cvc}
                        onChange={(e) => setPaymentCardData({ ...paymentCardData, cvc: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-name">Cardholder Name</Label>
                    <Input
                      id="new-name"
                      placeholder="John Doe"
                      value={paymentCardData.name}
                      onChange={(e) => setPaymentCardData({ ...paymentCardData, name: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Payment Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span>{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span>{selectedPlan.duration}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Due Today</span>
                <span>${selectedPlan.price}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment}>
              <CreditCard className="w-4 h-4 mr-2" />
              Confirm Payment ${selectedPlan.price}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Premium Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your premium subscription? Your listing will revert to a basic listing and lose all premium features including marketplace visibility.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelSubscription}>
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
