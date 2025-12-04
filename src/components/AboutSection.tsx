import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Sparkles, Target, Heart } from 'lucide-react';

export function AboutSection() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About This Project</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          An experimental initiative to bring Pashto into modern AI systems
        </p>
      </div>

      {/* Mission Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Our Mission</h3>
            <p className="text-sm text-muted-foreground">
              To create high-quality training data for Pashto handwriting recognition, enabling AI to understand one of the world's most beautiful scripts.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-secondary/10 w-fit mx-auto">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold">How It Works</h3>
            <p className="text-sm text-muted-foreground">
              Contributors submit handwritten Pashto images with verified text. This data trains AI models to better recognize Pashto handwriting.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-accent/10 w-fit mx-auto">
              <Heart className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold">Community Driven</h3>
            <p className="text-sm text-muted-foreground">
              Every contribution helps improve OCR accuracy. Together, we're building a future where Pashto speakers can fully participate in the digital age.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Creator Section */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground">
              SA
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
              <h2 className="text-2xl font-bold">Sabil Ahmad</h2>
              <p className="text-lg text-primary font-medium">Blockchain & AI Engineer</p>
              <p className="text-muted-foreground">
                Sabil Ahmad is passionate about leveraging cutting-edge technology to preserve and promote the Pashto language. 
                This project represents his commitment to bringing Pashto into modern AI systems, 
                making it accessible for future generations while celebrating its rich cultural heritage.
              </p>
              <a
                href="https://sabilahmad.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                Visit sabilahmad.com
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
        <h3 className="text-xl font-bold mb-2">Ready to Contribute?</h3>
        <p className="text-muted-foreground mb-4">
          Your contributions help train AI models to better understand Pashto handwriting.
        </p>
        <p className="text-sm text-muted-foreground">
          Every sample makes a difference in preserving our language for the digital age.
        </p>
      </div>
    </div>
  );
}
