import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Image, FileText, Users, Target, Upload, Camera, Type, Send, Sparkles, BookOpen, Eye } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  // Mock stats - will be replaced with real data
  const stats = {
    images: 2847,
    pairs: 2634,
    contributors: 156,
    target: 10000,
  };

  const benefits = [
    { icon: BookOpen, title: t('why.benefit1'), desc: t('why.benefit1.desc') },
    { icon: Sparkles, title: t('why.benefit2'), desc: t('why.benefit2.desc') },
    { icon: Eye, title: t('why.benefit3'), desc: t('why.benefit3.desc') },
  ];

  const steps = [
    { icon: Type, text: t('how.step1') },
    { icon: Camera, text: t('how.step2') },
    { icon: Upload, text: t('how.step3') },
    { icon: Send, text: t('how.step4') },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Open Source AI Project
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground px-8">
                <Link to="/contribute">{t('hero.cta')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/dashboard">{t('nav.dashboard')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard icon={Image} value={stats.images} label={t('stats.images')} trend="+12%" />
            <StatsCard icon={FileText} value={stats.pairs} label={t('stats.pairs')} trend="+8%" />
            <StatsCard icon={Users} value={stats.contributors} label={t('stats.contributors')} trend="+5%" />
            <StatsCard icon={Target} value={stats.target} label={t('stats.target')} />
          </div>
          <div className="max-w-3xl mx-auto">
            <ProgressBar current={stats.pairs} target={stats.target} label={t('stats.progress')} />
          </div>
        </div>
      </section>

      {/* OCR Flow Diagram */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-6">OCR Training Pipeline</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex flex-col items-center p-4 bg-muted rounded-xl">
                  <div className="w-16 h-16 rounded-lg bg-secondary/20 flex items-center justify-center mb-3">
                    <Image className="h-8 w-8 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Input Image</span>
                  <span className="text-xs text-muted-foreground">(Handwritten Pashto)</span>
                </div>
                <div className="text-3xl text-primary">→</div>
                <div className="flex flex-col items-center p-4 bg-primary/10 rounded-xl border-2 border-primary/30">
                  <div className="w-16 h-16 rounded-lg gradient-primary flex items-center justify-center mb-3">
                    <Sparkles className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">MD-LSTM Classifier</span>
                  <span className="text-xs text-muted-foreground">OCR System</span>
                </div>
                <div className="text-3xl text-primary">→</div>
                <div className="flex flex-col items-center p-4 bg-muted rounded-xl">
                  <div className="w-16 h-16 rounded-lg bg-success/20 flex items-center justify-center mb-3">
                    <FileText className="h-8 w-8 text-success" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Predicted Text</span>
                  <span className="text-xs text-muted-foreground">(Editable Pashto)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('why.title')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('why.description')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="glass-card rounded-xl p-6 text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Contribute */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">{t('how.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="glass-card rounded-xl p-6 text-center h-full">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gradient-primary text-primary-foreground font-bold text-lg mb-4">
                      {index + 1}
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/10 inline-flex mb-4">
                      <step.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <p className="text-sm text-foreground">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground px-8">
                <Link to="/contribute">{t('hero.cta')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Pashto Text */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-foreground mb-6">Sample Pashto Proverbs</h3>
            <div className="space-y-4">
              <div className="glass-card rounded-xl p-6">
                <p className="pashto-text text-2xl text-foreground mb-2">چې زړه پاک وي، وطن پاک وي</p>
                <p className="text-sm text-muted-foreground italic">"If the heart is pure, the homeland is pure"</p>
              </div>
              <div className="glass-card rounded-xl p-6">
                <p className="pashto-text text-2xl text-foreground mb-2">پښتو زما ژبه ده، پښتونخوا زما وطن دی</p>
                <p className="text-sm text-muted-foreground italic">"Pashto is my language, Pashtunkhwa is my homeland"</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
