import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechRecognitionProps {
  onResult: (transcript: string) => void;
  onEnd?: () => void;
  language?: string;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  start: () => Promise<void>;
  stop: () => void;
  error: string | null;
}

export function useSpeechRecognition({
  onResult,
  onEnd,
  language = 'en-US'
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(() => 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Initialize recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;

    // Configure handlers
    recognitionInstance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      onResult(transcript);
    };

    recognitionInstance.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied');
        toast({
          title: "Permission Denied",
          description: "Please allow microphone access to use speech input.",
          variant: "destructive"
        });
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.abort();
    };
  }, [isSupported, language, onResult, onEnd]);

  // Silence detection
  useEffect(() => {
    if (!isListening || !recognition) return;

    let silenceTimer: NodeJS.Timeout;
    const audioContext = new AudioContext();
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let silenceCount = 0;
    const SILENCE_THRESHOLD = 10;
    const MAX_SILENCE_COUNT = 50;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        source.connect(analyser);
        
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        function checkAudioLevel() {
          if (!isListening) return;
          
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          
          if (average < SILENCE_THRESHOLD) {
            silenceCount++;
            if (silenceCount > MAX_SILENCE_COUNT) {
              stop();
              return;
            }
          } else {
            silenceCount = 0;
          }
          
          silenceTimer = setTimeout(checkAudioLevel, 100);
        }
        
        checkAudioLevel();
      })
      .catch(err => {
        console.error('Audio context error:', err);
      });

    return () => {
      clearTimeout(silenceTimer);
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [isListening, recognition]);

  const start = useCallback(async () => {
    if (!recognition) {
      setError('Speech recognition not supported');
      return;
    }

    try {
      // Request microphone permission
      console.log('Requesting microphone permission...'); // Add log before permission request
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted.'); // Add log after permission grant
      
      recognition.start();
      setIsListening(true);
      setError(null);
    } catch (err) {
      setError('Failed to start speech recognition');
      console.error('Speech recognition start error:', err, (err as Error).message, (err as Error).name, (err as Error).stack); // Log full error details
    }
  }, [recognition]);

  const stop = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return {
    isListening,
    isSupported,
    start,
    stop,
    error
  };
}