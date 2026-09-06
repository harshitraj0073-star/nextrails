import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { LogOut, Menu } from 'lucide-react';

/* ─── Mini inline AI nucleus ──────────────────────────────── */
const MiniNucleus: React.FC = () => (
  <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
    <div className="absolute inset-0 rounded-full border border-cyan-400/20"
      style={{ animation: 'rotateCW 8s linear infinite' }} />
    <div className="absolute w-5 h-5 rounded-full border border-purple-400/20"
      style={{ animation: 'rotateCCW 5s linear infinite' }} />
    <div className="w-3 h-3 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(34,211,238,0.9) 0%, rgba(34,211,238,0.2) 100%)',
        boxShadow: '0 0 10px rgba(34,211,238,0.6)',
        animation: 'coreBreathe 2.5s ease-in-out infinite',
      }} />
  </div>
);

/* ─── Header ──────────────────────────────────────────────── */
export const Header: React.FC<{ onMenu?: () => void }> = ({ onMenu }) => {
  const { state, setRole } = useStore();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    setRole(null as any);
    navigate('/');
  };

  const roleLabel = state.role === 'victim' ? 'SURVIVOR NODE'
    : state.role === 'counsellor' ? 'CLINICIAN NODE'
    : 'COMMAND NEXUS';

  const roleColor = state.role === 'victim' ? 'rgba(34,211,238,0.7)'
    : state.role === 'counsellor' ? 'rgba(168,85,247,0.7)'
    : 'rgba(251,191,36,0.7)';

  return (
    <header className="holo-surface sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

      {/* Left: Logo + nucleus */}
      <div className="flex items-center gap-3">
        <MiniNucleus />
        <div>
          <span className="font-black text-white text-sm tracking-[0.15em]">NEXORA</span>
          <p className="tele text-[8px]" style={{ color: roleColor }}>{roleLabel}</p>
        </div>
      </div>

      {/* Center: Telemetry strip */}
      <div className="hidden lg:flex items-center gap-6">
        {[
          { label: 'UPLINK', val: '99.8%', color: '#10b981' },
          { label: 'LATENCY', val: '12ms', color: '#22d3ee' },
          { label: 'AI ENGINE', val: 'ACTIVE', color: '#a855f7' },
        ].map(({ label, val, color }) => (
          <div key={label} className="text-center">
            <p className="tele text-[8px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{label}</p>
            <p className="font-mono text-[10px] font-bold" style={{ color }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Right: Clock + logout */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="font-mono text-[11px] text-white/60"
            style={{ letterSpacing: '0.12em' }}>
            {time.toLocaleTimeString('en-IN', { hour12: false })}
          </p>
          <p className="tele text-[8px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase()}
          </p>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-lg cursor-pointer transition-all"
          style={{ color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}
          title="Disconnect">
          <LogOut className="w-3 h-3" />
          <span className="hidden sm:inline">EXIT</span>
        </button>

        {/* Mobile menu toggle */}
        <button className="mobile-menu-button" onClick={onMenu} aria-label="Open spatial navigation">
          <Menu className="w-5 h-5 text-white/50" />
        </button>
      </div>
    </header>
  );
};
