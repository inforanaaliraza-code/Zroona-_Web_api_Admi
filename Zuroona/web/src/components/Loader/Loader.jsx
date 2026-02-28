"use client";

import React from "react";

// Keep React in scope for SSR (prevents "React is not defined" when automatic JSX runtime strips the import)
const createElement = React.createElement;

/**
 * Pure CSS spinner. No react-loader-spinner dependency to avoid
 * "React is not defined" during SSR (that package expects global React).
 */
function Loader(props) {
  const height = props.height != null ? String(props.height) : "40";
  const width = props.width != null ? String(props.width) : "100";
  const color = props.color || "#a797cc";
  const h = /^\d+$/.test(height) ? `${height}px` : height;
  const w = /^\d+$/.test(width) ? `${width}px` : width;

  return createElement(
    "div",
    {
      className: "flex justify-center items-center",
      style: { minHeight: h, width: w },
      role: "status",
      "aria-label": "loading",
    },
    createElement("div", {
      className: "animate-spin rounded-full border-2 border-t-transparent",
      style: {
        width: w,
        height: h,
        borderColor: color,
        borderTopColor: "transparent",
      },
    })
  );
}

export default Loader;
