import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useLanguage();

  // Mock user stats
  const userStats = {
    total: 24,
    approved: 18,
    pending: 4,
    rejected: 2,
  };

  // Mock global stats
  const globalStats = {
    images: 2847,
    pairs: 2634,
    target: 10000,
  };

  // Mock submissions
  const mockSubmissions = [
    { id: 1, text: 'چې زړه پاک وي، وطن پاک وي', status: 'approved', date: '2024-01-15' },
    { id: 2, text: 'پښتو زما ژبه ده', status: 'approved', date: '2024-01-14' },
    { id: 3, text: 'علم په زړه کې رڼا ده', status: 'pending', date: '2024-01-13' },
    { id: 4, text: 'صبر تلخ دی خو ثمر یې خوږ دی', status: 'approved', date: '2024-01-12' },
    { id: 5, text: 'په کار کې برکت دی', status: 'rejected', date: '2024-01-11' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/10 text-success hover:bg-success/20">{t('dashboard.approved')}</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">{t('dashboard.pending')}</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">{t('dashboard.rejected')}</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('dashboard.title')}</h1>
              <p className="text-muted-foreground">Track your contributions and see global progress</p>
            </div>
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/contribute">{t('hero.cta')}</Link>
            </Button>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatsCard icon={FileText} value={userStats.total} label={t('dashboard.submissions')} />
            <StatsCard icon={CheckCircle} value={userStats.approved} label={t('dashboard.approved')} />
            <StatsCard icon={Clock} value={userStats.pending} label={t('dashboard.pending')} />
            <StatsCard icon={XCircle} value={userStats.rejected} label={t('dashboard.rejected')} />
          </div>

          {/* Global Progress */}
          <div className="glass-card rounded-xl p-6 mb-10">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('stats.progress')}</h3>
            <ProgressBar current={globalStats.pairs} target={globalStats.target} />
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{globalStats.images.toLocaleString()} {t('stats.images')}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary" />
                <span className="text-muted-foreground">{globalStats.pairs.toLocaleString()} {t('stats.pairs')}</span>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">{t('dashboard.submissions')}</h3>
            </div>
            <div className="divide-y divide-border">
              {mockSubmissions.map((submission) => (
                <div key={submission.id} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="pashto-text text-lg text-foreground truncate">{submission.text}</p>
                    <p className="text-sm text-muted-foreground">{submission.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
