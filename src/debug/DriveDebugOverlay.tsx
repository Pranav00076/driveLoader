import React, { useEffect, useState } from 'react';
import { defaultCache } from '../cache/MemoryCache';
import { driveLogger } from './logger';
import type { CacheStats, DebugLog, PerformanceMetric } from '../types/index';

/**
 * DriveDebugOverlay - Developer debugging HUD panel.
 * Displays real-time cache hit rates, endpoint resolution latency, candidate URL probes, and request history logs.
 */
export const DriveDebugOverlay: React.FC<{ initialOpen?: boolean }> = ({ initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'logs'>('stats');
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    const updateStats = () => {
      setStats(defaultCache.getStats());
      setLogs(driveLogger.getLogs());
      setMetrics(driveLogger.getMetrics());
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    const unsubLog = driveLogger.onLog(() => updateStats());
    const unsubMetric = driveLogger.onMetric(() => updateStats());

    return () => {
      clearInterval(interval);
      unsubLog();
      unsubMetric();
    };
  }, []);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          zIndex: 99999,
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          background: '#18181b',
          color: '#3b82f6',
          border: '1px solid #3b82f6',
          fontWeight: 600,
          fontSize: '0.8rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        🛠 DriveLoader Debugger
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        width: '380px',
        maxHeight: '480px',
        zIndex: 99999,
        background: '#09090b',
        color: '#f4f4f5',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 0.75rem',
          background: '#18181b',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>⚡ DriveLoader Inspector</span>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#a1a1aa',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          ✕
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: '#111113',
        }}
      >
        {(['stats', 'history', 'logs'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '0.4rem',
              background: activeTab === tab ? '#18181b' : 'transparent',
              color: activeTab === tab ? '#60a5fa' : '#a1a1aa',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
        {activeTab === 'stats' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ background: '#18181b', padding: '0.5rem', borderRadius: '6px' }}>
              <div style={{ color: '#a1a1aa' }}>Hit Rate</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                {stats.hitRate}%
              </div>
            </div>
            <div style={{ background: '#18181b', padding: '0.5rem', borderRadius: '6px' }}>
              <div style={{ color: '#a1a1aa' }}>Cached Items</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {stats.cachedEntries}
              </div>
            </div>
            <div style={{ background: '#18181b', padding: '0.5rem', borderRadius: '6px' }}>
              <div style={{ color: '#a1a1aa' }}>Cache Hits</div>
              <div style={{ fontSize: '1rem', color: '#34d399' }}>{stats.cacheHits}</div>
            </div>
            <div style={{ background: '#18181b', padding: '0.5rem', borderRadius: '6px' }}>
              <div style={{ color: '#a1a1aa' }}>Cache Misses</div>
              <div style={{ fontSize: '1rem', color: '#f87171' }}>{stats.cacheMisses}</div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {metrics.length === 0 ? (
              <div style={{ color: '#71717a' }}>No resolution history recorded yet.</div>
            ) : (
              metrics.map((m, idx) => (
                <div
                  key={idx}
                  style={{ background: '#18181b', padding: '0.4rem', borderRadius: '4px' }}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', color: '#e4e4e7' }}
                  >
                    <span>{m.name}</span>
                    <span style={{ color: '#60a5fa' }}>{m.durationMs}ms</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.65rem',
                      color: '#71717a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    File: {m.fileId} | Cached: {m.fromCache ? 'Yes' : 'No'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#71717a' }}>No debug logs recorded.</div>
            ) : (
              logs.map((l, idx) => (
                <div
                  key={idx}
                  style={{
                    borderLeft: `2px solid ${l.level === 'error' ? '#ef4444' : '#3b82f6'}`,
                    paddingLeft: '0.4rem',
                  }}
                >
                  <span style={{ color: '#71717a' }}>
                    [{new Date(l.timestamp).toLocaleTimeString()}]
                  </span>{' '}
                  {l.message}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
