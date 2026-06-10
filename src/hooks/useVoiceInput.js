import { useCallback, useEffect, useRef, useState } from 'react';

const getSpeechRecognition = () =>
    window.SpeechRecognition || window.webkitSpeechRecognition || null;


export const useVoiceInput = ({ onTranscript, onInterim, lang = 'en-US' } = {}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isSupported, setIsSupported] = useState(null);
    const [error, setError] = useState(null);
    const [interimTranscript, setInterimTranscript] = useState('');

    const recognitionRef = useRef(null);
    const onTranscriptRef = useRef(onTranscript);
    const onInterimRef = useRef(onInterim);

    useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
    useEffect(() => { onInterimRef.current = onInterim; }, [onInterim]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsSupported(!!getSpeechRecognition());
    }, []);

    useEffect(() => {
        return () => {
            recognitionRef.current?.abort();
        };
    }, []);

    const stopRecording = useCallback(() => {
        recognitionRef.current?.stop();
    }, []);

    const startRecording = useCallback(() => {
        const SpeechRecognition = getSpeechRecognition();
        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
            return;
        }

        setError(null);
        setInterimTranscript('');

        const recognition = new SpeechRecognition();
        recognition.continuous = false;    // auto-stop after a pause
        recognition.interimResults = true; // surface partial results
        recognition.lang = lang;

        recognition.onstart = () => setIsRecording(true);

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const text = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += text;
                } else {
                    interim += text;
                }
            }

            if (interim) {
                setInterimTranscript(interim);
                onInterimRef.current?.(interim);
            }
            if (final) {
                setInterimTranscript('');
                onTranscriptRef.current?.(final.trim());
            }
        };

        recognition.onerror = (event) => {
            // 'aborted' is user-initiated — not an error worth showing
            if (event.error === 'aborted') return;

            const ERROR_MESSAGES = {
                'not-allowed':      'Microphone access was denied. Please allow microphone access and try again.',
                'no-speech':        'No speech detected. Please speak clearly and try again.',
                'audio-capture':    'No microphone found. Please connect a microphone and try again.',
                'network':          'A network error occurred during speech recognition.',
                'service-not-allowed': 'Speech recognition service is not allowed.',
            };
            setError(ERROR_MESSAGES[event.error] ?? `Speech recognition error: ${event.error}`);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
            setInterimTranscript('');
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [lang]);

    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    return {
        isRecording,
        isSupported,
        error,
        interimTranscript,
        startRecording,
        stopRecording,
        toggleRecording,
    };
};
