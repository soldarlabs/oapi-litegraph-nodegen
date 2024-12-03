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

3. **WidgetFactory**
   - Creates appropriate widgets based on OpenAPI types
   - Manages widget lifecycle and updates
   - Handles widget validation

### Development Environment

1. **Build System**

   ```
   TypeScript → TSC → ESM Modules → Vite → Browser
   ```

   - TypeScript for type safety and modern JavaScript features
   - TSC for compiling library code
   - Vite for development server and hot module reloading
   - ESM modules for better tree-shaking and modern module loading

2. **Demo Application**

   ```
   Source Files → Vite Dev Server → Hot Module Reloading → Browser
   ```

   - Vite dev server for instant updates
   - Hot module reloading for rapid development
   - Source maps for easy debugging
   - OpenAPI specs in public directory for easy modification

### Data Flow

1. **Initialization**

   ```
   Load OpenAPI Spec → Parse Operations → Generate Node Types → Register with LiteGraph
   ```

2. **Node Execution**

   ```
   Input Values → Validate Parameters → Execute API Call → Process Response → Update Outputs
   ```

3. **Widget Updates**
   ```
   User Input → Validate Value → Update Node State → Trigger Execution
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

```
oapi-litegraph-nodegen/
├── src/                    # Library source code
│   ├── utils/             # Utility functions
│   ├── nodeGenerator.ts   # Main node generator
│   └── index.ts           # Public API
├── demo/                   # Demo application
│   ├── public/            # Static files and OpenAPI specs
│   ├── src/               # Demo-specific code
│   └── index.html         # Demo entry point
├── dist/                   # Compiled library output
├── test/                   # Test files
└── docs/                   # Documentation
```

## Development Workflow

1. **Library Development**

   ```
   Edit TypeScript → TSC Watch → Update Demo → Hot Reload
   ```

   - TypeScript compilation with source maps
   - Automatic rebuilding on changes
   - Hot module reloading in demo

2. **Demo Development**

   ```
   Edit Demo Files → Vite Dev Server → Instant Updates
   ```

   - Fast development server
   - Hot module replacement
   - Source maps for debugging

3. **Testing**
   ```
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
