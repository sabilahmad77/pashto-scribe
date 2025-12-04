import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Upload, X, CheckCircle, Sparkles, Loader2, Camera, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contribute = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pashtoText, setPashtoText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ocrConfidence, setOcrConfidence] = useState<'high' | 'medium' | 'low' | null>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, []);

  const processImage = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setPashtoText('');
      setOcrConfidence(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      processImage(file);
    }
  }, []);

  const runOCR = async () => {
    if (!imagePreview) {
      toast({
        title: "No image",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setOcrConfidence(null);

    try {
      console.log('Starting OCR scan...');
      
      const { data, error } = await supabase.functions.invoke('pashto-ocr', {
        body: { image: imagePreview }
      });

      if (error) {
        console.error('OCR error:', error);
        throw new Error(error.message || 'OCR failed');
      }

      console.log('OCR response:', data);

      if (data.success && data.text) {
        setPashtoText(data.text);
        setOcrConfidence('high');
        toast({
          title: "Text Recognized!",
          description: "AI has extracted the text. Please verify and edit if needed.",
        });
      } else {
        setOcrConfidence('low');
        toast({
          title: "Could not read text",
          description: data.message || "Please ensure the handwriting is clear and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OCR error:', error);
      toast({
        title: "OCR Failed",
        description: error instanceof Error ? error.message : "Failed to scan image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile || !pashtoText.trim() || !consent) {
      toast({
        title: "Missing fields",
        description: "Please upload an image, enter the text, and agree to the license",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission - will be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    toast({
      title: t('contribute.success'),
      description: "Your contribution helps build Pashto OCR!",
    });
  };

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setPashtoText('');
    setName('');
    setEmail('');
    setCountry('');
    setConsent(false);
    setSubmitted(false);
    setOcrConfidence(null);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-lg mx-auto text-center animate-scale-in">
            <div className="inline-flex p-6 rounded-full bg-success/10 mb-6">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('contribute.success')}</h2>
            <p className="text-muted-foreground mb-8">Your contribution helps advance Pashto language technology!</p>
            <Button onClick={resetForm} size="lg" className="gradient-primary text-primary-foreground">
              Submit Another
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('contribute.title')}</h1>
            <p className="text-muted-foreground">
              Upload your handwritten Pashto and use AI to automatically recognize the text
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('contribute.upload')}</Label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`relative border-2 border-dashed rounded-xl transition-colors ${
                  imagePreview ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                {imagePreview ? (
                  <div className="relative p-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setPashtoText('');
                        setOcrConfidence(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                    <div className="p-4 rounded-full bg-muted mb-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <span className="text-foreground font-medium mb-1">{t('contribute.dragdrop')}</span>
                    <span className="text-sm text-muted-foreground">{t('contribute.formats')}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* OCR Button */}
            {imagePreview && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  onClick={runOCR}
                  disabled={isScanning}
                  className="gradient-secondary text-secondary-foreground px-8"
                  size="lg"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Scanning with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Scan with AI OCR
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* OCR Confidence Indicator */}
            {ocrConfidence && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                ocrConfidence === 'high' ? 'bg-success/10 text-success' :
                ocrConfidence === 'medium' ? 'bg-warning/10 text-warning' :
                'bg-destructive/10 text-destructive'
              }`}>
                {ocrConfidence === 'high' ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">AI recognized the text with high confidence. Please verify.</span>
                  </>
                ) : ocrConfidence === 'low' ? (
                  <>
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Could not recognize text. Please type manually.</span>
                  </>
                ) : null}
              </div>
            )}

            {/* Pashto Text Input */}
            <div className="space-y-3">
              <Label htmlFor="pashtoText" className="text-base font-semibold">
                {t('contribute.text')}
                {pashtoText && <span className="text-muted-foreground font-normal ml-2">(Edit if needed)</span>}
              </Label>
              <Textarea
                id="pashtoText"
                value={pashtoText}
                onChange={(e) => setPashtoText(e.target.value)}
                placeholder={t('contribute.placeholder')}
                className="min-h-32 text-xl pashto-text"
                dir="rtl"
              />
              <p className="text-xs text-muted-foreground">
                Tip: After AI scans your image, please verify and correct any mistakes in the recognized text.
              </p>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('contribute.name')}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('contribute.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('contribute.country')}</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                {t('contribute.consent')}
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              disabled={!imageFile || !pashtoText.trim() || !consent || isSubmitting}
              className="w-full gradient-primary text-primary-foreground"
            >
              {isSubmitting ? 'Submitting...' : t('contribute.submit')}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contribute;
