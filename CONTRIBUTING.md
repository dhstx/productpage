# Contributing to DHStx Product Page

First off, thank you for considering contributing to the DHStx Product Page! It's people like you that make this project better for everyone.

## Table of Contents

* [Code of Conduct](#code-of-conduct)
* [Getting Started](#getting-started)
* [Development Setup](#development-setup)
* [How to Contribute](#how-to-contribute)
* [Coding Standards](#coding-standards)
* [Commit Guidelines](#commit-guidelines)
* [Pull Request Process](#pull-request-process)
* [Testing](#testing)
* [Documentation](#documentation)
* [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to contact@daleyhousestacks.com.

## Getting Started

### Prerequisites

* **Node.js**: v18.0.0 or higher
* **pnpm**: v8.0.0 or higher (install via `npm install -g pnpm`)
* **Git**: Latest version
* **Supabase Account**: Optional for backend features (free tier available)

### First Time Setup

1. **Fork the repository** on GitHub
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
   pnpm install
   ```
5. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
6. **Run the development server**:
   ```bash
   pnpm run dev
   ```

The application should now be running at `http://localhost:5173`.

## Development Setup

### Project Structure

```
productpage/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utility functions and integrations
│   ├── hooks/          # Custom React hooks
│   └── styles/         # Global styles
├── public/             # Static assets
├── api/                # API routes (if applicable)
├── tests/              # Test files
└── docs/               # Documentation
```

### Available Scripts

* `pnpm run dev` - Start development server
* `pnpm run build` - Build for production
* `pnpm run preview` - Preview production build locally
* `pnpm run lint` - Run ESLint
* `pnpm run lint:fix` - Fix ESLint issues automatically
* `pnpm run test` - Run tests
* `pnpm run test:watch` - Run tests in watch mode
* `pnpm run test:coverage` - Generate test coverage report

## How to Contribute

### Types of Contributions

We welcome many types of contributions:

* **Bug reports**: Found a bug? Let us know!
* **Feature requests**: Have an idea? Share it!
* **Code contributions**: Fix bugs or implement features
* **Documentation**: Improve or add documentation
* **Design**: Improve UI/UX
* **Testing**: Write tests or improve test coverage

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

When filing a bug report, include:

* **Clear title and description**
* **Steps to reproduce** the behavior
* **Expected behavior**
* **Actual behavior**
* **Screenshots** (if applicable)
* **Environment details**: OS, browser, Node version
* **Additional context**: Any other relevant information

### Suggesting Features

Feature requests are welcome! Please provide:

* **Clear title and description**
* **Use case**: Why is this feature needed?
* **Proposed solution**: How should it work?
* **Alternatives considered**: Other approaches you've thought about
* **Additional context**: Mockups, examples, etc.

## Coding Standards

### JavaScript/React Guidelines

* Use **functional components** with hooks
* Follow **React best practices** and hooks rules
* Use **ES6+ syntax** (arrow functions, destructuring, etc.)
* Prefer **const** over let, avoid var
* Use **meaningful variable names**
* Keep functions **small and focused** (single responsibility)
* Add **JSDoc comments** for complex functions

### Style Guide

* **Indentation**: 2 spaces
* **Quotes**: Single quotes for strings
* **Semicolons**: Required
* **Trailing commas**: Required in multi-line objects/arrays
* **Line length**: Max 100 characters (soft limit)

### Component Guidelines

```javascript
// Good component structure
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 */
function ComponentName({ title }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div className="component-name">
      <h1>{title}</h1>
    </div>
  );
}

ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ComponentName;
```

### File Naming

* **Components**: PascalCase (e.g., `ContactForm.jsx`)
* **Utilities**: camelCase (e.g., `formatDate.js`)
* **Styles**: kebab-case (e.g., `contact-form.css`)
* **Tests**: `*.test.js` or `*.spec.js`

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation changes
* **style**: Code style changes (formatting, semicolons, etc.)
* **refactor**: Code refactoring without feature changes
* **perf**: Performance improvements
* **test**: Adding or updating tests
* **chore**: Maintenance tasks, dependency updates
* **ci**: CI/CD configuration changes

### Examples

```
feat(contact-form): add email validation

Add client-side email validation to contact form using regex pattern.
Displays error message when email format is invalid.

Closes #123
```

```
fix(animations): resolve gear rotation performance issue

Optimized requestAnimationFrame loop to prevent memory leaks.
Reduced CPU usage by 40% on low-end devices.

Fixes #456
```

### Commit Best Practices

* Use the **imperative mood** ("Add feature" not "Added feature")
* Keep the **subject line under 50 characters**
* Capitalize the subject line
* Don't end the subject line with a period
* Separate subject from body with a blank line
* Wrap the body at 72 characters
* Use the body to explain **what** and **why**, not how

## Pull Request Process

### Before Submitting

1. **Update your fork**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following our coding standards

4. **Test your changes**:
   ```bash
   pnpm run lint
   pnpm run test
   pnpm run build
   ```

5. **Commit your changes** following commit guidelines

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting the Pull Request

1. Go to the [original repository](https://github.com/dhstx/productpage)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:
   * **Title**: Clear, descriptive title
   * **Description**: What changes were made and why
   * **Related Issues**: Link to related issues
   * **Screenshots**: If UI changes were made
   * **Testing**: How you tested the changes
   * **Checklist**: Complete the PR checklist

### PR Review Process

1. **Automated checks** must pass (lint, tests, build)
2. **Code review** by at least one maintainer
3. **Address feedback** if requested
4. **Approval** and merge by maintainer

### After Your PR is Merged

* **Delete your feature branch**:
  ```bash
  git branch -d feature/your-feature-name
  git push origin --delete feature/your-feature-name
  ```

* **Update your fork**:
  ```bash
  git checkout main
  git pull upstream main
  git push origin main
  ```

## Testing

### Writing Tests

* Write tests for **all new features**
* Maintain **≥80% code coverage**
* Use **descriptive test names**
* Follow **AAA pattern** (Arrange, Act, Assert)

### Test Structure

```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('should render with correct title', () => {
    // Arrange
    const title = 'Test Title';

    // Act
    render(<ComponentName title={title} />);

    // Assert
    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

## Documentation

### When to Update Documentation

* Adding new features
* Changing existing functionality
* Fixing bugs that affect usage
* Improving setup or deployment processes

### Documentation Standards

* Use **clear, concise language**
* Include **code examples** where appropriate
* Add **screenshots or GIFs** for UI features
* Keep documentation **up to date** with code changes
* Use **proper Markdown formatting**

## Community

### Getting Help

* **GitHub Issues**: For bugs and feature requests
* **Email**: contact@daleyhousestacks.com
* **Documentation**: Check our docs first

### Recognition

Contributors will be recognized in:

* **CHANGELOG.md**: For significant contributions
* **README.md**: Contributors section
* **Release notes**: For features and major fixes

## Questions?

Don't hesitate to ask! We're here to help:

* Open an issue with the "question" label
* Email us at contact@daleyhousestacks.com

---

**Thank you for contributing to DHStx Product Page!** 🎉
