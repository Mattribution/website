import React, { useState } from "react";
import fetch from "isomorphic-unfetch";

import Head from "../components/head";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const Dashboard = ({}) => {
  const [_, setRefreshValue] = useState(0);
  const refresh = () => setRefreshValue(0);
  const classes = useStyles();

  return (
    <div>
      <Head title="Home" />
      <Nav />

      <Container fixed>
        <Grid container className={classes.root} spacing={2}>
          Hello world
        </Grid>
      </Container>
    </div>
  );
};

Dashboard.getInitialProps = async function() {
  // let res = await fetch("http://localhost:3001/");
  // let data = await res.json();
  return {};
};

export default Dashboard;
