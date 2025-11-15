'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  ExternalLink, 
  Check, 
  X, 
  Trash2, 
  RefreshCw,
  MapPin,
  Building2,
  Calendar,
  Eye,
  MousePointerClick
} from 'lucide-react';

interface JoobleAd {
  id: string;
  title: string;
  description: string;
  location: string;
  companyName: string;
  applyUrl: string;
  salary?: string;
  type?: string;
  snippet?: string;
  source?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  impressionsCount: number;
  clicksCount: number;
  createdAt: string;
}

export default function JoobleManagementPage() {
  const [ads, setAds] = useState<JoobleAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [currentTab, setCurrentTab] = useState('pending');
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAds(currentTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const fetchAds = async (status: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/jooble/ads?status=${status}`);
      const data = await response.json();
      
      if (response.ok) {
        setAds(data.ads || []);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch ads',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch ads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobsFromJooble = async () => {
    setFetching(true);
    try {
      const response = await fetch('/api/admin/jooble/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: searchKeywords,
          location: searchLocation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: data.message || 'Jobs fetched successfully',
        });
        // Refresh the pending list
        fetchAds('pending');
        // Clear search fields
        setSearchKeywords('');
        setSearchLocation('');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch jobs',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs from Jooble',
        variant: 'destructive',
      });
    } finally {
      setFetching(false);
    }
  };

  const handleApprove = async (adId: string) => {
    try {
      const response = await fetch(`/api/admin/jooble/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Job ad approved',
        });
        // Remove from current list
        setAds(ads.filter(ad => ad.id !== adId));
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to approve ad',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve ad',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (adId: string) => {
    const reason = rejectionReason[adId] || '';
    
    try {
      const response = await fetch(`/api/admin/jooble/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject',
          rejectionReason: reason 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Job ad rejected',
        });
        // Remove from current list
        setAds(ads.filter(ad => ad.id !== adId));
        // Clear rejection reason
        setRejectionReason(prev => {
          const updated = { ...prev };
          delete updated[adId];
          return updated;
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to reject ad',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject ad',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const response = await fetch(`/api/admin/jooble/ads/${adId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Job ad deleted',
        });
        setAds(ads.filter(ad => ad.id !== adId));
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete ad',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete ad',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Jooble Job Advertisements</h1>
        <p className="text-muted-foreground">
          Fetch jobs from Jooble and approve them to display as advertisements on your site
        </p>
      </div>

      {/* Fetch Jobs Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Fetch Jobs from Jooble</CardTitle>
          <CardDescription>
            Search for jobs on Jooble. They will be saved as pending for your review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="e.g., software engineer, marketing"
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., New York, London"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={fetchJobsFromJooble} 
            disabled={fetching}
            className="w-full md:w-auto"
          >
            {fetching ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Fetch Jobs
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Ads Management Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={currentTab} className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading ads...</p>
            </div>
          ) : ads.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No {currentTab} ads found
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {ads.map((ad) => (
                <Card key={ad.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{ad.title}</CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {ad.companyName}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {ad.location}
                          </div>
                          {ad.type && (
                            <Badge variant="secondary">{ad.type}</Badge>
                          )}
                          {ad.salary && (
                            <Badge variant="secondary">{ad.salary}</Badge>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant={
                          ad.status === 'approved' 
                            ? 'default' 
                            : ad.status === 'rejected' 
                            ? 'destructive' 
                            : 'secondary'
                        }
                      >
                        {ad.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm whitespace-pre-wrap">
                          {ad.snippet || ad.description.substring(0, 300)}
                          {ad.description.length > 300 && '...'}
                        </p>
                      </div>

                      {ad.status === 'approved' && (
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {ad.impressionsCount} impressions
                          </div>
                          <div className="flex items-center gap-1">
                            <MousePointerClick className="h-4 w-4" />
                            {ad.clicksCount} clicks
                          </div>
                        </div>
                      )}

                      {ad.status === 'rejected' && ad.rejectionReason && (
                        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                          <strong>Rejection Reason:</strong> {ad.rejectionReason}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Added {new Date(ad.createdAt).toLocaleDateString()}
                        </span>
                        {ad.source && (
                          <>
                            <span>•</span>
                            <span>Source: {ad.source}</span>
                          </>
                        )}
                      </div>

                      <a
                        href={ad.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        View original posting
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    {ad.status === 'pending' && (
                      <>
                        <Textarea
                          placeholder="Optional: Rejection reason..."
                          value={rejectionReason[ad.id] || ''}
                          onChange={(e) => 
                            setRejectionReason(prev => ({
                              ...prev,
                              [ad.id]: e.target.value
                            }))
                          }
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2 w-full">
                          <Button
                            onClick={() => handleApprove(ad.id)}
                            className="flex-1"
                            variant="default"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(ad.id)}
                            className="flex-1"
                            variant="destructive"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => handleDelete(ad.id)}
                            variant="outline"
                            size="icon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    {ad.status !== 'pending' && (
                      <Button
                        onClick={() => handleDelete(ad.id)}
                        variant="outline"
                        className="w-full"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
