import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Container, CssBaseline } from "@material-ui/core";
import CAppBar from "../CAppBar";

const LayoutVanilla = props => {
  return (
    <div>
      <CssBaseline />
      <CAppBar />
      <Container fixed>{props.children}</Container>
    </div>
  );
};

export default LayoutVanilla;
