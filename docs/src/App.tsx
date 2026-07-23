import React, { useState } from 'react';
import {
  DriveImage,
  DriveGallery,
  DriveLoaderProvider,
  analyzeDriveUrl,
  getCacheStats,
  clearCache,
  resolveDriveImages,
  loadFolderAssets,
  extractFolderId,
  isGoogleDriveFolder,
} from '../../src/index.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sandbox' | 'folder' | 'batch' | 'cache' | 'docs' | 'troubleshoot'>('sandbox');
  const [inputUrl, setInputUrl] = useState('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view');
  const [folderInput, setFolderInput] = useState('https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs');
  const [folderApiKey, setFolderApiKey] = useState('');
  const [folderResult, setFolderResult] = useState<any | null>(null);
  const [folderLoading, setFolderLoading] = useState(false);
  const [folderError, setFolderError] = useState<string | null>(null);

  const [stats, setStats] = useState(getCacheStats());
  const [batchInput, setBatchInput] = useState(
    `https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view\nhttps://drive.google.com/open?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs\n1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs`,
  );
  const [batchResults, setBatchResults] = useState<any | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);

  const diag = analyzeDriveUrl(inputUrl);

  const handleRefreshStats = () => {
    setStats(getCacheStats());
  };

  const handleClearCache = () => {
    clearCache();
    setStats(getCacheStats());
  };

  const handleRunBatch = async () => {
    setBatchLoading(true);
    const urls = batchInput
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);
    const res = await resolveDriveImages(urls, { concurrency: 2 });
    setBatchResults(res);
    setBatchLoading(false);
    setStats(getCacheStats());
  };

  const handleLoadFolder = async () => {
    if (!folderApiKey) {
      setFolderError('Please enter a Google Drive API Key.');
      return;
    }
    setFolderLoading(true);
    setFolderError(null);
    try {
      const res = await loadFolderAssets({
        folderUrl: folderInput,
        apiKey: folderApiKey,
        pageSize: 20,
      });
      setFolderResult(res);
      setStats(getCacheStats());
    } catch (err) {
      setFolderError(err instanceof Error ? err.message : String(err));
      setFolderResult(null);
    } finally {
      setFolderLoading(false);
    }
  };

  return (
    <DriveLoaderProvider debug={true} cacheTTL={3600000}>
      <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f3f4f6' }}>
        {/* Navigation Bar */}
        <header
          style={{
            borderBottom: '1px solid #1f2937',
            padding: '1.25rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            >
              Δ
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
                @driveloader/react
              </h1>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>v1.0.1 • Folder & Image Support</span>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'sandbox', label: 'Single Image' },
              { id: 'folder', label: 'Folder Loader' },
              { id: 'batch', label: 'Batch Resolution' },
              { id: 'cache', label: 'Cache & Metrics' },
              { id: 'docs', label: 'API Reference' },
              { id: 'troubleshoot', label: 'Troubleshooting' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#9ca3af',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {/* Hero Header */}
        <section
          style={{
            padding: '3.5rem 2rem 2.5rem',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
            borderBottom: '1px solid #1f2937',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#60a5fa',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: '1px solid rgba(59, 130, 246, 0.2)',
                marginBottom: '1rem',
              }}
            >
              Zero-Config Google Drive Engine for Images & Folders
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 1rem', letterSpacing: '-0.03em' }}>
              Load Google Drive Images & Public Folders Seamlessly
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
              Automatic link resolution, folder asset listing, endpoint learning, request coalescing,
              and memory caching inside one lightweight, high-performance package.
            </p>
          </div>
        </section>

        <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
          {/* TAB 1: SANDBOX */}
          {activeTab === 'sandbox' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Left Column: Diagnostics Input */}
              <div
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '12px',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ marginTop: 0, fontSize: '1.25rem' }}>URL Diagnostics & Inspector</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Paste any Google Drive share link, open link, or file ID to inspect candidate endpoints and
                  diagnostics.
                </p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Google Drive Link / File ID:
                  </label>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      color: '#ffffff',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Diagnostics Summary Card */}
                <div
                  style={{
                    backgroundColor: '#171e2e',
                    border: `1px solid ${diag.valid ? '#059669' : '#dc2626'}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Status:</span>
                    <span style={{ color: diag.valid ? '#34d399' : '#f87171', fontWeight: 700 }}>
                      {diag.valid ? 'VALID LINK' : 'INVALID LINK'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Extracted File ID:</span>
                    <span style={{ fontFamily: 'monospace', color: '#60a5fa' }}>{diag.fileId || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Link Format Variant:</span>
                    <span style={{ fontFamily: 'monospace', color: '#fbbf24' }}>{diag.detectedFormat}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600 }}>Cached in Memory:</span>
                    <span>{diag.cached ? 'Yes (Hit)' : 'No (Miss)'}</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.9375rem', margin: '1rem 0 0.5rem' }}>Generated Candidate CDN Endpoints:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {diag.candidateUrls.map((url, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: '#1f2937',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        color: '#d1d5db',
                        overflowX: 'auto',
                      }}
                    >
                      [{idx + 1}] {url}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Render Playground */}
              <div
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1f2937',
                  borderRadius: '12px',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ marginTop: 0, fontSize: '1.25rem' }}>Live Component Output</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Automatic resolution rendering in real-time via <code>&lt;DriveImage /&gt;</code>.
                </p>

                <div
                  style={{
                    minHeight: '300px',
                    border: '2px dashed #374151',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    backgroundColor: '#0b0f19',
                  }}
                >
                  <DriveImage
                    src={inputUrl}
                    alt="Sandbox Preview"
                    fade={true}
                    lazy={false}
                    onResolveSuccess={() => handleRefreshStats()}
                    style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FOLDER LOADER */}
          {activeTab === 'folder' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Public Google Drive Folder Loader</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Load all media assets from a public Google Drive folder using official Google Drive API v3.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Folder Share Link / Folder ID:
                  </label>
                  <input
                    type="text"
                    value={folderInput}
                    onChange={(e) => setFolderInput(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/FOLDER_ID"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    Google Drive API Key:
                  </label>
                  <input
                    type="text"
                    value={folderApiKey}
                    onChange={(e) => setFolderApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleLoadFolder}
                disabled={folderLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {folderLoading ? 'Loading Folder Assets...' : 'Fetch Folder Assets'}
              </button>

              {folderError && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#7f1d1d', borderRadius: '8px', color: '#fca5a5' }}>
                  ❌ {folderError}
                </div>
              )}

              {folderResult && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4>Folder: {folderResult.folder?.name}</h4>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Loaded {folderResult.totalLoaded} media assets.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                    {folderResult.assets.map((asset: any) => (
                      <div key={asset.id} style={{ backgroundColor: '#1f2937', padding: '0.75rem', borderRadius: '8px' }}>
                        <DriveImage src={asset.resolvedUrl} alt={asset.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div style={{ fontSize: '0.8125rem', marginTop: '0.5rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {asset.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{asset.type.toUpperCase()} • {asset.extension}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BATCH RESOLUTION */}
          {activeTab === 'batch' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Batch Resolution Playground (resolveDriveImages)</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Process multiple Google Drive links concurrently with request deduplication, worker concurrency control, and shared memory cache.
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>
                  URLs (One per line):
                </label>
                <textarea
                  rows={4}
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    color: '#ffffff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                onClick={handleRunBatch}
                disabled={batchLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {batchLoading ? 'Resolving Batch...' : 'Run resolveDriveImages()'}
              </button>

              {batchResults && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4>Batch Results Summary:</h4>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem' }}>
                    <span>Total: <strong>{batchResults.total}</strong></span>
                    <span style={{ color: '#34d399' }}>Successful: <strong>{batchResults.successful}</strong></span>
                    <span style={{ color: '#f87171' }}>Failed: <strong>{batchResults.failed}</strong></span>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <DriveGallery images={batchResults.results.filter((r: any) => r.result).map((r: any) => r.result.imageUrl)} columns={3} gap="1rem" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CACHE & METRICS */}
          {activeTab === 'cache' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Memory Cache Metrics & Endpoint Learning</h3>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleRefreshStats}
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#374151', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                  >
                    Refresh Stats
                  </button>
                  <button
                    onClick={handleClearCache}
                    style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                  >
                    Clear Cache
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Cache Hits', val: stats.cacheHits, color: '#34d399' },
                  { label: 'Cache Misses', val: stats.cacheMisses, color: '#f87171' },
                  { label: 'Hit Rate', val: `${stats.hitRate}%`, color: '#60a5fa' },
                  { label: 'Cached Entries', val: stats.cachedEntries, color: '#fbbf24' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151' }}>
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{item.label}</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: item.color, marginTop: '0.25rem' }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: API REFERENCE */}
          {activeTab === 'docs' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem', lineHeight: 1.7 }}>
              <h3 style={{ marginTop: 0 }}>API Reference</h3>
              
              <h4>Folder Loading APIs</h4>
              <ul style={{ paddingLeft: '1.25rem' }}>
                <li><code>extractFolderId(urlOrId: string): string | null</code></li>
                <li><code>isGoogleDriveFolder(urlOrId: string): boolean</code></li>
                <li><code>loadFolderAssets(options: LoadFolderOptions): Promise&lt;FolderLoadResult&gt;</code></li>
                <li><code>useDriveFolder(options: LoadFolderOptions): UseDriveFolderResult</code></li>
                <li><code>&lt;DriveGallery folderUrl="..." apiKey="..." /&gt;</code></li>
              </ul>
            </div>
          )}

          {/* TAB 6: TROUBLESHOOTING */}
          {activeTab === 'troubleshoot' && (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '2rem', lineHeight: 1.7 }}>
              <h3 style={{ marginTop: 0 }}>Troubleshooting & Google API Key Setup</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4>Setting up a Google Drive API Key</h4>
                <p style={{ color: '#9ca3af', fontSize: '0.9375rem' }}>
                  1. Go to Google Cloud Console &rarr; APIs & Services &rarr; Credentials.<br />
                  2. Click Create Credentials &rarr; API Key.<br />
                  3. Enable Google Drive API in API Library.<br />
                  4. Restrict key HTTP referrers to your web application domain.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </DriveLoaderProvider>
  );
}
