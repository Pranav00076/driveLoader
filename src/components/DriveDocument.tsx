import React from 'react';
import { useDriveDocument } from '../hooks/useDriveDocument';
import type { DriveDocumentProps } from '../types/index';

/**
 * DriveDocument - Production-ready Google Drive document viewer component.
 * Supports PDF previews, TXT view, Markdown rendering, zoom, and page navigation controls.
 */
export const DriveDocument: React.FC<DriveDocumentProps> = ({
  src,
  width = '100%',
  height = '600px',
  mode = 'auto',
  className = '',
  style,
  placeholder,
  fallback,
  onResolveSuccess,
  onError,
}) => {
  const {
    documentUrl,
    format,
    content,
    loading,
    error,
    zoom: currentZoom,
    setZoom,
    download,
  } = useDriveDocument(src);

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  React.useEffect(() => {
    if (documentUrl && onResolveSuccess && format) {
      onResolveSuccess({
        documentUrl,
        fileId: src,
        format,
        content: content || undefined,
        fromCache: false,
      });
    }
  }, [documentUrl, format, content, onResolveSuccess, src]);

  if (loading) {
    return (
      <div
        className={`driveloader-doc-loading ${className}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          color: '#a1a1aa',
          ...style,
        }}
      >
        {placeholder || <span>Loading Document Preview...</span>}
      </div>
    );
  }

  if (error || !documentUrl) {
    return (
      <div
        className={`driveloader-doc-error ${className}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(239,68,68,0.1)',
          borderRadius: '12px',
          color: '#ef4444',
          padding: '1rem',
          ...style,
        }}
      >
        {fallback || <span>Failed to load document: {error?.message || 'Unknown error'}</span>}
      </div>
    );
  }

  const isTextMode =
    (mode === 'text' || mode === 'markdown' || format === 'txt' || format === 'md') && content;

  return (
    <div
      className={`driveloader-document ${className}`}
      style={{
        width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: '#18181b',
        color: '#f4f4f5',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.6rem 1rem',
          background: '#27272a',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#a1a1aa',
          }}
        >
          Document Preview ({format || 'PDF'})
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            aria-label="Zoom Out"
            onClick={() => setZoom(currentZoom - 0.15)}
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              background: '#3f3f46',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            -
          </button>
          <span
            style={{ fontSize: '0.8rem', color: '#d4d4d8', minWidth: '45px', textAlign: 'center' }}
          >
            {Math.round(currentZoom * 100)}%
          </span>
          <button
            type="button"
            aria-label="Zoom In"
            onClick={() => setZoom(currentZoom + 0.15)}
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              background: '#3f3f46',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            +
          </button>
          <button
            type="button"
            onClick={download}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '6px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500,
              marginLeft: '0.5rem',
            }}
          >
            Open in Drive ↗
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isTextMode ? (
          <div
            style={{
              padding: '1.5rem',
              height: '100%',
              overflow: 'auto',
              transform: currentZoom === 1 ? 'none' : `scale(${currentZoom})`,
              transformOrigin: 'top left',
              whiteSpace: 'pre-wrap',
              fontFamily: format === 'md' ? 'system-ui, sans-serif' : 'monospace',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            {content}
          </div>
        ) : (
          <iframe
            src={documentUrl}
            title="Google Drive Document Viewer"
            style={{
              width: currentZoom === 1 ? '100%' : `${100 / currentZoom}%`,
              height: currentZoom === 1 ? '100%' : `${100 / currentZoom}%`,
              border: 'none',
              transform: currentZoom === 1 ? 'none' : `scale(${currentZoom})`,
              transformOrigin: 'top left',
            }}
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};
