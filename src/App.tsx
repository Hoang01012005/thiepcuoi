import { useState, useEffect } from 'react';
import { weddingConfig } from './config/weddingConfig';
import { useLanguage } from './hooks/useLanguage';
import { useAudio } from './hooks/useAudio';
import { AmbientPetals } from './components/effects/AmbientPetals';
import { EnvelopeCover } from './components/envelope/EnvelopeCover';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { CoupleSection } from './components/couple/CoupleSection';
import { StoryTimeline } from './components/story/StoryTimeline';
import { EventDetails } from './components/events/EventDetails';
import { CountdownTimer } from './components/countdown/CountdownTimer';
import { GallerySection } from './components/gallery/GallerySection';
import { RsvpSection } from './components/rsvp/RsvpSection';
import { WishesSection } from './components/wishes/WishesSection';
import { GiftSection } from './components/gift/GiftSection';
import { ClosingSection } from './components/closing/ClosingSection';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { InviteGeneratorPage } from './components/admin/InviteGeneratorPage';

export function App() {
  const { lang, toggleLang } = useLanguage();
  const { isPlaying, togglePlay, playAudio } = useAudio(weddingConfig.audio.src);

  // Check if user is navigating to the dedicated Host / Admin invitation generator portal
  const [isAdminView, setIsAdminView] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return hash === '#invite' || hash === '#tao-thiep' || search.includes('admin') || search.includes('host');
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      setIsAdminView(hash === '#invite' || hash === '#tao-thiep' || search.includes('admin') || search.includes('host'));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const hasSectionHash = Boolean(hash && hash !== '#' && hash !== '#invite' && hash !== '#tao-thiep');
    return hasSectionHash;
  });

  // Automatically initiate music on first touch/interaction on the site
  useEffect(() => {
    const startAudioOnFirstInteraction = () => {
      if (!isPlaying) {
        playAudio();
      }
    };

    window.addEventListener('click', startAudioOnFirstInteraction, { once: true });
    window.addEventListener('touchstart', startAudioOnFirstInteraction, { once: true });
    window.addEventListener('pointerdown', startAudioOnFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', startAudioOnFirstInteraction);
      window.removeEventListener('touchstart', startAudioOnFirstInteraction);
      window.removeEventListener('pointerdown', startAudioOnFirstInteraction);
    };
  }, [isPlaying, playAudio]);

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpened(true);
    playAudio();
  };

  // If in dedicated host generator portal, show the separate administration workspace
  if (isAdminView) {
    return <InviteGeneratorPage />;
  }

  // Pure, pristine guest invitation experience (NO floating edit buttons visible to guests!)
  return (
    <div className="wedding-app-root" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Cinematic Ambient Floating Petals & Sparkles */}
      <AmbientPetals />

      {/* Interactive Envelope Invitation Cover */}
      {!isEnvelopeOpened && (
        <EnvelopeCover lang={lang} onOpen={handleOpenEnvelope} />
      )}

      {/* Main Wedding Invitation Website */}
      <main style={{ opacity: isEnvelopeOpened ? 1 : 0, transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <Navbar
          lang={lang}
          onToggleLang={toggleLang}
          isPlaying={isPlaying}
          onToggleMusic={togglePlay}
        />

        <HeroSection lang={lang} />
        <CoupleSection lang={lang} />
        <StoryTimeline lang={lang} />
        <EventDetails lang={lang} />
        <CountdownTimer lang={lang} />
        <GallerySection lang={lang} />
        <RsvpSection lang={lang} />
        <WishesSection lang={lang} />
        <GiftSection lang={lang} />
        <ClosingSection lang={lang} />
        <MobileBottomBar lang={lang} />
      </main>
    </div>
  );
}

export default App;
