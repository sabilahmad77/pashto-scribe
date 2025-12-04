import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Check, X, Download, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Sample {
  id: string;
  image_url: string;
  original_ocr_text: string | null;
  corrected_text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (isAdmin) {
      fetchSamples();
    }
  }, [isAdmin, filter, page]);

  const fetchSamples = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ocr_samples')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setSamples(data as Sample[]);
    } catch (err) {
      console.error('Error fetching samples:', err);
      toast.error('Failed to load samples');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('ocr_samples')
        .update({
          status,
          reviewer_id: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Sample ${status}`);
      fetchSamples();
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const saveEdit = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ocr_samples')
        .update({ corrected_text: editText })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Text updated');
      setEditingId(null);
      fetchSamples();
    } catch (err) {
      console.error('Error saving edit:', err);
      toast.error('Failed to save');
    }
  };

  const exportData = async () => {
    try {
      const { data, error } = await supabase
        .from('ocr_samples')
        .select('*')
        .eq('status', 'approved');

      if (error) throw error;

      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pashto-ocr-dataset-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Dataset exported');
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Failed to export');
    }
  };

  if (!isAdmin) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Admin access required</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setFilter(f); setPage(0); }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
        <Button variant="outline" onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          Export Approved
        </Button>
      </div>

      {/* Samples Grid */}
      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : samples.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No samples found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {samples.map((sample) => (
            <Card key={sample.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    <img
                      src={sample.image_url}
                      alt="Handwriting sample"
                      className="w-full h-32 object-contain rounded-lg bg-muted"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={
                        sample.status === 'approved' ? 'default' :
                        sample.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {sample.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(sample.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {sample.original_ocr_text && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">OCR: </span>
                        <span className="pashto-text">{sample.original_ocr_text}</span>
                      </div>
                    )}

                    {editingId === sample.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="pashto-text"
                          dir="rtl"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(sample.id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="p-3 rounded-lg bg-muted/50 pashto-text text-lg cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => { setEditingId(sample.id); setEditText(sample.corrected_text); }}
                      >
                        {sample.corrected_text}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {sample.status === 'pending' && (
                    <div className="flex lg:flex-col gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success hover:bg-success hover:text-success-foreground"
                        onClick={() => updateStatus(sample.id, 'approved')}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => updateStatus(sample.id, 'rejected')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-4 py-2 text-sm">Page {page + 1}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={samples.length < pageSize}
          onClick={() => setPage(p => p + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
