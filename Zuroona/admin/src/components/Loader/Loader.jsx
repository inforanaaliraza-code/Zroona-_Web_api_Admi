"use client";

import React, { useState, useEffect } from "react";

function Loader(props) {
  const [ThreeCircles, setThreeCircles] = useState(null);

  useEffect(() => {
    import("react-loader-spinner").then((mod) => setThreeCircles(() => mod.ThreeCircles));
  }, []);

  if (!ThreeCircles) {
    return (
      <div
        className="inline-block h-8 w-20 animate-pulse rounded bg-brand-pastel-gray-purple-1/30"
        aria-label="Loading"
      />
    );
  }

  return (
    <ThreeCircles
      height="30"
      width="80"
      color={props.color ? props.color : "#a797cc"}
      ariaLabel="bars-loading"
      wrapperStyle={{}}
      wrapperClass="justify-center"
      visible={true}
    />
  );
}

export default Loader;
