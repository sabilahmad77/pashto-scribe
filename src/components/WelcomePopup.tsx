import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart } from 'lucide-react';

export function WelcomePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('pashto-ocr-welcome-seen');
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('pashto-ocr-welcome-seen', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Welcome to Pashto OCR
          </DialogTitle>
          <DialogDescription className="text-center space-y-4 pt-4">
            <p className="text-base">
              <span className="font-semibold text-foreground">Sabil Ahmad</span> welcomes you to this experimental Pashto handwriting recognition project!
            </p>
            <p className="text-muted-foreground">
              This is a testing app designed to help collect and improve Pashto OCR accuracy. Your contributions will help bring Pashto into modern AI systems.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary pt-2">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Please leave feedback after using it!</span>
              <Heart className="h-4 w-4" />
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={handleClose} className="px-8">
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
