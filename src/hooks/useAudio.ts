import { useState, useRef, useEffect } from 'react';

export function useAudio(src: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.6;
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    // Attempt autoplay if permitted by browser
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      // Browser blocked autoplay until first user gesture
    });

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const playAudio = () => {
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      // Autoplay blocked until gesture
    });
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setHasInteracted(true);
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return { isPlaying, hasInteracted, togglePlay, playAudio, pauseAudio };
}


