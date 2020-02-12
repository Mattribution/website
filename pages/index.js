import React from "react";
import fetch from "isomorphic-unfetch";

import Head from "../components/head";
import { Typography, Paper, Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { VictoryPie, VictoryChart, VictoryLegend } from "victory";
import moment from "moment";

import LayoutDrawer from "../components/Layouts/LayoutDrawer";
import KPIs from "../components/kpis";
import DailyVisits from "../components/dailyVisits";
import DailyConversions from "../components/dailyConversions";

const useStyles = makeStyles(theme => ({
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

const Dashboard = ({
  tracks,
  kpis,
  dailyConversions,
  campaigns,
  mostActiveCampaigns
}) => {
  const classes = useStyles();

  return (
    <LayoutDrawer campaigns={campaigns}>
      <Head title="Home" />

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
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </LayoutDrawer>
  );
};

Dashboard.getInitialProps = async function() {
  // let res = await fetch("http://localhost:3001/v1/tracks/daily_visits");
  // const tracks = await res.json();
  // res = await fetch("http://localhost:3001/v1/kpis");
  // const kpis = await res.json();
  // res = await fetch("http://localhost:3001/v1/tracks/most_active_campaigns");
  // const mostActiveCampaigns = await res.json();

  // // TODO: this gets specific, must be a more general way to do this
  // const dailyConversions = [];
  // for (let i = 0; i < kpis.length; i++) {
  //   const kpi = kpis[i];
  //   res = await fetch(
  //     `http://localhost:3001/v1/kpis/${kpi.id}/daily_conversion_count`
  //   );
  //   const conversions = await res.json();
  //   dailyConversions.push({ kpi, conversions });
  // }

  return {};
};

export default Dashboard;
