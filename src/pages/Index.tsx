import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WelcomePopup } from '@/components/WelcomePopup';
import { OCRInterface } from '@/components/OCRInterface';
import { ContributorStats } from '@/components/ContributorStats';
import { AboutSection } from '@/components/AboutSection';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, Shield, ExternalLink } from 'lucide-react';

export default function Index() {
  const { user, isAdmin, signOut, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <WelcomePopup />
      <AuthModal open={showAuth} onOpenChange={setShowAuth} />

      {/* Header */}
      <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent font-pashto">
              پښتو OCR
            </span>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Pashto Handwriting Recognition
            </span>
          </div>
          <div className="flex items-center gap-2">
            {loading ? null : user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => setShowAuth(true)}>
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Tabs defaultValue="scan" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="scan">Scan</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">
                Contribute to Pashto AI
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Help improve Pashto handwriting recognition by uploading samples and correcting the OCR output.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <OCRInterface />
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="max-w-4xl mx-auto">
              <ContributorStats />
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="max-w-4xl mx-auto">
              <AboutSection />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Made by <span className="font-semibold text-foreground">Sabil Ahmad</span> – Blockchain & AI Engineer
            </p>
            <a
              href="https://sabilahmad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              sabilahmad.com
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
