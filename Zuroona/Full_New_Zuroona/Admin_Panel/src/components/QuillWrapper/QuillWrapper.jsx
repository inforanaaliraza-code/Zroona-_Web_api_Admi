"use client";

import { forwardRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamic import with SSR disabled to prevent findDOMNode error in React 19
const ReactQuillComponent = dynamic(
  () => import("react-quill"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[200px] bg-gray-50 flex items-center justify-center text-gray-400">
        Loading editor...
      </div>
    ),
  }
);

// Store Quill class outside component
let QuillClass = null;
let isQuillRegistered = false;

const registerQuillModules = async () => {
  if (typeof window === "undefined" || isQuillRegistered) return;
  
  try {
    const quillModule = await import("react-quill");
    QuillClass = quillModule.Quill || quillModule.default?.Quill;
    
    if (QuillClass) {
      // Try to import and register ImageResize
      try {
        const imageResizeModule = await import("quill-image-resize-module-react");
        QuillClass.register("modules/imageResize", imageResizeModule.default);
      } catch (e) {
        console.warn("ImageResize module not available");
      }
      
      // Register custom sizes
      const Size = QuillClass.import("attributors/style/size");
      Size.whitelist = [
        "10px", "11px", "12px", "13px", "14px", "16px", 
        "18px", "20px", "22px", "24px", "28px", "32px", "36px", "48px"
      ];
      QuillClass.register(Size, true);
      
      isQuillRegistered = true;
    }
  } catch (e) {
    console.error("Error registering Quill modules:", e);
  }
};

// Wrapper component that safely handles ReactQuill with React 19
const QuillWrapper = forwardRef(function QuillWrapper(props, ref) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    registerQuillModules().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-[200px] bg-gray-50 flex items-center justify-center text-gray-400 border rounded">
        Loading editor...
      </div>
    );
  }

  return <ReactQuillComponent ref={ref} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper";

// Export both the wrapper and a function to get Quill class
export { QuillClass as Quill, registerQuillModules };
export default QuillWrapper;
