import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const CAppBar = ({ className }) => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={className}>
      <Toolbar>
        <Typography className={classes.title} variant="h6" noWrap>
          MAttribution
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default CAppBar;
