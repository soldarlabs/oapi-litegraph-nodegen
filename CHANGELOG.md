# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New `CanvasWrapper` class in `src/utils/canvasWrapper.ts` for improved canvas handling
  - High-DPI display support
  - Automatic resize handling
  - Passive event listeners for better performance
- New `contextMenu.ts` utility for enhanced context menu behaviour
  - Passive event listeners for wheel events
  - Improved scrolling performance
  - TypeScript type definitions for better type safety
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

### Changed

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

### Fixed

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
