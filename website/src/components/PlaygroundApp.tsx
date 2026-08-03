"use client";

import React, { useState } from "react";
import {
  DriveImage,
  DriveVideo,
  DriveAudio,
  DrivePlaylist,
  DriveDocument,
  DriveMedia,
  DriveGallery,
  DriveDebugOverlay,
  useDriveFolder,
  analyzeDriveUrl,
  getCacheStats,
  clearCache,
  resolveDriveImage,
  resolveDriveVideo,
  isDriveVideo,
  getVideoThumbnail,
  extractVideoMetadata,
} from "@driveloader/react";

import {
  Image as ImageIcon,
  Video,
  Folder,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Play,
  Grid,
  List,
  Clock,
  Sparkles,
  Info,
  Key,
  Database,
} from "lucide-react";

export function PlaygroundApp({ initialTab = "image" }: { initialTab?: string }) {
  const [tab, setTab] = useState<"media" | "image" | "video" | "audio" | "document" | "folder" | "resolver">(initialTab as any);

  // Single Image State
  const [imageUrlInput, setImageUrlInput] = useState(
    "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"
  );
  const [imageResolveInfo, setImageResolveInfo] = useState<any | null>(null);
  const [imageResolving, setImageResolving] = useState(false);

  // Video State
  const [videoUrlInput, setVideoUrlInput] = useState(
    "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?type=video"
  );
  const [videoMeta, setVideoMeta] = useState<any | null>(null);
  const [videoResolving, setVideoResolving] = useState(false);

  // Folder State
  const [folderInput, setFolderInput] = useState(
    "https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"
  );
  const [apiKeyInput, setApiKeyInput] = useState("");

  // Resolver Diagnostics State
  const [resolverInput, setResolverInput] = useState(
    "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"
  );
  const [diagnosticResult, setDiagnosticResult] = useState<any | null>(null);

  // Audio, Document & Media State
  const [audioUrlInput, setAudioUrlInput] = useState(
    "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?type=audio"
  );
  const [docUrlInput, setDocUrlInput] = useState(
    "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?type=document"
  );
  const [mediaUrlInput, setMediaUrlInput] = useState(
    "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view"
  );

  // Cache stats
  const [cacheStats, setCacheStats] = useState(getCacheStats());


  const handleResolveImageManual = async () => {
    setImageResolving(true);
    const start = performance.now();
    try {
      const res = await resolveDriveImage(imageUrlInput, { cache: true });
      const elapsed = Math.round(performance.now() - start);
      setImageResolveInfo({ ...res, elapsedMs: elapsed });
    } catch (err) {
      setImageResolveInfo({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setImageResolving(false);
      setCacheStats(getCacheStats());
    }
  };

  const handleResolveVideoManual = async () => {
    setVideoResolving(true);
    try {
      const res = await resolveDriveVideo(videoUrlInput, { cache: true });
      const meta = await extractVideoMetadata(videoUrlInput);
      setVideoMeta({ ...res, metadata: meta });
    } catch (err) {
      setVideoMeta({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setVideoResolving(false);
      setCacheStats(getCacheStats());
    }
  };

  const handleRunDiagnostics = () => {
    const diag = analyzeDriveUrl(resolverInput);
    const fileId = diag.fileId;
    const candidates = diag.candidateUrls;

    setDiagnosticResult({
      ...diag,
      winningEndpoint: candidates[0] || "https://lh3.googleusercontent.com/d/" + (fileId || ""),
    });
    setCacheStats(getCacheStats());
  };


  const handleClearCache = () => {
    clearCache();
    setCacheStats(getCacheStats());
  };

  return (
    <div className="w-full space-y-6">

      {/* Playground Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl glass-panel">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full scrollbar-none pb-0.5 w-full sm:w-auto">
          {[
            { id: "media", label: "Universal <DriveMedia>", icon: Sparkles },
            { id: "image", label: "DriveImage", icon: ImageIcon },
            { id: "video", label: "DriveVideo", icon: Video },
            { id: "audio", label: "DriveAudio", icon: Play },
            { id: "document", label: "DriveDocument", icon: Info },
            { id: "folder", label: "Folder Loader", icon: Folder },
            { id: "resolver", label: "Diagnostics & Cache", icon: Cpu },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cache Stats Bar */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-3 py-1.5 rounded-xl bg-gray-900/80 border border-gray-800 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-gray-400">
              Hits: <strong className="text-emerald-400">{cacheStats.cacheHits}</strong>
            </span>
            <span className="text-gray-400">
              Rate: <strong className="text-blue-400">{cacheStats.hitRate}%</strong>
            </span>
          </div>
          <button
            onClick={handleClearCache}
            className="ml-1 text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer shrink-0"
          >
            Clear
          </button>
        </div>
      </div>


      {/* TAB 1: SINGLE IMAGE PLAYGROUND */}
      {tab === "image" && (
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" />
              Single Image Resolution Playground
            </h3>
            <p className="text-xs text-gray-400">
              Paste any Google Drive share link or File ID to resolve and render live via <code className="text-blue-300">&lt;DriveImage /&gt;</code>.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="Paste Google Drive image link or File ID..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs sm:text-sm font-mono focus:border-blue-500 focus:outline-none w-full min-w-0"
            />
            <button
              onClick={handleResolveImageManual}
              disabled={imageResolving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {imageResolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              <span>Resolve Image</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Live Preview Render */}
            <div className="bg-[#070a13] border border-gray-800 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[240px] sm:min-h-[280px] h-auto overflow-hidden">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Live Component Preview</span>
              <div className="w-full flex items-center justify-center p-2 overflow-hidden">
                {React.createElement(DriveImage as any, {
                  src: imageUrlInput,
                  alt: "Playground Live Preview",
                  style: { maxHeight: "520px" },
                  className: "rounded-xl shadow-2xl border border-gray-800 max-h-[520px] w-auto max-w-full object-contain",
                  onResolveSuccess: (res: any) => setImageResolveInfo(res),
                })}
              </div>
            </div>

            {/* Inspector Panel */}
            <div className="bg-[#070a13] border border-gray-800 rounded-2xl p-4 text-xs font-mono space-y-3">
              <div className="text-[11px] text-gray-400 font-sans font-semibold uppercase tracking-wider border-b border-gray-800 pb-2">
                Resolution Inspector
              </div>
              {imageResolveInfo ? (
                <div className="space-y-2 text-gray-300">
                  <div><span className="text-gray-500">Working URL:</span> <span className="text-emerald-400 break-all">{imageResolveInfo.imageUrl}</span></div>
                  <div><span className="text-gray-500">File ID:</span> <span className="text-blue-300">{imageResolveInfo.fileId}</span></div>
                  <div><span className="text-gray-500">From Cache:</span> <span className={imageResolveInfo.fromCache ? "text-emerald-400" : "text-amber-400"}>{String(imageResolveInfo.fromCache)}</span></div>
                  <div><span className="text-gray-500">Endpoint Learning Applied:</span> <span className="text-purple-400">{String(imageResolveInfo.learned)}</span></div>
                  {imageResolveInfo.elapsedMs && (
                    <div><span className="text-gray-500">Resolution Time:</span> <span className="text-blue-400">{imageResolveInfo.elapsedMs} ms</span></div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 py-8 text-center">Click "Resolve Image" to view resolution diagnostics...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIDEO PLAYER PLAYGROUND */}
      {tab === "video" && (
        <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-400 shrink-0" />
              Google Drive Video Player Playground
            </h3>
            <p className="text-xs text-gray-400">
              Paste a Google Drive video link to stream live via <code className="text-purple-300">&lt;DriveVideo /&gt;</code> with poster thumbnails and metadata extraction.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              placeholder="Paste Google Drive video share link..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs sm:text-sm font-mono focus:border-purple-500 focus:outline-none w-full min-w-0"
            />
            <button
              onClick={handleResolveVideoManual}
              disabled={videoResolving}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {videoResolving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Resolve Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-[#070a13] border border-gray-800 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] h-auto overflow-hidden">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Live &lt;DriveVideo /&gt; Stream</span>
              <div className="w-full flex items-center justify-center overflow-hidden">
                {React.createElement(DriveVideo as any, {
                  src: videoUrlInput,
                  controls: true,
                  preload: "metadata",
                  className: "w-full max-w-[640px] rounded-xl shadow-2xl border border-gray-800",
                })}
              </div>
            </div>

            <div className="bg-[#070a13] border border-gray-800 rounded-2xl p-4 text-xs font-mono space-y-3">
              <div className="text-[11px] text-gray-400 font-sans font-semibold uppercase tracking-wider border-b border-gray-800 pb-2">
                Video Metadata Inspector
              </div>
              {videoMeta ? (
                <div className="space-y-2 text-gray-300">
                  <div><span className="text-gray-500">Stream URL:</span> <span className="text-emerald-400 break-all">{videoMeta.videoUrl}</span></div>
                  <div><span className="text-gray-500">Duration:</span> <span className="text-purple-400">{videoMeta.metadata?.duration || 0}s</span></div>
                  <div><span className="text-gray-500">Resolution:</span> <span className="text-blue-400">{videoMeta.metadata?.width} x {videoMeta.metadata?.height}</span></div>
                  <div><span className="text-gray-500">MIME Type:</span> <span className="text-amber-400">{videoMeta.metadata?.mimeType}</span></div>
                  <div><span className="text-gray-500">Poster Thumbnail:</span> <span className="text-gray-400 break-all">{videoMeta.thumbnailUrl}</span></div>
                </div>
              ) : (
                <div className="text-gray-500 py-8 text-center">Click "Resolve Video" to inspect metadata...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FOLDER LOADER PLAYGROUND */}
      {tab === "folder" && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-amber-400" />
              Public Google Drive Folder Loader Playground
            </h3>
            <p className="text-xs text-gray-400">
              Fetch images and videos from a public Google Drive folder using Google Drive API v3.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1">Public Folder Link or ID:</label>
              <input
                type="text"
                value={folderInput}
                onChange={(e) => setFolderInput(e.target.value)}
                placeholder="drive.google.com/drive/folders/ID"
                className="w-full px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1 flex items-center justify-between">
                <span>Google Drive API Key:</span>
                <span className="text-[10px] text-amber-400">Required</span>
              </label>
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter AIzaSy..."
                className="w-full px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {apiKeyInput ? (
            React.createElement(DriveGallery as any, {
              folderUrl: folderInput,
              apiKey: apiKeyInput,
              columns: { sm: 1, md: 2, lg: 3 },
              gap: "1rem",
            })
          ) : (

            <div className="p-8 text-center border border-dashed border-gray-800 rounded-2xl text-gray-400 text-xs space-y-2">
              <Key className="w-6 h-6 text-amber-400 mx-auto" />
              <p>Enter a public Google Drive API Key to load folder assets live in the grid.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RESOLVER DIAGNOSTICS */}
      {tab === "resolver" && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              Resolver Diagnostics Deep-Dive (`analyzeDriveUrl`)
            </h3>
            <p className="text-xs text-gray-400">
              Run diagnostic analysis on any input link to test format variants, candidate endpoints, and actionable recommendations.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={resolverInput}
              onChange={(e) => setResolverInput(e.target.value)}
              placeholder="Paste any link to analyze..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm font-mono focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleRunDiagnostics}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Cpu className="w-4 h-4" />
              <span>Run Diagnostics</span>
            </button>
          </div>

          {diagnosticResult && (
            <div className="bg-[#070a13] border border-gray-800 rounded-2xl p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800">
                  <div className="text-[10px] text-gray-500 uppercase font-sans">Valid Drive Link</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">{String(diagnosticResult.valid)}</div>
                </div>
                <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800">
                  <div className="text-[10px] text-gray-500 uppercase font-sans">Detected Format</div>
                  <div className="text-base font-bold text-blue-400 mt-1">{diagnosticResult.detectedFormat}</div>
                </div>
                <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800">
                  <div className="text-[10px] text-gray-500 uppercase font-sans">Asset Media Type</div>
                  <div className="text-base font-bold text-purple-400 mt-1 capitalize">{diagnosticResult.mediaType || "Image"}</div>
                </div>

                <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800">
                  <div className="text-[10px] text-gray-500 uppercase font-sans">Extracted File ID</div>
                  <div className="text-sm font-bold text-amber-400 mt-1 truncate">{diagnosticResult.fileId || "N/A"}</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-gray-300 font-sans">Generated Candidate CDN Endpoints ({diagnosticResult.candidateUrls.length}):</div>
                <ul className="space-y-1">
                  {diagnosticResult.candidateUrls.map((url: string, i: number) => (
                    <li key={i} className="p-2 bg-gray-900/40 rounded-lg text-gray-300 flex items-center justify-between">
                      <span className="truncate">{i + 1}. {url}</span>
                      {i === 0 && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-sans">Priority Candidate</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: UNIVERSAL DRIVEMEDIA PLAYGROUND */}
      {tab === "media" && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Universal <code className="text-blue-300">&lt;DriveMedia /&gt;</code> Playground
            </h3>
            <p className="text-xs text-gray-400">
              One universal component automatically renders Images, Videos, Audio tracks, or Documents based on file type.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
              placeholder="Paste any Google Drive asset link..."
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm font-mono focus:border-blue-500 focus:outline-none"
            />

            <div className="p-6 bg-[#070a13] border border-gray-800 rounded-2xl flex items-center justify-center min-h-[300px]">
              {React.createElement(DriveMedia as any, { src: mediaUrlInput })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DRIVEAUDIO & PLAYLIST */}
      {tab === "audio" && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400" />
              Google Drive Audio & Playlist Player
            </h3>
            <p className="text-xs text-gray-400">
              Stream Google Drive hosted audio files with custom waveform visualization, seeking, and multi-track playlists.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={audioUrlInput}
              onChange={(e) => setAudioUrlInput(e.target.value)}
              placeholder="Paste Google Drive audio link (MP3, WAV, AAC, OGG, FLAC, M4A) or File ID..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-xs sm:text-sm font-mono focus:border-emerald-500 focus:outline-none w-full min-w-0"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-300">Single Track Player (&lt;DriveAudio /&gt;)</h4>
              {React.createElement(DriveAudio as any, { src: audioUrlInput, title: "Drive Audio Track", artist: "DriveLoader SDK" })}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-300">Multi-Track Playlist (&lt;DrivePlaylist /&gt;)</h4>
              {React.createElement(DrivePlaylist as any, {
                tracks: [
                  { src: audioUrlInput, title: "Track 1 - Custom Audio", artist: "Google Drive" },
                  { src: audioUrlInput, title: "Track 2 - Drive Stream", artist: "DriveLoader" },
                ],
              })}
            </div>
          </div>
        </div>
      )}


      {/* TAB 7: DRIVEDOCUMENT */}
      {tab === "document" && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-sky-400" />
              Google Drive Document Viewer (&lt;DriveDocument /&gt;)
            </h3>
            <p className="text-xs text-gray-400">
              Preview PDFs, text files, and markdown documents directly inside your React app with zoom and page controls.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={docUrlInput}
              onChange={(e) => setDocUrlInput(e.target.value)}
              placeholder="Paste Google Drive document or PDF link..."
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-white text-sm font-mono focus:border-sky-500 focus:outline-none"
            />

            <div className="h-[550px] bg-[#070a13] border border-gray-800 rounded-2xl overflow-hidden">
              {React.createElement(DriveDocument as any, { src: docUrlInput, height: "100%" })}
            </div>

          </div>
        </div>
      )}

      {/* Floating Developer Debugger Overlay */}
      {React.createElement(DriveDebugOverlay as any, { initialOpen: false })}
    </div>
  );
}

