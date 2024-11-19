# oapi-litegraph-nodegen

Generate dynamic and callable LiteGraph nodes from OpenAPI specifications, enabling seamless API integration in a visual programming environment.

## Features

- **Dynamic Node Generation**: Automatically generate LiteGraph nodes from OpenAPI specifications.
- **Seamless Integration**: Easily integrate APIs into your visual programming environment.
- **Interactive Example**: Run an example web server to see the library in action.

## Installation

Since the package is not yet published to npm, you can use the library by cloning the repository and running the following command:

```bash
git clone https://github.com/yourusername/oapi-litegraph-nodegen.git
cd oapi-litegraph-nodegen
npm install
```

## Usage

After installing the dependencies, you can use the `oapi-litegraph-nodegen` library by importing it into your project:

```javascript
import { NodeGenerator } from "oapi-litegraph-nodegen";

const graph = new LGraph();

const generator = new NodeGenerator();
const specPath = "./openapi.yaml";
await generator.addSpec("exampleSpec", specPath);
generator.registerNodes("exampleSpec");

new LGraphCanvas("#mycanvas", graph);
graph.start();
```

## Example

To run the example web server showcasing the library, follow these steps:

1. **Build the Example**:

   ```bash
   npm run build:example
   ```

2. **Start the Example Server**:

   ```bash
    npm run start:example
   ```

The server will be running on `http://127.0.0.1:8080`. Open this URL in your browser to see the example in action.
