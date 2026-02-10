// ============================================================
// FILE: src/hooks.js
// Custom Hooks for Portfolio Enhancements
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';

// ── KEYBOARD NAVIGATION ─────────────────────────────────────
export const useKeyboardNavigation = ({ onNext, onPrev, onSelect, onBack }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Prevent if user is typing in input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    onNext?.();
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    onPrev?.();
                    break;
                case 'Enter':
                    onSelect?.();
                    break;
                case 'Escape':
                case 'Backspace':
                    e.preventDefault();
                    onBack?.();
                    break;
                case '1':
                    onSelect?.('brahma');
                    break;
                case '2':
                    onSelect?.('shiva');
                    break;
                case '3':
                    onSelect?.('vishnu');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNext, onPrev, onSelect, onBack]);
};

// ── GESTURE SUPPORT FOR TOUCH DEVICES ───────────────────────
export const useGestures = (ref, { onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight }) => {
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

    useEffect(() => {
        const element = ref?.current || document.body;

        const handleTouchStart = (e) => {
            if (e.touches.length === 1) {
                touchStartRef.current = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                    time: Date.now()
                };
            }
        };

        const handleTouchEnd = (e) => {
            if (e.changedTouches.length === 1) {
                const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
                const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
                const deltaTime = Date.now() - touchStartRef.current.time;
                const threshold = 50;
                const maxTime = 300;

                if (deltaTime > maxTime) return;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > threshold) onSwipeRight?.();
                    else if (deltaX < -threshold) onSwipeLeft?.();
                } else {
                    if (deltaY > threshold) onSwipeDown?.();
                    else if (deltaY < -threshold) onSwipeUp?.();
                }
            }
        };

        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [ref, onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight]);
};

// ── PREFERS REDUCED MOTION ──────────────────────────────────
export const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
};

// ── SOUND EFFECTS ───────────────────────────────────────────
export const useSoundEffects = () => {
    const [enabled, setEnabled] = useState(false);
    const audioContextRef = useRef(null);

    useEffect(() => {
        // Initialize Web Audio API
        try {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }, []);

    const playSound = useCallback((soundName, options = {}) => {
        if (!enabled || !audioContextRef.current) return;

        const { volume = 0.3, frequency = 440, duration = 0.1 } = options;

        try {
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            oscillator.frequency.value = frequency;
            gainNode.gain.value = volume;

            oscillator.start();
            oscillator.stop(audioContextRef.current.currentTime + duration);
        } catch (e) {
            console.warn('Error playing sound:', e);
        }
    }, [enabled]);

    return { enabled, setEnabled, playSound };
};

// ── ACHIEVEMENTS ────────────────────────────────────────────
const ACHIEVEMENTS = {
    FIRST_VISIT: { id: 'first_visit', title: 'First Steps', description: 'Welcome to the journey!', icon: '👋' },
    EXPLORER: { id: 'explorer', title: 'Explorer', description: 'Visited all three mountains', icon: '🏔️' },
    TRAIN_MASTER: { id: 'train_master', title: 'Train Master', description: 'Interacted with the train 10 times', icon: '🚂' },
    SPEED_RUNNER: { id: 'speed_runner', title: 'Speed Runner', description: 'Completed journey in under 2 minutes', icon: '⚡' },
    COMPLETIONIST: { id: 'completionist', title: 'Completionist', description: 'Viewed all projects and resume', icon: '🏆' },
    NIGHT_OWL: { id: 'night_owl', title: 'Night Owl', description: 'Visited between midnight and 5 AM', icon: '🦉' },
    KONAMI: { id: 'konami', title: 'Secret Code Master', description: 'Discovered the secret!', icon: '🎮' },
};

export const useAchievements = () => {
    const [unlocked, setUnlocked] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('achievements') || '[]');
        } catch {
            return [];
        }
    });
    const [showNotification, setShowNotification] = useState(null);

    const unlock = useCallback((achievementId) => {
        if (unlocked.includes(achievementId)) return;

        const newUnlocked = [...unlocked, achievementId];
        setUnlocked(newUnlocked);
        localStorage.setItem('achievements', JSON.stringify(newUnlocked));
        setShowNotification(ACHIEVEMENTS[achievementId]);

        setTimeout(() => setShowNotification(null), 3000);
    }, [unlocked]);

    // Check for night owl on mount
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 5) {
            unlock('NIGHT_OWL');
        }
        unlock('FIRST_VISIT');
    }, [unlock]);

    return { unlocked, unlock, showNotification, ACHIEVEMENTS };
};

// ── SCREEN SHAKE ────────────────────────────────────────────
export const useScreenShake = () => {
    const [shake, setShake] = useState(false);

    const triggerShake = useCallback((intensity = 'medium') => {
        setShake(intensity);
        setTimeout(() => setShake(false), 500);
    }, []);

    return { shake, triggerShake };
};

// ── KONAMI CODE ─────────────────────────────────────────────
export const useKonamiCode = (callback) => {
    const inputRef = useRef([]);

    useEffect(() => {
        // Define sequence inside useEffect to satisfy exhaustive-deps
        const sequence = [
            'ArrowUp', 'ArrowUp',
            'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight',
            'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];

        const handleKeyDown = (e) => {
            inputRef.current.push(e.key);
            inputRef.current = inputRef.current.slice(-10);

            if (inputRef.current.join(',') === sequence.join(',')) {
                callback();
                inputRef.current = [];
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [callback]);
};

// ── COLOR THEME ─────────────────────────────────────────────
const SCENE_THEMES = {
    name_fall: { primary: '#00d9ff', secondary: '#0066cc', ambient: 'rgba(0, 217, 255, 0.05)' },
    mountain_selection: { primary: '#fbbf24', secondary: '#92400e', ambient: 'rgba(251, 191, 36, 0.05)' },
    brahma: { primary: '#fbbf24', secondary: '#92400e', ambient: 'rgba(251, 191, 36, 0.08)' },
    shiva: { primary: '#00d9ff', secondary: '#1e40af', ambient: 'rgba(0, 217, 255, 0.08)' },
    vishnu: { primary: '#60a5fa', secondary: '#1e3a8a', ambient: 'rgba(96, 165, 250, 0.08)' },
    contact: { primary: '#10b981', secondary: '#065f46', ambient: 'rgba(16, 185, 129, 0.08)' },
};

export const useColorTheme = (sceneKey) => {
    useEffect(() => {
        const theme = SCENE_THEMES[sceneKey] || SCENE_THEMES.name_fall;

        document.documentElement.style.setProperty('--theme-primary', theme.primary);
        document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
        document.documentElement.style.setProperty('--theme-ambient', theme.ambient);
    }, [sceneKey]);
};

// ── CONSOLE MESSAGE ─────────────────────────────────────────
export const useConsoleMessage = () => {
    useEffect(() => {
        console.log(`
%c 🚂 Welcome, curious developer! 🚂
%c
╔═══════════════════════════════════════════╗
║   VANDAN SHARMA - Systems Engineer        ║
║                                           ║
║   Like what you see?                      ║
║   Let's build something amazing together! ║
║                                           ║
║   📧 vandan.sharma06@gmail.com            ║
║   💼 github.com/DevWizard-Vandan          ║
╚═══════════════════════════════════════════╝

%cType 'hire()' for a surprise! 😉
`,
            'font-size: 20px; font-weight: bold; color: #00d9ff;',
            'font-size: 12px; color: #94a3b8; font-family: monospace;',
            'font-size: 14px; color: #fbbf24;'
        );

        window.hire = () => {
            window.open('mailto:vandan.sharma06@gmail.com?subject=Let\'s Work Together!', '_blank');
            console.log('%c📬 Opening email... Thanks for your interest!', 'color: #00d9ff; font-size: 16px;');
        };
    }, []);
};