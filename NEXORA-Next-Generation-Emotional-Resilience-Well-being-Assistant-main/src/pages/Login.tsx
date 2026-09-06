import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { useTranslation } from '../utils/i18n';
import { AIChatbot } from '../components/AIChatbot';

/* ─── Sentient Core SVG (layered counter-rotating dashed rings) ──────────── */
const SentientCore: React.FC<{ parallaxX: number; parallaxY: number }> = ({ parallaxX, parallaxY }) => (
  <div
    className="relative anim-core-breathe"
    style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)`, transition: 'transform 0.1s linear' }}
    aria-hidden="true"
  >
    <svg width="340" height="340" viewBox="0 0 340 340" fill="none">
      {/* Outer ring — slow CW dashes */}
      <circle cx="170" cy="170" r="158"
        stroke="rgba(34,211,238,0.18)" strokeWidth="1"
        strokeDasharray="12 8"
        style={{ animation: 'rotateCW 28s linear infinite', transformOrigin: '170px 170px' }} />

      {/* Ring 2 — CCW dashes */}
      <circle cx="170" cy="170" r="138"
        stroke="rgba(168,85,247,0.2)" strokeWidth="1.5"
        strokeDasharray="20 14"
        style={{ animation: 'rotateCCW 18s linear infinite', transformOrigin: '170px 170px' }} />

      {/* Ring 3 — CW medium */}
      <circle cx="170" cy="170" r="116"
        stroke="rgba(34,211,238,0.25)" strokeWidth="1"
        strokeDasharray="6 20"
        style={{ animation: 'rotateCW 10s linear infinite', transformOrigin: '170px 170px' }} />

      {/* Ring 4 — CCW fast */}
      <circle cx="170" cy="170" r="94"
        stroke="rgba(168,85,247,0.3)" strokeWidth="1.5"
        strokeDasharray="8 12"
        style={{ animation: 'rotateCCW 6s linear infinite', transformOrigin: '170px 170px' }} />

      {/* Inner solid ring */}
      <circle cx="170" cy="170" r="70"
        stroke="rgba(34,211,238,0.15)" strokeWidth="1" fill="none" />

      {/* Nucleus radial glow */}
      <defs>
        <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(34,211,238,0.9)" />
          <stop offset="40%"  stopColor="rgba(34,211,238,0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="core-outer" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(168,85,247,0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Dot markers on rings */}
      </defs>
      <circle cx="170" cy="170" r="155" fill="url(#core-outer)" />
      <circle cx="170" cy="170" r="50"  fill="url(#core-grad)"
        style={{ animation: 'coreBreathe 3.5s ease-in-out infinite', transformOrigin: '170px 170px' }} />

      {/* Center cross-hair tick marks */}
      <line x1="170" y1="115" x2="170" y2="125" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
      <line x1="170" y1="215" x2="170" y2="225" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
      <line x1="115" y1="170" x2="125" y2="170" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
      <line x1="215" y1="170" x2="225" y2="170" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />

      {/* Orbiting dots */}
      {[0, 90, 180, 270].map((deg, i) => (
        <circle
          key={i}
          cx={170 + 158 * Math.cos((deg * Math.PI) / 180)}
          cy={170 + 158 * Math.sin((deg * Math.PI) / 180)}
          r="3"
          fill={i % 2 === 0 ? 'rgba(34,211,238,0.9)' : 'rgba(168,85,247,0.9)'}
          style={{
            filter: 'blur(0.5px)',
            boxShadow: '0 0 6px currentColor',
            animation: `rotateCW 28s linear infinite`,
            transformOrigin: '170px 170px',
          }}
        />
      ))}
    </svg>
  </div>
);

/* ─── Liquid-border initialize link ──────────────────────────────────────── */
const InitializeLink: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-pointer outline-none"
      aria-label="Initialize NEXORA System Link"
    >
      {/* Liquid animated border */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, rgba(34,211,238,0.6), rgba(168,85,247,0.6), rgba(34,211,238,0.6))',
          backgroundSize: '200% 100%',
          animation: 'rotateCW 3s linear infinite',
          padding: '1px',
          borderRadius: '9999px',
          filter: hovered ? 'blur(0px) drop-shadow(0 0 12px rgba(34,211,238,0.8))' : 'blur(0.5px)',
          transition: 'filter 0.3s',
        }}
      />
      <span
        className="relative z-10 block font-mono text-xs tracking-[0.3em] uppercase px-10 py-3 rounded-full"
        style={{
          background: 'rgba(1,3,8,0.8)',
          color: hovered ? 'rgba(34,211,238,1)' : 'rgba(34,211,238,0.7)',
          textShadow: hovered ? '0 0 20px rgba(34,211,238,0.9)' : 'none',
          transition: 'color 0.3s, text-shadow 0.3s',
          border: '1px solid rgba(34,211,238,0.15)',
        }}
      >
        [ INITIALIZE LINK ]
      </span>
    </button>
  );
};

/* ─── Role Selection (The Neural Gateway) ────────────────────────────────── */
interface PillarProps {
  role: 'victim' | 'counsellor' | 'admin';
  label: string;
  sublabel: string;
  description: string;
  accentColor: string;
  accentRgb: string;
  glowClass: string;
  isHovered: boolean;
  isAnyHovered: boolean;
  onHover: (r: string | null) => void;
  onClick: () => void;
  disabled: boolean;
}

const HoloPillar: React.FC<PillarProps> = ({
  label, sublabel, description, accentColor, accentRgb, glowClass,
  isHovered, isAnyHovered, onHover, onClick, disabled
}) => {
  const [typed, setTyped] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isHovered) {
      setTyped('');
      let i = 0;
      const type = () => {
        if (i <= description.length) {
          setTyped(description.slice(0, i));
          i++;
          timerRef.current = setTimeout(type, 28);
        }
      };
      type();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setTyped('');
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isHovered, description]);

  const opacity = isAnyHovered ? (isHovered ? 1 : 0.2) : 1;

  return (
    <div
      className="holo-pillar flex-1 flex flex-col items-center justify-between p-8 select-none"
      style={{
        opacity,
        transform: isHovered ? 'scaleY(1.03) translateY(-6px)' : 'scaleY(1) translateY(0)',
        boxShadow: isHovered
          ? `0 0 80px -10px rgba(${accentRgb},0.4), 0 0 160px -30px rgba(${accentRgb},0.2), inset 0 0 60px -20px rgba(${accentRgb},0.08)`
          : '0 0 0 transparent',
        borderColor: isHovered ? `rgba(${accentRgb},0.25)` : 'rgba(255,255,255,0.06)',
        minHeight: '520px',
        transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)',
      }}
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={0}
      aria-label={`Enter as ${label}`}
      onKeyDown={e => { if (e.key === 'Enter') onClick(); }}
    >
      {/* Internal volumetric glow */}
      {isHovered && (
        <div className="absolute inset-0 rounded-[1.25rem] pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 60%, rgba(${accentRgb},0.12) 0%, transparent 70%)` }} />
      )}

      {/* Pillar shimmer line */}
      <div className="absolute left-1/2 -translate-x-1/2 w-px h-16 top-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(${accentRgb},0.6), transparent)`,
          opacity: isHovered ? 1 : 0.3,
          transition: 'opacity 0.4s',
        }} />

      {/* Role icon ring */}
      <div className="relative flex items-center justify-center w-20 h-20 mt-8 shrink-0">
        <div className="absolute inset-0 rounded-full"
          style={{
            border: `1px solid rgba(${accentRgb},0.3)`,
            animation: isHovered ? 'rotateCW 6s linear infinite' : 'none',
          }} />
        <div className="absolute w-14 h-14 rounded-full"
          style={{
            border: `1px solid rgba(${accentRgb},0.15)`,
            animation: isHovered ? 'rotateCCW 4s linear infinite' : 'none',
          }} />
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, rgba(${accentRgb},0.7) 0%, rgba(${accentRgb},0.1) 100%)`,
            boxShadow: isHovered ? `0 0 30px rgba(${accentRgb},0.6)` : `0 0 12px rgba(${accentRgb},0.2)`,
            transition: 'box-shadow 0.4s',
          }} />
      </div>

      {/* Label */}
      <div className="text-center space-y-2 flex-1 flex flex-col justify-center">
        <p className="tele" style={{ color: `rgba(${accentRgb},0.7)` }}>{sublabel}</p>
        <h2 className={`text-2xl font-black tracking-tight ${isHovered ? glowClass : ''} text-white transition-all`}>
          {label}
        </h2>
        {/* Typewriter description */}
        <div className="h-20 flex items-start justify-center mt-3">
          <p className="font-mono text-[10px] tracking-widest uppercase leading-relaxed text-center"
            style={{ color: `rgba(${accentRgb},0.55)`, maxWidth: '180px' }}>
            {typed}
            {isHovered && typed.length < description.length && (
              <span style={{ animation: 'cursorBlink 0.8s infinite', color: accentColor }}>_</span>
            )}
          </p>
        </div>
      </div>

      {/* Enter tag */}
      <div className="mt-6 font-mono text-[9px] tracking-[0.25em] uppercase pb-2"
        style={{
          color: `rgba(${accentRgb},${isHovered ? 0.9 : 0.3})`,
          textShadow: isHovered ? `0 0 12px rgba(${accentRgb},0.8)` : 'none',
          transition: 'all 0.3s',
        }}>
        {isHovered ? '[ ENTER ]' : '— — —'}
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, rgba(${accentRgb},0.4), transparent)`, opacity: isHovered ? 1 : 0.3 }} />
    </div>
  );
};

/* ─── Main Login / Awakening Page ────────────────────────────────────────── */
export const Login: React.FC = () => {
  const { setRole, state } = useStore();
  const t = useTranslation(state.language);
  const navigate = useNavigate();

  const [phase, setPhase] = useState<'awakening' | 'gateway'>('awakening');
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<'victim' | 'counsellor' | 'admin' | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Parallax tracking
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      setParallax({
        x: ((e.clientX - cx) / cx) * 14,
        y: ((e.clientY - cy) / cy) * 10,
      });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const handleLogin = (role: 'victim' | 'counsellor' | 'admin') => {
    if (activeRole) return;
    setActiveRole(role);
    setTimeout(() => {
      setRole(role);
      navigate(role === 'victim' ? '/victim' : '/dashboard');
    }, 500);
  };

  const PILLARS = [
    {
      role: 'victim' as const,
      label: 'Survivor',
      sublabel: 'Patient Node',
      description: 'SECURE EMOTIONAL SUPPORT SANCTUARY // DISTRESS MONITORING // AI-GUIDED WELLNESS SESSIONS // TELE-CONSULTATION ACCESS',
      accentColor: '#22d3ee',
      accentRgb: '34,211,238',
      glowClass: 'glow-cyan',
    },
    {
      role: 'counsellor' as const,
      label: 'Counsellor',
      sublabel: 'Clinician Node',
      description: 'TRIAGE INTELLIGENCE MATRIX // REAL-TIME CASE MONITORING // NEURAL INTERVENTION PROTOCOLS // AI RISK SCORING',
      accentColor: '#a855f7',
      accentRgb: '168,85,247',
      glowClass: 'glow-purple',
    },
    {
      role: 'admin' as const,
      label: 'Commander',
      sublabel: 'Admin Nexus',
      description: 'STATE-LEVEL COMMAND CENTER // DISTRICT HEATMAP ANALYTICS // SYSTEM OVERSIGHT // INTER-DISTRICT RESOURCE ROUTING',
      accentColor: '#fbbf24',
      accentRgb: '251,191,36',
      glowClass: 'glow-amber',
    },
  ];

  /* ── THE AWAKENING ──────────────────────────────────────────────────────── */
  if (phase === 'awakening') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden select-none">
        {/* Floating title — ethereal fade */}
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center"
          style={{ animation: 'fadeUp 1.4s ease both' }}>
          <p className="tele" style={{ color: 'rgba(34,211,238,0.4)', letterSpacing: '0.4em' }}>
            NEXORA // NEURAL-GLASS OS // v2.0
          </p>
        </div>

        {/* Sentient Core */}
        <div className="flex flex-col items-center gap-16"
          style={{ animation: 'fadeUp 1s ease 0.3s both' }}>
          <SentientCore parallaxX={parallax.x} parallaxY={parallax.y} />

          {/* Ethereal tagline */}
          <div className="text-center space-y-4" style={{ animation: 'fadeUp 1s ease 0.8s both' }}>
            <h1 className="text-5xl font-black tracking-tight text-white glow-cyan"
              style={{ lineHeight: 1.1 }}>
              Sentient.<br />
              <span style={{ color: 'rgba(168,85,247,0.85)', textShadow: '0 0 30px rgba(168,85,247,0.5)' }}>
                Aware.
              </span>
            </h1>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/25 max-w-xs mx-auto">
              {t('login.privacyNotice') || 'End-to-end encrypted · Govt. of India · NHAA Integrated'}
            </p>
          </div>

          {/* Initialize link */}
          <div style={{ animation: 'fadeUp 1s ease 1.4s both' }}>
            <InitializeLink onClick={() => setPhase('gateway')} />
          </div>
        </div>

        {/* Ripple rings around core */}
        {[1, 2, 3].map(i => (
          <div key={i} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
            style={{
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              borderColor: 'rgba(34,211,238,0.06)',
              animation: `orbRipple ${4 + i * 1.5}s ease-out ${i * 1.2}s infinite`,
            }} />
        ))}

        <AIChatbot />
      </div>
    );
  }

  /* ── THE NEURAL GATEWAY ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Header */}
      <div className="text-center mb-12" style={{ animation: 'fadeUp 0.6s ease both' }}>
        <p className="tele mb-3" style={{ letterSpacing: '0.3em' }}>NEXORA NEURAL GATEWAY // IDENTIFY YOURSELF</p>
        <h1 className="text-3xl font-black tracking-tight text-white/80">Select Your Access Node</h1>
      </div>

      {/* The three pillars */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl"
        style={{ animation: 'fadeUp 0.7s ease 0.15s both' }}>
        {PILLARS.map(p => (
          <HoloPillar
            key={p.role}
            {...p}
            isHovered={hoveredPillar === p.label}
            isAnyHovered={hoveredPillar !== null}
            onHover={setHoveredPillar}
            onClick={() => handleLogin(p.role)}
            disabled={activeRole !== null}
          />
        ))}
      </div>

      {/* Footer tags */}
      <div className="flex items-center gap-6 mt-10" style={{ animation: 'fadeUp 0.6s ease 0.4s both' }}>
        {['E2E ENCRYPTED', 'GOVT. OF INDIA PORTAL', 'NHAA INTEGRATED'].map(tag => (
          <span key={tag} className="tele" style={{ color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em' }}>
            {tag}
          </span>
        ))}
      </div>

      <AIChatbot />
    </div>
  );
};
