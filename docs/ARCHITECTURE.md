# Architecture Overview

## System Design

### Core Components

1. **NodeGenerator**

   - Main entry point for the library
   - Manages OpenAPI spec loading and parsing
   - Handles node type registration
   - Coordinates widget creation

2. **OpenAPINode**

   - Base class for generated nodes
   - Manages input/output slots
   - Handles API request execution
   - Manages widget state

3. **Canvas Optimization**

   - Modular canvas optimization utilities
   - High-DPI display support
   - Pointer events optimization
   - Performance-focused event handling

4. **WidgetFactory**
   - Creates appropriate widgets based on OpenAPI types
   - Manages widget lifecycle and updates
   - Handles widget validation

### Development Environment

1. **Build System**

   ```txt
   TypeScript → TSC → ESM Modules → Vite → Browser
   ```

   - TypeScript for type safety and modern JavaScript features
   - TSC for compiling library code
   - Vite for development server and hot module reloading
   - ESM modules for better tree-shaking and modern module loading

2. **Demo Application**

   ```txt
   Source Files → Vite Dev Server → Hot Module Reloading → Browser
   ```

   - Vite dev server for instant updates
   - Hot module reloading for rapid development
   - Source maps for easy debugging
   - OpenAPI specs in public directory for easy modification

### Data Flow

1. **Initialization**

   ```txt
   Load OpenAPI Spec → Parse Operations → Generate Node Types → Register with LiteGraph
   ```

2. **Node Execution**

   ```txt
   Input Values → Validate Parameters → Execute API Call → Process Response → Update Outputs
   ```

3. **Widget Updates**

   ```txt
   User Input → Validate Value → Update Node State → Trigger Execution
   ```

### Canvas Optimization

The canvas optimization module provides a set of utilities to enhance LiteGraph's canvas performance:

1. **High-DPI Support**

   - Automatically detects device pixel ratio
   - Adjusts canvas resolution for crisp rendering
   - Maintains correct scaling for input events

2. **Pointer Events**

   - Optional pointer events support
   - Improved touch device compatibility
   - Better performance than mouse events

3. **Usage**

   ```typescript
   import { optimizeCanvas } from "@soldarlabs/oapi-litegraph-nodegen";

   // Apply optimizations.
   optimizeCanvas(canvas, {
     pointerEvents: true, // Enable pointer events
   });
   ```

## Performance Considerations

1. **Memory Management**

   - Lazy loading of OpenAPI specs
   - Efficient widget disposal
   - Smart caching of API responses

2. **Rendering Optimization**

   - Minimized DOM updates
   - Efficient event handling
   - Batched widget updates
   - Hot module reloading for development

3. **Network Efficiency**
   - Request debouncing
   - Response caching
   - Connection pooling
   - Development server with instant updates

## Extension Points

1. **Custom Widgets**

   ```typescript
   interface WidgetDefinition {
     type: string;
     options?: any;
     callback?: (value: any) => void;
   }
   ```

2. **Node Templates**

   ```typescript
   interface NodeTemplate {
     title: string;
     properties: any;
     constructor: typeof LGraphNode;
   }
   ```

3. **API Middleware**

   ```typescript
   interface Middleware {
     before?: (config: any) => any;
     after?: (response: any) => any;
     error?: (error: any) => any;
   }
   ```

## Project Structure

```bash
oapi-litegraph-nodegen/
├── src/                    # Library source code
│   ├── utils/             # Utility functions
│   │   ├── optim/        # Performance optimization utilities
│   │   │   └── canvas.ts # Canvas optimization module
│   │   |── logger.ts     # Logging utilities
|   |   └── mathUtils.ts       # Math utilities
│   ├── nodeGenerator.ts   # Main node generator
│   ├── visualWidgets.ts   # Visual widget implementations
│   ├── OpenAPINode.ts     # Core node implementation
│   ├── widgets.ts         # Widget definitions
│   └── index.ts          # Public API
├── demo/                  # Demo application
│   └── index.html       # Demo entry point
|   |── main.js           # Demo entry point
|   |── vite.config.js    # Vite configuration
│   └── styles.css        # Demo styles
|   └── openapi.yaml      # OpenAPI spec for demo
├── dist/                 # Compiled library output
├── test/                 # Test files
└── docs/                # Documentation
    ├── ARCHITECTURE.md  # Architecture documentation
    ├── CHANGELOG.md     # Version history
    └── CONTRIBUTING.md  # Contribution guidelines
```

## Development Workflow

1. **Library Development**

   ```txt
   Edit TypeScript → TSC Watch → Update Demo → Hot Reload
   ```

   - TypeScript compilation with source maps
   - Automatic rebuilding on changes
   - Hot module reloading in demo

2. **Demo Development**

   ```txt
   Edit Demo Files → Vite Dev Server → Instant Updates
   ```

   - Fast development server
   - Hot module replacement
   - Source maps for debugging

3. **Testing**

   ```txt
   Jest → TypeScript → Code Coverage
   ```

   - Unit tests with Jest
   - Integration tests with demo
   - Automated CI/CD pipeline

## Security Measures

1. **Input Validation**

   - Schema-based validation
   - Type checking
   - Sanitization

2. **API Security**

   - CORS configuration
   - Rate limiting
   - Authentication handling

3. **Development Security**
   - Secure development server
   - Environment variable handling
   - Dependency scanning
