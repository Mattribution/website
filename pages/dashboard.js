import React from "react";
import fetch from "isomorphic-unfetch";

import Head from "../components/head";
import Nav from "../components/nav";
import { Typography, Paper, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryTheme,
  VictoryBar,
  VictoryTooltip
} from "victory";
import moment from "moment";
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

const fillData = tracks => {
  // Create a date 30 days ago
  const date = moment()
    .startOf("day")
    .subtract(30, "days");

  // Loop over tracks
  for (let i = 0; i < 30; i++) {
    const dateAlreadyExists = false;
    // Check to see if this date already has data
    for (const track of tracks) {
      const trackDate = moment(track.value);
      if (trackDate == date) {
        dateAlreadyExists = true;
        break;
      }
    }
    // If the date already has data, skip
    if (dateAlreadyExists) {
      continue;
    }
    // else, fill zero data
    tracks.push({
      value: date.format(),
      count: 0
    });

    // Increment the date
    date.add(1, "days");
  }

  function compare(a, b) {
    if (moment(a.value) > moment(b.value)) return 1;
    if (moment(b.value) > moment(a.value)) return -1;

    return 0;
  }
  tracks.sort(compare);
};

// const fillData2 = tracks => {
//   // Add a date for furthest back and most recent, in case data isn't there
//   const datesToAdd = moment()
//     .startOf("day")
//     .subtract(30, "days");

// }

const Dashboard = ({ tracks }) => {
  const classes = useStyles();
  tracks.map(t => {
    t.value = moment(t.value)
      .startOf("day")
      .toDate();
    t.label = t.count;
    return t;
  });
  console.log(tracks);
  // fillData(tracks);

  // // TODO: Optimize, don't convert to moment again after fillData
  // let xTickValues = tracks.map(t => {
  //   return moment(t.value);
  // });
  // xTickValues = xTickValues.filter((d, i) => i % 5 === 0);

  return (
    <div>
      <Head title="Home" />
      <Nav />
      <Grid container className={classes.root} spacing={2}>
        <Grid item md={3}>
          <Typography variant="h4">Daily Visits</Typography>
          <Paper>
            <VictoryChart
              theme={VictoryTheme.material}
              scale={{ x: "time" }}
              domain={{
                x: [
                  moment()
                    .subtract(30, "days")
                    .toDate(),
                  moment().toDate()
                ]
              }}
            >
              <VictoryAxis />
              <VictoryAxis dependentAxis />

              <VictoryBar
                style={{
                  data: { fill: "#c43a31" }
                }}
                labelComponent={<VictoryTooltip />}
                data={tracks}
                x="value"
                y="count"
                barWidth={5}
              />
            </VictoryChart>
          </Paper>
        </Grid>
      </Grid>

      {/* {tracks.map(track => {
        return <Typography>{JSON.stringify(track)}</Typography>;
      })} */}
    </div>
  );
};

Dashboard.getInitialProps = async function() {
  const res = await fetch("http://localhost:3001/v1/tracks/daily_visits");
  const tracks = await res.json();
  console.log(tracks);
  return { tracks };
};

export default Dashboard;
