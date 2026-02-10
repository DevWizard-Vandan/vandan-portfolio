// ============================================================
// FILE: src/App.js
// Version: Progressive Streaming (Complete Implementation)
// ============================================================

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Github, ChevronDown, ArrowRight, ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import './App.css';
import './enhancements.css';

// Enhancement hooks
import {
  useKeyboardNavigation,
  useAchievements,
  useSoundEffects,
  usePrefersReducedMotion
} from './hooks';

// Enhancement components
import {
  ScreenReaderAnnouncement,
  AchievementNotification,
  SoundToggle
} from './components';

// ─────────────────────────────────────────────────────────────
// 1. CONFIGURATION
// ─────────────────────────────────────────────────────────────
const R2_BASE_URL = "https://portfolio-assets-proxy.vandan-sharma06.workers.dev";

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

// Priority queues for progressive loading
const CRITICAL_VIDEOS = ['NAME_FALL'];
const INTRO_VIDEOS = ['TRAIN_SMASHING', 'TRAIN_INTERACTION', 'TRAIN_EXIT', 'MOUNTAIN_ZOOM'];
const DEITY_VIDEOS = [
  'BRAHMA_ZOOM', 'SHIVA_ZOOM', 'VISHNU_ZOOM',
  'BRAHMA_HOVER', 'SHIVA_HOVER', 'VISHNU_HOVER',
  'BRAHMA_TO_PROJECT', 'SHIVA_TO_PROJECT', 'VISHNU_TO_PROJECT',
  'MINIDRIVE_ENV', 'TITAN_ENV', 'VAJRA_ENV'
];
const OUTRO_VIDEOS = [
  'MOUNTAIN_TO_SKY', 'STARS_GLOW', 'TRAIN_AT_REST',
  'RESUME_UNFOLD', 'RESUME_FOLD', 'FINAL_DEPARTURE'
];

// ─────────────────────────────────────────────────────────────
// 2. SCENE DEFINITIONS
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
  { id: 'sky_contact', video: 'STARS_GLOW', scrollHeight: 1200, holdLastFrame: true, showContact: true },
  { id: 'train_at_rest', video: 'TRAIN_AT_REST', scrollHeight: 1200, allowHover: true },
  { id: 'resume_unfold', video: 'RESUME_UNFOLD', scrollHeight: 1200 },
  { id: 'resume_view', video: 'RESUME_UNFOLD', scrollHeight: 600, holdLastFrame: true, showResume: true },
  { id: 'resume_fold', video: 'RESUME_FOLD', scrollHeight: 1200 },
  { id: 'final_departure', video: 'FINAL_DEPARTURE', scrollHeight: 1200, triggerLoop: true },
];

const PROJECTS = {
  brahma: {
    key: 'brahma', name: 'MiniDrive', deity: 'Brahma',
    tagline: 'Hybrid Cloud Storage', quote: 'Creating Data Realms',
    color: '#fbbf24', icon: '🔱',
    zoomVideo: 'BRAHMA_ZOOM', hoverVideo: 'BRAHMA_HOVER',
    transformVideo: 'BRAHMA_TO_PROJECT', envVideo: 'MINIDRIVE_ENV',
    description: 'A sophisticated cloud storage solution combining MinIO object storage with PostgreSQL metadata management.',
    stack: ['Java', 'Spring Boot', 'MinIO', 'PostgreSQL', 'Redis', 'Docker'],
    github: 'https://github.com/DevWizard-Vandan',
    features: ['Block-level deduplication', 'Hybrid cloud architecture', 'Real-time sync', 'End-to-end encryption']
  },
  shiva: {
    key: 'shiva', name: 'Titan', deity: 'Shiva',
    tagline: 'HFT Matching Engine', quote: 'Orchestrating Market Chaos',
    color: '#00d9ff', icon: '⚡',
    zoomVideo: 'SHIVA_ZOOM', hoverVideo: 'SHIVA_HOVER',
    transformVideo: 'SHIVA_TO_PROJECT', envVideo: 'TITAN_ENV',
    description: 'Ultra low-latency matching engine built in Rust, achieving 12.8M matches/sec with sub-microsecond latency.',
    stack: ['Rust', 'Lock-Free DS', 'SPSC Ring', 'SIMD', 'io_uring'],
    github: 'https://github.com/DevWizard-Vandan',
    features: ['12.8M matches/sec', 'Sub-μs latency', 'Lock-free architecture', 'Zero-copy networking']
  },
  vishnu: {
    key: 'vishnu', name: 'Vajra', deity: 'Vishnu',
    tagline: 'Distributed Vector DB', quote: 'Preserving Data Eternally',
    color: '#60a5fa', icon: '💎',
    zoomVideo: 'VISHNU_ZOOM', hoverVideo: 'VISHNU_HOVER',
    transformVideo: 'VISHNU_TO_PROJECT', envVideo: 'VAJRA_ENV',
    description: 'Distributed Vector Database with custom Raft consensus implementation and HNSW indexing.',
    stack: ['Rust', 'Raft Consensus', 'HNSW', 'gRPC', 'RocksDB'],
    github: 'https://github.com/DevWizard-Vandan',
    features: ['Custom Raft implementation', 'HNSW indexing', 'Horizontal scaling', 'Strong consistency']
  },
};

const PROJECT_ORDER = ['brahma', 'shiva', 'vishnu'];

// ─────────────────────────────────────────────────────────────
// 3. UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────
const runIdle = (cb) => {
  if (typeof window.requestIdleCallback !== 'undefined') {
    return window.requestIdleCallback(cb);
  }
  return setTimeout(cb, 50);
};

const loadSingleImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

const getInterpolatedFrame = (frames, targetIndex) => {
  if (!frames || frames.length === 0) return null;

  const safeIndex = Math.max(0, Math.min(Math.floor(targetIndex), frames.length - 1));

  if (frames[safeIndex]) return frames[safeIndex];

  // Nearest neighbor search for sparse arrays
  let left = safeIndex;
  while (left >= 0 && !frames[left]) left--;

  let right = safeIndex;
  while (right < frames.length && !frames[right]) right++;

  if (left >= 0 && right < frames.length) {
    return (safeIndex - left <= right - safeIndex) ? frames[left] : frames[right];
  }

  return frames[left] ?? frames[right] ?? null;
};

// ─────────────────────────────────────────────────────────────
// 4. LOADING SCREEN COMPONENT
// ─────────────────────────────────────────────────────────────
const LoadingScreen = ({ progress, stage }) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-brand">
          <span className="loading-logo">VS</span>
          <span className="loading-brand-text">VANDAN SHARMA</span>
        </div>

        <div className="loading-progress-section">
          <div className="loading-bar-container">
            <div className="loading-bar" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="loading-stats">
            <span className="loading-percentage">{Math.round(progress * 100)}%</span>
            <span className="loading-stage">{stage}</span>
          </div>
        </div>

        <p className="loading-hint">Preparing your journey...</p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// 5. PROJECT PANEL COMPONENT
// ─────────────────────────────────────────────────────────────
const ProjectPanel = ({ project, onClose, onContinue, onNavigate, canGoPrev, canGoNext }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!project) return null;

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="project-panel" style={{ '--accent': project.color }}>
        {/* Navigation Arrows */}
        <button
          className={`project-nav-arrow prev ${canGoPrev ? '' : 'disabled'}`}
          onClick={() => canGoPrev && onNavigate('prev')}
          disabled={!canGoPrev}
          aria-label="Previous project"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className={`project-nav-arrow next ${canGoNext ? '' : 'disabled'}`}
          onClick={() => canGoNext && onNavigate('next')}
          disabled={!canGoNext}
          aria-label="Next project"
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
            <button className="project-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          {/* Title */}
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

          {/* Dots Navigation */}
          <div className="project-dots">
            {PROJECT_ORDER.map((key) => (
              <button
                key={key}
                className={`project-dot ${key === project.key ? 'active' : ''}`}
                onClick={() => onNavigate(key)}
                style={{ '--dot-color': PROJECTS[key].color }}
                aria-label={`Go to ${PROJECTS[key].name}`}
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
export default function App() {
  const canvasRef = useRef(null);
  const frameBankRef = useRef({});
  const loadingRef = useRef(false);
  const lastDrawnRef = useRef({ video: null, frame: -1 });
  const loopTimeoutRef = useRef(null);
  const trainFrameRef = useRef(0);

  // Loading State
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStage, setLoadStage] = useState('Initializing...');
  const [criticalLoaded, setCriticalLoaded] = useState(false);

  // App State
  const [phase, setPhase] = useState('intro');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeDeity, setActiveDeity] = useState(null);
  const [deityStage, setDeityStage] = useState('zoom');
  const [showProject, setShowProject] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [isTrainHovered, setIsTrainHovered] = useState(false);
  const [fadeOverlay, setFadeOverlay] = useState(false);

  // Enhancement State
  const [srAnnouncement, setSrAnnouncement] = useState('');
  const visitedProjectsRef = useRef(new Set());
  const startTimeRef = useRef(Date.now());

  // Enhancement Hooks
  const { unlock, showNotification } = useAchievements();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, playSound } = useSoundEffects();
  const prefersReducedMotion = usePrefersReducedMotion();

  const currentScenes = useMemo(() =>
    phase === 'intro' ? INTRO_SCENES : OUTRO_SCENES
    , [phase]);

  const totalScrollHeight = useMemo(() =>
    currentScenes.reduce((acc, scene) => acc + scene.scrollHeight, 0) + window.innerHeight
    , [currentScenes]);

  // ─────────────────────────────────────────────────────────────
  // 7. PROGRESSIVE ASSET LOADER
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const loadBatch = async (keys, step = 1, concurrent = 6) => {
      for (const key of keys) {
        const config = VIDEOS[key];
        if (!config) continue;

        if (!frameBankRef.current[key]) {
          frameBankRef.current[key] = new Array(config.frames).fill(null);
        }

        // Create batches for concurrent loading
        const frameNumbers = [];
        for (let j = 1; j <= config.frames; j += step) {
          if (!frameBankRef.current[key][j - 1]) {
            frameNumbers.push(j);
          }
        }

        // Process in chunks
        for (let i = 0; i < frameNumbers.length; i += concurrent) {
          const chunk = frameNumbers.slice(i, i + concurrent);
          await Promise.all(
            chunk.map(async (j) => {
              const padded = String(j).padStart(4, '0');
              const src = `${R2_BASE_URL}/${config.folder}/frame_${padded}.webp`;
              const img = await loadSingleImage(src);
              if (img) {
                frameBankRef.current[key][j - 1] = img;
              }
            })
          );
        }
      }
    };

    const initLoad = async () => {
      // Phase 1: Critical (blocks UI)
      setLoadStage('Loading essential assets...');
      await loadBatch(CRITICAL_VIDEOS, 1, 10);
      setLoadProgress(0.15);
      setCriticalLoaded(true);

      // Phase 2: Intro (sparse first, then fill)
      setLoadStage('Preparing introduction...');
      await loadBatch(INTRO_VIDEOS, 4, 8);
      setLoadProgress(0.4);

      // Phase 3: Deity videos (sparse)
      setLoadStage('Loading project scenes...');
      await loadBatch(DEITY_VIDEOS, 8, 6);
      setLoadProgress(0.65);

      // Phase 4: Outro videos (sparse)
      setLoadStage('Preparing finale...');
      await loadBatch(OUTRO_VIDEOS, 8, 6);
      setLoadProgress(0.8);

      // Phase 5: Background fill (non-blocking)
      setLoadStage('Optimizing...');

      const fillGaps = async () => {
        const allKeys = [...INTRO_VIDEOS, ...DEITY_VIDEOS, ...OUTRO_VIDEOS];
        for (let i = 0; i < allKeys.length; i++) {
          await loadBatch([allKeys[i]], 1, 4);
          setLoadProgress(0.8 + (0.2 * (i + 1) / allKeys.length));
          // Yield to main thread
          await new Promise(r => setTimeout(r, 10));
        }
        setLoadStage('Complete');
      };

      runIdle(fillGaps);
    };

    initLoad();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 8. DRAWING ENGINE
  // ─────────────────────────────────────────────────────────────
  const drawFrame = useCallback((videoKey, frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const frames = frameBankRef.current[videoKey];
    const img = getInterpolatedFrame(frames, frameIdx);

    if (!img || !img.complete || img.naturalWidth === 0) return false;

    const safeIndex = Math.floor(frameIdx);
    if (lastDrawnRef.current.video === videoKey && lastDrawnRef.current.frame === safeIndex) {
      return true; // Already drawn, skip
    }

    const ctx = canvas.getContext('2d', { alpha: false });

    // Cover fit calculation
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

  // ─────────────────────────────────────────────────────────────
  // 9. CANVAS SETUP
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const setupCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        lastDrawnRef.current.frame = -1; // Force redraw
        if (criticalLoaded) {
          drawFrame('NAME_FALL', 0);
        }
      }
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [criticalLoaded, drawFrame]);

  // Initial paint
  useEffect(() => {
    if (criticalLoaded) {
      drawFrame('NAME_FALL', 0);
    }
  }, [criticalLoaded, drawFrame]);

  // ─────────────────────────────────────────────────────────────
  // 10. LOOP HANDLER
  // ─────────────────────────────────────────────────────────────
  const triggerLoop = useCallback(() => {
    setFadeOverlay(true);

    setTimeout(() => {
      window.scrollTo(0, 0);
      setPhase('intro');
      setSceneIndex(0);
      lastDrawnRef.current = { video: null, frame: -1 };
      drawFrame('NAME_FALL', 0);

      setTimeout(() => setFadeOverlay(false), 300);
    }, 500);
  }, [drawFrame]);

  // ─────────────────────────────────────────────────────────────
  // 11. SCROLL HANDLER
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!criticalLoaded || phase === 'deity') return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scenes = phase === 'intro' ? INTRO_SCENES : OUTRO_SCENES;
      let accumulatedHeight = 0;

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const sceneStart = accumulatedHeight;
        const sceneEnd = accumulatedHeight + scene.scrollHeight;

        if (scrollY < sceneEnd || i === scenes.length - 1) {
          setSceneIndex(i);

          const sceneProgress = Math.max(0, Math.min(1, (scrollY - sceneStart) / scene.scrollHeight));
          const config = VIDEOS[scene.video];
          const maxFrame = config ? config.frames - 1 : 143;

          // Skip drawing if train is being hovered
          if ((scene.id === 'train_idle' || scene.id === 'train_at_rest') && isTrainHovered) {
            break;
          }

          const targetFrame = scene.holdLastFrame ? maxFrame : sceneProgress * maxFrame;
          drawFrame(scene.video, targetFrame);

          // Handle loop trigger
          if (scene.triggerLoop && sceneProgress > 0.95) {
            if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
            loopTimeoutRef.current = setTimeout(triggerLoop, 500);
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
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, [criticalLoaded, phase, isTrainHovered, drawFrame, triggerLoop]);

  // ─────────────────────────────────────────────────────────────
  // 12. TRAIN HOVER ANIMATION
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!criticalLoaded) return;

    const currentScene = currentScenes[sceneIndex];
    if (!currentScene?.allowHover) {
      trainFrameRef.current = 0;
      return;
    }

    const frames = frameBankRef.current['TRAIN_INTERACTION'];
    if (!frames?.length) return;

    const maxFrame = Math.min(frames.length - 1, 61);
    let animationId;

    const animate = () => {
      const currentFrame = trainFrameRef.current;

      if (isTrainHovered && currentFrame < maxFrame) {
        trainFrameRef.current = Math.min(currentFrame + 1, maxFrame);
        drawFrame('TRAIN_INTERACTION', trainFrameRef.current);
        animationId = setTimeout(animate, prefersReducedMotion ? 50 : 30);
      } else if (!isTrainHovered && currentFrame > 0) {
        trainFrameRef.current = Math.max(currentFrame - 2, 0);
        if (trainFrameRef.current > 0) {
          drawFrame('TRAIN_INTERACTION', trainFrameRef.current);
          animationId = setTimeout(animate, prefersReducedMotion ? 30 : 20);
        } else {
          // Return to base video
          const scene = currentScenes[sceneIndex];
          if (scene) {
            lastDrawnRef.current.frame = -1;
            const config = VIDEOS[scene.video];
            drawFrame(scene.video, config ? config.frames - 1 : 143);
          }
        }
      }
    };

    animate();
    return () => clearTimeout(animationId);
  }, [criticalLoaded, isTrainHovered, sceneIndex, currentScenes, drawFrame, prefersReducedMotion]);

  // ─────────────────────────────────────────────────────────────
  // 13. DEITY ANIMATION LOOP
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'deity' || !activeDeity || !criticalLoaded) return;

    const project = PROJECTS[activeDeity];
    if (!project) return;

    let videoKey;
    let shouldLoop = false;

    if (deityStage === 'zoom') videoKey = project.zoomVideo;
    else if (deityStage === 'hover') { videoKey = project.hoverVideo; shouldLoop = true; }
    else if (deityStage === 'transform') videoKey = project.transformVideo;
    else if (deityStage === 'env') { videoKey = project.envVideo; shouldLoop = true; }

    const frames = frameBankRef.current[videoKey];
    if (!frames) return;

    const maxFrame = frames.length - 1;
    let currentFrame = isReversing ? maxFrame : 0;
    let intervalId;

    // Adjust animation speed based on reduced motion preference
    const frameInterval = prefersReducedMotion ? 60 : 40;

    const advanceFrame = () => {
      if (isReversing) {
        currentFrame--;
        if (currentFrame < 0) {
          clearInterval(intervalId);

          if (deityStage === 'env') setDeityStage('transform');
          else if (deityStage === 'transform') setDeityStage('zoom');
          else if (deityStage === 'zoom') {
            setIsReversing(false);
            setActiveDeity(null);
            setPhase('intro');
            const scrollTarget = INTRO_SCENES.slice(0, 5).reduce((a, s) => a + s.scrollHeight, 0);
            window.scrollTo(0, scrollTarget);
          }
          return;
        }
      } else {
        currentFrame++;
        if (currentFrame > maxFrame) {
          if (shouldLoop) {
            currentFrame = 0;
          } else {
            clearInterval(intervalId);
            if (deityStage === 'zoom') setDeityStage('hover');
            else if (deityStage === 'transform') {
              setDeityStage('env');
              setShowProject(true);
            }
            return;
          }
        }
      }

      drawFrame(videoKey, currentFrame);
    };

    intervalId = setInterval(advanceFrame, frameInterval);

    return () => clearInterval(intervalId);
  }, [phase, activeDeity, deityStage, isReversing, criticalLoaded, drawFrame, prefersReducedMotion]);

  // ─────────────────────────────────────────────────────────────
  // 14. EVENT HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleDeityClick = useCallback((deity) => {
    setActiveDeity(deity);
    setPhase('deity');
    setDeityStage('zoom');
    setIsReversing(false);
    setShowProject(false);
    playSound('transition', { frequency: 700, duration: 0.2 });
    setSrAnnouncement(`Entering ${PROJECTS[deity]?.name} project`);
    visitedProjectsRef.current.add(deity);
    if (visitedProjectsRef.current.size === 3) { unlock('EXPLORER'); }
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
    playSound('click', { frequency: 800, duration: 0.25 });
    setSrAnnouncement('Continuing journey to finale');
    const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
    if (elapsedTime < 120) { unlock('SPEED_RUNNER'); }
  }, [playSound, unlock]);

  const handleProjectNavigate = useCallback((direction) => {
    if (!activeDeity) return;

    const currentIndex = PROJECT_ORDER.indexOf(activeDeity);
    let newDeity;

    if (direction === 'prev' && currentIndex > 0) {
      newDeity = PROJECT_ORDER[currentIndex - 1];
    } else if (direction === 'next' && currentIndex < PROJECT_ORDER.length - 1) {
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

  // ─────────────────────────────────────────────────────────────
  // KEYBOARD NAVIGATION
  // ─────────────────────────────────────────────────────────────
  const scrollToNext = useCallback(() => {
    if (phase !== 'intro' && phase !== 'outro') return;
    window.scrollBy({ top: 100, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    playSound('scroll', { frequency: 500, duration: 0.05 });
  }, [phase, playSound, prefersReducedMotion]);

  const scrollToPrev = useCallback(() => {
    if (phase !== 'intro' && phase !== 'outro') return;
    window.scrollBy({ top: -100, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    playSound('scroll', { frequency: 450, duration: 0.05 });
  }, [phase, playSound, prefersReducedMotion]);

  const handleKeySelect = useCallback((key) => {
    const currentScene = currentScenes[sceneIndex];
    if (currentScene?.allowClick && phase === 'intro' && key) {
      handleDeityClick(key);
    }
  }, [sceneIndex, currentScenes, phase, handleDeityClick]);

  const handleKeyBack = useCallback(() => {
    if (phase === 'deity' && showProject) {
      handleDeityBack();
    }
  }, [phase, showProject, handleDeityBack]);

  useKeyboardNavigation({
    onNext: scrollToNext,
    onPrev: scrollToPrev,
    onSelect: handleKeySelect,
    onBack: handleKeyBack
  });

  // ─────────────────────────────────────────────────────────────
  // 15. RENDER
  // ─────────────────────────────────────────────────────────────

  // Loading screen
  if (!criticalLoaded) {
    return <LoadingScreen progress={loadProgress} stage={loadStage} />;
  }

  const currentProjectIndex = activeDeity ? PROJECT_ORDER.indexOf(activeDeity) : -1;

  return (
    <div className="app-container">
      {/* Background loading indicator */}
      {loadProgress < 1 && (
        <div className="bg-load-indicator">
          Loading: {Math.round(loadProgress * 100)}%
        </div>
      )}

      {/* Enhancement Components */}
      <ScreenReaderAnnouncement message={srAnnouncement} />
      <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
      {showNotification && <AchievementNotification achievement={showNotification} />}

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        className="main-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          background: '#020c1a'
        }}
      />

      {/* Scroll Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: totalScrollHeight,
          pointerEvents: 'none'
        }}
      />

      {/* Fade Overlay for Loop */}
      <div className={`fade-overlay ${fadeOverlay ? 'active' : ''}`} />

      {/* UI Overlays */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <>
            {/* Hero Overlay */}
            {currentScenes[sceneIndex]?.overlay === 'hero' && (
              <div className="hero-overlay">
                <div className="hero-badge">SYSTEMS ENGINEER</div>
                <h1 className="hero-name">
                  <span className="hero-name-line">VANDAN</span>
                  <span className="hero-name-line accent">SHARMA</span>
                </h1>
                <p className="hero-tagline">
                  Building high-performance systems that push the boundaries
                </p>
                <div className="hero-scroll-indicator">
                  <span>Scroll to begin</span>
                  <ChevronDown size={20} />
                </div>
              </div>
            )}

            {/* Scroll Hint */}
            {currentScenes[sceneIndex]?.overlay === 'scroll_hint' && (
              <div className="scroll-hint">
                <span>SCROLL TO EXPLORE</span>
                <ChevronDown size={24} />
              </div>
            )}

            {/* Train Hover Zone */}
            {currentScenes[sceneIndex]?.allowHover && (
              <div
                className="train-hover-zone"
                style={{ pointerEvents: 'auto' }}
                onMouseEnter={() => setIsTrainHovered(true)}
                onMouseLeave={() => setIsTrainHovered(false)}
              >
                <div className={`hover-hint ${isTrainHovered ? 'active' : ''}`}>
                  <span>🚂</span>
                  <span>{isTrainHovered ? 'Exploring...' : 'Hover to interact'}</span>
                </div>
              </div>
            )}

            {/* Mountain Selection */}
            {currentScenes[sceneIndex]?.allowClick && (
              <div className="mountain-selection" style={{ pointerEvents: 'auto' }}>
                <div className="selection-header">
                  <span className="selection-eyebrow">CHOOSE YOUR PATH</span>
                  <h2 className="selection-title">The Divine Trimurti</h2>
                  <p className="selection-subtitle">Each mountain reveals a unique project</p>
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
                <button
                  className="reveal-button"
                  onClick={() => setDeityStage('transform')}
                >
                  <span className="reveal-icon">{PROJECTS[activeDeity]?.icon}</span>
                  <span className="reveal-text">Reveal {PROJECTS[activeDeity]?.name}</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* OUTRO PHASE */}
        {phase === 'outro' && (
          <>
            {/* Contact Section */}
            {currentScenes[sceneIndex]?.showContact && (
              <div className="contact-section" style={{ pointerEvents: 'auto' }}>
                <h2>Let's Connect</h2>
                <div className="contact-links">
                  <a href="https://github.com/DevWizard-Vandan" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                  <a href="https://linkedin.com/in/vandan-sharma" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                  <a href="mailto:vandan.sharma06@gmail.com">
                    Email
                  </a>
                </div>
              </div>
            )}

            {/* Train Hover (Outro) */}
            {currentScenes[sceneIndex]?.allowHover && (
              <div
                className="train-hover-zone"
                style={{ pointerEvents: 'auto' }}
                onMouseEnter={() => setIsTrainHovered(true)}
                onMouseLeave={() => setIsTrainHovered(false)}
              >
                <div className={`hover-hint ${isTrainHovered ? 'active' : ''}`}>
                  <span>🚂</span>
                  <span>{isTrainHovered ? 'Hello again!' : 'Hover to interact'}</span>
                </div>
              </div>
            )}

            {/* Resume */}
            {currentScenes[sceneIndex]?.showResume && (
              <div className="resume-section" style={{ pointerEvents: 'auto' }}>
                <div className="resume-buttons">
                  <a
                    href={`${process.env.PUBLIC_URL}/resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-button"
                    download="Vandan_Sharma_Resume.pdf"
                  >
                    <FileText size={24} />
                    <span>Download PDF</span>
                  </a>
                  <a
                    href={`${process.env.PUBLIC_URL}/resume.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-button secondary"
                  >
                    <ExternalLink size={24} />
                    <span>View Online</span>
                  </a>
                </div>
              </div>
            )}

            {/* Loop Indicator */}
            {currentScenes[sceneIndex]?.triggerLoop && (
              <div className="loop-indicator">
                <span>Journey complete • Scroll to restart</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Project Panel Modal */}
      {showProject && activeDeity && (
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
      )}
    </div>
  );
}