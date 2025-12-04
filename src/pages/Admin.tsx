import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Image, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Download, 
  Search,
  Edit,
  Check,
  X,
  FileText,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Submission {
  id: number;
  text: string;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  contributor: string;
  imageUrl: string;
}

const Admin = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [editedText, setEditedText] = useState('');

  // Mock submissions
  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: 1, text: 'چې زړه پاک وي، وطن پاک وي', status: 'pending', date: '2024-01-15', contributor: 'Ahmad', imageUrl: '' },
    { id: 2, text: 'پښتو زما ژبه ده', status: 'pending', date: '2024-01-14', contributor: 'Fatima', imageUrl: '' },
    { id: 3, text: 'علم په زړه کې رڼا ده', status: 'approved', date: '2024-01-13', contributor: 'Khan', imageUrl: '' },
    { id: 4, text: 'صبر تلخ دی خو ثمر یې خوږ دی', status: 'approved', date: '2024-01-12', contributor: 'Zara', imageUrl: '' },
    { id: 5, text: 'په کار کې برکت دی', status: 'rejected', date: '2024-01-11', contributor: 'Omar', imageUrl: '' },
  ]);

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  const filteredSubmissions = submissions.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = s.text.includes(searchQuery) || s.contributor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (id: number, newStatus: 'approved' | 'rejected') => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: newStatus } : s
    ));
    toast({
      title: newStatus === 'approved' ? 'Submission Approved' : 'Submission Rejected',
      description: `Submission #${id} has been ${newStatus}`,
    });
  };

  const handleEditSave = () => {
    if (editingSubmission) {
      setSubmissions(submissions.map(s => 
        s.id === editingSubmission.id ? { ...s, text: editedText } : s
      ));
      setEditingSubmission(null);
      toast({
        title: 'Text Updated',
        description: 'The transcription has been corrected',
      });
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    const approvedData = submissions.filter(s => s.status === 'approved');
    
    if (format === 'json') {
      const jsonData = JSON.stringify(approvedData.map(s => ({
        id: s.id,
        text: s.text,
        contributor_id: s.contributor,
        created_at: s.date,
      })), null, 2);
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pashto_ocr_dataset.json';
      a.click();
    } else {
      const csvRows = [
        'id,text,contributor_id,created_at',
        ...approvedData.map(s => `${s.id},"${s.text}",${s.contributor},${s.date}`)
      ];
      const csvData = csvRows.join('\n');
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pashto_ocr_dataset.csv';
      a.click();
    }

    toast({
      title: 'Export Complete',
      description: `Downloaded ${approvedData.length} approved submissions as ${format.toUpperCase()}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/10 text-success">{t('dashboard.approved')}</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning">{t('dashboard.pending')}</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive">{t('dashboard.rejected')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t('admin.title')}</h1>
              <p className="text-muted-foreground">Review, approve, and manage submissions</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('json')}>
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatsCard icon={FileText} value={stats.total} label="Total" />
            <StatsCard icon={Clock} value={stats.pending} label={t('dashboard.pending')} />
            <StatsCard icon={CheckCircle} value={stats.approved} label={t('dashboard.approved')} />
            <StatsCard icon={XCircle} value={stats.rejected} label={t('dashboard.rejected')} />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by text or contributor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('admin.filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">{t('dashboard.pending')}</SelectItem>
                <SelectItem value="approved">{t('dashboard.approved')}</SelectItem>
                <SelectItem value="rejected">{t('dashboard.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submissions Table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Image</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Text</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contributor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="w-16 h-12 rounded bg-muted flex items-center justify-center">
                          <Image className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="pashto-text text-foreground max-w-xs truncate">{submission.text}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{submission.contributor}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-muted-foreground">{submission.date}</span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingSubmission(submission);
                              setEditedText(submission.text);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {submission.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-success hover:text-success hover:bg-success/10"
                                onClick={() => handleStatusChange(submission.id, 'approved')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleStatusChange(submission.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Dialog */}
          <Dialog open={!!editingSubmission} onOpenChange={() => setEditingSubmission(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('admin.edit')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-24 pashto-text text-lg"
                  dir="rtl"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingSubmission(null)}>
                  Cancel
                </Button>
                <Button onClick={handleEditSave} className="gradient-primary text-primary-foreground">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
