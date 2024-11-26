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
- New `contextMenu.ts` utility for enhanced context menu behavior
  - Passive event listeners for wheel events
  - Improved scrolling performance
  - TypeScript type definitions for better type safety
- Enhanced widget support for nodes
  - Added support for combo box widgets
  - Improved text input widgets with validation
  - Added number input widgets with range support
  - Support for boolean toggle widgets
- New input handling system for nodes
  - Dynamic input slot generation based on OpenAPI schemas
  - Support for multiple input types (string, number, boolean)
  - Improved input validation and error handling
  - Auto-connection support between compatible node types

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
  - Support for enum values in combo boxes

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
  - Corrected widget positioning and sizing
  - Resolved widget update propagation issues
- Input slot connection problems
  - Fixed type compatibility checks
  - Improved connection validation
  - Resolved issues with multiple input handling

### Technical Details
#### Files Changed
1. `src/utils/canvasWrapper.ts`
   - Created new wrapper for canvas handling
   - Added high-DPI support
   - Implemented passive event listeners

2. `src/utils/contextMenu.ts`
   - Created new utility for context menu handling
   - Added TypeScript interfaces
   - Implemented passive event listeners

3. `example/example.js`
   - Updated LiteGraph configuration
   - Added pointer events support
   - Integrated new canvas and context menu utilities

4. `src/nodeGenerator.ts`
   - Enhanced widget generation logic
   - Improved input slot handling
   - Added support for complex schema types
   - Better type validation and compatibility checks

#### Performance Improvements
- Reduced main thread blocking during scrolling
- Improved canvas resize performance
- Better handling of high-DPI displays
- Optimized widget rendering and updates
- More efficient input slot connection handling

#### Browser Compatibility
- Added support for modern pointer events
- Maintained compatibility with older mouse events
- Improved performance on high-DPI displays
- Enhanced widget compatibility across browsers

#### Node Enhancements
- Widget Improvements
  - Better combo box rendering and interaction
  - Enhanced text input with validation
  - Improved number input with range support
  - Optimized boolean toggle widgets
  - Better widget positioning and styling

- Input System Updates
  - Smarter type inference from OpenAPI schemas
  - Enhanced connection compatibility checks
  - Improved input validation
  - Better handling of optional parameters
  - Support for complex nested types
