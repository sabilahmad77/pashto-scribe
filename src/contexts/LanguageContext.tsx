import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ps';

interface Translations {
  [key: string]: {
    en: string;
    ps: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', ps: 'کور' },
  'nav.contribute': { en: 'Contribute', ps: 'مرسته وکړئ' },
  'nav.dashboard': { en: 'Dashboard', ps: 'ډشبورډ' },
  'nav.admin': { en: 'Admin', ps: 'اډمین' },
  'nav.login': { en: 'Login', ps: 'ننوتل' },
  'nav.logout': { en: 'Logout', ps: 'وتل' },
  
  // Hero
  'hero.title': { en: 'Pashto Handwriting Dataset', ps: 'د پښتو لاسلیک ډیټاسیټ' },
  'hero.subtitle': { en: 'Help build the first open-source Pashto OCR training dataset', ps: 'د پښتو OCR لومړی خلاص سرچینه روزنیز ډیټاسیټ جوړولو کې مرسته وکړئ' },
  'hero.cta': { en: 'Start Contributing', ps: 'مرسته پیل کړئ' },
  
  // Stats
  'stats.images': { en: 'Images Collected', ps: 'راټول شوي انځورونه' },
  'stats.pairs': { en: 'Labeled Pairs', ps: 'لیبل شوي جوړه' },
  'stats.contributors': { en: 'Contributors', ps: 'مرستندویان' },
  'stats.target': { en: 'Target', ps: 'هدف' },
  'stats.progress': { en: 'Progress to Goal', ps: 'هدف ته پرمختګ' },
  
  // Why Section
  'why.title': { en: 'Why Pashto OCR Matters', ps: 'ولې د پښتو OCR مهم دی' },
  'why.description': { en: 'Pashto is spoken by over 50 million people, yet digital tools for handwriting recognition are severely lacking. This dataset will enable:', ps: 'پښتو له 50 ملیون څخه زیات خلک وایي، خو د لاسلیک پیژندنې ډیجیټل وسیلې خورا کمې دي. دا ډیټاسیټ به دا ممکن کړي:' },
  'why.benefit1': { en: 'Document Digitization', ps: 'د سندونو ډیجیټل کول' },
  'why.benefit1.desc': { en: 'Convert historical manuscripts and handwritten documents to searchable text', ps: 'تاریخي لاسوندونه او لاسي سندونه د لټون وړ متن ته بدل کړئ' },
  'why.benefit2': { en: 'Educational Tools', ps: 'تعلیمي وسیلې' },
  'why.benefit2.desc': { en: 'Create learning apps that can read and grade Pashto handwriting', ps: 'داسې زده کړې ایپسونه جوړ کړئ چې پښتو لاسلیک لوستلی او درجه بندي کولی شي' },
  'why.benefit3': { en: 'Accessibility', ps: 'لاسرسی' },
  'why.benefit3.desc': { en: 'Help visually impaired users access handwritten content', ps: 'د لید معلولو کاروونکو سره مرسته وکړئ چې لاسلیک منځپانګې ته لاسرسی ولري' },
  
  // How to Contribute
  'how.title': { en: 'How to Contribute', ps: 'څنګه مرسته وکړئ' },
  'how.step1': { en: 'Write a Pashto proverb or text by hand', ps: 'یو پښتو متل یا متن په لاس ولیکئ' },
  'how.step2': { en: 'Take a clear photo of your handwriting', ps: 'د خپل لاسلیک روښانه عکس واخلئ' },
  'how.step3': { en: 'Upload the image and type the exact text', ps: 'انځور اپلوډ کړئ او دقیق متن یې ولیکئ' },
  'how.step4': { en: 'Submit to help train the OCR model', ps: 'د OCR ماډل روزنې لپاره یې وسپارئ' },
  
  // Contribute Page
  'contribute.title': { en: 'Contribute a Sample', ps: 'یوه نمونه ورکړئ' },
  'contribute.upload': { en: 'Upload Image', ps: 'انځور اپلوډ کړئ' },
  'contribute.dragdrop': { en: 'Drag and drop or click to upload', ps: 'کش کړئ او غورځوئ یا کلیک وکړئ' },
  'contribute.formats': { en: 'JPG, PNG up to 10MB', ps: 'JPG، PNG تر 10MB پورې' },
  'contribute.text': { en: 'Type the exact Pashto text', ps: 'دقیق پښتو متن ولیکئ' },
  'contribute.placeholder': { en: 'Type the Pashto text exactly as shown in the image...', ps: 'پښتو متن دقیقاً لکه څنګه چې په انځور کې ښودل شوی ولیکئ...' },
  'contribute.name': { en: 'Your Name (optional)', ps: 'ستاسو نوم (اختیاري)' },
  'contribute.email': { en: 'Email (optional)', ps: 'بریښنالیک (اختیاري)' },
  'contribute.country': { en: 'Country (optional)', ps: 'هیواد (اختیاري)' },
  'contribute.consent': { en: 'I agree to release this data under an open-source license', ps: 'زه موافق یم چې دا ډاټا د خلاصې سرچینې جواز لاندې خوشې کړم' },
  'contribute.submit': { en: 'Submit Contribution', ps: 'مرسته وسپارئ' },
  'contribute.success': { en: 'Thank you! Your contribution has been submitted.', ps: 'مننه! ستاسو مرسته سپارل شوې.' },
  
  // Dashboard
  'dashboard.title': { en: 'Your Dashboard', ps: 'ستاسو ډشبورډ' },
  'dashboard.submissions': { en: 'Your Submissions', ps: 'ستاسو سپارنې' },
  'dashboard.approved': { en: 'Approved', ps: 'تایید شوي' },
  'dashboard.pending': { en: 'Pending', ps: 'انتظار' },
  'dashboard.rejected': { en: 'Rejected', ps: 'رد شوي' },
  
  // Admin
  'admin.title': { en: 'Admin Panel', ps: 'اډمین پینل' },
  'admin.review': { en: 'Review Submissions', ps: 'سپارنې بیاکتنه کړئ' },
  'admin.approve': { en: 'Approve', ps: 'تایید' },
  'admin.reject': { en: 'Reject', ps: 'رد' },
  'admin.edit': { en: 'Edit Text', ps: 'متن سمول' },
  'admin.export': { en: 'Export Data', ps: 'ډاټا صادرول' },
  'admin.filter': { en: 'Filter', ps: 'فلټر' },
  
  // Footer
  'footer.privacy': { en: 'Privacy Policy', ps: 'د محرمیت تګلاره' },
  'footer.license': { en: 'Open Source License', ps: 'د خلاصې سرچینې جواز' },
  'footer.contact': { en: 'Contact', ps: 'اړیکه' },
  'footer.copyright': { en: '© 2024 Pashto Handwriting Dataset. Open source project.', ps: '© 2024 د پښتو لاسلیک ډیټاسیټ. د خلاصې سرچینې پروژه.' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ps';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
