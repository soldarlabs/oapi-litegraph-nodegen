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
