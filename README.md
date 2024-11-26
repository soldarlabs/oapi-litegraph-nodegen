# oapi-litegraph-nodegen

Generate dynamic and callable LiteGraph nodes from OpenAPI specifications, enabling seamless API integration in a visual programming environment.

## Features

- **Dynamic Node Generation**: Automatically generate LiteGraph nodes from OpenAPI specifications
- **Type-Safe Integration**: Full TypeScript support with proper type inference
- **Interactive Widgets**: Rich set of input widgets based on OpenAPI parameter types
- **High Performance**: Optimized event handling and canvas rendering
- **Easy Integration**: Simple API for adding OpenAPI specs and registering nodes

## Installation

```bash
npm install @soldarlabs/oapi-litegraph-nodegen
```

## Quick Start

```javascript
import { NodeGenerator } from "@soldarlabs/oapi-litegraph-nodegen";
import { LGraph, LGraphCanvas } from "litegraph.js";

// Create a new graph
const graph = new LGraph();

// Initialize the node generator
const generator = new NodeGenerator();

// Add an OpenAPI specification
await generator.addSpec("myApi", "./openapi.yaml");

// Register nodes from the spec
generator.registerNodes();

// Create and start the canvas
const canvas = document.getElementById("mycanvas");
new LGraphCanvas("#mycanvas", graph);
graph.start();
```

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md): System design, components, and data flow
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md): Common issues and solutions
- [Contributing Guide](CONTRIBUTING.md): Development setup and guidelines

## Basic Usage

### Node Generation Options

```typescript
const generator = new NodeGenerator({
  // Prefix for generated node types (default: '')
  typePrefix: 'MyAPI/',
  
  // Whether to group nodes by tag (default: true)
  groupByTag: true,
  
  // Custom widget mappings
  widgetMappings: {
    'string:date': 'date-picker',
    'string:color': 'color-picker'
  }
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
