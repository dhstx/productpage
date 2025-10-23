/**
 * Logging and Monitoring Service
 * 
 * Provides structured logging with:
 * - Multiple log levels (debug, info, warn, error, critical)
 * - Contextual metadata
 * - Error tracking
 * - Performance monitoring
 * - Alert system
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Log levels
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  CRITICAL: 'critical'
};

// Log categories
export const LogCategory = {
  API: 'api',
  AUTH: 'auth',
  BILLING: 'billing',
  PT_TRACKING: 'pt_tracking',
  SECURITY: 'security',
  WEBHOOK: 'webhook',
  SYSTEM: 'system',
  USER: 'user'
};

/**
 * Structured logger
 */
class Logger {
  constructor(category = LogCategory.SYSTEM) {
    this.category = category;
    this.context = {};
  }

  /**
   * Set context for all subsequent logs
   */
  setContext(context) {
    this.context = { ...this.context, ...context };
    return this;
  }

  /**
   * Clear context
   */
  clearContext() {
    this.context = {};
    return this;
  }

  /**
   * Log message
   */
  async log(level, message, metadata = {}) {
    const logEntry = {
      level,
      category: this.category,
      message,
      metadata: {
        ...this.context,
        ...metadata
      },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Console output
    this._consoleLog(logEntry);

    // Database logging (async, don't wait)
    this._databaseLog(logEntry).catch(err => {
      console.error('Failed to write log to database:', err);
    });

    // Send alerts for critical logs
    if (level === LogLevel.CRITICAL || level === LogLevel.ERROR) {
      this._sendAlert(logEntry).catch(err => {
        console.error('Failed to send alert:', err);
      });
    }

    return logEntry;
  }

  /**
   * Debug log
   */
  debug(message, metadata = {}) {
    return this.log(LogLevel.DEBUG, message, metadata);
  }

  /**
   * Info log
   */
  info(message, metadata = {}) {
    return this.log(LogLevel.INFO, message, metadata);
  }

  /**
   * Warning log
   */
  warn(message, metadata = {}) {
    return this.log(LogLevel.WARN, message, metadata);
  }

  /**
   * Error log
   */
  error(message, error = null, metadata = {}) {
    const errorMetadata = error ? {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name
    } : {};

    return this.log(LogLevel.ERROR, message, {
      ...metadata,
      ...errorMetadata
    });
  }

  /**
   * Critical log (triggers immediate alert)
   */
  critical(message, error = null, metadata = {}) {
    const errorMetadata = error ? {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name
    } : {};

    return this.log(LogLevel.CRITICAL, message, {
      ...metadata,
      ...errorMetadata
    });
  }

  /**
   * Console output
   */
  _consoleLog(logEntry) {
    const { level, category, message, metadata, timestamp } = logEntry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${category}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, metadata);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, metadata);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, metadata);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(prefix, message, metadata);
        break;
      default:
        console.log(prefix, message, metadata);
    }
  }

  /**
   * Database logging
   */
  async _databaseLog(logEntry) {
    const { error } = await supabase
      .from('application_logs')
      .insert({
        level: logEntry.level,
        category: logEntry.category,
        message: logEntry.message,
        metadata: logEntry.metadata,
        environment: logEntry.environment,
        created_at: logEntry.timestamp
      });

    if (error) throw error;
  }

  /**
   * Send alert
   */
  async _sendAlert(logEntry) {
    const { level, category, message, metadata } = logEntry;

    // Send to Slack
    if (process.env.SLACK_WEBHOOK_URL) {
      const emoji = level === LogLevel.CRITICAL ? '🚨' : '⚠️';
      const color = level === LogLevel.CRITICAL ? 'danger' : 'warning';

      const slackMessage = {
        text: `${emoji} ${level.toUpperCase()}: ${message}`,
        attachments: [
          {
            color,
            fields: [
              {
                title: 'Category',
                value: category,
                short: true
              },
              {
                title: 'Environment',
                value: logEntry.environment,
                short: true
              },
              {
                title: 'Metadata',
                value: '```' + JSON.stringify(metadata, null, 2) + '```',
                short: false
              }
            ],
            footer: 'DHStx Monitoring',
            ts: Math.floor(new Date(logEntry.timestamp).getTime() / 1000)
          }
        ]
      };

      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      });
    }

    // Log alert to database
    await supabase
      .from('alerts')
      .insert({
        level,
        category,
        message,
        metadata,
        triggered_at: logEntry.timestamp,
        status: 'open'
      });
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  constructor(operation) {
    this.operation = operation;
    this.startTime = Date.now();
    this.metrics = {};
  }

  /**
   * Record metric
   */
  recordMetric(name, value) {
    this.metrics[name] = value;
    return this;
  }

  /**
   * End monitoring and log
   */
  async end(logger, metadata = {}) {
    const duration = Date.now() - this.startTime;

    await logger.info(`Performance: ${this.operation}`, {
      operation: this.operation,
      duration_ms: duration,
      metrics: this.metrics,
      ...metadata
    });

    // Log to performance table
    await supabase
      .from('performance_metrics')
      .insert({
        operation: this.operation,
        duration_ms: duration,
        metrics: this.metrics,
        metadata,
        recorded_at: new Date().toISOString()
      });

    return { duration, metrics: this.metrics };
  }
}

/**
 * Create logger instance
 */
export function createLogger(category = LogCategory.SYSTEM) {
  return new Logger(category);
}

/**
 * Start performance monitoring
 */
export function startPerformanceMonitor(operation) {
  return new PerformanceMonitor(operation);
}

/**
 * Get log statistics
 */
export async function getLogStatistics(hours = 24) {
  const { data, error } = await supabase
    .rpc('get_log_statistics', { p_hours: hours });

  if (error) throw error;
  return data;
}

/**
 * Get recent errors
 */
export async function getRecentErrors(limit = 50) {
  const { data, error } = await supabase
    .from('application_logs')
    .select('*')
    .in('level', [LogLevel.ERROR, LogLevel.CRITICAL])
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get open alerts
 */
export async function getOpenAlerts() {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('status', 'open')
    .order('triggered_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Resolve alert
 */
export async function resolveAlert(alertId, resolution) {
  const { data, error } = await supabase
    .from('alerts')
    .update({
      status: 'resolved',
      resolution,
      resolved_at: new Date().toISOString()
    })
    .eq('id', alertId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Health check
 */
export async function healthCheck() {
  const checks = {
    database: false,
    api: false,
    timestamp: new Date().toISOString()
  };

  // Check database
  try {
    const { error } = await supabase
      .from('application_logs')
      .select('id')
      .limit(1);
    checks.database = !error;
  } catch (err) {
    checks.database = false;
  }

  // Check API
  checks.api = true; // If we got here, API is working

  // Overall health
  checks.healthy = checks.database && checks.api;

  return checks;
}

export default {
  createLogger,
  startPerformanceMonitor,
  getLogStatistics,
  getRecentErrors,
  getOpenAlerts,
  resolveAlert,
  healthCheck,
  LogLevel,
  LogCategory
};

