"use client";
import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markup"; // HTML
import "prismjs/themes/prism.css"; // basic theme; you can customize this file

// Simple overlay editor: textarea with transparent text sits over a highlighted <pre>
export default function HtmlCodeEditor({ value, onChange, onBlur, className = "", ...rest }) {
  const [code, setCode] = useState(value || "");
  const preRef = useRef(null);

  useEffect(() => {
    if (preRef.current) {
      Prism.highlightElement(preRef.current);
    }
  }, [code]);

  useEffect(() => {
    setCode(value || "");
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setCode(v);
    onChange && onChange(v);
  };

  return (
    <div className={`relative w-full h-full ${className}`} style={{ fontFamily: "'Courier New', monospace" }}>
      <pre
        ref={preRef}
        className="language-markup whitespace-pre-wrap break-words m-0 p-4 text-sm"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {code}
      </pre>
      <textarea
        value={code}
        onChange={handleChange}
        onBlur={onBlur}
        spellCheck="false"
        className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-black p-4 text-sm resize-none focus:outline-none focus:ring-0"
        {...rest}
      />
    </div>
  );
}
