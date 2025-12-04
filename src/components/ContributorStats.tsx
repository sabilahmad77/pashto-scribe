import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Stats {
  total_samples: number;
  approved_samples: number;
  pending_samples: number;
  total_contributors: number;
}

interface UserStats {
  total: number;
  approved: number;
  pending: number;
}

export function ContributorStats() {
  const { user } = useAuth();
  const [communityStats, setCommunityStats] = useState<Stats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch community stats
      const { data: statsData } = await supabase.rpc('get_ocr_stats');
      if (statsData) {
        setCommunityStats(statsData as unknown as Stats);
      }

      // Fetch user stats if logged in
      if (user) {
        const { data: samples, count } = await supabase
          .from('ocr_samples')
          .select('status', { count: 'exact' })
          .eq('contributor_id', user.id);

        if (samples) {
          const approved = samples.filter(s => s.status === 'approved').length;
          const pending = samples.filter(s => s.status === 'pending').length;
          setUserStats({
            total: count || 0,
            approved,
            pending
          });
        }
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Community Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{communityStats?.total_samples || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Samples</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{communityStats?.approved_samples || 0}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{communityStats?.pending_samples || 0}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{communityStats?.total_contributors || 0}</p>
                  <p className="text-xs text-muted-foreground">Contributors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Stats */}
      {user && userStats && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Your Contributions</h3>
          <div className="grid grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{userStats.total}</p>
                <p className="text-sm text-muted-foreground">Submitted</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-success">{userStats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-warning">{userStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
