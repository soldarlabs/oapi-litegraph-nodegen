# oapi-litegraph-nodegen

Generate dynamic and callable LiteGraph nodes from OpenAPI specifications, enabling seamless API integration in a visual programming environment.

## Features

- **Dynamic Node Generation**: Automatically generate LiteGraph nodes from OpenAPI specifications
- **Type-Safe Integration**: Full TypeScript support with proper type inference
- **Interactive Widgets**: Rich set of input widgets based on OpenAPI parameter types
- **Optimized Canvas**: Modular canvas optimization for high-DPI displays and pointer events
- **Easy Integration**: Simple API for adding OpenAPI specs and registering nodes
- **Hot Reloading**: Development server with Vite for instant feedback

## Installation

```bash
npm install @soldarlabs/oapi-litegraph-nodegen
```

## Demo

The project includes a Next.js-based demo that showcases the library's capabilities with hot-reloading support for development:

```bash
# Navigate to the demo directory
cd demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to see the demo in action.

## Quick Start

```javascript
import {
  NodeGenerator,
  optimizeCanvas,
} from "@soldarlabs/oapi-litegraph-nodegen";
import { LGraph, LGraphCanvas } from "litegraph.js";

// Create a new graph
const graph = new LGraph();
const canvas = new LGraphCanvas("#graphcanvas", graph);

// Apply canvas optimizations (optional)
optimizeCanvas(canvas, {
  pointerEvents: true,  // Enable pointer events for better performance
});

// Initialize the node generator
const generator = new NodeGenerator();

// Add an OpenAPI specification.
await generator.addSpec("myApi", "./openapi.yaml");

// Register nodes from the spec.
generator.registerNodes();

// Create and start the canvas.
canvas.start();
```

## Running the Demo

The demo uses Vite for hot module reloading and fast development:

```bash
# Clone the repository
git clone https://github.com/soldarlabs/oapi-litegraph-nodegen.git
cd oapi-litegraph-nodegen

# Install dependencies
npm install

# Build the library
npm run build

# Start the demo
npm run start:demo
```

The demo will be available at `http://localhost:5173` with hot reloading enabled.

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md): System design and components
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md): Common issues and solutions
- [Contributing Guide](CONTRIBUTING.md): Development setup and guidelines

## Basic Usage

### Node Generation Options

```typescript
const generator = new NodeGenerator({
  typePrefix: "MyAPI/", // Prefix for generated node types
  groupByTag: true, // Group nodes by OpenAPI tags
  widgetMappings: {
    "string:date": "date-picker",
    "string:color": "color-picker",
  },
});
```

### Widget Types

The library automatically selects appropriate widgets based on OpenAPI parameter types:

- **String**: Text input widget
- **Number**: Number input widget with optional range
- **Boolean**: Toggle widget
- **Enum**: Combo box widget
- **Object**: Nested properties with individual widgets
- **Array**: Dynamic list of widgets

## Development

The project uses modern tooling:

- **TypeScript** for type-safe code
- **Vite** for fast development and hot module reloading
- **Jest** for testing
- **ESLint** and **Prettier** for code quality

## Browser Support

- Chrome ≥ 61
- Firefox ≥ 60
- Safari ≥ 11
- Edge ≥ 79

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related Projects

- [LiteGraph.js](https://github.com/jagenjo/litegraph.js)
- [OpenAPI Tools](https://openapi.tools/)
