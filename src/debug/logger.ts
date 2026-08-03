import type { DebugLog, PerformanceMetric } from '../types/index';

type PerformanceListener = (metric: PerformanceMetric) => void;
type LogListener = (log: DebugLog) => void;

class DriveLogger {
  private logs: DebugLog[] = [];
  private metrics: PerformanceMetric[] = [];
  private logListeners = new Set<LogListener>();
  private metricListeners = new Set<PerformanceListener>();
  private enabled = false;

  public setEnabled(enable: boolean): void {
    this.enabled = enable;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public log(level: 'info' | 'warn' | 'error' | 'debug', message: string, details?: unknown): void {
    const item: DebugLog = {
      timestamp: Date.now(),
      level,
      message,
      details,
    };
    this.logs.push(item);
    if (this.logs.length > 200) this.logs.shift();

    if (this.enabled) {
      console.log(`[DriveLoader Debug] [${level.toUpperCase()}] ${message}`, details || '');
    }

    this.logListeners.forEach((fn) => fn(item));
  }

  public recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    if (this.metrics.length > 200) this.metrics.shift();
    this.metricListeners.forEach((fn) => fn(metric));
  }

  public getLogs(): DebugLog[] {
    return [...this.logs];
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public onLog(fn: LogListener): () => void {
    this.logListeners.add(fn);
    return () => this.logListeners.delete(fn);
  }

  public onMetric(fn: PerformanceListener): () => void {
    this.metricListeners.add(fn);
    return () => this.metricListeners.delete(fn);
  }

  public clear(): void {
    this.logs = [];
    this.metrics = [];
  }
}

export const driveLogger = new DriveLogger();

export function enableDriveDebug(enable = true): void {
  driveLogger.setEnabled(enable);
}

export function onPerformanceMetric(fn: PerformanceListener): () => void {
  return driveLogger.onMetric(fn);
}

export function getPerformanceMetrics(): PerformanceMetric[] {
  return driveLogger.getMetrics();
}
