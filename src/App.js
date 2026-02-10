// ============================================================
// FILE: src/App.js
// Version: Enhanced v2 - Full Accessibility, Interactivity & Polish
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Github, Linkedin, Mail, FileText, ChevronDown, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import './App.css';
import './enhancements.css';

// Import custom hooks
import {
  useKeyboardNavigation,
  useGestures,
  usePrefersReducedMotion,
  useSoundEffects,
  useAchievements,
  useScreenShake,
  useKonamiCode,
  useColorTheme,
  useConsoleMessage
} from './hooks';

// Import components
import {
  SkipLink,
  ScreenReaderAnnouncement,
  JourneyTimeline,
  CustomCursor,
  CinematicBars,
  ParallaxOverlay,
  AchievementNotification,
  SoundToggle,
  MobileControls,
  OrientationWarning,
  MiniMap,
  PortfolioErrorBoundary
} from './components';

const R2_BASE_URL = "https://pub-3e38bbb0c6cf4dedbcb0737064924fb2.r2.dev";
// ─────────────────────────────────────────────────────────────
// 1. ASSET CONFIGURATION
// ─────────────────────────────────────────────────────────────
const VIDEOS = {
  NAME_FALL: { folder: 'Video_1_Name_Fall', frames: 144 },
  TRAIN_SMASHING: { folder: 'Video_2_Train_Smashing', frames: 144 },
  TRAIN_INTERACTION: { folder: 'Video_3_Train_Interaction', frames: 62 },
  TRAIN_EXIT: { folder: 'Video_4_Train_Exit', frames: 144 },
  MOUNTAIN_ZOOM: { folder: 'Video_5_Mountain_Zoom', frames: 144 },

  BRAHMA_ZOOM: { folder: 'Video_6_Brahma_Zoom', frames: 144 },
  SHIVA_ZOOM: { folder: 'Video_7_Shiva_Zoom', frames: 144 },
  VISHNU_ZOOM: { folder: 'Video_8_Vishnu_Zoom', frames: 144 },

  BRAHMA_HOVER: { folder: 'Video_9_Hovering_Brahma_Interaction', frames: 144 },
  SHIVA_HOVER: { folder: 'Video_10_Hovering_Shiva_Interaction', frames: 144 },
  VISHNU_HOVER: { folder: 'Video_11_Hovering_Vishnu_Interaction', frames: 144 },

  BRAHMA_TO_PROJECT: { folder: 'Video_12_Brahma_to_MiniDrive', frames: 144 },
  SHIVA_TO_PROJECT: { folder: 'Video_13_Shiva_to_Titan', frames: 144 },
  VISHNU_TO_PROJECT: { folder: 'Video_14_Vishnu_to_Vajra', frames: 144 },

  MINIDRIVE_ENV: { folder: 'Video_15_MiniDrive_Environment', frames: 144 },
  TITAN_ENV: { folder: 'Video_16_Titan_Environment', frames: 144 },
  VAJRA_ENV: { folder: 'Video_17_Vajra_Environment', frames: 144 },

  MOUNTAIN_TO_SKY: { folder: 'Video_19_Mountain_to_Sky', frames: 144 },
  STARS_GLOW: { folder: 'Video_20_Star_Glow', frames: 144 },
  TRAIN_AT_REST: { folder: 'Video_21_Train_at_Rest', frames: 144 },

  RESUME_UNFOLD: { folder: 'Video_22_Resume_Unfold', frames: 144 },
  RESUME_FOLD: { folder: 'Video_23_Resume_Unfold_Rev', frames: 144 },
  FINAL_DEPARTURE: { folder: 'Video_24_Final_Departure', frames: 144 },
};

// ─────────────────────────────────────────────────────────────
// 2. SCROLL SCENES TIMELINE
// ─────────────────────────────────────────────────────────────
const INTRO_SCENES = [
  { id: 'name_fall', video: 'NAME_FALL', scrollHeight: 1200, overlay: 'hero' },
  { id: 'train_smashing', video: 'TRAIN_SMASHING', scrollHeight: 1200, overlay: 'scroll_hint' },
  { id: 'train_idle', video: 'TRAIN_SMASHING', scrollHeight: 600, holdLastFrame: true, allowHover: true },
  { id: 'train_exit', video: 'TRAIN_EXIT', scrollHeight: 1200 },
  { id: 'mountain_zoom', video: 'MOUNTAIN_ZOOM', scrollHeight: 1200 },
  { id: 'mountain_selection', video: 'MOUNTAIN_ZOOM', scrollHeight: 800, holdLastFrame: true, allowClick: true },
];

const OUTRO_SCENES = [
  { id: 'mountain_to_sky', video: 'MOUNTAIN_TO_SKY', scrollHeight: 1200 },
  { id: 'stars_glow', video: 'STARS_GLOW', scrollHeight: 800 },
  { id: 'sky_contact', video: 'STARS_GLOW', scrollHeight: 1200, holdLastFrame: true, showParticles: true },
  { id: 'train_at_rest', video: 'TRAIN_AT_REST', scrollHeight: 1200, allowHover: true },
  { id: 'resume_unfold', video: 'RESUME_UNFOLD', scrollHeight: 1200 },
  { id: 'resume_view', video: 'RESUME_UNFOLD', scrollHeight: 600, holdLastFrame: true, showResumeClick: true },
  { id: 'resume_fold', video: 'RESUME_FOLD', scrollHeight: 1200 },
  { id: 'final_departure', video: 'FINAL_DEPARTURE', scrollHeight: 1200, triggerLoop: true },
];

const PROJECTS = {
  brahma: {
    key: 'brahma', name: 'MiniDrive', deity: 'Brahma', tagline: 'Hybrid Cloud Storage',
    quote: 'Creating Data Realms', color: '#fbbf24', icon: '🔱',
    zoomVideo: 'BRAHMA_ZOOM', hoverVideo: 'BRAHMA_HOVER',
    transformVideo: 'BRAHMA_TO_PROJECT', envVideo: 'MINIDRIVE_ENV',
    description: 'A sophisticated cloud storage solution combining MinIO object storage with PostgreSQL metadata management. Features block-level deduplication achieving 40% storage reduction.',
    stack: ['Java', 'Spring Boot', 'MinIO', 'PostgreSQL', 'Redis', 'Docker'],
    github: 'https://github.com/DevWizard-Vandan',
    features: ['Block-level deduplication', 'Hybrid cloud architecture', 'Real-time sync', 'End-to-end encryption']
  },
  shiva: {
    key: 'shiva', name: 'Titan', deity: 'Shiva', tagline: 'HFT Matching Engine',
    quote: 'Orchestrating Market Chaos', color: '#00d9ff', icon: '⚡',
    zoomVideo: 'SHIVA_ZOOM', hoverVideo: 'SHIVA_HOVER',
    transformVideo: 'SHIVA_TO_PROJECT', envVideo: 'TITAN_ENV',
    description: 'Ultra low-latency matching engine built in Rust, achieving 12.8M matches/sec with sub-microsecond latency. Designed for high-frequency trading environments.',
    stack: ['Rust', 'Lock-Free DS', 'SPSC Ring', 'SIMD', 'io_uring'],
    github: 'https://github.com/DevWizard-Vandan',
    features: ['12.8M matches/sec', 'Sub-μs latency', 'Lock-free architecture', 'Zero-copy networking']
  },
  vishnu: {
    key: 'vishnu', name: 'Vajra', deity: 'Vishnu', tagline: 'Distributed Vector DB',
    quote: 'Preserving Data Eternally', color: '#60a5fa', icon: '💎',
    zoomVideo: 'VISHNU_ZOOM', hoverVideo: 'VISHNU_HOVER',
    transformVideo: 'VISHNU_TO_PROJECT', envVideo: 'VAJRA_ENV',
    description: 'Distributed Vector Database with custom Raft consensus implementation and HNSW indexing. Optimized for AI/ML embedding storage and similarity search.',
    stack: ['Rust', 'Raft Consensus', 'HNSW', 'gRPC', 'RocksDB'],
    github: 'https://github.com/DevWizard-Vandan',
    features: ['Custom Raft implementation', 'HNSW indexing', 'Horizontal scaling', 'Strong consistency']
  },
};

const PROJECT_ORDER = ['brahma', 'shiva', 'vishnu'];

const LOADING_HINTS = [
  "Initializing the cosmic journey...",
  "Loading divine frameworks...",
  "Preparing visual experiences...",
  "Assembling the train of innovation...",
  "Crafting mountain landscapes...",
  "Synchronizing timelines...",
  "Almost ready for departure..."
];

// ─────────────────────────────────────────────────────────────
// 3. ENHANCED LOADING SCREEN
// ─────────────────────────────────────────────────────────────
const LoadingScreen = ({ progress, currentItem, loadedVideos, totalVideos }) => {
  const [hintIndex, setHintIndex] = useState(0);
  const [particles, setParticles] = useState([]);
  const trainPosition = progress * 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex(i => (i + 1) % LOADING_HINTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate falling particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="loading-screen">
      {/* Animated Background */}
      <div className="loading-bg">
        <div className="loading-gradient-orb orb-1" />
        <div className="loading-gradient-orb orb-2" />
        <div className="loading-gradient-orb orb-3" />
      </div>

      {/* Falling Particles */}
      <div className="loading-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="loading-particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity
            }}
          />
        ))}
      </div>

      <div className="loading-content">
        {/* Logo/Brand */}
        <div className="loading-brand">
          <span className="loading-logo">VS</span>
          <span className="loading-brand-text">VANDAN SHARMA</span>
        </div>

        {/* Animated Train Track */}
        <div className="loading-train-section">
          <div className="loading-track">
            <div className="loading-track-line" />
            <div className="loading-track-ties">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="loading-tie" />
              ))}
            </div>
          </div>
          <div
            className="loading-train"
            style={{ left: `${Math.min(trainPosition, 85)}%` }}
          >
            <span className="train-emoji">🚂</span>
            <div className="train-smoke">
              <span>💨</span>
              <span>💨</span>
              <span>💨</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="loading-progress-section">
          <div className="loading-bar-container">
            <div className="loading-bar-bg" />
            <div
              className="loading-bar"
              style={{ width: `${progress * 100}%` }}
            >
              <div className="loading-bar-shine" />
            </div>
            <div
              className="loading-bar-glow"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="loading-stats">
            <span className="loading-percentage">{Math.round(progress * 100)}%</span>
            <span className="loading-count">{loadedVideos}/{totalVideos} scenes</span>
          </div>
        </div>

        {/* Current Loading Item */}
        <div className="loading-current">
          <div className="loading-spinner" />
          <span>{currentItem || 'Preparing...'}</span>
        </div>

        {/* Hints */}
        <p className="loading-hint" key={hintIndex}>
          {LOADING_HINTS[hintIndex]}
        </p>

        {/* Footer */}
        <div className="loading-footer">
          <span>Systems Engineer Portfolio</span>
          <span className="loading-dot">•</span>
          <span>2024</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 4. PHYSICS PARTICLES COMPONENT
// ─────────────────────────────────────────────────────────────
const ParticleContact = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const iconsRef = useRef([]);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    iconsRef.current = [
      { label: 'GitHub', cx: w * 0.25, cy: h * 0.5, color: '#fff', href: 'https://github.com/DevWizard-Vandan', icon: '⚡' },
      { label: 'LinkedIn', cx: w * 0.5, cy: h * 0.5, color: '#0077b5', href: 'https://linkedin.com/in/vandan-sharma-682536330', icon: '💼' },
      { label: 'Email', cx: w * 0.75, cy: h * 0.5, color: '#ea4335', href: 'mailto:vandan.sharma06@gmail.com', icon: '✉️' },
    ];

    const particles = [];
    iconsRef.current.forEach((icon) => {
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 50;
        const tx = icon.cx + Math.cos(angle) * radius;
        const ty = icon.cy + Math.sin(angle) * radius;
        particles.push({
          x: tx, y: ty, homeX: tx, homeY: ty, vx: 0, vy: 0,
          color: icon.color, size: 1 + Math.random() * 3,
          iconIndex: iconsRef.current.indexOf(icon)
        });
      }
    });
    particlesRef.current = particles;

    const handleMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach(p => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const f = (150 - dist) / 150;
          p.vx += (dx / dist) * f * 4;
          p.vy += (dy / dist) * f * 4;
        }

        p.vx += (p.homeX - p.x) * 0.04;
        p.vy += (p.homeY - p.y) * 0.04;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw labels
      ctx.textAlign = 'center';
      ctx.font = 'bold 18px system-ui';
      iconsRef.current.forEach(icon => {
        // Icon emoji
        ctx.font = '32px system-ui';
        ctx.fillText(icon.icon, icon.cx, icon.cy - 70);

        // Label
        ctx.font = 'bold 16px system-ui';
        ctx.fillStyle = icon.color;
        ctx.fillText(icon.label, icon.cx, icon.cy + 90);

        // Hint
        ctx.font = '12px system-ui';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('Click to connect', icon.cx, icon.cy + 110);
      });

      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleClick = (e) => {
      iconsRef.current.forEach(icon => {
        const d = Math.sqrt(Math.pow(e.clientX - icon.cx, 2) + Math.pow(e.clientY - icon.cy, 2));
        if (d < 100) window.open(icon.href, '_blank');
      });
    };
    window.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

// ─────────────────────────────────────────────────────────────
// 5. ENHANCED PROJECT PANEL WITH NAVIGATION
// ─────────────────────────────────────────────────────────────
const ProjectPanel = ({ project, onClose, onContinue, onNavigate, canGoPrev, canGoNext }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="project-panel" style={{ '--accent': project.color }}>
        {/* Navigation Arrows */}
        <button
          className={`project-nav-arrow prev ${canGoPrev ? '' : 'disabled'}`}
          onClick={() => canGoPrev && onNavigate('prev')}
          disabled={!canGoPrev}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className={`project-nav-arrow next ${canGoNext ? '' : 'disabled'}`}
          onClick={() => canGoNext && onNavigate('next')}
          disabled={!canGoNext}
        >
          <ArrowRight size={24} />
        </button>

        <div className="project-content">
          {/* Header */}
          <div className="project-header">
            <div className="project-deity-badge">
              <span className="project-icon">{project.icon}</span>
              <span className="project-deity-name">{project.deity}</span>
            </div>
            <button className="project-close" onClick={onClose}>✕</button>
          </div>

          {/* Title Section */}
          <div className="project-title-section">
            <h1 className="project-name">{project.name}</h1>
            <p className="project-tagline">{project.tagline}</p>
            <p className="project-quote">"{project.quote}"</p>
          </div>

          {/* Description */}
          <p className="project-description">{project.description}</p>

          {/* Features */}
          <div className="project-section">
            <h3>KEY FEATURES</h3>
            <div className="project-features">
              {project.features.map((feature, i) => (
                <div key={i} className="feature-item">
                  <span className="feature-bullet">◆</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="project-section">
            <h3>TECH STACK</h3>
            <div className="stack-tags">
              {project.stack.map(t => (
                <span key={t} className="stack-tag">{t}</span>
              ))}
            </div>
          </div>

          {/* Project Navigation Dots */}
          <div className="project-dots">
            {PROJECT_ORDER.map((key) => (
              <button
                key={key}
                className={`project-dot ${key === project.key ? 'active' : ''}`}
                onClick={() => onNavigate(key)}
                style={{ '--dot-color': PROJECTS[key].color }}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="project-actions">
            <button onClick={onClose} className="action-back">
              <ArrowLeft size={16} />
              <span>Back to Mountains</span>
            </button>
            <div className="action-buttons">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="action-github"
              >
                <Github size={18} />
                <span>View Code</span>
                <ExternalLink size={14} />
              </a>
              <button onClick={onContinue} className="action-continue">
                <span>Continue Journey</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 6. MAIN APP COMPONENT
// ─────────────────────────────────────────────────────────────
function AppContent() {
  const canvasRef = useRef(null);
  const gestureRef = useRef(null);
  const frameBankRef = useRef({});
  const loadingRef = useRef(false);
  const lastDrawnRef = useRef({ video: null, frame: -1 });
  const loopTimeoutRef = useRef(null);
  const trainInteractionCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const visitedProjectsRef = useRef(new Set());

  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingItem, setLoadingItem] = useState('');
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [totalVideos] = useState(Object.keys(VIDEOS).length);
  const [allLoaded, setAllLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [phase, setPhase] = useState('intro');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeDeity, setActiveDeity] = useState(null);
  const [deityStage, setDeityStage] = useState('zoom');
  const [showProject, setShowProject] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [isTrainHovered, setIsTrainHovered] = useState(false);
  const [trainFrame, setTrainFrame] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [fadeOverlay, setFadeOverlay] = useState(false);
  const [cursorType, setCursorType] = useState('');
  const [showCinematic, setShowCinematic] = useState(false);
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState('');

  const currentScenes = phase === 'intro' ? INTRO_SCENES : OUTRO_SCENES;

  // ── CUSTOM HOOKS ────────────────────────────────────────
  const prefersReducedMotion = usePrefersReducedMotion();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, playSound } = useSoundEffects();
  const { unlocked, unlock, showNotification } = useAchievements();
  const { shake, triggerShake } = useScreenShake();

  // Console easter egg
  useConsoleMessage();

  // Color theme based on current scene
  const currentSceneKey = currentScenes[sceneIndex]?.id || 'name_fall';
  useColorTheme(currentSceneKey);

  // Konami code
  useKonamiCode(() => {
    setKonamiActivated(true);
    unlock('KONAMI');
    playSound('success', { frequency: 880, duration: 0.3 });
    setTimeout(() => setKonamiActivated(false), 5000);
  });

  // Keyboard navigation
  const scrollToNext = useCallback(() => {
    if (phase !== 'intro' && phase !== 'outro') return;
    window.scrollBy({ top: 100, behavior: 'smooth' });
    playSound('scroll', { frequency: 600, duration: 0.05 });
  }, [phase, playSound]);

  const scrollToPrev = useCallback(() => {
    if (phase !== 'intro' && phase !== 'outro') return;
    window.scrollBy({ top: -100, behavior: 'smooth' });
    playSound('scroll', { frequency: 500, duration: 0.05 });
  }, [phase, playSound]);

  const handleKeySelect = useCallback((key) => {
    if (currentScenes[sceneIndex]?.allowClick && phase === 'intro') {
      if (key) {
        handleDeityClick(key);
      }
    }
  }, [phase, sceneIndex, currentScenes]);

  const handleKeyBack = useCallback(() => {
    if (phase === 'deity') {
      handleDeityBack();
    }
  }, [phase]);

  useKeyboardNavigation({
    onNext: scrollToNext,
    onPrev: scrollToPrev,
    onSelect: handleKeySelect,
    onBack: handleKeyBack
  });

  // Touch gestures
  useGestures(gestureRef, {
    onSwipeUp: scrollToNext,
    onSwipeDown: scrollToPrev,
    onSwipeLeft: () => {
      if (activeDeity) {
        handleProjectNavigate('next');
      }
    },
    onSwipeRight: () => {
      if (activeDeity) {
        handleProjectNavigate('prev');
      }
    }
  });

  // ── DRAW FRAME FUNCTION ─────────────────────────────────
  const drawFrame = useCallback((videoKey, frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const frames = frameBankRef.current[videoKey];
    if (!frames || frames.length === 0) return false;

    const safeIndex = Math.max(0, Math.min(Math.floor(frameIdx), frames.length - 1));
    const img = frames[safeIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return false;

    if (lastDrawnRef.current.video === videoKey && lastDrawnRef.current.frame === safeIndex) {
      return true;
    }

    const ctx = canvas.getContext('2d', { alpha: false });

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;
    let dw, dh, dx, dy;

    if (canvasRatio > imgRatio) {
      dw = canvas.width;
      dh = canvas.width / imgRatio;
      dx = 0;
      dy = (canvas.height - dh) / 2;
    } else {
      dh = canvas.height;
      dw = canvas.height * imgRatio;
      dx = (canvas.width - dw) / 2;
      dy = 0;
    }

    ctx.fillStyle = '#020c1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, dx, dy, dw, dh);

    lastDrawnRef.current = { video: videoKey, frame: safeIndex };
    return true;
  }, []);

  // ── ASSET LOADER ────────────────────────────────────────
  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const tryLoadImage = (src) => {
      return new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img.naturalWidth > 0 ? img : null);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    const loadVideoFrames = async (key) => {
      const config = VIDEOS[key];
      if (!config) return 0;

      setLoadingItem(config.folder.replace(/_/g, ' '));
      const promises = [];

      for (let j = 1; j <= config.frames; j++) {
        promises.push(new Promise(async (resolve) => {
          const padded = String(j).padStart(4, '0');

          // 1. Try WebP from Cloudflare R2
          // NOTICE: We use R2_BASE_URL instead of process.env.PUBLIC_URL
          // And we REMOVED "/Video_assets" from the path because we uploaded contents to root
          let src = `${R2_BASE_URL}/${config.folder}/frame_${padded}.webp`;

          let img = await tryLoadImage(src);

          // 2. Fallback JPG from R2
          if (!img) {
            src = `${R2_BASE_URL}/${config.folder}/frame_${padded}.jpg`;
            img = await tryLoadImage(src);
          }

          if (img) resolve(img);
          else resolve(null);
        }));
      }

      const results = await Promise.all(promises);
      const frames = results.filter(img => img !== null);

      frameBankRef.current[key] = frames;
      return frames.length;
    };

    const loadAll = async () => {
      const keys = Object.keys(VIDEOS);
      let totalLoaded = 0;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const loadedFrames = await loadVideoFrames(key);
        if (loadedFrames > 0) totalLoaded++;
        setLoadedVideos(totalLoaded);
        setLoadProgress((i + 1) / keys.length);
      }

      const criticalVideos = ['NAME_FALL', 'TRAIN_SMASHING', 'TRAIN_EXIT', 'MOUNTAIN_ZOOM'];
      const missingCritical = criticalVideos.filter(k => !frameBankRef.current[k]?.length);

      if (missingCritical.length > 0) {
        setLoadError(`Failed to load: ${missingCritical.join(', ')}`);
      }

      // Small delay for smooth transition
      setTimeout(() => setAllLoaded(true), 500);
    };

    loadAll();
  }, []);

  // ── CANVAS SETUP ────────────────────────────────────────
  useEffect(() => {
    const setupCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        if (lastDrawnRef.current.video && allLoaded) {
          lastDrawnRef.current.frame = -1;
          drawFrame(lastDrawnRef.current.video, 0);
        }
      }
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [allLoaded, drawFrame]);

  // ── INITIAL FRAME ───────────────────────────────────────
  useEffect(() => {
    if (allLoaded && frameBankRef.current['NAME_FALL']?.length > 0) {
      drawFrame('NAME_FALL', 0);
    }
  }, [allLoaded, drawFrame]);

  // ── INFINITE LOOP HANDLER ───────────────────────────────
  const triggerLoop = useCallback(() => {
    if (isLooping) return;
    setIsLooping(true);
    setFadeOverlay(true);

    // Wait for fade out
    setTimeout(() => {
      window.scrollTo(0, 0);
      setPhase('intro');
      setSceneIndex(0);
      lastDrawnRef.current = { video: null, frame: -1 };
      drawFrame('NAME_FALL', 0);

      // Fade back in
      setTimeout(() => {
        setFadeOverlay(false);
        setIsLooping(false);
      }, 300);
    }, 500);
  }, [isLooping, drawFrame]);

  // ── MAIN SCROLL HANDLER ─────────────────────────────────
  useEffect(() => {
    if (!allLoaded || phase === 'deity') return;

    const scenes = phase === 'intro' ? INTRO_SCENES : OUTRO_SCENES;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      let accumulatedHeight = 0;

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const sceneStart = accumulatedHeight;
        const sceneEnd = accumulatedHeight + scene.scrollHeight;

        if (scrollY < sceneEnd || i === scenes.length - 1) {
          setSceneIndex(i);

          const sceneProgress = Math.max(0, Math.min(1, (scrollY - sceneStart) / scene.scrollHeight));
          const frames = frameBankRef.current[scene.video];

          if (frames && frames.length > 0) {
            const isTrainHoverScene = (scene.id === 'train_idle' || scene.id === 'train_at_rest');
            if (isTrainHoverScene && isTrainHovered) break;

            let targetFrame = scene.holdLastFrame ? frames.length - 1 : sceneProgress * (frames.length - 1);
            drawFrame(scene.video, targetFrame);

            // Check for loop trigger
            if (scene.triggerLoop && sceneProgress > 0.95) {
              if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
              loopTimeoutRef.current = setTimeout(triggerLoop, 500);
            }
          }
          break;
        }
        accumulatedHeight += scene.scrollHeight;
      }
    };

    let rafId;
    const throttledScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, [allLoaded, phase, isTrainHovered, drawFrame, triggerLoop]);

  // ── TRAIN HOVER ANIMATION ───────────────────────────────
  useEffect(() => {
    if (!allLoaded) return;

    const currentScene = currentScenes[sceneIndex];
    if (!currentScene?.allowHover) {
      if (trainFrame !== 0) setTrainFrame(0);
      return;
    }

    const frames = frameBankRef.current['TRAIN_INTERACTION'];
    if (!frames?.length) return;

    const maxFrame = frames.length - 1;

    if (isTrainHovered && trainFrame < maxFrame) {
      // Track train interaction for achievement
      if (trainFrame === 0) {
        trainInteractionCountRef.current++;
        if (trainInteractionCountRef.current >= 10) {
          unlock('TRAIN_MASTER');
        }
        playSound('hover', { frequency: 650, duration: 0.1 });
      }

      const timer = setTimeout(() => {
        const newFrame = Math.min(trainFrame + 1, maxFrame);
        setTrainFrame(newFrame);
        drawFrame('TRAIN_INTERACTION', newFrame);
      }, 30);
      return () => clearTimeout(timer);
    } else if (!isTrainHovered && trainFrame > 0) {
      const timer = setTimeout(() => {
        const newFrame = Math.max(trainFrame - 2, 0);
        setTrainFrame(newFrame);
        if (newFrame > 0) {
          drawFrame('TRAIN_INTERACTION', newFrame);
        } else {
          const scene = currentScenes[sceneIndex];
          if (scene) {
            const baseFrames = frameBankRef.current[scene.video];
            if (baseFrames?.length) {
              lastDrawnRef.current.frame = -1;
              drawFrame(scene.video, baseFrames.length - 1);
            }
          }
        }
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [allLoaded, isTrainHovered, trainFrame, sceneIndex, currentScenes, drawFrame, unlock, playSound]);

  // ── DEITY ANIMATION LOOP ────────────────────────────────
  useEffect(() => {
    if (phase !== 'deity' || !activeDeity || !allLoaded) return;

    const project = PROJECTS[activeDeity];
    let videoKey;
    let shouldLoop = false;

    if (deityStage === 'zoom') videoKey = project.zoomVideo;
    else if (deityStage === 'hover') { videoKey = project.hoverVideo; shouldLoop = true; }
    else if (deityStage === 'transform') videoKey = project.transformVideo;
    else if (deityStage === 'env') { videoKey = project.envVideo; shouldLoop = true; }

    const frames = frameBankRef.current[videoKey];
    if (!frames?.length) return;

    let currentFrame = isReversing ? frames.length - 1 : 0;

    const interval = setInterval(() => {
      if (isReversing) {
        currentFrame--;
        if (currentFrame < 0) {
          clearInterval(interval);
          if (deityStage === 'env') setDeityStage('transform');
          else if (deityStage === 'transform') setDeityStage('zoom');
          else if (deityStage === 'zoom') {
            setIsReversing(false);
            setActiveDeity(null);
            setPhase('intro');
            const scrollTarget = INTRO_SCENES.slice(0, 5).reduce((a, b) => a + b.scrollHeight, 0);
            window.scrollTo(0, scrollTarget);
          }
          return;
        }
      } else {
        currentFrame++;
        if (currentFrame >= frames.length) {
          if (shouldLoop) currentFrame = 0;
          else {
            clearInterval(interval);
            if (deityStage === 'zoom') setDeityStage('hover');
            else if (deityStage === 'transform') { setDeityStage('env'); setShowProject(true); }
            return;
          }
        }
      }
      drawFrame(videoKey, currentFrame);
    }, 40);

    return () => clearInterval(interval);
  }, [phase, activeDeity, deityStage, isReversing, allLoaded, drawFrame]);

  // ── HANDLERS ────────────────────────────────────────────
  const handleDeityClick = useCallback((deity) => {
    setActiveDeity(deity);
    setPhase('deity');
    setDeityStage('zoom');
    setIsReversing(false);
    setShowProject(false);
    playSound('transition', { frequency: 700, duration: 0.2 });
    setCursorType('');
    setSrAnnouncement(`Entering ${PROJECTS[deity]?.name} project`);
    visitedProjectsRef.current.add(deity);

    // Check for explorer achievement
    if (visitedProjectsRef.current.size === 3) {
      unlock('EXPLORER');
    }
  }, [playSound, unlock]);

  const handleDeityBack = useCallback(() => {
    setShowProject(false);
    setIsReversing(true);
    playSound('back', { frequency: 500, duration: 0.15 });
    setSrAnnouncement('Returning to mountain selection');
  }, [playSound]);

  const handleContinueToOutro = useCallback(() => {
    setShowProject(false);
    setActiveDeity(null);
    setPhase('outro');
    window.scrollTo(0, 0);
    playSound('continue', { frequency: 800, duration: 0.25 });
    setSrAnnouncement('Continuing journey to outro');

    // Check for completionist if visited all projects
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    if (elapsedTime < 120) {
      unlock('SPEED_RUNNER');
    }
  }, [playSound, unlock]);

  const handleProjectNavigate = useCallback((direction) => {
    if (!activeDeity) return;

    let newDeity;
    const currentIndex = PROJECT_ORDER.indexOf(activeDeity);

    if (direction === 'prev') {
      newDeity = PROJECT_ORDER[currentIndex - 1];
    } else if (direction === 'next') {
      newDeity = PROJECT_ORDER[currentIndex + 1];
    } else if (PROJECT_ORDER.includes(direction)) {
      newDeity = direction;
    }

    if (newDeity && newDeity !== activeDeity) {
      setShowProject(false);
      setTimeout(() => {
        setActiveDeity(newDeity);
        setDeityStage('env');
        setTimeout(() => setShowProject(true), 100);
      }, 300);
    }
  }, [activeDeity]);

  // ── LOADING SCREEN ──────────────────────────────────────
  if (!allLoaded) {
    return (
      <LoadingScreen
        progress={loadProgress}
        currentItem={loadingItem}
        loadedVideos={loadedVideos}
        totalVideos={totalVideos}
      />
    );
  }

  // ── ERROR STATE ─────────────────────────────────────────
  if (loadError) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Loading Error</h2>
          <p className="error-message">{loadError}</p>
          <button className="error-retry" onClick={() => window.location.reload()}>
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const totalScrollHeight = currentScenes.reduce((acc, scene) => acc + scene.scrollHeight, 0) + window.innerHeight;
  const currentProjectIndex = activeDeity ? PROJECT_ORDER.indexOf(activeDeity) : -1;

  return (
    <div ref={gestureRef} className={shake ? `screen-shake-${shake}` : ''}>
      {/* Skip Link for Accessibility */}
      <SkipLink />

      {/* Screen Reader Announcements */}
      <ScreenReaderAnnouncement message={srAnnouncement} />

      {/* Custom Cursor */}
      {!('ontouchstart' in window) && <CustomCursor type={cursorType} />}

      {/* Cinematic Bars */}
      <CinematicBars visible={showCinematic || phase === 'deity'} />

      {/* Journey Timeline */}
      {(phase === 'intro' || phase === 'outro') && (
        <JourneyTimeline
          currentPhase={phase}
          sceneIndex={sceneIndex}
          scenes={currentScenes}
          onNavigate={(index) => {
            const targetScroll = currentScenes.slice(0, index).reduce((a, b) => a + b.scrollHeight, 0);
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          }}
        />
      )}

      {/* Sound Toggle */}
      <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />

      {/* Achievement Notification */}
      {showNotification && <AchievementNotification achievement={showNotification} />}

      {/* Orientation Warning for Mobile */}
      <OrientationWarning />

      {/* Mini Map for Mobile */}
      {window.innerWidth < 768 && (phase === 'intro' || phase === 'outro') && (
        <MiniMap
          scenes={currentScenes}
          currentIndex={sceneIndex}
          onNavigate={(index) => {
            const targetScroll = currentScenes.slice(0, index).reduce((a, b) => a + b.scrollHeight, 0);
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          }}
        />
      )}

      {/* Konami Code Indicator */}
      {konamiActivated && (
        <div className="konami-overlay">
          <div className="konami-stars">✨🎮✨</div>
          <p>Secret Code Activated!</p>
        </div>
      )}

      {/* Fixed Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          display: 'block',
          background: '#020c1a'
        }}
      />

      {/* Scroll Container */}
      <div style={{ position: 'relative', zIndex: 2, height: totalScrollHeight, pointerEvents: 'none' }} />

      {/* Fade Overlay for Loop */}
      <div className={`fade-overlay ${fadeOverlay ? 'active' : ''}`} />

      {/* UI Overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <>
            {currentScenes[sceneIndex]?.overlay === 'hero' && (
              <div className="hero-overlay">
                <div className="hero-badge">SYSTEMS ENGINEER</div>
                <h1 className="hero-name">
                  <span className="hero-name-line">VANDAN</span>
                  <span className="hero-name-line accent">SHARMA</span>
                </h1>
                <p className="hero-tagline">
                  Building high-performance systems that push the boundaries of what's possible
                </p>
                <div className="hero-scroll-indicator">
                  <span>Scroll to begin</span>
                  <ChevronDown className="hero-scroll-arrow" size={20} />
                </div>
              </div>
            )}

            {currentScenes[sceneIndex]?.overlay === 'scroll_hint' && (
              <div className="scroll-hint">
                <div className="scroll-hint-content">
                  <span className="scroll-hint-text">SCROLL TO EXPLORE</span>
                  <div className="scroll-hint-line" />
                  <ChevronDown className="scroll-arrow" size={24} />
                </div>
              </div>
            )}

            {currentScenes[sceneIndex]?.allowHover && (
              <div
                className="train-hover-zone"
                style={{ pointerEvents: 'auto' }}
                onMouseEnter={() => setIsTrainHovered(true)}
                onMouseLeave={() => setIsTrainHovered(false)}
              >
                <div className={`hover-hint ${isTrainHovered ? 'active' : ''}`}>
                  <span className="hover-emoji">🚂</span>
                  <span className="hover-text">{isTrainHovered ? 'Exploring...' : 'Hover to interact'}</span>
                </div>
              </div>
            )}

            {currentScenes[sceneIndex]?.allowClick && (
              <div className="mountain-selection" style={{ pointerEvents: 'auto' }}>
                <div className="selection-header">
                  <span className="selection-eyebrow">CHOOSE YOUR PATH</span>
                  <h2 className="selection-title">The Divine Trimurti</h2>
                  <p className="selection-subtitle">Each mountain reveals a unique project journey</p>
                </div>
                <div className="deity-buttons">
                  {PROJECT_ORDER.map((key) => {
                    const project = PROJECTS[key];
                    return (
                      <button
                        key={key}
                        className={`deity-button ${key}`}
                        onClick={() => handleDeityClick(key)}
                      >
                        <span className="deity-icon">{project.icon}</span>
                        <span className="deity-name">{project.deity.toUpperCase()}</span>
                        <span className="deity-project">{project.name}</span>
                        <span className="deity-arrow">→</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* DEITY PHASE */}
        {phase === 'deity' && (
          <>
            <button
              className="back-button-floating"
              style={{ pointerEvents: 'auto' }}
              onClick={handleDeityBack}
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>

            {deityStage === 'hover' && !showProject && (
              <div className="reveal-overlay" style={{ pointerEvents: 'auto' }}>
                <button className="reveal-button" onClick={() => setDeityStage('transform')}>
                  <span className="reveal-icon">{PROJECTS[activeDeity]?.icon}</span>
                  <span className="reveal-text">Reveal {PROJECTS[activeDeity]?.name}</span>
                  <span className="reveal-hint">Click to discover</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* OUTRO PHASE */}
        {phase === 'outro' && (
          <>
            {currentScenes[sceneIndex]?.showParticles && <ParticleContact />}

            {currentScenes[sceneIndex]?.allowHover && (
              <div
                className="train-hover-zone"
                style={{ pointerEvents: 'auto' }}
                onMouseEnter={() => setIsTrainHovered(true)}
                onMouseLeave={() => setIsTrainHovered(false)}
              >
                <div className={`hover-hint ${isTrainHovered ? 'active' : ''}`}>
                  <span className="hover-emoji">🚂</span>
                  <span className="hover-text">{isTrainHovered ? 'Hello again!' : 'Hover to interact'}</span>
                </div>
              </div>
            )}

            {currentScenes[sceneIndex]?.showResumeClick && (
              <div className="resume-click-zone" style={{ pointerEvents: 'auto' }}>
                <a
                  href={`${process.env.PUBLIC_URL}/resume.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-prompt"
                >
                  <FileText size={36} />
                  <span className="resume-title">View Resume</span>
                  <span className="resume-hint">Click to open PDF</span>
                </a>
              </div>
            )}

            {currentScenes[sceneIndex]?.triggerLoop && (
              <div className="loop-indicator">
                <span>Journey complete • Scroll to restart</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* PROJECT PANEL */}
      {
        showProject && activeDeity && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'auto' }}>
            <ProjectPanel
              project={PROJECTS[activeDeity]}
              onClose={handleDeityBack}
              onContinue={handleContinueToOutro}
              onNavigate={handleProjectNavigate}
              canGoPrev={currentProjectIndex > 0}
              canGoNext={currentProjectIndex < PROJECT_ORDER.length - 1}
            />
          </div>
        )
      }
    </div >
  );
}

// Wrap with Error Boundary
export default function App() {
  return (
    <PortfolioErrorBoundary>
      <AppContent />
    </PortfolioErrorBoundary>
  );
}