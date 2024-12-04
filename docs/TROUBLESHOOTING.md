# Troubleshooting Guide

## Common Issues and Solutions

### Node Generation Issues

1. **Nodes not appearing in the graph**

   - Verify OpenAPI spec was loaded successfully using `addSpec()`
   - Ensure `registerNodes()` was called after adding specs
   - Check browser console for validation errors
   - Verify node type prefix matches your registration

2. **Invalid node types**
   - Validate OpenAPI spec against schema
   - Check for unsupported OpenAPI features
   - Ensure all referenced schemas exist

### Widget Issues

1. **Widget values not updating**

   - Verify graph is started with `graph.start()`
   - Check widget connections are properly set
   - Ensure data types match between connected nodes
   - Verify widget event handlers are registered

2. **Incorrect widget types**
   - Check OpenAPI parameter types and formats
   - Verify custom widget mappings
   - Ensure widget dependencies are loaded

### Performance Issues

1. **Slow graph rendering**

   - Reduce number of visible nodes using groups
   - Enable passive event listeners
   - Use node grouping for better organization
   - Consider browser hardware acceleration

2. **Memory leaks**
   - Properly dispose nodes when removing
   - Clear event listeners when destroying graph
   - Monitor browser memory usage

### Build Issues

1. **TypeScript Compilation Errors**

   ```bash
   Error: Cannot find module '../dist/index.js'
   ```

   **Solution**: Make sure to build the library before starting the demo:

   ```bash
   npm run build
   ```

2. **Vite Build Errors**

   ```bash
   Error: Failed to resolve import "litegraph.js"
   ```

   **Solution**: Check that all dependencies are installed in the demo directory:

   ```bash
   cd demo
   npm install
   ```

3. **Node Polyfill Issues**

   ```bash
   ReferenceError: Buffer is not defined
   ```

   **Solution**: Make sure vite-plugin-node-polyfills is properly configured in vite.config.js:

   ```javascript
   plugins: [
     nodePolyfills({
       globals: {
         Buffer: true,
         global: true,
       },
     }),
   ];
   ```

### Development Server Issues

1. **Hot Reload Not Working**

   **Symptoms**:

   - Changes not reflecting in browser
   - Need to manually refresh

   **Solutions**:

   - Check that you're editing the correct files
   - Ensure you're running `npm run start:demo`
   - Clear browser cache and reload

2. **CORS Errors**

   ```bash
   Access to fetch at '...' has been blocked by CORS policy
   ```

   **Solution**: Update Vite config to allow necessary origins:

   ```javascript
   server: {
     cors: true,
     fs: {
       allow: ['..'],
     },
   }
   ```

3. **Port Conflicts**

   ```bash
   Error: Port 5173 is already in use
   ```

   **Solution**: Either:

   - Kill the process using the port
   - Use a different port: `npm run dev -- --port 3000`

### Runtime Issues

1. **Node Generation Failures**

   ```bash
   Error: Could not find schema for operation
   ```

   **Solutions**:

   - Check OpenAPI spec path in demo/public/
   - Verify spec format and validity
   - Look for console errors about schema parsing

2. **Widget Rendering Issues**

   ```bash
   TypeError: Cannot read property 'value' of undefined
   ```

   **Solutions**:

   - Check widget initialization in node constructor
   - Verify property types in OpenAPI spec
   - Look for missing widget definitions

3. **API Request Failures**

   ```bash
   Error: Failed to fetch
   ```

   **Solutions**:

   - Check API endpoint availability
   - Verify authentication setup
   - Look for CORS or network issues

## Debugging Techniques

### Debug Mode

Enable detailed logging:

```javascript
import { setLogLevel } from "@soldarlabs/oapi-litegraph-nodegen";
setLogLevel("debug");
```

### Browser DevTools

1. **Console logging**

   - Check for errors and warnings
   - Monitor network requests for spec loading
   - Track widget value changes

2. **Performance profiling**
   - Use Performance tab to identify bottlenecks
   - Monitor memory usage
   - Track event listeners

### Common Error Messages

1. **"Invalid OpenAPI specification"**

   - Validate spec against OpenAPI schema
   - Check for required fields
   - Verify JSON/YAML syntax

2. **"Failed to register node type"**

   - Check node type naming conflicts
   - Verify LiteGraph.js integration
   - Check node registration order

3. **"Widget type not found"**
   - Verify widget type exists
   - Check widget mapping configuration
   - Ensure widget dependencies loaded

## Best Practices

1. **Node Generation**

   - Use meaningful node type prefixes
   - Group related nodes by tags
   - Implement proper error handling

2. **Widget Usage**

   - Use appropriate widget types
   - Implement validation
   - Handle edge cases

3. **Performance**
   - Minimize number of nodes
   - Use efficient data structures
   - Implement proper cleanup

## Development Tips

### Debugging

1. **Source Maps**

   - Source maps are enabled in development
   - Use browser devtools to debug TypeScript
   - Set breakpoints in original source

2. **Console Logging**

   - Use `setLogLevel("debug")` for verbose output
   - Check browser console for errors
   - Monitor network requests in devtools

3. **Hot Reload**
   - Changes to demo files reload instantly
   - Library changes require rebuild
   - Use `console.log` for quick debugging

### Performance

1. **Build Size**

   - Use production build for deployment
   - Enable minification in vite.config.js
   - Monitor chunk sizes in build output

2. **Memory Leaks**

   - Dispose nodes properly
   - Clean up event listeners
   - Monitor memory usage in devtools

3. **Network**
   - Use local development server
   - Cache API responses when possible
   - Monitor network tab for bottlenecks

## Getting Help

1. **Documentation**

   - Check [README.md](../README.md) for basic usage
   - Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
   - See [CONTRIBUTING.md](../CONTRIBUTING.md) for development

2. **Community Support**

   - Open GitHub issues for bugs
   - Use discussions for questions
   - Check existing issues first

3. **Debugging Tools**
   - Browser DevTools
   - Node.js debugger
   - Logging utilities
