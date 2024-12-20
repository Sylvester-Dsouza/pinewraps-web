'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { formatDate, calculateNextTierProgress, TIER_BENEFITS, TIER_COLORS, calculateTier } from '@/lib/utils';

interface RewardHistory {
  id: string;
  pointsEarned: number;
  pointsRedeemed: number;
  action: 'EARNED' | 'REDEEMED';
  description: string;
  createdAt: string;
}

interface CustomerReward {
  id: string;
  points: number;
  totalPoints: number;
  tier: 'GREEN' | 'SILVER' | 'GOLD' | 'PLATINUM';
  history: RewardHistory[];
}

export default function RewardsPage() {
  const { user, loading: authLoading } = useAuth();
  const [rewards, setRewards] = useState<CustomerReward | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        if (!user) return;

        // Get the current user's ID token
        const token = await user.getIdToken();
        if (!token) {
          throw new Error('No authentication token available');
        }

        const response = await fetch('/api/rewards', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch rewards');
        }

        const data = await response.json();
        if (data.success && data.data) {
          // Calculate the correct tier based on total points
          const totalPoints = data.data.totalPoints || 0;
          const calculatedTier = calculateTier(totalPoints);
          
          setRewards({
            ...data.data,
            tier: calculatedTier // Override the tier with calculated value
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching rewards:', error);
        toast({
          title: 'Error',
          description: 'Failed to load rewards data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchRewards();
    }
  }, [user, authLoading, toast]);

  // Calculate tier and next tier info based on total points
  const currentTier = rewards ? calculateTier(rewards.totalPoints) : 'GREEN';
  const nextTierInfo = calculateNextTierProgress(rewards?.totalPoints || 0);

  if (loading || authLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in Required</CardTitle>
          <CardDescription>
            Please sign in to view your rewards.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Rewards</span>
            <Badge className={TIER_COLORS[currentTier]}>
              {currentTier} TIER
            </Badge>
          </CardTitle>
          <CardDescription>
            Your current rewards status and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Available Points</span>
                <span className="text-2xl font-bold">{rewards?.points || 0}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Total Points Earned: <span className="font-medium">{rewards?.totalPoints || 0}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Current Tier: <span className="font-medium">{currentTier}</span>
              </div>
              <div className="text-sm text-gray-500">
                {TIER_BENEFITS[currentTier]}
              </div>
            </div>

            {nextTierInfo && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Next Tier Progress</span>
                  <span className="text-sm text-gray-600">
                    {nextTierInfo.pointsNeeded} points needed for {nextTierInfo.nextTier}
                  </span>
                </div>
                <Progress 
                  value={nextTierInfo.progress}
                  className="h-2"
                />
                <div className="text-sm text-gray-500 mt-1 text-right">
                  {Math.round(nextTierInfo.progress)}% to {nextTierInfo.nextTier}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
          <CardDescription>Your recent points activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewards?.history.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(item.createdAt)}</p>
                </div>
                <span className={`font-medium ${
                  item.action === 'EARNED' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.action === 'EARNED' ? 
                    `+${item.pointsEarned}` : 
                    `-${item.pointsRedeemed}`
                  } points
                </span>
              </div>
            ))}
            {(!rewards?.history || rewards.history.length === 0) && (
              <p className="text-center text-gray-500 py-4">No points history yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
