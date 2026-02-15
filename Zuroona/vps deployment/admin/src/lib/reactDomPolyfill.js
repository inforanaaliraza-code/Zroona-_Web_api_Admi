"use client";

/**
 * Polyfill for ReactDOM.findDOMNode
 * 
 * React 19 has removed findDOMNode, but some legacy libraries like react-quill
 * still depend on it. This polyfill provides a minimal implementation to
 * prevent runtime errors.
 * 
 * This should be imported BEFORE any library that uses findDOMNode.
 */

if (typeof window !== 'undefined') {
  // Only run in browser environment
  const ReactDOM = require('react-dom');
  
  // Check if findDOMNode is already available (React 18 or earlier)
  if (!ReactDOM.findDOMNode) {
    // Provide a polyfill for React 19+
    // This implementation returns the first DOM node it can find
    ReactDOM.findDOMNode = function findDOMNode(componentOrElement) {
      if (componentOrElement == null) {
        return null;
      }
      
      // If it's already a DOM node, return it
      if (componentOrElement.nodeType === 1) {
        return componentOrElement;
      }
      
      // If it has a _reactInternals (React 18+ internal), try to get the DOM node
      if (componentOrElement._reactInternals) {
        // Try to find the stateNode which should be the DOM element
        let fiber = componentOrElement._reactInternals;
        while (fiber) {
          if (fiber.stateNode && fiber.stateNode.nodeType === 1) {
            return fiber.stateNode;
          }
          fiber = fiber.child;
        }
      }
      
      // If it has a ref that points to a DOM element
      if (componentOrElement.ref && componentOrElement.ref.current) {
        const current = componentOrElement.ref.current;
        if (current.nodeType === 1) {
          return current;
        }
      }
      
      // For class components with a container ref
      if (componentOrElement.container) {
        return componentOrElement.container;
      }
      
      // For components with editingArea (specific to ReactQuill)
      if (componentOrElement.editingArea) {
        return componentOrElement.editingArea;
      }
      
      // Last resort: try to get the element directly
      if (typeof componentOrElement.getEditor === 'function') {
        try {
          const editor = componentOrElement.getEditor();
          if (editor && editor.container) {
            return editor.container;
          }
        } catch (e) {
          // Ignore errors
        }
      }
      
      console.warn(
        'findDOMNode polyfill: Could not find DOM node for component.',
        'Consider updating the library to use refs instead.'
      );
      
      return null;
    };
  }
}

export {};
