# Audit & Logging Framework

## Overview
This document details the comprehensive logging and audit framework using LogRocket, AWS CloudTrail, and custom audit tables for compliance and security monitoring.

## Logging Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Application Layer                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Frontend │  │Backend  │  │Workers  │  │Scheduled│        │
│  │(Next.js)│  │(NestJS) │  │(Bull)   │  │Jobs     │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
        │ Client     │ Server     │ Background │ System
        │ Events     │ Events     │ Events     │ Events
        │            │            │            │
        ▼            ▼            ▼            ▼
┌──────────────────────────────────────────────────────────────┐
│                      Log Aggregation                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   LogRocket    │  │ Winston Logger │  │ AWS CloudWatch │ │
│  │ (Frontend UX)  │  │ (Application)  │  │ (System Logs)  │ │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘ │
└───────────┼──────────────────┼──────────────────┼───────────┘
            │                  │                  │
            ▼                  ▼                  ▼
┌──────────────────────────────────────────────────────────────┐
│                     Storage Layer                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   LogRocket    │  │  PostgreSQL    │  │      S3        │ │
│  │   Dashboard    │  │  Audit Tables  │  │  (Long-term)   │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
            │                  │                  │
            └──────────────────┴──────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Analysis & Alerting                        │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │   Dashboards   │  │     Alerts     │  │   Compliance   │ │
│  │   (Grafana)    │  │  (CloudWatch)  │  │    Reports     │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema

### Audit Tables

```sql
-- Main Audit Log Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100) UNIQUE NOT NULL, -- Unique identifier for correlation
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    
    -- Event Classification
    event_type VARCHAR(50) NOT NULL, -- 'authentication', 'authorization', 'crud', 'system'
    action VARCHAR(100) NOT NULL, -- 'login', 'create', 'update', 'delete', 'permission_change'
    resource VARCHAR(100) NOT NULL, -- 'user', 'content', 'event', 'role', 'permission'
    resource_id VARCHAR(255), -- ID of the affected resource
    
    -- Event Details
    status VARCHAR(20) NOT NULL, -- 'success', 'failure', 'error'
    severity VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'critical'
    
    -- Change Tracking
    old_values JSONB, -- Previous state (for updates/deletes)
    new_values JSONB, -- New state (for creates/updates)
    changes JSONB, -- Specific fields that changed
    
    -- Request Context
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10), -- GET, POST, PUT, DELETE
    request_path TEXT,
    request_query JSONB,
    request_body JSONB, -- Sanitized (no sensitive data)
    
    -- Response Context
    response_status INTEGER,
    response_time_ms INTEGER,
    
    -- Error Context
    error_message TEXT,
    error_stack TEXT,
    
    -- Additional Metadata
    metadata JSONB, -- Flexible field for extra context
    tags TEXT[], -- For categorization and filtering
    
    -- Compliance
    requires_review BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX idx_audit_logs_requires_review ON audit_logs(requires_review) WHERE requires_review = TRUE;
CREATE INDEX idx_audit_logs_tags ON audit_logs USING GIN(tags);
CREATE INDEX idx_audit_logs_metadata ON audit_logs USING GIN(metadata);

-- Partition by month for better performance
CREATE TABLE audit_logs_2025_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE audit_logs_2025_02 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
-- Continue for each month...

-- Authentication Audit Table
CREATE TABLE auth_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id),
    email VARCHAR(255),
    
    -- Authentication Details
    auth_method VARCHAR(50) NOT NULL, -- 'saml', 'jwt', 'password', 'mfa'
    auth_provider VARCHAR(50), -- 'okta', 'azure_ad', 'google'
    action VARCHAR(50) NOT NULL, -- 'login_attempt', 'login_success', 'login_failure', 'logout', 'token_refresh'
    
    -- MFA Details
    mfa_required BOOLEAN DEFAULT FALSE,
    mfa_verified BOOLEAN,
    mfa_method VARCHAR(50), -- 'totp', 'sms', 'email'
    
    -- Session Details
    session_id UUID,
    token_jti VARCHAR(255),
    
    -- Request Context
    ip_address INET NOT NULL,
    user_agent TEXT,
    geo_location JSONB, -- {country, region, city}
    
    -- Failure Details
    failure_reason VARCHAR(255),
    failure_count INTEGER DEFAULT 1,
    
    -- Security Flags
    is_suspicious BOOLEAN DEFAULT FALSE,
    suspicious_reasons TEXT[],
    blocked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_auth_audit_timestamp ON auth_audit_logs(timestamp DESC);
CREATE INDEX idx_auth_audit_user ON auth_audit_logs(user_id);
CREATE INDEX idx_auth_audit_email ON auth_audit_logs(email);
CREATE INDEX idx_auth_audit_action ON auth_audit_logs(action);
CREATE INDEX idx_auth_audit_ip ON auth_audit_logs(ip_address);
CREATE INDEX idx_auth_audit_suspicious ON auth_audit_logs(is_suspicious) WHERE is_suspicious = TRUE;

-- Permission Change Audit Table
CREATE TABLE permission_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Change Details
    change_type VARCHAR(50) NOT NULL, -- 'role_assigned', 'role_removed', 'permission_granted', 'permission_revoked'
    
    -- Affected User
    target_user_id UUID REFERENCES users(id) NOT NULL,
    target_user_email VARCHAR(255) NOT NULL,
    
    -- Role/Permission Details
    role_id UUID REFERENCES roles(id),
    role_name VARCHAR(50),
    permission_id UUID REFERENCES permissions(id),
    permission_name VARCHAR(100), -- 'resource:action'
    
    -- Who Made the Change
    changed_by_user_id UUID REFERENCES users(id) NOT NULL,
    changed_by_email VARCHAR(255) NOT NULL,
    
    -- Previous and New State
    old_roles TEXT[],
    new_roles TEXT[],
    old_permissions TEXT[],
    new_permissions TEXT[],
    
    -- Justification
    reason TEXT,
    ticket_number VARCHAR(50), -- Reference to approval ticket
    
    -- Approval Workflow
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    -- Context
    ip_address INET,
    metadata JSONB
);

CREATE INDEX idx_permission_audit_timestamp ON permission_audit_logs(timestamp DESC);
CREATE INDEX idx_permission_audit_target_user ON permission_audit_logs(target_user_id);
CREATE INDEX idx_permission_audit_changed_by ON permission_audit_logs(changed_by_user_id);
CREATE INDEX idx_permission_audit_type ON permission_audit_logs(change_type);
CREATE INDEX idx_permission_audit_approval ON permission_audit_logs(requires_approval) WHERE requires_approval = TRUE;

-- Data Change Audit Table (for CRUD operations)
CREATE TABLE data_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) NOT NULL,
    
    -- Table and Record Details
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    operation VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    
    -- Change Details
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    
    -- Context
    transaction_id VARCHAR(100), -- Group related changes
    batch_id VARCHAR(100), -- For bulk operations
    
    -- Compliance
    pii_accessed BOOLEAN DEFAULT FALSE,
    retention_period_days INTEGER DEFAULT 2555 -- 7 years default
);

CREATE INDEX idx_data_audit_timestamp ON data_audit_logs(timestamp DESC);
CREATE INDEX idx_data_audit_user ON data_audit_logs(user_id);
CREATE INDEX idx_data_audit_table ON data_audit_logs(table_name);
CREATE INDEX idx_data_audit_record ON data_audit_logs(record_id);
CREATE INDEX idx_data_audit_operation ON data_audit_logs(operation);
CREATE INDEX idx_data_audit_pii ON data_audit_logs(pii_accessed) WHERE pii_accessed = TRUE;

-- System Event Logs
CREATE TABLE system_event_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Event Classification
    event_type VARCHAR(50) NOT NULL, -- 'deployment', 'configuration_change', 'backup', 'maintenance'
    event_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'critical'
    
    -- Event Details
    description TEXT,
    component VARCHAR(100), -- 'database', 'api', 'worker', 'frontend'
    environment VARCHAR(20), -- 'development', 'staging', 'production'
    
    -- Change Details
    old_value TEXT,
    new_value TEXT,
    
    -- Actor
    triggered_by VARCHAR(100), -- user email or 'system'
    automated BOOLEAN DEFAULT FALSE,
    
    -- Context
    metadata JSONB,
    
    -- Impact
    affected_users INTEGER,
    downtime_seconds INTEGER
);

CREATE INDEX idx_system_event_timestamp ON system_event_logs(timestamp DESC);
CREATE INDEX idx_system_event_type ON system_event_logs(event_type);
CREATE INDEX idx_system_event_severity ON system_event_logs(severity);
CREATE INDEX idx_system_event_environment ON system_event_logs(environment);
```

## Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│       users         │
│─────────────────────│
│ id (PK)            │◄──┐
│ email              │   │
│ first_name         │   │
│ last_name          │   │
│ external_id        │   │
│ ...                │   │
└─────────────────────┘   │
          ▲               │
          │               │
          │ user_id       │ user_id
          │               │
┌─────────┴───────────┐   │
│   audit_logs        │   │
│─────────────────────│   │
│ id (PK)            │   │
│ event_id           │   │
│ timestamp          │   │
│ user_id (FK)       │───┘
│ event_type         │
│ action             │
│ resource           │
│ old_values         │
│ new_values         │
│ ...                │
└─────────────────────┘
          │
          │
          ▼
┌─────────────────────┐       ┌─────────────────────┐
│ auth_audit_logs     │       │ permission_audit    │
│─────────────────────│       │─────────────────────│
│ id (PK)            │       │ id (PK)            │
│ timestamp          │       │ timestamp          │
│ user_id (FK)       │       │ target_user_id (FK)│
│ auth_method        │       │ changed_by (FK)    │
│ action             │       │ change_type        │
│ ip_address         │       │ role_id (FK)       │
│ mfa_verified       │       │ old_roles          │
│ ...                │       │ new_roles          │
└─────────────────────┘       └─────────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│ data_audit_logs     │       │ system_event_logs   │
│─────────────────────│       │─────────────────────│
│ id (PK)            │       │ id (PK)            │
│ timestamp          │       │ timestamp          │
│ user_id (FK)       │       │ event_type         │
│ table_name         │       │ event_name         │
│ record_id          │       │ severity           │
│ operation          │       │ component          │
│ old_data           │       │ triggered_by       │
│ new_data           │       │ ...                │
└─────────────────────┘       └─────────────────────┘
```

## NestJS Audit Service Implementation

```typescript
// audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuthAuditLog } from './entities/auth-audit-log.entity';
import { PermissionAuditLog } from './entities/permission-audit-log.entity';
import { DataAuditLog } from './entities/data-audit-log.entity';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(AuthAuditLog)
    private authAuditRepository: Repository<AuthAuditLog>,
    @InjectRepository(PermissionAuditLog)
    private permissionAuditRepository: Repository<PermissionAuditLog>,
    @InjectRepository(DataAuditLog)
    private dataAuditRepository: Repository<DataAuditLog>,
  ) {}

  /**
   * Log general audit event
   */
  async log(params: {
    userId?: string;
    sessionId?: string;
    eventType: string;
    action: string;
    resource: string;
    resourceId?: string;
    status: 'success' | 'failure' | 'error';
    severity?: 'info' | 'warning' | 'error' | 'critical';
    oldValues?: any;
    newValues?: any;
    changes?: any;
    request?: any;
    metadata?: any;
    tags?: string[];
    requiresReview?: boolean;
  }): Promise<AuditLog> {
    const eventId = uuidv4();

    const auditLog = this.auditLogRepository.create({
      eventId,
      timestamp: new Date(),
      userId: params.userId,
      sessionId: params.sessionId,
      eventType: params.eventType,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      status: params.status,
      severity: params.severity || 'info',
      oldValues: params.oldValues,
      newValues: params.newValues,
      changes: params.changes,
      ipAddress: params.request?.ip,
      userAgent: params.request?.headers['user-agent'],
      requestMethod: params.request?.method,
      requestPath: params.request?.path,
      requestQuery: params.request?.query,
      requestBody: this.sanitizeRequestBody(params.request?.body),
      metadata: params.metadata,
      tags: params.tags,
      requiresReview: params.requiresReview || false,
    });

    try {
      const saved = await this.auditLogRepository.save(auditLog);
      
      // Also log to application logger
      this.logger.log({
        eventId,
        action: params.action,
        resource: params.resource,
        status: params.status,
      });

      return saved;
    } catch (error) {
      this.logger.error('Failed to save audit log', error);
      // Don't throw - audit logging should never break the main flow
      return auditLog;
    }
  }

  /**
   * Log authentication event
   */
  async logAuthEvent(params: {
    userId?: string;
    email: string;
    authMethod: string;
    authProvider?: string;
    action: string;
    mfaRequired?: boolean;
    mfaVerified?: boolean;
    sessionId?: string;
    tokenJti?: string;
    ipAddress: string;
    userAgent?: string;
    geoLocation?: any;
    failureReason?: string;
    isSuspicious?: boolean;
    suspiciousReasons?: string[];
  }): Promise<AuthAuditLog> {
    const authLog = this.authAuditRepository.create({
      timestamp: new Date(),
      userId: params.userId,
      email: params.email,
      authMethod: params.authMethod,
      authProvider: params.authProvider,
      action: params.action,
      mfaRequired: params.mfaRequired || false,
      mfaVerified: params.mfaVerified,
      sessionId: params.sessionId,
      tokenJti: params.tokenJti,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      geoLocation: params.geoLocation,
      failureReason: params.failureReason,
      isSuspicious: params.isSuspicious || false,
      suspiciousReasons: params.suspiciousReasons,
    });

    try {
      return await this.authAuditRepository.save(authLog);
    } catch (error) {
      this.logger.error('Failed to save auth audit log', error);
      return authLog;
    }
  }

  /**
   * Log permission change
   */
  async logPermissionChange(params: {
    changeType: string;
    targetUserId: string;
    targetUserEmail: string;
    roleId?: string;
    roleName?: string;
    permissionId?: string;
    permissionName?: string;
    changedByUserId: string;
    changedByEmail: string;
    oldRoles?: string[];
    newRoles?: string[];
    oldPermissions?: string[];
    newPermissions?: string[];
    reason?: string;
    ticketNumber?: string;
    requiresApproval?: boolean;
    ipAddress?: string;
    metadata?: any;
  }): Promise<PermissionAuditLog> {
    const permissionLog = this.permissionAuditRepository.create({
      timestamp: new Date(),
      changeType: params.changeType,
      targetUserId: params.targetUserId,
      targetUserEmail: params.targetUserEmail,
      roleId: params.roleId,
      roleName: params.roleName,
      permissionId: params.permissionId,
      permissionName: params.permissionName,
      changedByUserId: params.changedByUserId,
      changedByEmail: params.changedByEmail,
      oldRoles: params.oldRoles,
      newRoles: params.newRoles,
      oldPermissions: params.oldPermissions,
      newPermissions: params.newPermissions,
      reason: params.reason,
      ticketNumber: params.ticketNumber,
      requiresApproval: params.requiresApproval || false,
      ipAddress: params.ipAddress,
      metadata: params.metadata,
    });

    try {
      const saved = await this.permissionAuditRepository.save(permissionLog);
      
      // Flag for review if it's a privileged role
      if (['BOARD', 'STAFF'].includes(params.roleName)) {
        await this.log({
          userId: params.changedByUserId,
          eventType: 'authorization',
          action: 'privileged_role_assigned',
          resource: 'role',
          resourceId: params.roleId,
          status: 'success',
          severity: 'warning',
          metadata: params,
          requiresReview: true,
        });
      }

      return saved;
    } catch (error) {
      this.logger.error('Failed to save permission audit log', error);
      return permissionLog;
    }
  }

  /**
   * Log data change (CRUD operation)
   */
  async logDataChange(params: {
    userId: string;
    tableName: string;
    recordId: string;
    operation: 'INSERT' | 'UPDATE' | 'DELETE';
    oldData?: any;
    newData?: any;
    changedFields?: string[];
    transactionId?: string;
    batchId?: string;
    piiAccessed?: boolean;
  }): Promise<DataAuditLog> {
    const dataLog = this.dataAuditRepository.create({
      timestamp: new Date(),
      userId: params.userId,
      tableName: params.tableName,
      recordId: params.recordId,
      operation: params.operation,
      oldData: this.sanitizeData(params.oldData),
      newData: this.sanitizeData(params.newData),
      changedFields: params.changedFields,
      transactionId: params.transactionId,
      batchId: params.batchId,
      piiAccessed: params.piiAccessed || false,
    });

    try {
      return await this.dataAuditRepository.save(dataLog);
    } catch (error) {
      this.logger.error('Failed to save data audit log', error);
      return dataLog;
    }
  }

  /**
   * Log authentication failure
   */
  async logAuthenticationFailure(request: any): Promise<void> {
    await this.logAuthEvent({
      email: request.body?.email || 'unknown',
      authMethod: 'jwt',
      action: 'login_failure',
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
      failureReason: 'Invalid or missing token',
    });
  }

  /**
   * Log authorization failure
   */
  async logAuthorizationFailure(
    userId: string,
    requiredPermissions: string[],
    request: any,
  ): Promise<void> {
    await this.log({
      userId,
      eventType: 'authorization',
      action: 'access_denied',
      resource: request.path,
      status: 'failure',
      severity: 'warning',
      metadata: {
        requiredPermissions,
        method: request.method,
      },
      request,
    });
  }

  /**
   * Sanitize request body (remove sensitive fields)
   */
  private sanitizeRequestBody(body: any): any {
    if (!body) return null;

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'ssn', 'creditCard'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Sanitize data (mask PII fields)
   */
  private sanitizeData(data: any): any {
    if (!data) return null;

    const piiFields = ['ssn', 'creditCard', 'bankAccount', 'passport'];
    const sanitized = { ...data };

    for (const field of piiFields) {
      if (sanitized[field]) {
        sanitized[field] = this.maskPII(sanitized[field]);
      }
    }

    return sanitized;
  }

  /**
   * Mask PII data (show only last 4 characters)
   */
  private maskPII(value: string): string {
    if (!value || value.length < 4) return '****';
    return '****' + value.slice(-4);
  }
}
```

## Example Queries

### 1. Get User Activity History

```sql
-- Get all actions performed by a specific user
SELECT 
    al.timestamp,
    al.action,
    al.resource,
    al.resource_id,
    al.status,
    al.old_values,
    al.new_values,
    al.ip_address
FROM audit_logs al
WHERE al.user_id = 'user-uuid'
ORDER BY al.timestamp DESC
LIMIT 100;
```

### 2. Get Change History for a Resource

```sql
-- Get complete change history for a specific record
SELECT 
    al.timestamp,
    u.email as changed_by,
    al.action,
    al.old_values,
    al.new_values,
    al.changes
FROM audit_logs al
LEFT JOIN users u ON u.id = al.user_id
WHERE al.resource = 'content'
  AND al.resource_id = 'content-uuid'
ORDER BY al.timestamp ASC;
```

### 3. Get Failed Login Attempts

```sql
-- Get failed login attempts in the last 24 hours
SELECT 
    aal.timestamp,
    aal.email,
    aal.ip_address,
    aal.failure_reason,
    aal.is_suspicious,
    aal.user_agent
FROM auth_audit_logs aal
WHERE aal.action = 'login_failure'
  AND aal.timestamp > NOW() - INTERVAL '24 hours'
ORDER BY aal.timestamp DESC;
```

### 4. Get Permission Changes for Compliance Review

```sql
-- Get all permission changes requiring review
SELECT 
    pal.timestamp,
    pal.change_type,
    target.email as affected_user,
    changer.email as changed_by,
    pal.role_name,
    pal.old_roles,
    pal.new_roles,
    pal.reason,
    pal.approved_at,
    approver.email as approved_by
FROM permission_audit_logs pal
JOIN users target ON target.id = pal.target_user_id
JOIN users changer ON changer.id = pal.changed_by_user_id
LEFT JOIN users approver ON approver.id = pal.approved_by
WHERE pal.timestamp > '2025-01-01'
  AND pal.role_name IN ('BOARD', 'STAFF')
ORDER BY pal.timestamp DESC;
```

### 5. Get Suspicious Activity Report

```sql
-- Get potentially suspicious authentication activity
SELECT 
    aal.timestamp,
    aal.email,
    aal.ip_address,
    aal.action,
    aal.suspicious_reasons,
    COUNT(*) OVER (PARTITION BY aal.email) as total_attempts,
    COUNT(*) FILTER (WHERE aal.action = 'login_failure') 
        OVER (PARTITION BY aal.email) as failed_attempts
FROM auth_audit_logs aal
WHERE aal.timestamp > NOW() - INTERVAL '1 hour'
  AND (
    aal.is_suspicious = TRUE
    OR aal.action = 'login_failure'
  )
ORDER BY aal.timestamp DESC;
```

### 6. Get Data Access Audit for PII

```sql
-- Get all PII data access in the last 30 days
SELECT 
    dal.timestamp,
    u.email as accessed_by,
    dal.table_name,
    dal.record_id,
    dal.operation,
    dal.changed_fields
FROM data_audit_logs dal
JOIN users u ON u.id = dal.user_id
WHERE dal.pii_accessed = TRUE
  AND dal.timestamp > NOW() - INTERVAL '30 days'
ORDER BY dal.timestamp DESC;
```

### 7. Get Compliance Report

```sql
-- Generate compliance report for audit period
WITH audit_summary AS (
    SELECT 
        DATE_TRUNC('day', timestamp) as date,
        event_type,
        COUNT(*) as event_count,
        COUNT(*) FILTER (WHERE status = 'failure') as failure_count,
        COUNT(*) FILTER (WHERE severity IN ('error', 'critical')) as critical_count
    FROM audit_logs
    WHERE timestamp BETWEEN '2025-01-01' AND '2025-03-31'
    GROUP BY DATE_TRUNC('day', timestamp), event_type
)
SELECT 
    date,
    event_type,
    event_count,
    failure_count,
    critical_count,
    ROUND(100.0 * failure_count / NULLIF(event_count, 0), 2) as failure_rate
FROM audit_summary
ORDER BY date DESC, event_type;
```

### 8. Get User Access Pattern Analysis

```sql
-- Analyze user access patterns for anomaly detection
SELECT 
    u.email,
    DATE_TRUNC('hour', al.timestamp) as hour,
    COUNT(DISTINCT al.ip_address) as unique_ips,
    COUNT(*) as total_requests,
    COUNT(DISTINCT al.resource) as unique_resources,
    ARRAY_AGG(DISTINCT al.resource) as resources_accessed
FROM audit_logs al
JOIN users u ON u.id = al.user_id
WHERE al.timestamp > NOW() - INTERVAL '7 days'
GROUP BY u.email, DATE_TRUNC('hour', al.timestamp)
HAVING COUNT(DISTINCT al.ip_address) > 3  -- Multiple IPs in same hour
   OR COUNT(*) > 1000  -- High request volume
ORDER BY hour DESC, total_requests DESC;
```

## LogRocket Integration

```typescript
// logrocket.service.ts
import LogRocket from 'logrocket';

export class LogRocketService {
  initialize() {
    if (process.env.NODE_ENV === 'production') {
      LogRocket.init(process.env.LOGROCKET_APP_ID);
    }
  }

  identifyUser(user: { id: string; email: string; name: string; roles: string[] }) {
    LogRocket.identify(user.id, {
      name: user.name,
      email: user.email,
      roles: user.roles.join(','),
    });
  }

  logEvent(eventName: string, metadata?: any) {
    LogRocket.track(eventName, metadata);
  }

  captureException(error: Error, context?: any) {
    LogRocket.captureException(error, {
      tags: {
        environment: process.env.NODE_ENV,
      },
      extra: context,
    });
  }
}
```

## Winston Logger Configuration

```typescript
// logger.config.ts
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const createLogger = () => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    defaultMeta: {
      service: 'university-app',
      environment: process.env.NODE_ENV,
    },
    transports: [
      // Console output
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
      
      // File output with rotation
      new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
      }),
      
      // Error file
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '30d',
      }),
    ],
  });
};
```

## Retention Policy

```sql
-- Automated cleanup for expired logs (run monthly)
DELETE FROM audit_logs 
WHERE timestamp < NOW() - INTERVAL '90 days'
  AND requires_review = FALSE
  AND severity NOT IN ('error', 'critical');

DELETE FROM auth_audit_logs 
WHERE timestamp < NOW() - INTERVAL '90 days'
  AND action NOT IN ('login_failure');

-- Keep critical logs for 7 years (compliance requirement)
-- Archive to S3 instead of deleting
-- Use AWS Data Pipeline or custom script
```

## Alerting Rules

```yaml
# CloudWatch Alarms Configuration
alarms:
  - name: HighFailureRate
    metric: FailedRequests
    threshold: 100
    period: 300  # 5 minutes
    evaluation_periods: 2
    actions:
      - send_notification
      - page_on_call
  
  - name: SuspiciousLoginActivity
    metric: SuspiciousLogins
    threshold: 10
    period: 300
    evaluation_periods: 1
    actions:
      - send_security_alert
  
  - name: UnauthorizedAccessAttempts
    metric: AuthorizationFailures
    threshold: 50
    period: 300
    evaluation_periods: 2
    actions:
      - send_security_alert
```

## Compliance Requirements

### Data Retention
- **Audit Logs**: 90 days (standard), 7 years (critical events)
- **Authentication Logs**: 90 days (success), 1 year (failures)
- **Permission Changes**: 7 years
- **Data Changes**: 7 years (if PII involved)

### Access Requirements
- Only authorized compliance officers can access full audit logs
- Users can access their own activity logs
- Automated exports for compliance reporting

### Review Requirements
- Quarterly review of all permission changes
- Monthly review of suspicious activities
- Weekly review of critical security events
- Annual audit trail validation
