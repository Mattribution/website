import React from "react";
import fetch from "isomorphic-unfetch";

import Head from "../components/head";
import Nav from "../components/nav";
import { Typography, Paper, Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import moment from "moment";
import KPIs from "../components/kpis";
import DailyVisits from "../components/dailyVisits";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing(2)
  }
}));

const Dashboard = ({ tracks, kpis }) => {
  const classes = useStyles();
  tracks.map(t => {
    t.value = moment(t.value)
      .startOf("day")
      .toDate();
    t.label = t.count;
    return t;
  });

  return (
    <div>
      <Head title="Home" />
      <Nav />

      <Container fixed>
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h4">Daily Visits</Typography>
            <Paper className={classes.dailyVisitsContainer}>
              <DailyVisits tracks={tracks} />
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="h4">KPIs</Typography>
            <Paper>
              <KPIs kpis={kpis} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

Dashboard.getInitialProps = async function() {
  let res = await fetch("http://localhost:3001/v1/tracks/daily_visits");
  const tracks = await res.json();

  res = await fetch("http://localhost:3001/v1/kpis");
  const kpis = await res.json();
  return { tracks, kpis };
};

export default Dashboard;
