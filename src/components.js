// ============================================================
// FILE: src/components.js
// Reusable UI Components for Portfolio Enhancements
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// ── SKIP LINK (Accessibility) ───────────────────────────────
export const SkipLink = () => (
    <a href="#main-content" className="skip-link">
        Skip to main content
    </a>
);

// ── SCREEN READER ANNOUNCEMENT ──────────────────────────────
export const ScreenReaderAnnouncement = ({ message }) => (
    <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
    >
        {message}
    </div>
);

// ── JOURNEY TIMELINE ────────────────────────────────────────
export const JourneyTimeline = ({ currentPhase, sceneIndex, scenes, onNavigate }) => {
    const [isVisible, setIsVisible] = useState(true);
    const totalScenes = scenes.length;
    const progress = (sceneIndex / Math.max(1, totalScenes - 1)) * 100;

    return (
        <div className={`journey-timeline ${isVisible ? 'visible' : ''}`} role="navigation" aria-label="Journey progress">
            <button
                className="timeline-toggle"
                onClick={() => setIsVisible(!isVisible)}
                aria-label={isVisible ? 'Hide timeline' : 'Show timeline'}
            >
                {isVisible ? '→' : '←'}
            </button>

            {isVisible && (
                <>
                    <div className="timeline-track">
                        <div className="timeline-progress" style={{ height: `${progress}%` }} />
                        {scenes.map((scene, i) => (
                            <button
                                key={scene.id}
                                className={`timeline-dot ${i <= sceneIndex ? 'active' : ''} ${i === sceneIndex ? 'current' : ''}`}
                                style={{ top: `${(i / Math.max(1, totalScenes - 1)) * 100}%` }}
                                onClick={() => onNavigate?.(i)}
                                aria-label={`Go to ${scene.id.replace(/_/g, ' ')}`}
                                aria-current={i === sceneIndex ? 'step' : undefined}
                            >
                                <span className="timeline-label">{scene.id.replace(/_/g, ' ')}</span>
                            </button>
                        ))}
                    </div>
                    <div className="timeline-indicator">
                        <span className="current-scene">{scenes[sceneIndex]?.id.replace(/_/g, ' ')}</span>
                        <span className="scene-count">{sceneIndex + 1} / {totalScenes}</span>
                    </div>
                </>
            )}
        </div>
    );
};

// ── CUSTOM CURSOR ───────────────────────────────────────────
export const CustomCursor = ({ type }) => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);
    const [position, setPosition] = useState({ x: -100, y: -100 });

    useEffect(() => {
        const moveCursor = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className={`custom-cursor ${type || ''}`}
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            >
                {type === 'click' && <span>Click</span>}
                {type === 'scroll' && <span className="scroll-hint-cursor">↓</span>}
            </div>
            <div
                ref={followerRef}
                className="cursor-follower"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transitionDelay: '50ms'
                }}
            />
        </>
    );
};

// ── CINEMATIC BARS ──────────────────────────────────────────
export const CinematicBars = ({ visible }) => (
    <div className={`cinematic-bars ${visible ? 'visible' : ''}`} aria-hidden="true">
        <div className="bar top" />
        <div className="bar bottom" />
    </div>
);

// ── PARALLAX OVERLAY ────────────────────────────────────────
export const ParallaxOverlay = ({ scrollProgress }) => {
    const y1 = scrollProgress * 50;
    const y2 = scrollProgress * 30;
    const opacity = Math.max(0, 1 - scrollProgress * 2);

    return (
        <div className="parallax-overlay" aria-hidden="true">
            <div
                className="parallax-layer dust"
                style={{ transform: `translateY(${y1}px)`, opacity }}
            />
            <div
                className="parallax-layer fog"
                style={{ transform: `translateY(${y2}px)`, opacity: opacity * 0.5 }}
            />
        </div>
    );
};

// ── ACHIEVEMENT NOTIFICATION ────────────────────────────────
export const AchievementNotification = ({ achievement }) => (
    <div className="achievement-notification" role="alert">
        <span className="achievement-icon">{achievement.icon}</span>
        <div className="achievement-info">
            <span className="achievement-title">🏆 {achievement.title}</span>
            <span className="achievement-desc">{achievement.description}</span>
        </div>
    </div>
);

// ── SOUND TOGGLE ────────────────────────────────────────────
export const SoundToggle = ({ enabled, onToggle }) => (
    <button
        className="sound-toggle"
        onClick={onToggle}
        aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
        title={enabled ? 'Sound On' : 'Sound Off'}
    >
        <span className="sound-icon">{enabled ? '🔊' : '🔇'}</span>
        <span className="sound-text">{enabled ? 'Sound On' : 'Sound Off'}</span>
    </button>
);

// ── MOBILE CONTROLS ─────────────────────────────────────────
export const MobileControls = ({ onAdvance, onReverse, progress }) => {
    return (
        <div className="mobile-controls">
            <div className="mobile-progress">
                <div className="mobile-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="mobile-buttons">
                <button
                    className="mobile-btn reverse"
                    onTouchStart={onReverse}
                    aria-label="Previous scene"
                >
                    <ChevronUp size={24} />
                    <span>Previous</span>
                </button>

                <div className="mobile-indicator">
                    <span>Swipe or tap to navigate</span>
                </div>

                <button
                    className="mobile-btn advance"
                    onTouchStart={onAdvance}
                    aria-label="Next scene"
                >
                    <ChevronDown size={24} />
                    <span>Next</span>
                </button>
            </div>
        </div>
    );
};

// ── ORIENTATION WARNING ─────────────────────────────────────
export const OrientationWarning = () => {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const isPortrait = window.innerHeight > window.innerWidth;
            const isMobile = window.innerWidth < 768;
            setShowWarning(isMobile && isPortrait);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!showWarning) return null;

    return (
        <div className="orientation-warning" role="dialog" aria-labelledby="orientation-title">
            <div className="phone-icon">📱</div>
            <div className="rotate-icon">↻</div>
            <p id="orientation-title">Rotate your device for the best experience</p>
            <button onClick={() => setShowWarning(false)}>Continue anyway</button>
        </div>
    );
};

// ── MINI MAP ────────────────────────────────────────────────
export const MiniMap = ({ scenes, currentIndex, onNavigate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`mini-map ${isExpanded ? 'expanded' : ''}`}>
            <button
                className="mini-map-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-label="Journey map"
            >
                <span className="toggle-icon">{isExpanded ? '✕' : '☰'}</span>
                <span className="toggle-text">Journey Map</span>
            </button>

            {isExpanded && (
                <div className="mini-map-content">
                    <div className="map-grid">
                        {scenes.map((scene, i) => (
                            <button
                                key={scene.id}
                                className={`map-tile ${i === currentIndex ? 'current' : ''} ${i < currentIndex ? 'visited' : ''}`}
                                onClick={() => {
                                    onNavigate(i);
                                    setIsExpanded(false);
                                }}
                                aria-label={`Go to ${scene.id.replace(/_/g, ' ')}`}
                                aria-current={i === currentIndex ? 'step' : undefined}
                            >
                                <span className="tile-number">{i + 1}</span>
                                <span className="tile-name">{scene.id.replace(/_/g, ' ')}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ── ERROR BOUNDARY ──────────────────────────────────────────
export class PortfolioErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Portfolio Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-fallback">
                    <div className="error-content">
                        <h1>Something went wrong</h1>
                        <p>The interactive experience encountered an error.</p>
                        <div className="fallback-content">
                            <h2>Vandan Sharma</h2>
                            <p>Systems Engineer</p>
                            <div className="fallback-links">
                                <a href="https://github.com/DevWizard-Vandan" target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href="https://linkedin.com/in/vandan-sharma-682536330" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                <a href="mailto:vandan.sharma06@gmail.com">Email</a>
                            </div>
                        </div>
                        <button onClick={() => window.location.reload()}>Try Again</button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
