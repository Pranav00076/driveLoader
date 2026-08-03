import { useCallback, useEffect, useState } from 'react';
import { resolveDriveDocument } from '../core/documentResolver';
import type { UseDriveDocumentResult } from '../types/index';

/**
 * Custom React hook for viewing and interacting with Google Drive document previews.
 *
 * @param src - Google Drive document URL or File ID.
 * @returns UseDriveDocumentResult state and controls.
 */
export function useDriveDocument(src: string): UseDriveDocumentResult {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<'pdf' | 'txt' | 'md' | 'gdoc' | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [zoom, setZoomState] = useState<number>(1.0);

  const loadDocument = useCallback(async () => {
    if (!src) return;
    setLoading(true);
    setError(null);
    try {
      const res = await resolveDriveDocument(src);
      setDocumentUrl(res.documentUrl);
      setFormat(res.format);
      if (res.content) {
        setContent(res.content);
      }
      setLoading(false);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      setLoading(false);
    }
  }, [src]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const setZoom = useCallback((z: number) => {
    const clamped = Math.max(0.5, Math.min(3.0, z));
    setZoomState(clamped);
  }, []);

  const download = useCallback(() => {
    if (documentUrl) {
      window.open(documentUrl.replace('/preview', '/view'), '_blank');
    }
  }, [documentUrl]);

  return {
    documentUrl,
    format,
    content,
    loading,
    error,
    page,
    totalPages: 1,
    zoom,

    setPage,
    setZoom,
    download,
    reload: loadDocument,
  };
}
