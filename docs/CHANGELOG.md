# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Modernized development environment with Vite
  - Hot Module Reloading (HMR) for instant feedback
  - Fast development server with source maps
  - Improved build performance and caching
- New demo application structure
  - Moved from example to dedicated demo directory
  - Better organization of static files and OpenAPI specs
  - Improved development workflow
- Enhanced Node.js polyfills support
  - Added vite-plugin-node-polyfills for better compatibility
  - Proper handling of Buffer and process globals
  - Improved ESM module support
- New modular canvas optimization utilities in `src/utils/optim/canvas.ts`
  - High-DPI display support with automatic pixel ratio detection
  - Optional pointer events support for better touch device compatibility
  - Performance-focused event handling with passive listeners
  - Type-safe implementation with proper TypeScript definitions
- Enhanced widget support for nodes
  - Added input widgets with validation
  - Added number input widgets with range support
  - Added support for combo box widgets
  - Added Support for boolean toggle widgets
- New input handling system for nodes
  - Dynamic input slot generation based on OpenAPI schemas
  - Support for multiple input types (string, number, boolean)
  - Improved input validation and error handling
  - Auto-connection support between compatible node types
  - Support for complex nested types
- Added support for modern pointer events
- Maintained compatibility with older mouse events
- Next.js-based demo implementation with hot reloading support
- React integration example in documentation
- Client-side only rendering for canvas components
- Proper cleanup handling for canvas and widgets
- Viewport meta tag for better scaling control

### Changed

- Migrated from basic HTTP server to Vite development server
  - Faster development feedback loop
  - Better error reporting and debugging
  - Improved module resolution
- Updated project structure
  - Separated demo from core library code
  - Better organization of static assets
  - Clearer separation of concerns
- Improved documentation
  - Added Vite-specific troubleshooting guides
  - Updated development workflow documentation
  - Enhanced architecture documentation with build system details
- Updated `example.js` configuration
  - Using pointer events instead of mouse events
  - Configured wheel zoom behavior
  - Integrated context menu patches
- Improved TypeScript type definitions across the codebase
  - Added proper interfaces for context menu options
  - Enhanced type safety in canvas wrapper
  - Fixed type definition issues in LiteGraph integration
- Enhanced node generation from OpenAPI specs
  - Better handling of complex schema types
  - Improved widget selection based on parameter types
  - Smarter default value handling
  - Better combo box rendering and interaction
  - Support for enum values in combo boxes
- Better handling of high-DPI displays
- Improved input system handling
  - Smarter type inference from OpenAPI schemas
  - Enhanced connection compatibility checks
- Replaced static example with Next.js demo
- Updated documentation to reflect new demo setup
- Improved canvas scaling using viewport units
- Enhanced canvas positioning for consistent full-screen display
- Modified widget positioning to work better with React lifecycle
- Refactored canvas optimization implementation
  - Moved from class-based `CanvasWrapper` to functional utilities
  - Simplified API with optional configuration
  - Better separation of concerns for maintainability
  - Improved TypeScript type safety with proper type assertions

### Fixed

- Build issues with node polyfills
  - Properly configured vite-plugin-node-polyfills
  - Fixed Buffer and process global objects
  - Resolved ESM compatibility issues
- Development server CORS issues
  - Added proper CORS configuration
  - Fixed file system access permissions
  - Improved security settings
- Hot reload inconsistencies
  - Better handling of TypeScript compilation
  - Improved module invalidation
  - Fixed source map generation
- Context menu scrolling performance
  - Added passive event listeners for wheel events
  - Improved scroll handling without blocking the main thread
- Canvas resize handling
  - Better support for high-DPI displays
  - Proper scaling of canvas dimensions
  - Automatic updates on window resize
- TypeScript compilation errors
  - Added proper type definitions for LiteGraph integration
  - Fixed interface compatibility issues
- Node widget issues
  - Fixed widget value persistence
  - Corrected widget positioning and styling
  - Resolved widget update propagation issues
- Input slot connection problems
  - Fixed type compatibility checks
  - Improved connection validation
  - Resolved issues with multiple input handling
- Improved input validation
  - Better handling of optional parameters
- Browser compatibility
  - Enhanced widget compatibility across browsers
- Rendering performance
  - Reduced main thread blocking during scrolling
  - Improved canvas resize performance
  - Optimized widget rendering and updates
  - More efficient input slot connection handling
  - Improved performance on high-DPI displays
- Canvas scaling issues across different resolutions
- Widget positioning in Next.js environment
- Event handling conflicts between React and LiteGraph
- Full-screen display issues on various aspect ratios

### Removed

- Old example directory in favor of Next.js demo
- Redundant canvas initialization code
- Legacy static HTML implementation
- Removed `CanvasWrapper` class in favor of modular utilities
- Removed `contextMenu.ts` utility and related patches
  - Simplified codebase by removing custom context menu handling
  - Reverted to LiteGraph's native context menu implementation
