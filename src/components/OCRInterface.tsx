import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Loader2, Send, ImageIcon, AlertCircle } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function OCRInterface() {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImage(dataUrl);
        processOCR(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    setImage(imageDataUrl);
    processOCR(imageDataUrl);
  };

  const processOCR = async (imageData: string) => {
    setIsProcessing(true);
    setOcrText('');
    setCorrectedText('');

    try {
      const { data, error } = await supabase.functions.invoke('pashto-ocr', {
        body: { image: imageData }
      });

      if (error) throw error;

      if (data.success) {
        setOcrText(data.text);
        setCorrectedText(data.text);
        toast.success('Text recognized successfully!');
      } else {
        toast.error(data.message || 'Could not recognize text');
      }
    } catch (err) {
      console.error('OCR error:', err);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to contribute');
      return;
    }

    if (!image || !correctedText.trim()) {
      toast.error('Please provide an image and corrected text');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const base64Data = image.split(',')[1];
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage
        .from('ocr-images')
        .upload(fileName, binaryData, {
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ocr-images')
        .getPublicUrl(fileName);

      // Insert sample record
      const { error: insertError } = await supabase
        .from('ocr_samples')
        .insert({
          image_url: publicUrl,
          original_ocr_text: ocrText,
          corrected_text: correctedText.trim(),
          contributor_id: user.id
        });

      if (insertError) throw insertError;

      toast.success('Thank you for your contribution!');
      
      // Reset form
      setImage(null);
      setOcrText('');
      setCorrectedText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setImage(null);
    setOcrText('');
    setCorrectedText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {showCamera && (
        <CameraScanner
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div className="space-y-6">
        {/* Image Input Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Upload Handwritten Pashto
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!image ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1 h-24"
                  onClick={() => setShowCamera(true)}
                >
                  <Camera className="h-6 w-6 mr-2" />
                  Use Camera
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-24"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  <img
                    src={image}
                    alt="Uploaded handwriting"
                    className="w-full max-h-64 object-contain"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Recognizing text...</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={reset} size="sm">
                  Choose Different Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* OCR Result & Correction Section */}
        {image && !isProcessing && (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle>Recognized & Corrected Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ocrText && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-2">Original OCR Result:</p>
                  <p className="pashto-text text-lg">{ocrText}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Corrected Text (edit if needed):
                </label>
                <Textarea
                  value={correctedText}
                  onChange={(e) => setCorrectedText(e.target.value)}
                  placeholder="Enter or correct the Pashto text..."
                  className="pashto-text min-h-[120px] text-lg"
                  dir="rtl"
                />
              </div>

              {!user && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p className="text-sm">Sign in to contribute your corrections</p>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!user || isSubmitting || !correctedText.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Contribution
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
