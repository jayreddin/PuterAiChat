import { useState, useCallback, useEffect } from 'react';

export interface UseSpeechRecognitionProps {
  onResult: (text: string) => void;
  language?: string;
  onError?: (error: { message: string }) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export function useSpeechRecognition({
  onResult,
  language = 'en-US',
  onError
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = language;

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            }
          }

          if (finalTranscript) {
            onResult(finalTranscript);
          }
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          onError?.({ message: event.error });
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [language, onResult, onError]);

  const startRecording = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        onError?.({ message: 'Failed to start recording' });
      }
    }
  }, [recognition, onError]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Failed to stop recording:', error);
        onError?.({ message: 'Failed to stop recording' });
      }
    }
  }, [recognition, onError]);

  return {
    isSupported: !!recognition,
    isListening,
    startRecording,
    stopRecording,
  };
}