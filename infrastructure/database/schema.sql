-- University Web Application Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS AND AUTHENTICATION
-- ============================================================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    external_id VARCHAR(255) UNIQUE,
    identity_provider VARCHAR(50),
    email_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_external_id ON users(external_id);
CREATE INDEX idx_users_status ON users(status);

-- ============================================================================
-- ROLES AND PERMISSIONS
-- ============================================================================

-- Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    priority INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_name ON roles(name);

-- Permissions Table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_permissions_resource_action ON permissions(resource, action);

-- Role Permissions (Many-to-Many)
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- User Roles (Many-to-Many)
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    expires_at TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_user_roles_expires ON user_roles(expires_at);

-- ============================================================================
-- SESSIONS
-- ============================================================================

-- Sessions Table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_jti VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    revoked_reason VARCHAR(255)
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token_jti ON sessions(token_jti);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_revoked ON sessions(revoked_at);

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================

-- Main Audit Log Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    event_type VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    request_method VARCHAR(10),
    request_path TEXT,
    request_query JSONB,
    request_body JSONB,
    response_status INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    error_stack TEXT,
    metadata JSONB,
    tags TEXT[],
    requires_review BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT
);

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

-- Authentication Audit Table
CREATE TABLE auth_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id),
    email VARCHAR(255),
    auth_method VARCHAR(50) NOT NULL,
    auth_provider VARCHAR(50),
    action VARCHAR(50) NOT NULL,
    mfa_required BOOLEAN DEFAULT FALSE,
    mfa_verified BOOLEAN,
    mfa_method VARCHAR(50),
    session_id UUID,
    token_jti VARCHAR(255),
    ip_address INET NOT NULL,
    user_agent TEXT,
    geo_location JSONB,
    failure_reason VARCHAR(255),
    failure_count INTEGER DEFAULT 1,
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
    change_type VARCHAR(50) NOT NULL,
    target_user_id UUID REFERENCES users(id) NOT NULL,
    target_user_email VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES roles(id),
    role_name VARCHAR(50),
    permission_id UUID REFERENCES permissions(id),
    permission_name VARCHAR(100),
    changed_by_user_id UUID REFERENCES users(id) NOT NULL,
    changed_by_email VARCHAR(255) NOT NULL,
    old_roles TEXT[],
    new_roles TEXT[],
    old_permissions TEXT[],
    new_permissions TEXT[],
    reason TEXT,
    ticket_number VARCHAR(50),
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    ip_address INET,
    metadata JSONB
);

CREATE INDEX idx_permission_audit_timestamp ON permission_audit_logs(timestamp DESC);
CREATE INDEX idx_permission_audit_target_user ON permission_audit_logs(target_user_id);
CREATE INDEX idx_permission_audit_changed_by ON permission_audit_logs(changed_by_user_id);
CREATE INDEX idx_permission_audit_type ON permission_audit_logs(change_type);
CREATE INDEX idx_permission_audit_approval ON permission_audit_logs(requires_approval) WHERE requires_approval = TRUE;

-- Data Change Audit Table
CREATE TABLE data_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    operation VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    transaction_id VARCHAR(100),
    batch_id VARCHAR(100),
    pii_accessed BOOLEAN DEFAULT FALSE,
    retention_period_days INTEGER DEFAULT 2555
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
    event_type VARCHAR(50) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    component VARCHAR(100),
    environment VARCHAR(20),
    old_value TEXT,
    new_value TEXT,
    triggered_by VARCHAR(100),
    automated BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    affected_users INTEGER,
    downtime_seconds INTEGER
);

CREATE INDEX idx_system_event_timestamp ON system_event_logs(timestamp DESC);
CREATE INDEX idx_system_event_type ON system_event_logs(event_type);
CREATE INDEX idx_system_event_severity ON system_event_logs(severity);
CREATE INDEX idx_system_event_environment ON system_event_logs(environment);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert Default Roles
INSERT INTO roles (name, description, priority) VALUES
    ('BOARD', 'Board members with full system access', 3),
    ('STAFF', 'Staff members with administrative access', 2),
    ('ALUMNI', 'Alumni members with basic access', 1);

-- Insert Permissions
INSERT INTO permissions (resource, action, description) VALUES
    -- User Management
    ('users', 'create', 'Create new users'),
    ('users', 'read', 'View user profiles'),
    ('users', 'update', 'Update user information'),
    ('users', 'delete', 'Delete users'),
    ('users', 'list', 'List all users'),
    ('users', 'manage_roles', 'Assign/remove user roles'),
    
    -- Content Management
    ('content', 'create', 'Create content'),
    ('content', 'read', 'View content'),
    ('content', 'update', 'Update content'),
    ('content', 'delete', 'Delete content'),
    ('content', 'publish', 'Publish content'),
    
    -- Event Management
    ('events', 'create', 'Create events'),
    ('events', 'read', 'View events'),
    ('events', 'update', 'Update events'),
    ('events', 'delete', 'Delete events'),
    ('events', 'register', 'Register for events'),
    ('events', 'manage_registrations', 'Manage event registrations'),
    
    -- Reports
    ('reports', 'view_basic', 'View basic reports'),
    ('reports', 'view_financial', 'View financial reports'),
    ('reports', 'view_audit', 'View audit logs'),
    
    -- System
    ('system', 'configure', 'Configure system settings'),
    ('system', 'manage_integrations', 'Manage external integrations');

-- ALUMNI Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ALUMNI' AND p.resource || ':' || p.action IN (
    'users:read',
    'content:read',
    'events:read',
    'events:register',
    'reports:view_basic'
);

-- STAFF Permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'STAFF' AND p.resource || ':' || p.action IN (
    'users:read',
    'users:list',
    'content:read',
    'content:create',
    'content:update',
    'content:publish',
    'events:read',
    'events:create',
    'events:update',
    'events:register',
    'events:manage_registrations',
    'reports:view_basic'
);

-- BOARD Permissions (all permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'BOARD';

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for roles table
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR REPORTING
-- ============================================================================

-- Active users with roles
CREATE VIEW v_active_users_with_roles AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.status,
    ARRAY_AGG(r.name) as roles,
    u.last_login_at,
    u.created_at
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.deleted_at IS NULL
  AND u.status = 'active'
GROUP BY u.id;

-- Recent audit activity
CREATE VIEW v_recent_audit_activity AS
SELECT 
    al.timestamp,
    u.email as user_email,
    al.event_type,
    al.action,
    al.resource,
    al.status,
    al.severity
FROM audit_logs al
LEFT JOIN users u ON u.id = al.user_id
WHERE al.timestamp > NOW() - INTERVAL '30 days'
ORDER BY al.timestamp DESC;
