# Authentication & Authorization Architecture

## Overview
This document details the SSO/SAML authentication system with JWT fallback and Role-Based Access Control (RBAC) implementation.

## Authentication Methods

### 1. SSO/SAML (Primary)

#### Supported Identity Providers
- Okta
- Azure Active Directory (Azure AD)
- Google Workspace
- Generic SAML 2.0 providers

#### SAML Flow

```
┌──────────┐                ┌──────────┐                ┌──────────┐
│  User    │                │  SP      │                │   IdP    │
│ Browser  │                │(NestJS)  │                │(Okta/AD) │
└────┬─────┘                └────┬─────┘                └────┬─────┘
     │                           │                           │
     │ 1. Access Protected       │                           │
     │────────────────────────►  │                           │
     │                           │                           │
     │ 2. Redirect to IdP        │                           │
     │  (SAML AuthnRequest)      │                           │
     │◄──────────────────────────│                           │
     │                           │                           │
     │ 3. Present Login Page     │                           │
     │◄──────────────────────────────────────────────────────│
     │                           │                           │
     │ 4. User Credentials       │                           │
     │───────────────────────────────────────────────────────►
     │                           │                           │
     │ 5. MFA Challenge          │                           │
     │◄──────────────────────────────────────────────────────│
     │                           │                           │
     │ 6. MFA Response           │                           │
     │───────────────────────────────────────────────────────►
     │                           │                           │
     │ 7. SAML Response          │                           │
     │  (signed assertion)       │                           │
     │──────────────────────────►│                           │
     │                           │                           │
     │                           │ 8. Validate Assertion     │
     │                           │    - Signature            │
     │                           │    - Expiration           │
     │                           │    - Audience             │
     │                           │                           │
     │                           │ 9. Create User Session    │
     │                           │    - Generate JWT         │
     │                           │    - Store in Redis       │
     │                           │    - Log event            │
     │                           │                           │
     │ 10. Set JWT Cookie        │                           │
     │    (HttpOnly, Secure)     │                           │
     │◄──────────────────────────│                           │
     │                           │                           │
     │ 11. Redirect to App       │                           │
     │◄──────────────────────────│                           │
     │                           │                           │
```

#### SAML Configuration

```typescript
// SAML Strategy Configuration
{
  entryPoint: process.env.SAML_ENTRY_POINT,
  issuer: process.env.SAML_ISSUER,
  callbackUrl: process.env.SAML_CALLBACK_URL,
  cert: process.env.SAML_CERT,
  signatureAlgorithm: 'sha256',
  identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
  wantAuthnResponseSigned: true,
  wantAssertionsSigned: true,
  acceptedClockSkewMs: 5000
}
```

### 2. JWT (Fallback/API Access)

#### JWT Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "key-id-1"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@university.edu",
    "roles": ["STAFF"],
    "permissions": ["read:users", "write:content"],
    "iat": 1234567890,
    "exp": 1234571490,
    "iss": "university-app",
    "aud": "university-app-api",
    "jti": "unique-token-id",
    "sessionId": "session-uuid"
  }
}
```

#### JWT Configuration

```typescript
// JWT Configuration
{
  secret: process.env.JWT_SECRET, // For development only
  publicKey: process.env.JWT_PUBLIC_KEY, // RS256 public key
  privateKey: process.env.JWT_PRIVATE_KEY, // RS256 private key
  signOptions: {
    algorithm: 'RS256',
    expiresIn: '1h',
    issuer: 'university-app',
    audience: 'university-app-api'
  },
  verifyOptions: {
    algorithms: ['RS256'],
    issuer: 'university-app',
    audience: 'university-app-api'
  }
}
```

## Role-Based Access Control (RBAC)

### Role Hierarchy

```
┌─────────────────────────────────────────┐
│              BOARD                       │
│  (Full System Access)                   │
│  - All STAFF permissions                │
│  - System configuration                 │
│  - User management                      │
│  - Financial reports                    │
│  - Audit log access                     │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│              STAFF                       │
│  (Administrative Access)                │
│  - All ALUMNI permissions               │
│  - Content management                   │
│  - Event management                     │
│  - Member approval                      │
│  - Basic reports                        │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│             ALUMNI                       │
│  (Member Access)                        │
│  - View content                         │
│  - Update own profile                   │
│  - Register for events                  │
│  - View directory                       │
│  - Submit forms                         │
└─────────────────────────────────────────┘
```

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    external_id VARCHAR(255) UNIQUE, -- SAML NameID
    identity_provider VARCHAR(50), -- 'okta', 'azure_ad', 'google'
    email_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_external_id ON users(external_id);
CREATE INDEX idx_users_status ON users(status);

-- Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL, -- BOARD, STAFF, ALUMNI
    description TEXT,
    priority INTEGER NOT NULL, -- Higher number = more privilege (BOARD=3, STAFF=2, ALUMNI=1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_name ON roles(name);

-- Permissions Table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL, -- users, content, events, reports
    action VARCHAR(50) NOT NULL, -- create, read, update, delete, list, approve
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
    expires_at TIMESTAMP, -- Optional expiration
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_user_roles_expires ON user_roles(expires_at);

-- Sessions Table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_jti VARCHAR(255) UNIQUE NOT NULL, -- JWT ID
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
```

### Sample Permission Data

```sql
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

-- STAFF Permissions (includes all ALUMNI permissions)
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

-- BOARD Permissions (includes all STAFF permissions)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'BOARD';
```

## Middleware Implementation

### 1. JWT Authentication Middleware

```typescript
// auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private auditService: AuditService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract JWT from cookie or Authorization header
      const token = this.extractToken(req);
      
      if (!token) {
        throw new UnauthorizedException('No authentication token provided');
      }

      // Verify JWT signature and expiration
      const payload = await this.jwtService.verifyAsync(token, {
        algorithms: ['RS256'],
      });

      // Check if session exists in Redis
      const sessionKey = `session:${payload.jti}`;
      const session = await this.redisService.get(sessionKey);

      if (!session) {
        throw new UnauthorizedException('Session expired or invalid');
      }

      // Check if session is revoked in database
      const isRevoked = await this.checkSessionRevoked(payload.jti);
      if (isRevoked) {
        await this.redisService.del(sessionKey);
        throw new UnauthorizedException('Session has been revoked');
      }

      // Update last activity
      await this.redisService.expire(sessionKey, 1800); // 30 minutes
      await this.updateLastActivity(payload.sessionId);

      // Attach user info to request
      req['user'] = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
        permissions: payload.permissions,
        sessionId: payload.sessionId,
      };

      next();
    } catch (error) {
      // Log failed authentication attempt
      await this.auditService.logAuthenticationFailure(req);
      
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException(error.message);
    }
  }

  private extractToken(req: Request): string | null {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check cookie
    if (req.cookies && req.cookies['jwt']) {
      return req.cookies['jwt'];
    }

    return null;
  }

  private async checkSessionRevoked(jti: string): Promise<boolean> {
    // Implementation to check database
    // This is a placeholder - actual implementation would query the sessions table
    return false;
  }

  private async updateLastActivity(sessionId: string): Promise<void> {
    // Update session last_activity_at in database
    // This could be batched or done async to avoid blocking
  }
}
```

### 2. RBAC Authorization Middleware

```typescript
// rbac.middleware.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../redis/redis.service';
import { AuditService } from '../audit/audit.service';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
    private auditService: AuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check permissions (with caching)
    const hasPermission = await this.checkPermissions(
      user.id,
      user.roles,
      requiredPermissions,
    );

    if (!hasPermission) {
      // Log authorization failure
      await this.auditService.logAuthorizationFailure(
        user.id,
        requiredPermissions,
        request,
      );
      
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }

  private async checkPermissions(
    userId: string,
    userRoles: string[],
    requiredPermissions: string[],
  ): Promise<boolean> {
    // Try to get permissions from cache
    const cacheKey = `user:${userId}:permissions`;
    let userPermissions = await this.redisService.get<string[]>(cacheKey);

    if (!userPermissions) {
      // Fetch from database if not in cache
      userPermissions = await this.fetchUserPermissions(userRoles);
      
      // Cache for 5 minutes
      await this.redisService.set(cacheKey, userPermissions, 300);
    }

    // Check if user has all required permissions
    return requiredPermissions.every(
      permission => userPermissions.includes(permission),
    );
  }

  private async fetchUserPermissions(roles: string[]): Promise<string[]> {
    // Implementation to fetch permissions from database
    // This is a placeholder - actual implementation would query role_permissions
    // and return array of 'resource:action' strings
    return [];
  }
}
```

### 3. Usage Examples

```typescript
// users.controller.ts
import { Controller, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard, Permissions } from '../auth/rbac.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RbacGuard)
export class UsersController {
  
  @Get()
  @Permissions('users:list')
  async findAll() {
    // Only users with 'users:list' permission can access
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('users:read')
  async findOne(@Param('id') id: string) {
    // Only users with 'users:read' permission can access
    return this.usersService.findOne(id);
  }

  @Post()
  @Permissions('users:create')
  async create(@Body() createUserDto: CreateUserDto) {
    // Only users with 'users:create' permission can access
    return this.usersService.create(createUserDto);
  }

  @Put(':id/roles')
  @Permissions('users:manage_roles')
  async updateRoles(
    @Param('id') id: string,
    @Body() updateRolesDto: UpdateRolesDto,
  ) {
    // Only users with 'users:manage_roles' permission can access
    return this.usersService.updateRoles(id, updateRolesDto);
  }

  @Delete(':id')
  @Permissions('users:delete')
  async remove(@Param('id') id: string) {
    // Only users with 'users:delete' permission can access
    return this.usersService.remove(id);
  }
}
```

## Multi-Factor Authentication (MFA)

### MFA Flow

```typescript
// mfa.service.ts
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

export class MfaService {
  async generateSecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({
      name: `University App (${email})`,
      issuer: 'University App',
    });

    // Store encrypted secret in database
    await this.storeSecret(userId, secret.base32);

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const secret = await this.getUserSecret(userId);
    
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps before/after
    });
  }

  async enableMfa(userId: string, token: string): Promise<boolean> {
    const isValid = await this.verifyToken(userId, token);
    
    if (isValid) {
      await this.setMfaEnabled(userId, true);
      await this.auditService.log({
        userId,
        action: 'mfa_enabled',
        resource: 'user_security',
      });
      return true;
    }
    
    return false;
  }

  async disableMfa(userId: string, token: string): Promise<boolean> {
    const isValid = await this.verifyToken(userId, token);
    
    if (isValid) {
      await this.setMfaEnabled(userId, false);
      await this.auditService.log({
        userId,
        action: 'mfa_disabled',
        resource: 'user_security',
      });
      return true;
    }
    
    return false;
  }
}
```

## Session Management

### Session Configuration

```typescript
// session.service.ts
export class SessionService {
  private readonly SESSION_TIMEOUT = 1800; // 30 minutes
  private readonly MAX_SESSIONS_PER_USER = 5;

  async createSession(user: User, req: Request): Promise<string> {
    const sessionId = uuidv4();
    const jti = uuidv4();

    // Generate JWT
    const jwt = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      permissions: this.flattenPermissions(user.roles),
      jti,
      sessionId,
    });

    // Store session in Redis
    await this.redisService.set(
      `session:${jti}`,
      {
        userId: user.id,
        sessionId,
        createdAt: new Date(),
      },
      this.SESSION_TIMEOUT,
    );

    // Store session in database
    await this.sessionsRepository.create({
      id: sessionId,
      userId: user.id,
      tokenJti: jti,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT * 1000),
    });

    // Check session limit
    await this.enforceSessionLimit(user.id);

    // Log session creation
    await this.auditService.log({
      userId: user.id,
      action: 'session_created',
      resource: 'authentication',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    return jwt;
  }

  async revokeSession(sessionId: string, reason: string): Promise<void> {
    const session = await this.sessionsRepository.findOne({ id: sessionId });
    
    if (session) {
      // Remove from Redis
      await this.redisService.del(`session:${session.tokenJti}`);
      
      // Mark as revoked in database
      await this.sessionsRepository.update(sessionId, {
        revokedAt: new Date(),
        revokedReason: reason,
      });

      // Log revocation
      await this.auditService.log({
        userId: session.userId,
        action: 'session_revoked',
        resource: 'authentication',
        metadata: { reason },
      });
    }
  }

  async revokeAllUserSessions(userId: string, reason: string): Promise<void> {
    const sessions = await this.sessionsRepository.find({
      userId,
      revokedAt: null,
    });

    for (const session of sessions) {
      await this.revokeSession(session.id, reason);
    }
  }

  private async enforceSessionLimit(userId: string): Promise<void> {
    const activeSessions = await this.sessionsRepository.find({
      userId,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (activeSessions.length > this.MAX_SESSIONS_PER_USER) {
      // Revoke oldest sessions
      const sessionsToRevoke = activeSessions
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .slice(0, activeSessions.length - this.MAX_SESSIONS_PER_USER);

      for (const session of sessionsToRevoke) {
        await this.revokeSession(session.id, 'session_limit_exceeded');
      }
    }
  }
}
```

## Security Best Practices

1. **Token Storage**
   - Store JWT in HttpOnly, Secure cookies for web
   - Never store in localStorage (XSS vulnerable)
   - Use short expiration times (1 hour)

2. **Password Requirements** (if using password auth)
   - Minimum 12 characters
   - Uppercase, lowercase, number, special character
   - Check against common password lists
   - Use bcrypt with cost factor 12

3. **Rate Limiting**
   - Login attempts: 5 per 15 minutes per IP
   - Password reset: 3 per hour per email
   - API requests: 100 per minute per user

4. **Audit Logging**
   - Log all authentication attempts
   - Log all permission changes
   - Log all role assignments
   - Log all session events

5. **Regular Security Reviews**
   - Quarterly permission audits
   - Monthly inactive account reviews
   - Automated vulnerability scanning
   - Penetration testing annually
