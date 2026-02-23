"use client";
import { Bars, Audio, Circles, CirclesWithBar, ThreeCircles  } from "react-loader-spinner";

function Loader(props) {
  return (
    <>
      <ThreeCircles
        height={props.height ? props.height : "40"}
        width={props.width ? props.width : "100"}
        color={props.color ? props.color : "#a797cc"}
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass="justify-center"
        visible={true}
      />
    </>
  );
}

export default Loader;
