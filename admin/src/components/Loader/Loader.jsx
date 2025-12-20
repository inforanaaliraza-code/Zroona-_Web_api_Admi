"use client";
import React from "react";
import { Bars, Audio, Circles, CirclesWithBar, ThreeCircles  } from "react-loader-spinner";

function Loader(props) {
  return (
    <>
      <ThreeCircles
        height="30"
        width="80"
        color={props.color ? props.color : "#f47c0c"}
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass="justify-center"
        visible={true}
      />
    </>
  );
}

export default Loader;
