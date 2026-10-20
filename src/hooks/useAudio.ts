import { useState, useRef, useEffect, useCallback } from 'react';

export function useAudio(src: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const webAudioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Fallback romantic music box synthesizer via Web Audio API if audio file fails
  const playSynthesizedMelody = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!webAudioCtxRef.current) {
        webAudioCtxRef.current = new AudioCtx();
      }
      const ctx = webAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Canon in D notes: D4, F#4, A4, D5, A3, C#4, E4, A4, B3, D4, F#4, B4, F#3, A3, C#4, F#4...
      const notes = [
        293.66, 369.99, 440.00, 587.33,
        220.00, 277.18, 329.63, 440.00,
        246.94, 293.66, 369.99, 493.88,
        185.00, 220.00, 277.18, 369.99,
        196.00, 246.94, 293.66, 392.00,
        146.83, 220.00, 293.66, 369.99,
        196.00, 246.94, 293.66, 392.00,
        220.00, 277.18, 329.63, 440.00,
      ];

      let noteIdx = 0;
      const playNextNote = () => {
        if (!isPlaying || !webAudioCtxRef.current) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx % notes.length], now);

        // Music box envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.15, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);

        noteIdx++;
        synthTimerRef.current = window.setTimeout(playNextNote, 480);
      };

      playNextNote();
    } catch {
      // Audio completely unavailable, fail silently
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    audio.addEventListener('error', () => {
      // Fallback to synthesized melody
      if (isPlaying) {
        playSynthesizedMelody();
      }
    });

    return () => {
      audio.pause();
      audio.src = '';
      if (synthTimerRef.current) {
        clearTimeout(synthTimerRef.current);
      }
      if (webAudioCtxRef.current && webAudioCtxRef.current.state !== 'closed') {
        webAudioCtxRef.current.close().catch(() => {});
      }
    };
  }, [src, playSynthesizedMelody, isPlaying]);

  const togglePlay = () => {
    setHasInteracted(true);
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (synthTimerRef.current) {
        clearTimeout(synthTimerRef.current);
      }
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Browser prevented playback or audio failed, try synth
          setIsPlaying(true);
          playSynthesizedMelody();
        });
      } else {
        setIsPlaying(true);
        playSynthesizedMelody();
      }
    }
  };

  return { isPlaying, hasInteracted, togglePlay };
}
