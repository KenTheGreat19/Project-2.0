'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Building2, Briefcase } from 'lucide-react';

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
}

interface JoobleAdDisplayProps {
  limit?: number;
  random?: boolean;
  className?: string;
}

export default function JoobleAdDisplay({ 
  limit = 3, 
  random = true,
  className = '' 
}: JoobleAdDisplayProps) {
  const [ads, setAds] = useState<JoobleAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/jooble/ads?limit=${limit}&random=${random}`);
      const data = await response.json();
      
      if (response.ok) {
        setAds(data.ads || []);
      }
    } catch (error) {
      console.error('Failed to fetch Jooble ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId: string) => {
    try {
      await fetch(`/api/jooble/ads/${adId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'impression' }),
      });
    } catch (error) {
      console.error('Failed to track impression:', error);
    }
  };

  const trackClick = async (adId: string) => {
    try {
      await fetch(`/api/jooble/ads/${adId}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'click' }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const handleAdClick = (ad: JoobleAd) => {
    trackClick(ad.id);
    window.open(ad.applyUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    // Track impressions for all displayed ads
    ads.forEach(ad => trackImpression(ad.id));
  }, [ads]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (ads.length === 0) {
    return null; // Don't show anything if no ads available
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Featured Job Opportunities</h3>
        <Badge variant="secondary" className="ml-auto">Sponsored</Badge>
      </div>

      {ads.map((ad) => (
        <Card 
          key={ad.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary"
          onClick={() => handleAdClick(ad)}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-start justify-between">
              <span className="flex-1">{ad.title}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {ad.companyName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {ad.location}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ad.snippet || ad.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {ad.type && (
                  <Badge variant="outline" className="text-xs">
                    {ad.type}
                  </Badge>
                )}
                {ad.salary && (
                  <Badge variant="secondary" className="text-xs">
                    {ad.salary}
                  </Badge>
                )}
              </div>

              <Button 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdClick(ad);
                }}
              >
                Apply Now
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <p className="text-xs text-center text-muted-foreground mt-4">
        These are external job postings. Clicking will redirect you to the employer&apos;s application page.
      </p>
    </div>
  );
}
