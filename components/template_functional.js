import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const Dashboard = ({}) => {
  const classes = useStyles();

  return (
    <div>
      <Container fixed>
        <Grid container className={classes.root} spacing={2}>
          Hello world
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
