# Contributing to University Web Application

Thank you for your interest in contributing! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Race or ethnicity
- Age
- Religion

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

### Unacceptable Behavior

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

1. **Fork the repository** to your GitHub account
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/productpage.git
   cd productpage
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/dhstx/productpage.git
   ```
4. **Install dependencies**:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

### Development Environment

Follow the [Quick Start Guide](docs/QUICKSTART.md) to set up your local development environment.

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-number-description
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### 2. Make Your Changes

Follow the [Coding Standards](#coding-standards) below when making changes.

### 3. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add feature: brief description

More detailed explanation if needed.
Fixes #123"
```

Commit message format:
```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat: Add SSO authentication with Okta

- Implement SAML authentication flow
- Add JWT token generation
- Create auth middleware
- Add tests for auth service

Closes #45
```

### 4. Keep Your Branch Updated

Regularly sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Run Tests

Before pushing, ensure all tests pass:

```bash
# Backend tests
cd backend
npm run test
npm run lint

# Frontend tests
cd frontend
npm run test
npm run lint
npm run type-check
```

### 6. Push Your Changes

```bash
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript/JavaScript

#### Style Guide

We follow the Airbnb JavaScript Style Guide with some modifications:

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Line length**: Max 100 characters
- **Trailing commas**: Always use in multiline

#### Examples

**Good:**
```typescript
// Use meaningful variable names
const userAuthentication = async (credentials: LoginCredentials): Promise<User> => {
  const user = await userService.findByEmail(credentials.email);
  
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }
  
  return user;
};

// Use async/await instead of promises
const fetchUserData = async (userId: string): Promise<UserData> => {
  try {
    const user = await userRepository.findOne(userId);
    const roles = await rolesRepository.findByUserId(userId);
    
    return { user, roles };
  } catch (error) {
    logger.error('Failed to fetch user data', { userId, error });
    throw error;
  }
};
```

**Bad:**
```typescript
// Don't use abbreviated variable names
const usrAuth = async (creds) => {
  const u = await uSrv.find(creds.email);
  if (!u) throw new Error('bad');
  return u;
};

// Don't use promises when async/await is clearer
const fetchUserData = (userId) => {
  return userRepository.findOne(userId)
    .then(user => {
      return rolesRepository.findByUserId(userId)
        .then(roles => ({ user, roles }));
    })
    .catch(error => {
      console.log(error);
      throw error;
    });
};
```

#### NestJS Specific

1. **Use dependency injection**:
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private auditService: AuditService,
  ) {}
}
```

2. **Use DTOs for validation**:
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;
}
```

3. **Use guards for authentication**:
```typescript
@Controller('users')
@UseGuards(JwtAuthGuard, RbacGuard)
export class UsersController {
  @Get()
  @Permissions('users:list')
  findAll() {
    return this.usersService.findAll();
  }
}
```

#### React/Next.js Specific

1. **Use functional components with hooks**:
```typescript
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Spinner />;
  if (!user) return <ErrorMessage />;

  return <div>{user.name}</div>;
};
```

2. **Use custom hooks for reusable logic**:
```typescript
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials);
    setUser(user);
  };
  
  const logout = () => {
    authService.logout();
    setUser(null);
  };
  
  return { user, login, logout };
};
```

### SQL

1. **Use uppercase for keywords**:
```sql
SELECT u.id, u.email, r.name AS role
FROM users u
INNER JOIN user_roles ur ON ur.user_id = u.id
INNER JOIN roles r ON r.id = ur.role_id
WHERE u.status = 'active';
```

2. **Use meaningful aliases**:
```sql
-- Good
SELECT u.email, r.name
FROM users u
JOIN roles r ON r.id = u.role_id

-- Bad
SELECT a.email, b.name
FROM users a
JOIN roles b ON b.id = a.role_id
```

3. **Use CTEs for complex queries**:
```sql
WITH active_users AS (
  SELECT id, email
  FROM users
  WHERE status = 'active'
),
user_permissions AS (
  SELECT user_id, ARRAY_AGG(permission) AS permissions
  FROM user_roles ur
  JOIN role_permissions rp ON rp.role_id = ur.role_id
  JOIN permissions p ON p.id = rp.permission_id
  GROUP BY user_id
)
SELECT au.email, up.permissions
FROM active_users au
JOIN user_permissions up ON up.user_id = au.id;
```

## Testing Guidelines

### Backend Tests

#### Unit Tests

Test individual functions/methods in isolation:

```typescript
describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(() => {
    userRepository = createMockRepository();
    service = new UserService(userRepository, mockAuditService);
  });

  it('should find user by email', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    userRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.findByEmail('test@example.com');

    expect(result).toEqual(mockUser);
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should throw when user not found', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(
      service.findByEmail('notfound@example.com')
    ).rejects.toThrow(NotFoundException);
  });
});
```

#### Integration Tests

Test multiple components working together:

```typescript
describe('AuthController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### Frontend Tests

#### Component Tests

```typescript
describe('LoginForm', () => {
  it('renders login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('submits form with valid credentials', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

### Test Coverage

Aim for:
- **Unit tests**: 80%+ coverage
- **Integration tests**: Cover critical paths
- **E2E tests**: Cover main user flows

## Pull Request Process

### Before Submitting

1. ✅ All tests pass
2. ✅ Linting passes
3. ✅ Code is properly formatted
4. ✅ Documentation is updated
5. ✅ Commit messages are clear
6. ✅ Branch is up to date with main

### Submitting a Pull Request

1. **Push your branch** to your fork
2. **Create a pull request** from your fork to the main repository
3. **Fill out the PR template** completely
4. **Link related issues** using "Closes #123" or "Fixes #456"
5. **Request reviews** from relevant team members

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. At least one approval required
2. All comments must be resolved
3. CI/CD checks must pass
4. No merge conflicts

### After Merge

1. Delete your feature branch
2. Pull latest main branch
3. Update your fork

## Issue Reporting

### Before Creating an Issue

1. Search existing issues to avoid duplicates
2. Check if it's already fixed in main branch
3. Gather relevant information

### Creating a Good Issue

Use the appropriate template:

#### Bug Report

```markdown
**Describe the bug**
Clear description of what the bug is

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

#### Feature Request

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Mockups, examples, etc.
```

## Questions?

- Check the [documentation](docs/)
- Search existing issues
- Ask in discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
