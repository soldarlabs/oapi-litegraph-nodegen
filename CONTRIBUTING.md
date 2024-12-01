# Contributing to oapi-litegraph-nodegen

First off, thank you for considering contributing to oapi-litegraph-nodegen! It's people like you that make it such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible
- Include your environment details:
  - Browser version
  - Node.js version
  - npm version
  - Library version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful
- List some other tools or applications where this enhancement exists

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the TypeScript styleguide
- Include thoughtfully-worded, well-structured tests
- Document new code
- End all files with a newline

## Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

### Setting Up Development Environment

1. Clone your fork:

   ```bash
   git clone https://github.com/soldarlabs/oapi-litegraph-nodegen.git
   ```

2. Install dependencies:

   ```bash
   cd oapi-litegraph-nodegen
   npm install
   ```

3. Create a branch:
   ```bash
   git checkout -b my-feature
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Style Guide

We use ESLint and Prettier to maintain code quality. Before submitting a pull request:

1. Run linter:

   ```bash
   npm run lint
   ```

2. Format code:
   ```bash
   npm run format
   ```

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format:
  - `<type>(<scope>): <subject>`
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Documentation

- Use JSDoc comments for functions and classes
- Update README.md for any user-facing changes
- Update API documentation for any changes to public APIs
- Include code examples for new features

## Project Structure

```
oapi-litegraph-nodegen/
├── src/                    # Source code
│   ├── utils/             # Utility functions
│   ├── nodeGenerator.ts   # Main node generator
│   └── index.ts          # Public API
├── example/               # Example implementation
├── test/                  # Test files
└── docs/                  # Documentation
```

## Financial Contribution

We also welcome financial contributions. You can support the project through:

- GitHub Sponsors
- Open Collective
- Direct donation

## Questions?

Feel free to open an issue with the tag `question`.
