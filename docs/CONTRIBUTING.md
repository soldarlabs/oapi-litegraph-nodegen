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
  - Next.js version (if using the demo)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

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

### Project Structure

```
oapi-litegraph-nodegen/
├── src/                    # Library source code
│   ├── utils/             # Utility functions
│   │   ├── optim/        # Performance optimization utilities
│   │   │   └── canvas.ts # Canvas optimization module
│   │   |── logger.ts     # Logging utilities
|   |   └── mathUtils.ts  # Math utilities
│   ├── nodeGenerator.ts   # Main node generator
│   ├── visualWidgets.ts   # Visual widget implementations
│   ├── OpenAPINode.ts     # Core node implementation
│   ├── widgets.ts         # Widget definitions
│   └── index.ts          # Public API
├── demo/                  # Demo application
│   └── index.html       # Demo entry point
|   |── main.js          # Demo entry point
|   |── vite.config.js   # Vite configuration
│   └── styles.css       # Demo styles
|   └── openapi.yaml     # OpenAPI spec for demo
├── dist/                 # Compiled library output
├── test/                 # Test files
└── docs/                # Documentation
    ├── ARCHITECTURE.md  # Architecture documentation
    ├── CHANGELOG.md     # Version history
    └── CONTRIBUTING.md  # Contribution guidelines
```

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

### Development Workflow

The project uses a watch-based development workflow with Vite for instant feedback:

1. Start the development environment:

   ```bash
   # From the root directory
   # This will start both the library watch mode and the demo server
   npm run dev
   ```

   This command starts two processes in parallel:

   - Library watch mode using `tsup` for instant rebuilds
   - Vite dev server for the demo with hot module reloading

2. Make changes to the code:

   - Source files in `src/` are automatically rebuilt by tsup
   - Demo files in `demo/` trigger instant updates in the browser
   - All changes are reflected immediately without manual rebuilds

3. View changes:

   - Demo runs at `http://localhost:5173`
   - Library changes are automatically rebuilt and reflected in the demo
   - Browser automatically reloads when necessary

4. Build for production:

   ```bash
   # Build the library for production
   npm run build
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

### Code Quality

We use ESLint and Prettier to maintain code quality. These run automatically in watch mode, but you can also run them manually:

1. Run linter:

   ```bash
   npm run lint

   # Auto-fix linting issues
   npm run lint:fix
   ```

2. Format code:

   ```bash
   npm run format
   ```

The development server will automatically catch most linting and formatting issues. Check the terminal output for any warnings or errors.

### Dependency Management

We use [ncu](https://github.com/auditjs/ncu) to automatically update dependencies. Run `npm run deps:update` to update all dependencies.

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

## Financial Contribution

We also welcome financial contributions. You can support the project through:

- GitHub Sponsors
- Open Collective
- Direct donation

## Questions?

Feel free to open an issue with the tag `question`.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
