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
  - Vite version (if using the demo)

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

```bash
oapi-litegraph-nodegen/
├── src/                    # Library source code
│   ├── generator/         # Node generation logic
│   │   └── nodeGenerator.ts # Main node generator
│   ├── nodes/            # Node implementations
│   │   ├── output/      # Output node types
│   │   ├── widgets/     # Widget implementations
│   │   └── OpenAPINode.ts # Base node implementation
│   ├── utils/           # Utility functions
│   │   ├── color.ts    # Color utilities
│   │   └── other utils...
│   └── index.ts        # Public API
├── demo/               # Vite-powered demo application
│   ├── index.html     # Demo entry point
│   ├── src/           # Demo source code
│   ├── public/        # Static assets
│   └── vite.config.ts # Vite configuration
├── dist/              # Compiled library output
├── test/             # Test files
└── docs/             # Documentation
    ├── ARCHITECTURE.md  # Architecture documentation
    ├── CHANGELOG.md     # Version history
    └── CONTRIBUTING.md  # Contribution guidelines
```

### Setting Up Development Environment

1. Clone your fork:

   ```bash
   git clone https://github.com/soldarlabs/oapi-litegraph-nodegen.git
   cd oapi-litegraph-nodegen
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Running the Demo

The demo is built using Vite for better development experience. To run it:

1. Start development:

   ```bash
   # Start the library in watch mode
   npm run dev

   # In another terminal, start the demo
   npm run start:demo
   ```

This will start a development server at `http://localhost:5173` (or another port if 5173 is in use).

The demo includes:

- Interactive LiteGraph canvas
- Sample OpenAPI specifications
- Live node generation
- Real-time API testing

### Building for Production

1. Build the library:

   ```bash
   npm run build:prod
   ```

2. Build the demo (optional):

   ```bash
   npm run build:prod
   ```

The built library will be in the `dist/` directory, and the demo build will be in `demo/dist/`.

### Development Workflow

The project uses a watch-based development workflow with Vite for instant feedback:

1. Start the development environment:

   ```bash
   # From the root directory
   # This will start the development server and watch for changes.
   npm run dev
   # From the demo directory
   # This will start the vite server for the demo.
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

### VS Code Configuration

To set up debugging in VS Code, add the following configuration to your `.vscode/launch.json` file:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "cwd": "${workspaceFolder}",
      "webRoot": "${workspaceFolder}/demo",
      "sourceMaps": true
    }
  ]
}
```

This configuration allows you to launch Chrome and debug the application running at `http://localhost:5173`.

### Running Tests

```bash
# Run all tests.
npm test

# Run tests in watch mode.
npm run test:watch

# Run tests with coverage.
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
