import React, { Fragment } from "react";
import Loader from "./Loader.svg";

export default () => {
  return (
    <Fragment>
      <img src={Loader} alt='loading...'></img>
    </Fragment>
  );
};
