import React from "react";
import fetch from "isomorphic-unfetch";

import Head from "../components/head";
import Nav from "../components/nav";
import { Typography, Paper, Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import moment from "moment";
import KPIs from "../components/kpis";
import DailyVisits from "../components/dailyVisits";
import DailyConversions from "../components/dailyConversions";

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    marginTop: 50
  },
  chartTitle: {
    color: "gray"
  },
  paper: {
    height: 140,
    width: 100
  },
  control: {
    padding: theme.spacing(2)
  }
}));

const Dashboard = ({ tracks, kpis, dailyConversions }) => {
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

      <Container fixed className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper className={classes.dailyVisitsContainer}>
              <Grid
                container
                alignItems="center"
                direction="row"
                justify="center"
              >
                <Typography variant="h5" className={classes.chartTitle}>
                  Daily Visits
                </Typography>
                <DailyVisits tracks={tracks} />
              </Grid>
            </Paper>
          </Grid>

          <Grid container xs={12}>
            <Grid item xs={12}>
              <Typography variant="h4">KPIs</Typography>
            </Grid>

            <Grid item xs={12}>
              <Paper>
                <KPIs kpis={kpis} />
              </Paper>
            </Grid>
          </Grid>

          <Grid container xs={12}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Conversions
              </Typography>
            </Grid>

            {dailyConversions.map(({ kpi, conversions }) => (
              <Grid item xs={4}>
                <Paper>
                  <Grid
                    container
                    alignItems="center"
                    direction="row"
                    justify="center"
                  >
                    <Typography variant="h5" className={classes.chartTitle}>
                      {kpi.name}
                    </Typography>
                    <DailyConversions conversions={conversions} />
                  </Grid>
                </Paper>
              </Grid>
            ))}
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

  // TODO: this gets specific, must be a more general way to do this
  const dailyConversions = [];
  for (let i = 0; i < kpis.length; i++) {
    const kpi = kpis[i];
    res = await fetch(
      `http://localhost:3001/v1/kpis/${kpi.id}/daily_conversion_count?`
    );
    const conversions = await res.json();
    dailyConversions.push({ kpi, conversions });
  }

  return { tracks, kpis, dailyConversions };
};

export default Dashboard;
