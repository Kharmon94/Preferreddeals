import { WhiteLabelPlatform } from './white-label-platform-new';
import { useState } from 'react';
import { Users, Award, DollarSign, TrendingUp, Copy, Share2, Gift, Globe, ArrowRight, MapPin, Package, BarChart3, Eye, Map, ChevronLeft, ChevronRight, CheckCircle, Search, CreditCard, Plus, Check, Sparkles, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface DistributionPartnerDashboardProps {
  userName: string;
}

export function DistributionPartnerDashboard({ userName }: DistributionPartnerDashboardProps) {
  const [showWhiteLabel, setShowWhiteLabel] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof partnerLocations[0] | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [businessDetailOpen, setBusinessDetailOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  // Set to false for non-white-label users, true for white-label users
  const [hasWhiteLabel, setHasWhiteLabel] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [useExistingCard, setUseExistingCard] = useState(true);
  const [paymentCardData, setPaymentCardData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [showNfcStandsDialog, setShowNfcStandsDialog] = useState(false);
  const [nfcStandsQuantity, setNfcStandsQuantity] = useState(5);
  const [nfcKeychainsQuantity, setNfcKeychainsQuantity] = useState(25);
  const [nfcDeliveryAddress, setNfcDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
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
  
  const stats = {
    totalClicks: 1847,
    thisWeekClicks: 423,
    thisMonthClicks: 1205,
    clickGrowth: 24.5,
  };

  const partnerLocations = [
    {
      id: 1,
      city: 'New York',
      state: 'NY',
      businesses: 18,
      activeDeals: 42,
      monthlyGrowth: 12.5,
      totalRevenue: 450,
      status: 'Active',
    },
    {
      id: 2,
      city: 'Brooklyn',
      state: 'NY',
      businesses: 10,
      activeDeals: 25,
      monthlyGrowth: 8.3,
      totalRevenue: 280,
      status: 'Active',
    },
    {
      id: 3,
      city: 'Queens',
      state: 'NY',
      businesses: 4,
      activeDeals: 9,
      monthlyGrowth: 15.2,
      totalRevenue: 120,
      status: 'Active',
    },
  ];

  if (showWhiteLabel) {
    return <WhiteLabelPlatform onBack={() => setShowWhiteLabel(false)} partnerName={userName} />;
  }

  const recentReferrals = [
    { id: 1, business: 'Green Leaf Cafe', owner: 'Sarah Chen', status: 'Active', commission: 50, joinDate: 'Oct 20, 2025', plan: 'Premium' },
    { id: 2, business: 'Peak Fitness', owner: 'Mike Johnson', status: 'Pending', commission: 75, joinDate: 'Oct 18, 2025', plan: 'Featured' },
    { id: 3, business: 'Style Studio', owner: 'Emma Davis', status: 'Active', commission: 50, joinDate: 'Oct 15, 2025', plan: 'Premium' },
    { id: 4, business: 'Tech Repair Hub', owner: 'James Wilson', status: 'Active', commission: 30, joinDate: 'Oct 12, 2025', plan: 'Basic' },
  ];

  const monthlyBreakdown = [
    { month: 'July', referrals: 8, earnings: 420 },
    { month: 'August', referrals: 12, earnings: 680 },
    { month: 'September', referrals: 10, earnings: 550 },
    { month: 'October', referrals: 15, earnings: 825 },
  ];

  // White-label pricing plans
  const whiteLabelPlans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 49,
      period: '/month',
      features: [
        'Custom branded directory',
        'Your own subdomain',
        'Full design customization',
        'Analytics dashboard',
        'Add businesses from marketplace',
        'Email support',
      ],
    },
    {
      id: 'annual',
      name: 'Annual',
      price: 499,
      pricePerMonth: '41.58',
      period: '/year',
      savings: 'Save $89/year',
      popular: true,
      features: [
        'Everything in Monthly',
        'Priority support',
        'Advanced analytics',
        'Custom domain setup',
        'Dedicated account manager',
        'Two months free',
      ],
    },
  ];

  const copyReferralLink = async () => {
    const referralLink = 'https://preferreddeals.com/signup?ref=DIST12345';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(referralLink);
        toast.success('Referral link copied to clipboard!');
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success('Referral link copied to clipboard!');
        } catch (err) {
          toast.error('Failed to copy referral link');
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      toast.error('Failed to copy referral link');
    }
  };

  const handleUpgradeToWhiteLabel = () => {
    setShowUpgradeDialog(false);
    setShowPaymentDialog(true);
  };

  const handlePaymentCardChange = (field: string, value: string) => {
    setPaymentCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmPayment = () => {
    // Simulate payment processing
    toast.success('White-label platform activated! Redirecting...');
    setShowPaymentDialog(false);
    setPaymentCardData({ cardNumber: '', expiry: '', cvc: '', name: '' });
    setHasWhiteLabel(true);
    // After a short delay, show the white-label platform
    setTimeout(() => {
      setShowWhiteLabel(true);
    }, 1000);
  };

  const handleNfcStandsRequest = () => {
    const items = [];
    if (nfcStandsQuantity > 0) items.push(`${nfcStandsQuantity} NFC stand${nfcStandsQuantity > 1 ? 's' : ''}`);
    if (nfcKeychainsQuantity > 0) items.push(`${nfcKeychainsQuantity} NFC keychain${nfcKeychainsQuantity > 1 ? 's' : ''}`);
    
    const itemsText = items.length > 0 ? items.join(' and ') : 'your items';
    toast.success(`Request submitted for ${itemsText}! We'll ship them to you within 5-7 business days.`);
    setShowNfcStandsDialog(false);
    // Reset form
    setNfcStandsQuantity(5);
    setNfcKeychainsQuantity(25);
    setNfcDeliveryAddress({ street: '', city: '', state: '', zip: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2">Distribution Partner Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Track your link performance, {userName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border-2 border-gray-900">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Clicks</p>
            <p className="text-2xl sm:text-3xl">{stats.totalClicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">This Month</p>
            <p className="text-2xl sm:text-3xl">{stats.thisMonthClicks.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{stats.clickGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">This Week</p>
            <p className="text-2xl sm:text-3xl">{stats.thisWeekClicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        {/* Slider Navigation */}
        <div className="space-y-3 sm:space-y-4">
          {/* Tab Name with Arrows */}
          <div className="relative text-center">
            <h2 className="text-xl sm:text-2xl capitalize">{activeTab}</h2>
            
            {/* Navigation Arrows */}
            <button
              onClick={() => {
                const tabs = ['overview', 'billing'];
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
                const tabs = ['overview', 'billing'];
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
            {['overview', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-2 rounded-full transition-all ${
                  tab === activeTab 
                    ? 'w-8 bg-black' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to ${tab}`}
              />
            ))}
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* White-Label Platform Card - Only for white-label users */}
          {hasWhiteLabel && (
            <Card className="border-2 border-gray-900 bg-gradient-to-br from-gray-50 to-white">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 sm:p-3 bg-gray-900 rounded-lg flex-shrink-0">
                      <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg">Your White-Label Platform</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Manage your community directory with your own branding</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gray-900 self-start sm:self-auto text-xs">Premium</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-white rounded-lg border">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Your Platform URL</p>
                    <p className="text-xs sm:text-sm font-medium break-all">community-connect.preferreddeals.com</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white rounded-lg border">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Pending Approvals</p>
                    <p className="text-xl sm:text-2xl">5</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-white rounded-lg border">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Businesses</p>
                    <p className="text-xl sm:text-2xl">42</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" onClick={() => setShowWhiteLabel(true)}>
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="text-sm">Manage Platform</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    <span className="text-sm">Share Platform Link</span>
                  </Button>
                </div>

                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs sm:text-sm">
                    <span className="font-medium">New!</span> Manage business approvals, customize branding, and set up your custom domain all in one place.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Referral Link Card */}
          <Card className="border-2">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Your Referral Link</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Share this link with communities to distribute the Preferred Deals directory</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value="https://preferreddeals.com/signup?ref=DIST12345"
                  readOnly
                  className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-xs sm:text-sm"
                />
                <Button onClick={copyReferralLink} className="sm:flex-shrink-0">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1 text-xs sm:text-sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on Social Media
                </Button>
                <Button variant="outline" className="flex-1 text-xs sm:text-sm" onClick={() => setShowNfcStandsDialog(true)}>
                  <Package className="w-4 h-4 mr-2" />
                  Request NFC Stands
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade to White-Label Card - Visible for development */}
          {true && (
            <Card className="border-2 border-gray-900 bg-gradient-to-br from-gray-50 to-white">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 sm:p-3 bg-gray-900 rounded-lg flex-shrink-0">
                      <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg">Upgrade to White-Label Directory</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Get your own branded community directory platform</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gray-900 self-start sm:self-auto text-xs">Premium</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Create your own branded directory platform with custom domain, branding, and full control over business approvals.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <p className="text-sm">Custom Domain</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Your own branded URL</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <p className="text-sm">Business Approvals</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Control which businesses join</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <p className="text-sm">Custom Branding</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Your logo, colors & style</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <p className="text-sm">Analytics Dashboard</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Track your community growth</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" onClick={() => setShowUpgradeDialog(true)}>
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm">Upgrade to White-Label Directory</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs sm:text-sm">
                    <span className="font-medium">Perfect for communities!</span> Create a directory for your neighborhood, HOA, business association, or any community group.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="billing" className="space-y-4 sm:space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Payment Methods</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your payment methods for white-label subscriptions and services</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="border rounded-lg p-3 sm:p-4 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-gray-500" />
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

      {/* Business Detail Dialog */}
      <Dialog open={businessDetailOpen} onOpenChange={setBusinessDetailOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="business-detail-description">
          <DialogHeader>
            <DialogTitle>Business Details</DialogTitle>
            <DialogDescription id="business-detail-description">
              Learn more about this business before adding to your directory
            </DialogDescription>
          </DialogHeader>

          {selectedBusiness && (
            <div className="space-y-4">
              <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={selectedBusiness.image} 
                  alt={selectedBusiness.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-xl">{selectedBusiness.name}</h3>
                  <Badge className="bg-black text-white">Premium</Badge>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline">{selectedBusiness.category}</Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{selectedBusiness.rating}</span>
                    <span className="text-gray-400">({selectedBusiness.reviewCount} reviews)</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{selectedBusiness.description}</p>
                <p className="text-sm text-gray-500">{selectedBusiness.city}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Why add this business?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Premium verified business with excellent ratings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Opted in to be featured in white-label directories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Increases value and credibility of your directory</span>
                  </li>
                </ul>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setBusinessDetailOpen(false)}>
                  Close
                </Button>
                {selectedBusiness.isAdded ? (
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => {
                      handleRemoveBusiness(selectedBusiness.id);
                      setBusinessDetailOpen(false);
                    }}
                  >
                    Remove from Directory
                  </Button>
                ) : (
                  <Button 
                    className="w-full sm:w-auto"
                    onClick={() => {
                      handleAddBusiness(selectedBusiness.id);
                      setBusinessDetailOpen(false);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Directory
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Location Details Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="location-details-description">
          <DialogHeader>
            <DialogTitle>Location Details</DialogTitle>
            <DialogDescription id="location-details-description">
              Detailed statistics and performance for this location
            </DialogDescription>
          </DialogHeader>

          {selectedLocation && (
            <div className="space-y-6">
              {/* Location Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedLocation.city}</h3>
                    <p className="text-sm text-muted-foreground">{selectedLocation.state}</p>
                  </div>
                </div>
                <Badge variant="default">{selectedLocation.status}</Badge>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Businesses</p>
                        <p className="text-2xl font-semibold">{selectedLocation.businesses}</p>
                      </div>
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Deals</p>
                        <p className="text-2xl font-semibold">{selectedLocation.activeDeals}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-semibold">${selectedLocation.totalRevenue}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Growth</p>
                        <p className="text-2xl font-semibold text-green-600">+{selectedLocation.monthlyGrowth}%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="p-4 bg-muted rounded-lg">
                <h5 className="font-semibold mb-3">Performance Metrics</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deals per Business</span>
                    <span className="font-medium">
                      {(selectedLocation.activeDeals / selectedLocation.businesses).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Revenue per Business</span>
                    <span className="font-medium">
                      ${(selectedLocation.totalRevenue / selectedLocation.businesses).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Growth Rate</span>
                    <span className="font-medium text-green-600">+{selectedLocation.monthlyGrowth}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setLocationDialogOpen(false)}>
              Close
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

      {/* Upgrade to White-Label Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-2xl" aria-describedby="upgrade-white-label-description">
          <DialogHeader>
            <DialogTitle>Upgrade to White-Label Platform</DialogTitle>
            <DialogDescription id="upgrade-white-label-description">
              Launch your own branded directory and grow your business
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              {whiteLabelPlans.map((plan) => (
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
                      <p className="text-sm text-gray-500">{plan.period}</p>
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
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpgradeToWhiteLabel}>
              <Sparkles className="w-4 h-4 mr-2" />
              Continue to Payment
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
              Complete your payment to activate {whiteLabelPlans.find(p => p.id === selectedPlan)?.name} White-Label Platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Plan Summary */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{whiteLabelPlans.find(p => p.id === selectedPlan)?.name} Plan</p>
                  <p className="text-sm text-muted-foreground">White-Label Directory Platform</p>
                </div>
                <p className="text-2xl">${whiteLabelPlans.find(p => p.id === selectedPlan)?.price}</p>
              </div>
              {whiteLabelPlans.find(p => p.id === selectedPlan)?.savings && (
                <Badge variant="secondary" className="mt-2">
                  {whiteLabelPlans.find(p => p.id === selectedPlan)?.savings}
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
                setShowUpgradeDialog(true);
              }}
            >
              Back
            </Button>
            <Button onClick={handleConfirmPayment}>
              <Check className="w-4 h-4 mr-2" />
              Confirm Payment - ${whiteLabelPlans.find(p => p.id === selectedPlan)?.price}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request NFC Stands Dialog */}
      <Dialog open={showNfcStandsDialog} onOpenChange={setShowNfcStandsDialog}>
        <DialogContent className="sm:max-w-lg" aria-describedby="nfc-stands-description">
          <DialogHeader>
            <DialogTitle>Request Free NFC Materials</DialogTitle>
            <DialogDescription id="nfc-stands-description">
              Order complimentary NFC stands and keychains for your distribution network
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Free Banner */}
            <div className="bg-black text-white p-3 rounded-lg text-center">
              <p className="text-sm">🎉 All NFC materials are completely FREE for distribution partners!</p>
            </div>

            {/* NFC Stands Quantity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="nfc-stands-quantity">Preferred Deals NFC Stands</Label>
                <Badge variant="outline">Max: 10</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNfcStandsQuantity(Math.max(0, nfcStandsQuantity - 1))}
                >
                  -
                </Button>
                <Input
                  id="nfc-stands-quantity"
                  type="number"
                  value={nfcStandsQuantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setNfcStandsQuantity(Math.min(10, Math.max(0, val)));
                  }}
                  className="text-center w-20"
                  min="0"
                  max="10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNfcStandsQuantity(Math.min(10, nfcStandsQuantity + 1))}
                  disabled={nfcStandsQuantity >= 10}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground ml-2">stands</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Desktop NFC-enabled stands for businesses
              </p>
            </div>

            {/* NFC Keychains Quantity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="nfc-keychains-quantity">NFC Smart Keychains</Label>
                <Badge variant="outline">Max: 50</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNfcKeychainsQuantity(Math.max(0, nfcKeychainsQuantity - 1))}
                >
                  -
                </Button>
                <Input
                  id="nfc-keychains-quantity"
                  type="number"
                  value={nfcKeychainsQuantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setNfcKeychainsQuantity(Math.min(50, Math.max(0, val)));
                  }}
                  className="text-center w-20"
                  min="0"
                  max="50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNfcKeychainsQuantity(Math.min(50, nfcKeychainsQuantity + 1))}
                  disabled={nfcKeychainsQuantity >= 50}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground ml-2">keychains</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Portable NFC keychains for on-the-go sharing
              </p>
            </div>

            <Separator />

            {/* Delivery Address */}
            <div className="space-y-3">
              <Label>Delivery Address</Label>
              
              <div>
                <Label htmlFor="nfc-street" className="text-sm">Street Address</Label>
                <Input
                  id="nfc-street"
                  placeholder="123 Main St"
                  value={nfcDeliveryAddress.street}
                  onChange={(e) => setNfcDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="nfc-city" className="text-sm">City</Label>
                  <Input
                    id="nfc-city"
                    placeholder="New York"
                    value={nfcDeliveryAddress.city}
                    onChange={(e) => setNfcDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="nfc-state" className="text-sm">State</Label>
                  <Input
                    id="nfc-state"
                    placeholder="NY"
                    maxLength={2}
                    value={nfcDeliveryAddress.state}
                    onChange={(e) => setNfcDeliveryAddress(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nfc-zip" className="text-sm">ZIP Code</Label>
                <Input
                  id="nfc-zip"
                  placeholder="10001"
                  maxLength={5}
                  value={nfcDeliveryAddress.zip}
                  onChange={(e) => setNfcDeliveryAddress(prev => ({ ...prev, zip: e.target.value }))}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">NFC Stands:</span>
                <span>{nfcStandsQuantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">NFC Keychains:</span>
                <span>{nfcKeychainsQuantity}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Cost:</span>
                <span className="text-lg">FREE</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Ships within 5-7 business days
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNfcStandsDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleNfcStandsRequest}>
              <Package className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* White-Label Platform Management */}
      {showWhiteLabel && (
        <WhiteLabelPlatform 
          onClose={() => setShowWhiteLabel(false)} 
        />
      )}
    </div>
  );
}